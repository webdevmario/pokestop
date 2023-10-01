import { Pool } from "pg";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query } = req.query;
  const client = await pool.connect();

  try {
    if (req.method === "GET") {
      const { rows } = await client.query(
        `SELECT pokemon.id, name, height, weight, url FROM pokemon INNER JOIN photos ON pokemon.id = photos.pokemon_id WHERE name like '%${query}%'`
      );

      res.status(200).json(rows);
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
