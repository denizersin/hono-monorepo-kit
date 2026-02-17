import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { validateBackendEnv } from "@repo/config/backend";

// Load environment variables
const env = validateBackendEnv();

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env._runtime.DATABASE_URL,
  },
});
