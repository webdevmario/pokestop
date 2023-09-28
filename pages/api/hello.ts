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
  console.log("pool", pool);

  const client = await pool.connect();

  try {
    const { rows } = await client.query("SELECT CURRENT_USER");
    const currentUser = rows[0]["current_user"];

    res.status(200).json({ name: currentUser });
  } catch (err) {
    console.error("err", err.message);
  } finally {
    client.release();
  }
}
