/**
 * Regenerates data/pokemon.json from PokeAPI.
 *
 *   node scripts/import-pokemon.mjs
 *
 * Idempotent: fetches every Pokemon row (species + alternate forms), flattens it
 * to the shape the app consumes, and overwrites data/pokemon.json. Safe to re-run
 * whenever PokeAPI adds new Pokemon.
 *
 * Sprite URLs are NOT stored. They are rebuilt from the id at render time by
 * getSpriteUrl / getOfficialArtUrl in lib/pokemon.ts, so persisting them here
 * would only create a second source of truth that can drift.
 *
 * Replaces the old manual pipeline (a hand-run .graphql query ->
 * utilities/data/data-cleanup.js -> utilities/data/insert-pokemon.js), which
 * targeted a Postgres instance that no longer exists and was never able to
 * produce data/pokemon.json on its own.
 */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

// v1beta2 carries the current unprefixed schema. The older
// beta.pokeapi.co/graphql/v1beta endpoint (pokemon_v2_* names) is a stale
// snapshot and is missing the Gen 9 DLC rows.
const ENDPOINT = "https://graphql.pokeapi.co/v1beta2";
const SOURCE_SCHEMA_VERSION = "v1beta2";

const PAGE_SIZE = 200;
const OUT_PATH = path.join(process.cwd(), "data", "pokemon.json");

const QUERY = `
query ImportPokemon($limit: Int!, $offset: Int!) {
  pokemon(order_by: { id: asc }, limit: $limit, offset: $offset) {
    id
    name
    height
    weight
    order
    pokemontypes(order_by: { slot: asc }) {
      type {
        name
      }
    }
    pokemonspecy {
      is_baby
      is_legendary
      is_mythical
      generation {
        name
        region {
          name
        }
      }
      pokemoncolor {
        name
      }
      evolutionchain {
        pokemonspecies(order_by: { order: asc }) {
          id
          name
          order
        }
      }
    }
  }
}
`;

async function gql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`${ENDPOINT} responded ${res.status} ${res.statusText}`);
  }

  const body = await res.json();

  if (body.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(body.errors)}`);
  }

  return body.data;
}

/** Flattens one GraphQL row into the shape the app's API route serves. */
function normalize(row) {
  const species = row.pokemonspecy;

  return {
    id: row.id,
    name: row.name,
    height: row.height,
    weight: row.weight,
    order: row.order,
    types: row.pokemontypes.map((t) => t.type.name),
    is_baby: species?.is_baby ?? false,
    is_legendary: species?.is_legendary ?? false,
    is_mythical: species?.is_mythical ?? false,
    generation: species?.generation?.name ?? "",
    region: species?.generation?.region?.name ?? "",
    color: species?.pokemoncolor?.name ?? "",
    evolution_chain:
      species?.evolutionchain?.pokemonspecies?.map((s) => ({
        id: s.id,
        name: s.name,
        order: s.order,
      })) ?? [],
  };
}

async function main() {
  const rows = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const data = await gql(QUERY, { limit: PAGE_SIZE, offset });
    const page = data.pokemon;

    rows.push(...page);
    process.stdout.write(`\rfetched ${rows.length} rows`);

    if (page.length < PAGE_SIZE) break;
  }

  process.stdout.write("\n");

  const pokemon = rows.map(normalize).sort((a, b) => a.id - b.id);

  const payload = {
    _meta: {
      fetchedAt: new Date().toISOString(),
      rowCount: pokemon.length,
      sourceSchemaVersion: SOURCE_SCHEMA_VERSION,
      source: ENDPOINT,
    },
    pokemon,
  };

  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");

  const species = pokemon.filter((p) => p.id <= 10000).length;

  console.log(`wrote ${OUT_PATH}`);
  console.log(`  ${pokemon.length} rows (${species} species, ${pokemon.length - species} forms)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
