import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

import { hasOfficialArt, hasSprite, type Pokemon } from "@/lib/pokemon";

export type { Pokemon };

interface PokemonFile {
  _meta: {
    fetchedAt: string;
    rowCount: number;
    sourceSchemaVersion: string;
    source: string;
  };
  pokemon: Pokemon[];
}

let cachedPokemon: Pokemon[] | null = null;

function loadPokemon(): Pokemon[] {
  if (cachedPokemon) return cachedPokemon;
  const filePath = path.join(process.cwd(), "data", "pokemon.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const file: PokemonFile = JSON.parse(raw);
  cachedPokemon = file.pokemon;
  return cachedPokemon!;
}

/**
 * A dense hide & seek plate needs a few hundred rows in one request; splitting
 * it into capped batches meant independent draws that overlapped.
 */
const MAX_RANDOM = 500;

/**
 * Uniform sample without replacement.
 *
 * Replaces `sort(() => Math.random() - 0.5)`, which is not a shuffle: it feeds
 * an inconsistent comparator to a sort, so the result is biased toward the
 * original order and the bias depends on the engine's sort implementation.
 * This is a partial Fisher-Yates, so it costs O(count) rather than O(n log n).
 */
function sample<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  const n = Math.min(count, pool.length);

  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, n);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const pokemon = loadPokemon();
  const { query, id, type, generation, limit, offset, random, spritesOnly, artOnly } =
    req.query;

  let results = pokemon;

  // Exclude rows with no game sprite. Anything that renders sprites on a
  // canvas needs this, or it gets invisible placeholders.
  if (spritesOnly === "1") {
    results = results.filter((p) => hasSprite(p.id));
  }

  // Same idea for the large official artwork, which is missing for a
  // different set of rows.
  if (artOnly === "1") {
    results = results.filter((p) => hasOfficialArt(p.id));
  }

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

  // Random selection. `random` returns its own slice, so composing it with
  // `offset`/`limit` would paginate an already-sampled set — two different
  // meanings of "which rows". Rejected explicitly rather than silently.
  if (random !== undefined) {
    if (offset !== undefined || limit !== undefined) {
      return res.status(400).json({
        error:
          "`random` cannot be combined with `offset` or `limit`. Use `random` to sample, or `offset`/`limit` to paginate.",
      });
    }

    const requested = parseInt(random as string);
    if (!Number.isFinite(requested) || requested < 1) {
      return res
        .status(400)
        .json({ error: "`random` must be a positive integer." });
    }

    const count = Math.min(requested, MAX_RANDOM);
    results = sample(results, count);

    return res.status(200).json({ pokemon: results, total: results.length });
  }

  // Pagination
  const off = offset ? parseInt(offset as string) : 0;
  const lim = limit ? parseInt(limit as string) : results.length;
  const total = results.length;
  results = results.slice(off, off + lim);

  res.status(200).json({ pokemon: results, total });
}
