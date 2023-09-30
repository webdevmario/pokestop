const { Client } = require("pg");

const json = require("./output.json");

const connectionString =
  "postgresql://postgres:mypassword@localhost:5432/postgres";
const client = new Client({ connectionString });

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS photos (
    id serial PRIMARY KEY,
    pokemon_id INTEGER REFERENCES pokemon(id),
    url TEXT
  );
`;

const dataToInsert = [];

const insertDataQuery = `
  INSERT INTO photos (pokemon_id, url)
  VALUES ($1, $2)
`;

async function insertData() {
  try {
    json.pokemon_pokemon.forEach((pokemon) => {
      const item = {
        pokemon_id: pokemon.id,
      };

      const sprites = pokemon.pokemon_pokemonsprites[0].sprites;

      if (sprites.other) {
        item.url = sprites.other["official-artwork"].front_default;

        dataToInsert.push(item);
      }
    });

    await client.connect();
    await client.query(createTableQuery);

    for (const data of dataToInsert) {
      await client.query(insertDataQuery, [data.pokemon_id, data.url]);
    }

    console.log("Data inserted successfully.");
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {
    client.end();
  }
}

insertData();
