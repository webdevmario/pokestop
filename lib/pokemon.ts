/**
 * One Pokemon row as served by /api/pokemon, matching the shape written by
 * scripts/import-pokemon.mjs. Sprite URLs are not stored on the row; build them
 * with getSpriteUrl / getOfficialArtUrl below.
 */
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  order: number;
  types: string[];
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  generation: string;
  region: string;
  color: string;
  evolution_chain: { id: number; name: string; order: number }[];
}

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export function getSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}

export function getOfficialArtUrl(id: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${id}.png`;
}

export const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  normal: { bg: "#A8A77A", text: "#fff" },
  fire: { bg: "#EE8130", text: "#fff" },
  water: { bg: "#6390F0", text: "#fff" },
  electric: { bg: "#F7D02C", text: "#333" },
  grass: { bg: "#7AC74C", text: "#fff" },
  ice: { bg: "#96D9D6", text: "#333" },
  fighting: { bg: "#C22E28", text: "#fff" },
  poison: { bg: "#A33EA1", text: "#fff" },
  ground: { bg: "#E2BF65", text: "#333" },
  flying: { bg: "#A98FF3", text: "#fff" },
  psychic: { bg: "#F95587", text: "#fff" },
  bug: { bg: "#A6B91A", text: "#fff" },
  rock: { bg: "#B6A136", text: "#fff" },
  ghost: { bg: "#735797", text: "#fff" },
  dragon: { bg: "#6F35FC", text: "#fff" },
  dark: { bg: "#705746", text: "#fff" },
  steel: { bg: "#B7B7CE", text: "#333" },
  fairy: { bg: "#D685AD", text: "#fff" },
};

export const GENERATIONS = [
  { value: "generation-i", label: "Gen I — Kanto" },
  { value: "generation-ii", label: "Gen II — Johto" },
  { value: "generation-iii", label: "Gen III — Hoenn" },
  { value: "generation-iv", label: "Gen IV — Sinnoh" },
  { value: "generation-v", label: "Gen V — Unova" },
  { value: "generation-vi", label: "Gen VI — Kalos" },
  { value: "generation-vii", label: "Gen VII — Alola" },
  { value: "generation-viii", label: "Gen VIII — Galar" },
  { value: "generation-ix", label: "Gen IX — Paldea" },
];

export const ALL_TYPES = Object.keys(TYPE_COLORS);

export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(4, "0")}`;
}
