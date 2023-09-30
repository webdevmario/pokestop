const fs = require("fs");

fs.readFile("../data/pokedata.json", "utf8", (err, fileData) => {
  if (err) {
    console.error("Error reading input file:", err);

    return;
  }

  try {
    const { data } = JSON.parse(fileData);
    const pokemon = data;

    pokemon.pokemon_pokemon.forEach((pokemonData) => {
      const sprites = pokemonData.pokemon_pokemonsprites[0].sprites;

      for (const key in sprites) {
        if (
          !sprites[key] ||
          key.includes("shiny") ||
          key.includes("female") ||
          key.includes("back")
        ) {
          delete sprites[key];
        }
      }

      if (sprites.other) {
        if (sprites.other.dream_world) {
          delete sprites.other.dream_world;
        }

        if (sprites.other.home) {
          for (const key in sprites.other.home) {
            if (
              !sprites.other.home[key] ||
              key.includes("shiny") ||
              key.includes("female") ||
              key.includes("back")
            ) {
              delete sprites.other.home[key];
            }
          }
        }

        if (sprites.other["official-artwork"]) {
          for (const key in sprites.other["official-artwork"]) {
            if (
              !sprites.other["official-artwork"][key] ||
              key.includes("shiny") ||
              key.includes("female") ||
              key.includes("back")
            ) {
              delete sprites.other["official-artwork"][key];
            }
          }
        }
      }

      if (sprites.versions) {
        delete sprites.versions;
      }
    });

    const manipulatedData = JSON.stringify(data, null, 2);

    fs.writeFile("output.json", manipulatedData, (err) => {
      if (err) {
        console.error("Error writing output file:", err);
      } else {
        console.log("Manipulated data saved to output.json");
      }
    });
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
  }
});
