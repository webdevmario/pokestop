import Image from "next/image";
import {
  TYPE_COLORS,
  getOfficialArtUrl,
  formatPokemonId,
} from "@/lib/pokemon";
import {
  decimetersToFeetAndInches,
  hectogramsToPounds,
} from "@/services/unit-conversion.service";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
}

interface Props {
  pokemon: Pokemon;
  showBack?: boolean;
}

function PokemonCard({ pokemon, showBack = true }: Props) {
  const primaryType = pokemon.types[0] || "normal";
  const typeColor = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  return (
    <div className="group w-72 h-96 [perspective:1000px]">
      <div
        className={`relative h-full w-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] ${
          showBack ? "group-hover:[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] bg-[var(--color-bg-card)] border border-white/5">
          <div
            className="h-2/3 flex items-center justify-center p-6 relative"
            style={{
              background: `linear-gradient(135deg, ${typeColor.bg}22, ${typeColor.bg}44)`,
            }}
          >
            <span className="absolute top-3 left-4 text-xs font-mono text-white/40">
              {formatPokemonId(pokemon.id)}
            </span>
            <Image
              alt={pokemon.name}
              className="drop-shadow-lg object-contain animate-float"
              height={200}
              width={200}
              src={getOfficialArtUrl(pokemon.id)}
              unoptimized
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-bold capitalize text-white mb-2">
              {pokemon.name}
            </h3>
            <div className="flex justify-center gap-2">
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
          </div>
        </div>

        {/* Back */}
        {showBack && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] bg-[var(--color-bg-card)] border border-white/5">
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <span className="text-xs font-mono text-white/40 mb-2">
                {formatPokemonId(pokemon.id)}
              </span>
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-4 text-white capitalize">
                {pokemon.name}
              </h2>
              <div className="flex gap-2 mb-6">
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
              <div className="flex gap-8 text-sm text-[var(--color-text-muted)]">
                <div>
                  <span className="block text-xs uppercase tracking-wide mb-1 text-white/50">
                    Height
                  </span>
                  <span className="font-semibold text-white">
                    {decimetersToFeetAndInches(pokemon.height)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wide mb-1 text-white/50">
                    Weight
                  </span>
                  <span className="font-semibold text-white">
                    {hectogramsToPounds(pokemon.weight)} lbs
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PokemonCard;
