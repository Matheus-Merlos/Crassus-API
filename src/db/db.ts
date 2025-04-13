import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER!,
  host: 'localhost',
  database: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  port: parseInt(process.env.POSTGRES_PORT!),
  ssl: false,
});

const db = drizzle(pool);

export default db;
