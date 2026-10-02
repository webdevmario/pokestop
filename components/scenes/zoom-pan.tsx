import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

export const MIN_ZOOM = 0.4;
export const MAX_ZOOM = 2;

/** Movement past this many px turns a press into a pan instead of a click. */
const DRAG_SLOP = 6;

interface Props {
  /** Viewport size (what the user sees). */
  viewportW: number;
  viewportH: number;
  /** Content size (the plate, which is larger than the viewport). */
  contentW: number;
  contentH: number;
  children: ReactNode;
  /** Reset pan/zoom whenever this changes, e.g. a new scene. */
  resetKey: string | number;
  animate: boolean;
}

interface Transform {
  x: number;
  y: number;
  k: number;
}

/**
 * Pan/zoom viewport. Scroll or pinch to zoom about the pointer, drag to pan.
 *
 * Pan is clamped so the plate always covers the viewport — at zoom levels
 * where the plate is smaller than the viewport on an axis, it centres instead.
 */
function ZoomPan({
  viewportW,
  viewportH,
  contentW,
  contentH,
  children,
  resetKey,
  animate,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState<Transform>({ x: 0, y: 0, k: 1 });
  const [panning, setPanning] = useState(false);

  // Active pointers, for pinch.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; k: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const movedRef = useRef(0);

  const clamp = useCallback(
    (next: Transform): Transform => {
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next.k));
      const w = contentW * k;
      const h = contentH * k;

      const x = w <= viewportW
        ? (viewportW - w) / 2
        : Math.min(0, Math.max(viewportW - w, next.x));
      const y = h <= viewportH
        ? (viewportH - h) / 2
        : Math.min(0, Math.max(viewportH - h, next.y));

      return { x, y, k };
    },
    [contentW, contentH, viewportW, viewportH]
  );

  /**
   * Open at 1:1 on the middle of the plate rather than fitted to the viewport.
   * Fitting a 2.2x plate means starting around 0.45x, which shrinks the sprites
   * to specks and throws away the density the scene is built around. The user
   * can zoom out to survey the whole plate.
   */
  useEffect(() => {
    const k = 1;
    setT(
      clamp({
        x: (viewportW - contentW * k) / 2,
        y: (viewportH - contentH * k) / 2,
        k,
      })
    );
  }, [resetKey, clamp, viewportW, viewportH, contentW, contentH]);

  const zoomAbout = useCallback(
    (clientX: number, clientY: number, nextK: number) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      setT((prev) => {
        const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextK));
        // Keep the point under the cursor fixed.
        const x = px - ((px - prev.x) / prev.k) * k;
        const y = py - ((py - prev.y) / prev.k) * k;
        return clamp({ x, y, k });
      });
    },
    [clamp]
  );

  // Non-passive wheel listener so we can preventDefault the page scroll.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      setT((prev) => {
        const rect = el.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.k * factor));
        const x = px - ((px - prev.x) / prev.k) * k;
        const y = py - ((py - prev.y) / prev.k) * k;
        return clamp({ x, y, k });
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clamp]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    movedRef.current = 0;

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinchStart.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        k: t.k,
      };
      dragStart.current = null;
    } else if (pointers.current.size === 1) {
      dragStart.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y };
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      movedRef.current = DRAG_SLOP + 1;
      zoomAbout(
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
        pinchStart.current.k * (dist / pinchStart.current.dist)
      );
      return;
    }

    const start = dragStart.current;
    if (!start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    movedRef.current = Math.max(movedRef.current, Math.hypot(dx, dy));

    if (movedRef.current > DRAG_SLOP) {
      setPanning(true);
      setT((prev) => clamp({ ...prev, x: start.tx + dx, y: start.ty + dy }));
    }
  };

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) {
      dragStart.current = null;
      setPanning(false);
    }
  };

  /**
   * Swallows the click that follows a drag, so panning across the plate never
   * registers as a guess. Capture phase, so it runs before the mon's handler.
   */
  const onClickCapture = (e: React.MouseEvent) => {
    if (movedRef.current > DRAG_SLOP) {
      e.stopPropagation();
      e.preventDefault();
      movedRef.current = 0;
    }
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onPointerLeave={endPointer}
      onClickCapture={onClickCapture}
      className="relative overflow-hidden rounded-card border-2 border-border/10 touch-none"
      style={{
        width: viewportW,
        height: viewportH,
        cursor: panning ? "grabbing" : "crosshair",
      }}
    >
      <div
        style={{
          width: contentW,
          height: contentH,
          transformOrigin: "0 0",
          transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.k})`,
          transition: animate && !panning ? "transform 120ms ease-out" : "none",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ZoomPan;
