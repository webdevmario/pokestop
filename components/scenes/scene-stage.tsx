import { Check } from "lucide-react";

import { getSpriteUrl } from "@/lib/pokemon";

import Backdrop from "./backdrop";
import { SceneProp } from "./props";
import type { PlacedMon, PlacedProp, SceneItem, Theme } from "./types";

interface Props {
  theme: Theme;
  width: number;
  height: number;
  items: SceneItem[];
  foundIds: Set<number>;
  /** Target currently being pointed out by the hint system. */
  hintedId: number | null;
  onMonClick: (mon: PlacedMon) => void;
  /** Click that didn't land on a Pokemon. */
  onMissClick: () => void;
  animate: boolean;
}

function PropNode({ item, theme }: { item: PlacedProp; theme: Theme }) {
  const w = item.width * item.scale;
  const h = item.height * item.scale;
  return (
    <div
      className="absolute"
      style={{
        left: item.x - w / 2,
        // y is the baseline (feet), so the box hangs above it.
        top: item.y - h,
        width: w,
        height: h,
        zIndex: item.z,
        transform: item.flipX ? "scaleX(-1)" : undefined,
        // The wrapper never takes clicks; the SVG inside opts back in on its
        // painted pixels only. See the note in SceneProp.
        pointerEvents: "none",
      }}
    >
      <SceneProp
        prop={item.prop}
        palette={theme.palette}
        interactive={item.layer === "mid"}
      />
    </div>
  );
}

function MonNode({
  item,
  found,
  hinted,
  animate,
  onClick,
}: {
  item: PlacedMon;
  found: boolean;
  hinted: boolean;
  animate: boolean;
  onClick: () => void;
}) {
  const size = item.width * item.scale;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      // No name while hidden: an accessible name here would hand the answer to
      // anyone inspecting the tree. The HUD carries the real target list.
      aria-label={found ? item.pokemon.name : "Pokémon"}
      className={[
        "absolute block p-0 leading-none",
        // Deliberately no hover scale or brightness: sweeping the pointer
        // across the plate must not reveal what is clickable.
        found ? "cursor-default" : "cursor-crosshair",
        animate && found ? "animate-found-pop" : "",
        animate && hinted ? "animate-hint-pulse" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      // The button's transform is reserved for the found/hint animations, so
      // the mirror lives on the image below. Writing both here would make the
      // flip vanish mid-animation.
      style={{
        left: item.x - size / 2,
        top: item.y - size,
        width: size,
        height: size,
        zIndex: found ? item.z + 50_000 : item.z,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- 150-300 sprites
          per scene; game sprites are ~1KB each and already the right size, so
          next/image here would add 300 wrappers for no optimization gain. */}
      <img
        src={getSpriteUrl(item.pokemon.id)}
        alt=""
        width={Math.round(size)}
        height={Math.round(size)}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full select-none object-contain [image-rendering:pixelated]"
        style={{
          filter: "drop-shadow(0 2px 2px rgb(0 0 0 / 0.35))",
          transform: item.flipX ? "scaleX(-1)" : undefined,
        }}
      />
      {found && (
        <span
          className="absolute -right-1 -top-1 flex items-center justify-center rounded-full bg-success text-white"
          style={{
            width: Math.max(14, size * 0.4),
            height: Math.max(14, size * 0.4),
          }}
        >
          <Check aria-hidden className="h-2/3 w-2/3" strokeWidth={4} />
        </span>
      )}
      {hinted && !found && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-25%] rounded-full border-4 border-warning"
        />
      )}
    </button>
  );
}

/**
 * Renders one plate. Props and Pokemon live in a single stacking context and
 * are painted in one baseline-sorted pass, which is what lets a Pokemon be
 * genuinely half-hidden behind a bush instead of merely near one.
 */
function SceneStage({
  theme,
  width,
  height,
  items,
  foundIds,
  hintedId,
  onMonClick,
  onMissClick,
  animate,
}: Props) {
  return (
    <div
      className="relative select-none"
      style={{ width, height }}
      onClick={onMissClick}
    >
      <Backdrop theme={theme} width={width} height={height} />

      {items.map((item) =>
        item.kind === "prop" ? (
          <PropNode key={item.id} item={item} theme={theme} />
        ) : (
          <MonNode
            key={item.id}
            item={item}
            found={item.isTarget && foundIds.has(item.pokemon.id)}
            hinted={item.isTarget && hintedId === item.pokemon.id}
            animate={animate}
            onClick={() => onMonClick(item)}
          />
        )
      )}

      {/* Palette-binding haze, above everything, inert. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.palette.haze, zIndex: 200_000 }}
      />
    </div>
  );
}

export default SceneStage;
