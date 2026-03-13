import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

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
  sprite: string | null;
  official_art: string | null;
}

let cachedPokemon: Pokemon[] | null = null;

function loadPokemon(): Pokemon[] {
  if (cachedPokemon) return cachedPokemon;
  const filePath = path.join(process.cwd(), "data", "pokemon.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedPokemon = JSON.parse(raw);
  return cachedPokemon!;
}

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export function getSpriteUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}

export function getOfficialArtUrl(id: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${id}.png`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const pokemon = loadPokemon();
  const { query, id, type, generation, limit, offset, random } = req.query;

  let results = pokemon;

  // Filter by name search
  if (query && typeof query === "string") {
    const q = query.toLowerCase();
    results = results.filter((p) => p.name.includes(q));
  }

  // Filter by ID
  if (id && typeof id === "string") {
    const pid = parseInt(id);
    results = results.filter((p) => p.id === pid);
  }

  // Filter by type
  if (type && typeof type === "string") {
    const t = type.toLowerCase();
    results = results.filter((p) => p.types.includes(t));
  }

  // Filter by generation
  if (generation && typeof generation === "string") {
    results = results.filter((p) => p.generation === generation);
  }

  // Random selection
  if (random && typeof random === "string") {
    const count = Math.min(parseInt(random) || 10, 100);
    const shuffled = [...results].sort(() => Math.random() - 0.5);
    results = shuffled.slice(0, count);
  }

  // Pagination
  const off = offset ? parseInt(offset as string) : 0;
  const lim = limit ? parseInt(limit as string) : results.length;
  const total = results.length;
  results = results.slice(off, off + lim);

  res.status(200).json({ pokemon: results, total });
}
