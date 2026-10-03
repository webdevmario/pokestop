import { Check } from "lucide-react";

import { getSpriteUrl, type Pokemon } from "@/lib/pokemon";

import type { Theme } from "./types";

interface Props {
  theme: Theme;
  targets: Pokemon[];
  foundIds: Set<number>;
}

/**
 * The "find these Pokémon" banner, modelled on the strip across the top of a
 * printed seek book: scene-setting copy, then the quarry shown in colour at a
 * size you can actually recognise.
 *
 * Deliberately one row that scrolls sideways rather than wrapping — on a phone
 * a wrapping grid pushes the scene off screen, and the strip stops reading as
 * a banner.
 *
 * Sprites are the same artwork used on the plate, so what you study here is
 * exactly what you are scanning for.
 */
function TargetStrip({ theme, targets, foundIds }: Props) {
  const { palette } = theme;
  const foundCount = foundIds.size;

  return (
    <section
      aria-label="Pokémon to find"
      className="mb-4 overflow-hidden rounded-card border border-border/10"
      style={{
        // Tinted from the scene itself, so the banner belongs to the plate
        // below rather than to the page chrome around it.
        background: `linear-gradient(135deg, ${palette.distant}26, ${palette.propMid}33)`,
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-text">
          {theme.name}
        </h2>
        <span className="font-mono text-sm font-bold tabular-nums text-text-muted">
          {foundCount}/{targets.length} found
        </span>
      </div>

      <p className="px-4 pb-3 pt-1 text-sm leading-snug text-text-muted">
        {theme.intro}
      </p>

      {/*
        One row, always. `overflow-x-auto` with `shrink-0` children keeps the
        cards at a legible size and lets the row scroll instead of squeezing.

        `scroll-px-4` matters: scroll snapping aligns a snap target to the
        scrollport edge, which cancels the container's own padding-left at
        rest, so the first card ends up flush while the last keeps its 16px.
        Matching the scroll padding to the box padding keeps both edges even.
      */}
      <ul className="flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
        {targets.map((t) => {
          const found = foundIds.has(t.id);
          return (
            <li
              key={t.id}
              className={`relative flex w-[92px] shrink-0 snap-start flex-col items-center gap-1 rounded-control border px-2 py-2 transition-colors ${
                found
                  ? "border-success/50 bg-success/15"
                  : "border-border/15 bg-bg/40"
              }`}
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element -- the same
                    ~1KB game sprite the plate renders; next/image adds nothing. */}
                <img
                  src={getSpriteUrl(t.id)}
                  alt=""
                  width={52}
                  height={52}
                  className={`h-13 w-13 object-contain transition-[filter,opacity] duration-300 ${
                    found ? "opacity-60 grayscale" : ""
                  }`}
                  style={{ height: 52, width: 52 }}
                />
                {found && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-white shadow">
                    <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3.5} />
                  </span>
                )}
              </div>
              <span
                className={`w-full truncate text-center text-micro font-semibold capitalize ${
                  found ? "text-success" : "text-text"
                }`}
                title={t.name}
              >
                {t.name}
              </span>
              <span className="sr-only">{found ? "Found" : "Still hidden"}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default TargetStrip;
