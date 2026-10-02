# Pokéstop Arcade

A Pokémon mini-game collection built with Next.js, TypeScript, and Tailwind CSS.

All 1,351 Pokémon (species plus alternate forms) loaded from a local JSON dataset — no database required.

## Features

- **Pokédex** — Browse all Pokémon with type/generation filters, pagination, and detail modals with evolution chains and a flippable artwork/stats panel
- **Matching** — Memory card game with easy/medium/hard difficulty and a timer
- **Who's That Pokémon?** — Silhouette guessing game with scoring, streaks, and hints
- **Word Search** — Procedurally generated puzzles with Pokémon names hidden in a grid
- **Hide & Seek** — Spot target Pokémon hidden among decoys in a generated scene

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data

Pokémon data sourced from [PokeAPI](https://pokeapi.co/) via their GraphQL endpoint. Sprites served from the [PokeAPI sprites repo](https://github.com/PokeAPI/sprites) on GitHub.

`data/pokemon.json` is generated. To refresh it after PokeAPI adds new Pokémon:

```bash
node scripts/import-pokemon.mjs
```

The script is idempotent and stamps `_meta` (fetch timestamp, row count, source schema) into the output.
