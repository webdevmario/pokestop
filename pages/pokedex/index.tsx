import Title from "@/components/layout/title";
import {
  TYPE_COLORS,
  ALL_TYPES,
  GENERATIONS,
  getSpriteUrl,
  getOfficialArtUrl,
  formatPokemonId,
} from "@/lib/pokemon";
import {
  decimetersToFeetAndInches,
  hectogramsToPounds,
} from "@/services/unit-conversion.service";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  generation: string;
  region: string;
  color: string;
  evolution_chain: { id: number; name: string; order: number }[];
}

const PAGE_SIZE = 48;

function PokedexScreen() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState("");
  const [genFilter, setGenFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", String(page * PAGE_SIZE));
    if (typeFilter) params.set("type", typeFilter);
    if (genFilter) params.set("generation", genFilter);
    if (search) params.set("query", search);

    const res = await fetch(`/api/pokemon?${params}`);
    const data = await res.json();
    setPokemon(data.pokemon);
    setTotal(data.total);
    setLoading(false);
  }, [page, typeFilter, genFilter, search]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Title name="Pokédex" subtitle={`${total} Pokémon`} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-center mb-8">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2.5 rounded-xl w-48 bg-[var(--color-bg-card)] border border-white/10 text-white text-sm placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        <select
          className="px-3 py-2.5 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-white text-sm outline-none"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All Types</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2.5 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-white text-sm outline-none"
          value={genFilter}
          onChange={(e) => {
            setGenFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All Generations</option>
          {GENERATIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {pokemon.map((p) => {
              const tc = TYPE_COLORS[p.types[0]] || TYPE_COLORS.normal;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="pokemon-card rounded-xl p-2 bg-[var(--color-bg-card)] border border-white/5 hover:border-white/15 text-center transition-all"
                >
                  <Image
                    src={getSpriteUrl(p.id)}
                    alt={p.name}
                    width={64}
                    height={64}
                    className="mx-auto"
                    unoptimized
                  />
                  <p className="text-[10px] text-white/40 font-mono">
                    {formatPokemonId(p.id)}
                  </p>
                  <p className="text-xs font-semibold capitalize text-white truncate">
                    {p.name}
                  </p>
                  <div className="flex justify-center gap-1 mt-1">
                    {p.types.map((t) => (
                      <span
                        key={t}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: TYPE_COLORS[t]?.bg }}
                        title={t}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg bg-[var(--color-bg-card)] border border-white/10 text-sm font-medium disabled:opacity-30 hover:bg-[var(--color-bg-hover)]"
              >
                ← Prev
              </button>
              <span className="text-sm text-[var(--color-text-muted)]">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-lg bg-[var(--color-bg-card)] border border-white/10 text-sm font-medium disabled:opacity-30 hover:bg-[var(--color-bg-hover)]"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-[var(--color-bg-secondary)] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header art */}
            <div
              className="relative h-48 flex items-center justify-center rounded-t-2xl"
              style={{
                background: `linear-gradient(135deg, ${
                  TYPE_COLORS[selected.types[0]]?.bg || "#666"
                }33, ${TYPE_COLORS[selected.types[0]]?.bg || "#666"}66)`,
              }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/70 hover:text-white"
              >
                ✕
              </button>
              <Image
                src={getOfficialArtUrl(selected.id)}
                alt={selected.name}
                width={160}
                height={160}
                className="drop-shadow-lg"
                unoptimized
              />
            </div>

            <div className="p-6">
              <p className="text-xs font-mono text-[var(--color-text-muted)]">
                {formatPokemonId(selected.id)}
              </p>
              <h2 className="text-2xl font-bold capitalize text-white mb-3">
                {selected.name}
              </h2>

              <div className="flex gap-2 mb-4">
                {selected.types.map((t) => (
                  <span
                    key={t}
                    className="type-badge"
                    style={{
                      backgroundColor: TYPE_COLORS[t]?.bg,
                      color: TYPE_COLORS[t]?.text,
                    }}
                  >
                    {t}
                  </span>
                ))}
                {selected.is_legendary && (
                  <span className="type-badge bg-yellow-500/20 text-yellow-400">
                    ⭐ Legendary
                  </span>
                )}
                {selected.is_mythical && (
                  <span className="type-badge bg-purple-500/20 text-purple-400">
                    ✦ Mythical
                  </span>
                )}
                {selected.is_baby && (
                  <span className="type-badge bg-pink-500/20 text-pink-400">
                    🍼 Baby
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                    Height
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {decimetersToFeetAndInches(selected.height)}
                  </p>
                </div>
                <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                    Weight
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {hectogramsToPounds(selected.weight)} lbs
                  </p>
                </div>
                <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                    Region
                  </p>
                  <p className="text-lg font-semibold text-white capitalize">
                    {selected.region || "Unknown"}
                  </p>
                </div>
                <div className="bg-[var(--color-bg-card)] rounded-xl p-3 text-center">
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                    Color
                  </p>
                  <p className="text-lg font-semibold text-white capitalize">
                    {selected.color || "Unknown"}
                  </p>
                </div>
              </div>

              {/* Evolution chain */}
              {selected.evolution_chain.length > 1 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
                    Evolution Chain
                  </h3>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {selected.evolution_chain.map((evo, i) => (
                      <div key={evo.id} className="flex items-center gap-2">
                        {i > 0 && (
                          <span className="text-[var(--color-text-muted)]">
                            →
                          </span>
                        )}
                        <div
                          className={`flex flex-col items-center p-2 rounded-xl ${
                            evo.id === selected.id
                              ? "bg-[var(--color-accent)]/20 ring-1 ring-[var(--color-accent)]"
                              : "bg-[var(--color-bg-card)]"
                          }`}
                        >
                          <Image
                            src={getSpriteUrl(evo.id)}
                            alt={evo.name}
                            width={48}
                            height={48}
                            unoptimized
                          />
                          <span className="text-[10px] capitalize text-white">
                            {evo.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default PokedexScreen;
