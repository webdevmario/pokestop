import { Pool, QueryResult } from "pg";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  url: string;
};

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  ssl: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;
  const client = await pool.connect();

  try {
    if (req.method === "GET") {
      const queryResult: QueryResult = await client.query<Pokemon[]>(
        `SELECT pokemon.id, name, height, weight, url FROM pokemon INNER JOIN photos ON pokemon.id = photos.pokemon_id WHERE name like '%${query}%'`
      );
      const output: Pokemon[] = queryResult.rows;

      res.status(200).json(output);
    } else {
      res.status(405).end(); // method not allowed
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("err", err.message);
    }
  } finally {
    client.release();
  }
}
