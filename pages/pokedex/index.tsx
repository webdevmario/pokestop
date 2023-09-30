import { useState } from "react";

function PokedexScreen() {
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
      <div className="flex gap-8 w-full flex-wrap">
        {pokemon &&
          pokemon.map((pokemon) => (
            <div
              className="rounded-md bg-slate-200 px-9 max-w-96"
              key={pokemon.id}
            >
              <div>
                <div className="uppercase flex justify-center items-center text-slate-600 tracking-widest font-bold mt-5 mb-5 text-2xl">
                  {pokemon.name}
                </div>
                <div>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/${pokemon.url.replace(
                      "media/",
                      ""
                    )}`}
                  />
                </div>
                <div className="flex flex-row justify-center gap-6 text-slate-600 mb-6 text-lg mt-6">
                  <div>
                    <span className="font-bold">ID:</span> {pokemon.id}
                  </div>
                  <div>
                    <span className="font-bold">Height:</span>{" "}
                    {decimetersToFeetAndInches(pokemon.height)}
                  </div>
                  <div>
                    <span className="font-bold">Weight:</span>{" "}
                    {hectogramsToPounds(pokemon.weight)} lbs
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default PokedexScreen;
