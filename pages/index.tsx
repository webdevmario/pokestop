import Image from "next/image";
import Link from "next/link";

import Card from "@/components/ui/card";
import PageMeta from "@/components/layout/page-meta";
import pokemonFile from "@/data/pokemon.json";
import { GAME_ROUTES } from "@/lib/games";

// Read from the dataset so re-running scripts/import-pokemon.mjs keeps this honest.
const POKEMON_COUNT = pokemonFile._meta.rowCount.toLocaleString();

function Home() {
  return (
    <>
      <PageMeta
        title="Pokéstop Arcade"
        description={`Explore, play, and test your Pokémon knowledge across ${POKEMON_COUNT} Pokémon with mini-games and tools.`}
      />

      <div className="flex min-h-screen flex-col items-center px-4 py-12">
        {/* Hero */}
        <div className="mb-16 animate-fade-in-up text-center">
          <Image
            src="/pokeball.png"
            alt=""
            width={80}
            height={80}
            className="mx-auto mb-6 animate-float"
            priority
          />
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-text sm:text-6xl">
            Pokéstop <span className="text-primary">Arcade</span>
          </h1>
          <p className="mx-auto max-w-md text-lg text-text-muted">
            Explore, play, and test your Pokémon knowledge with mini-games and
            tools.
          </p>
        </div>

        {/* Game grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GAME_ROUTES.map(({ href, title, description, icon: Icon, color }, i) => (
            <Link
              key={href}
              href={href}
              className="block animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Card variant="interactive" padding="lg" className="h-full">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-control"
                  style={{ backgroundColor: `${color}22`, color }}
                >
                  <Icon aria-hidden className="h-6 w-6" />
                </div>
                <h2 className="mb-1 text-xl font-bold text-text">{title}</h2>
                <p className="text-sm text-text-muted">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
