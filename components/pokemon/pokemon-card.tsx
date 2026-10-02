import Image from "next/image";
import { useState } from "react";

import {
  TYPE_COLORS,
  getOfficialArtUrl,
  formatPokemonId,
  type Pokemon,
} from "@/lib/pokemon";
import {
  decimetersToFeetAndInches,
  hectogramsToPounds,
} from "@/services/unit-conversion.service";

interface Props {
  pokemon: Pokemon;
  /** Set false to render the artwork only, with no flip affordance. */
  showBack?: boolean;
}

/**
 * Flippable artwork panel. Fills its container, so the caller controls the size.
 *
 * The flip is a single `transform` transition on one promoted layer: nothing else
 * inside the preserve-3d subtree may animate or carry a filter, or the whole
 * subtree re-rasterizes every frame. Hover is gated behind `(hover: hover)` so
 * touch devices use the tap instead and never get stuck mid-flip.
 */
function PokemonCard({ pokemon, showBack = true }: Props) {
  const [flipped, setFlipped] = useState(false);

  const primaryType = pokemon.types[0] || "normal";
  const typeColor = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;
  const gradient = `linear-gradient(135deg, ${typeColor.bg}33, ${typeColor.bg}66)`;

  // Each face gets exactly ONE transform declaration. Splitting translateZ into a
  // second utility would silently override the back face's rotateY and render
  // both faces at once.
  const faceClasses =
    "absolute inset-0 overflow-hidden [backface-visibility:hidden]";

  return (
    <div
      className="relative h-full w-full [perspective:1000px]"
      // drop-shadow lives out here: inside the rotating layer it would re-filter
      // on every frame of the flip.
      style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))" }}
    >
      <button
        type="button"
        onClick={() => showBack && setFlipped((f) => !f)}
        aria-label={
          showBack
            ? `${pokemon.name} artwork, activate to show stats`
            : `${pokemon.name} artwork`
        }
        aria-pressed={showBack ? flipped : undefined}
        disabled={!showBack}
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] [will-change:transform] ${
          showBack ? "cursor-pointer" : ""
        }`}
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* Front — artwork */}
        <div
          className={faceClasses}
          style={{ background: gradient, transform: "translateZ(0)" }}
        >
          <span className="absolute top-3 left-4 z-10 text-xs font-mono text-white/50">
            {formatPokemonId(pokemon.id)}
          </span>
          <Image
            alt={pokemon.name}
            className="object-contain p-4"
            fill
            sizes="(max-width: 640px) 90vw, 512px"
            src={getOfficialArtUrl(pokemon.id)}
            priority
          />
          {showBack && (
            <span className="absolute bottom-2 right-3 text-[10px] uppercase tracking-wide text-white/50">
              Tap for stats
            </span>
          )}
        </div>

        {/* Back — key stats */}
        {showBack && (
          <div
            className={faceClasses}
            style={{
              background: gradient,
              transform: "rotateY(180deg) translateZ(0)",
            }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center">
              <div>
                <span className="block font-mono text-xs text-white/50">
                  {formatPokemonId(pokemon.id)}
                </span>
                <h3 className="text-xl font-bold capitalize text-white">
                  {pokemon.name}
                </h3>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {pokemon.types.map((t) => (
                  <span
                    key={t}
                    className="type-badge"
                    style={{
                      backgroundColor: TYPE_COLORS[t]?.bg || "#999",
                      color: TYPE_COLORS[t]?.text || "#fff",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-7 text-sm">
                <div>
                  <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-white/50">
                    Height
                  </span>
                  <span className="font-semibold text-white">
                    {decimetersToFeetAndInches(pokemon.height)}
                  </span>
                </div>
                <div>
                  <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-white/50">
                    Weight
                  </span>
                  <span className="font-semibold text-white">
                    {hectogramsToPounds(pokemon.weight)} lbs
                  </span>
                </div>
              </div>

              <div>
                <span className="mb-0.5 block text-[10px] uppercase tracking-wide text-white/50">
                  Generation
                </span>
                <span className="text-sm font-semibold capitalize text-white">
                  {pokemon.generation.replace("generation-", "Gen ")}
                  {pokemon.region && ` — ${pokemon.region}`}
                </span>
              </div>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

export default PokemonCard;
