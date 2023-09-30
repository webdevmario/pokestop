import {
  decimetersToFeetAndInches,
  hectogramsToPounds,
} from "@/services/unit-conversion.service";
import Image from "next/image";
import { useState } from "react";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  url: string;
}

function ShowcaseScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  const apiHandler = async () => {
    const response = await fetch(`/api/hello?query=${searchQuery}`);
    const pokemon = await response.json();

    setPokemon(pokemon);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="mb-16 mt-12">
        <div className="flex justify-center items-center mb-6">
          <h3 className="font-bold tracking-widest text-3xl">SHOWCASE</h3>
        </div>
        <input
          type="text"
          placeholder="Enter a Pokemon name"
          className="p-3 rounded-l-md w-60 h-14 outline-none text-slate-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="border-gray-200 border-2 bg-slate-200 h-14 text-gray-700 px-6 py-3 rounded-r-md font-semibold"
          onClick={apiHandler}
        >
          Search
        </button>
      </div>
      <div className="flex gap-8 w-full flex-wrap justify-center">
        {pokemon.length > 0 &&
          pokemon.map((pokemon) => (
            <div
              className="group w-96 h-96 [perspective:1000px]"
              key={pokemon.id}
            >
              <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0">
                  {pokemon.url && (
                    <Image
                      alt={`pokemon_${pokemon.id}`}
                      className="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40 bg-slate-600 p-4"
                      height={350}
                      width={350}
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/${pokemon.url.replace(
                        "media/",
                        ""
                      )}`}
                    />
                  )}
                </div>
                <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex min-h-full flex-col items-center justify-center">
                    <h1 className="text-lg">#{pokemon.id}</h1>
                    <h2 className="text-3xl font-bold uppercase tracking-widest mb-6">
                      {pokemon.name}
                    </h2>
                    <div className="flex gap-6">
                      <div className="text-base">
                        <span className="font-bold">Height: </span>
                        {decimetersToFeetAndInches(pokemon.height)}
                      </div>
                      <div className="text-base">
                        <span className="font-bold">Weight: </span>
                        {hectogramsToPounds(pokemon.weight)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {pokemon.length === 0 && searchQuery !== "" && (
          <div className="text-slate-200">No results found.</div>
        )}
      </div>
    </main>
  );
}

export default ShowcaseScreen;
