import { useState } from "react";

function ShowcaseScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pokemon, setPokemon] = useState();

  const apiHandler = async () => {
    const response = await fetch(`/api/hello?query=${searchQuery}`);
    const json = await response.json();

    console.log("json", json);

    setPokemon(json);
  };

  function decimetersToFeetAndInches(decimeters) {
    // 1 decimeter is equal to 0.328084 feet
    const feet = decimeters * 0.328084;

    // 1 foot is equal to 12 inches
    const totalInches = feet * 12;

    // Calculate the number of whole feet
    const wholeFeet = Math.floor(feet);

    // Calculate the remaining inches
    const remainingInches = totalInches - wholeFeet * 12;

    return `${wholeFeet} ft. ${Math.ceil(remainingInches)} in`;
  }

  function hectogramsToPounds(hectograms) {
    // 1 hectogram is equal to 0.220462 pounds
    const pounds = hectograms * 0.220462;

    return Math.ceil(pounds);
  }

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
        {pokemon &&
          pokemon.map((pokemon) => (
            <div
              className="group w-96 h-96 [perspective:1000px]"
              key={pokemon.id}
            >
              <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0">
                  <img
                    className="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40 bg-slate-600 p-4"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/${pokemon.url.replace(
                      "media/",
                      ""
                    )}`}
                  />
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
        {pokemon && pokemon.length === 0 && (
          <div className="text-slate-200">No results found.</div>
        )}
      </div>
    </main>
  );
}

export default ShowcaseScreen;
