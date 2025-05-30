import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const env = process.env.ENV!;
const host = env === 'prod' ? process.env.POSTGRES_HOST! : 'localhost';
const port = env === 'prod' ? 5432 : parseInt(process.env.POSTGRES_PORT!);

const pool = new Pool({
  user: process.env.POSTGRES_USER!,
  host,
  database: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  port,
  ssl: false,
});

const db = drizzle(pool);

export default db;
