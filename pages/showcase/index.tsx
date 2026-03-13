import Title from "@/components/layout/title";
import PokemonCard from "@/components/pokemon/pokemon-card";
import { ALL_TYPES, TYPE_COLORS } from "@/lib/pokemon";
import { useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
}

function ShowcaseScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    setLoading(true);
    setSearched(false);
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (typeFilter) params.set("type", typeFilter);
    params.set("limit", "24");

    const res = await fetch(`/api/pokemon?${params}`);
    const data = await res.json();
    setPokemon(data.pokemon);
    setTotal(data.total);
    setSearched(true);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  const loadRandom = async () => {
    setLoading(true);
    setSearched(false);
    const res = await fetch("/api/pokemon?random=12");
    const data = await res.json();
    setPokemon(data.pokemon);
    setTotal(data.pokemon.length);
    setSearched(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      <Title
        name="Showcase"
        subtitle="Search Pokémon and hover to flip their cards"
      />

      {/* Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-3 rounded-xl w-64 bg-[var(--color-bg-card)] border border-white/10 text-white placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          className="px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-white outline-none focus:border-[var(--color-accent)] transition-colors"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <button
          className="px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:brightness-110 transition-all"
          onClick={search}
        >
          Search
        </button>
        <button
          className="px-6 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-white font-semibold hover:bg-[var(--color-bg-hover)] transition-all"
          onClick={loadRandom}
        >
          Random
        </button>
      </div>

      {searched && (
        <p className="text-center text-sm text-[var(--color-text-muted)] mb-8">
          {total} Pokémon found {total > 24 && `(showing first 24)`}
        </p>
      )}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Results */}
      <div className="flex gap-6 flex-wrap justify-center">
        {pokemon.map((p, i) => (
          <div
            key={p.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <PokemonCard pokemon={p} />
          </div>
        ))}
      </div>

      {searched && pokemon.length === 0 && !loading && (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          No Pokémon found. Try a different search!
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          Search for a Pokémon or click Random to get started!
        </div>
      )}
    </main>
  );
}

export default ShowcaseScreen;
