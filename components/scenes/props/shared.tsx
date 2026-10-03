import type { ThemePalette } from "../types";

/**
 * Shared drawing helpers for the scene prop library.
 *
 * Every prop is authored in a 100x100 viewBox with its feet on y=100, draws
 * only from the theme palette, and wears the same ink outline. That shared
 * outline is what keeps a pine, a mausoleum and a crystal reading as pages
 * from one book rather than as unrelated clip art.
 *
 * Shading is built from stacked semi-transparent paths rather than SVG
 * gradients or <defs> patterns: a plate renders well over a hundred props, and
 * gradients and patterns both need ids, which would collide across instances.
 * Explicit geometry costs a few more nodes and buys correctness.
 */

export interface PropProps {
  p: ThemePalette;
}

export type PropComponent = (props: PropProps) => JSX.Element;

/** The outline every prop shares. */
export function ink(p: ThemePalette, width = 2.4) {
  return {
    stroke: p.ink,
    strokeWidth: width,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
}

/** Thin interior marks: grain, cracks, veins. Never a second outline weight. */
export function detail(color: string, width = 1.3, opacity = 0.5) {
  return {
    stroke: color,
    strokeWidth: width,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
    opacity,
  };
}

/**
 * Soft contact shadow at the base. Grounds a prop against the plate so it
 * doesn't look pasted on; drawn first so everything else sits over it.
 */
export function Ground({
  p,
  cx = 50,
  rx = 42,
  ry = 6,
  cy = 97,
}: PropProps & { cx?: number; rx?: number; ry?: number; cy?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={p.ink} opacity={0.22} />;
}

/** Lit face: a translucent light wash over the side the light reaches. */
export function Lit({ d, p, opacity = 0.4 }: { d: string; p: ThemePalette; opacity?: number }) {
  return <path d={d} fill={p.propLight} opacity={opacity} stroke="none" />;
}

/** Shaded face: the opposite side, pushed toward the dark tone. */
export function Shade({ d, p, opacity = 0.3 }: { d: string; p: ThemePalette; opacity?: number }) {
  return <path d={d} fill={p.propDark} opacity={opacity} stroke="none" />;
}

/** Evenly spaced speckles, for mineral grain / sand / ash. */
export function Speckle({
  p,
  points,
  r = 1.6,
  color,
  opacity = 0.35,
}: PropProps & {
  points: [number, number][];
  r?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <g fill={color ?? p.propLight} opacity={opacity} stroke="none">
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

/**
 * Five-petal bloom in one of the theme's accent colours. Themes trend
 * monochrome on their own; these are what give a plate colour variety without
 * breaking its key.
 */
export function Bloom({
  p,
  cx,
  cy,
  r,
  colorIndex = 0,
}: PropProps & { cx: number; cy: number; r: number; colorIndex?: number }) {
  const color = p.blooms[colorIndex % p.blooms.length];
  return (
    <g stroke={p.ink} strokeWidth={1.8} strokeLinejoin="round">
      {[0, 72, 144, 216, 288].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={a}
            cx={cx + Math.cos(rad) * r * 0.62}
            cy={cy + Math.sin(rad) * r * 0.62}
            r={r * 0.48}
            fill={color}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.3} fill={p.ink} opacity={0.8} />
    </g>
  );
}
