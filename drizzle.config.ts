import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const env = process.env.ENV!;
const schemaParentFolder = env === 'prod' ? 'dist' : 'src';

export default defineConfig({
  out: './drizzle',
  schema: `./${schemaParentFolder}/db/schema`,
  dialect: 'postgresql',
  dbCredentials: {
    user: process.env.POSTGRES_USER!,
    host: 'localhost',
    database: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    port: parseInt(process.env.POSTGRES_PORT!),
    ssl: false,
  },
});
