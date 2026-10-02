import { Baby, ChevronLeft, ChevronRight, Sparkles, Star, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import PageMeta from "@/components/layout/page-meta";
import PokemonCard from "@/components/pokemon/pokemon-card";
import {
  Button,
  Card,
  Modal,
  PageHeader,
  Skeleton,
  StatTile,
  fieldClasses,
} from "@/components/ui";
import {
  ALL_TYPES,
  GENERATIONS,
  TYPE_COLORS,
  formatPokemonId,
  getSpriteUrl,
  type Pokemon,
} from "@/lib/pokemon";
import {
  decimetersToFeetAndInches,
  hectogramsToPounds,
} from "@/services/unit-conversion.service";

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
    <>
      <PageMeta
        title="Pokédex"
        description="Browse every Pokémon with type and generation filters, evolution chains and stats."
      />

      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
        <PageHeader title="Pokédex" subtitle={`${total} Pokémon`}>
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search Pokémon by name"
            className={`${fieldClasses} w-48`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
          <select
            aria-label="Filter by type"
            className={fieldClasses}
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
            aria-label="Filter by generation"
            className={fieldClasses}
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
        </PageHeader>

        {loading ? (
          // Mirrors the real grid so the layout doesn't jump when results land.
          <div
            aria-busy="true"
            aria-label="Loading Pokémon"
            className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
          >
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-[122px] rounded-card" />
            ))}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {pokemon.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p)}
                  className="pokemon-card rounded-card border border-border/5 bg-surface-raised p-2 text-center transition-colors hover:border-border/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Image
                    src={getSpriteUrl(p.id)}
                    alt={p.name}
                    width={64}
                    height={64}
                    className="mx-auto"
                    sizes="64px"
                  />
                  <p className="font-mono text-micro text-text-subtle">
                    {formatPokemonId(p.id)}
                  </p>
                  <p className="truncate text-xs font-semibold capitalize text-text">
                    {p.name}
                  </p>
                  <div className="mt-1 flex justify-center gap-1">
                    {p.types.map((t) => (
                      <span
                        key={t}
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: TYPE_COLORS[t]?.bg }}
                        title={t}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  icon={<ChevronLeft aria-hidden className="h-4 w-4" />}
                >
                  Prev
                </Button>
                <span className="text-sm text-text-muted">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  iconAfter={<ChevronRight aria-hidden className="h-4 w-4" />}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        <Modal
          open={selected !== null}
          onClose={() => setSelected(null)}
          label={selected?.name ?? "Pokémon details"}
          className="w-full max-w-lg"
        >
          {selected && (
            <Card
              variant="surface"
              padding="none"
              className="max-h-[85vh] w-full overflow-y-auto"
            >
              {/* Header art — click/tap the artwork to flip to key stats */}
              <div className="relative h-48 overflow-hidden rounded-t-card">
                <PokemonCard pokemon={selected} />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-text-muted transition-colors hover:text-text"
                >
                  <X aria-hidden className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                <p className="font-mono text-xs text-text-muted">
                  {formatPokemonId(selected.id)}
                </p>
                <h2 className="mb-3 text-2xl font-bold capitalize text-text">
                  {selected.name}
                </h2>

                <div className="mb-4 flex flex-wrap gap-2">
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
                    <span className="type-badge gap-1 bg-warning/20 text-warning">
                      <Star aria-hidden className="h-3 w-3" />
                      Legendary
                    </span>
                  )}
                  {selected.is_mythical && (
                    <span className="type-badge gap-1 bg-accent/20 text-accent">
                      <Sparkles aria-hidden className="h-3 w-3" />
                      Mythical
                    </span>
                  )}
                  {selected.is_baby && (
                    <span className="type-badge gap-1 bg-info/20 text-info">
                      <Baby aria-hidden className="h-3 w-3" />
                      Baby
                    </span>
                  )}
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <StatTile
                    boxed
                    size="sm"
                    label="Height"
                    value={decimetersToFeetAndInches(selected.height)}
                  />
                  <StatTile
                    boxed
                    size="sm"
                    label="Weight"
                    value={`${hectogramsToPounds(selected.weight)} lbs`}
                  />
                  <StatTile
                    boxed
                    size="sm"
                    label="Region"
                    value={
                      <span className="capitalize">
                        {selected.region || "Unknown"}
                      </span>
                    }
                  />
                  <StatTile
                    boxed
                    size="sm"
                    label="Color"
                    value={
                      <span className="capitalize">
                        {selected.color || "Unknown"}
                      </span>
                    }
                  />
                </div>

                {/* Evolution chain */}
                {selected.evolution_chain.length > 1 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
                      Evolution Chain
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {selected.evolution_chain.map((evo, i) => (
                        <div key={evo.id} className="flex items-center gap-2">
                          {i > 0 && (
                            <ChevronRight
                              aria-hidden
                              className="h-4 w-4 text-text-muted"
                            />
                          )}
                          <div
                            className={`flex flex-col items-center rounded-control p-2 ${
                              evo.id === selected.id
                                ? "bg-primary/20 ring-1 ring-primary"
                                : "bg-surface-raised"
                            }`}
                          >
                            <Image
                              src={getSpriteUrl(evo.id)}
                              alt={evo.name}
                              width={48}
                              height={48}
                              sizes="48px"
                            />
                            <span className="text-micro capitalize text-text">
                              {evo.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </Modal>
      </main>
    </>
  );
}

export default PokedexScreen;
