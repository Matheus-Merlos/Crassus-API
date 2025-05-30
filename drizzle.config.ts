import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const env = process.env.ENV!;
const host = env === 'prod' ? process.env.POSTGRES_HOST! : 'localhost';
const port = env === 'prod' ? 5432 : parseInt(process.env.POSTGRES_PORT!);

export default defineConfig({
  out: './drizzle',
  schema: `./src/db/schema`,
  dialect: 'postgresql',
  dbCredentials: {
    user: process.env.POSTGRES_USER!,
    host,
    database: process.env.POSTGRES_DB!,
    password: process.env.POSTGRES_PASSWORD!,
    port,
    ssl: false,
  },
});
