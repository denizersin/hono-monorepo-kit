import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { ENV } from './src/env';

console.log(ENV.DATABASE_URL, 'DATABASE_URL');
export default defineConfig({
  out: './src/modules/infrastructure/database/migrations',
  schema: './src/modules/infrastructure/database/schema/**/*.ts',
//   schema: "./src/server/db/schema/**/*.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
});
