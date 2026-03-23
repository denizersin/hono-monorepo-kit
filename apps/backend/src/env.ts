import "dotenv/config";
import { validateBackendEnv } from "@repo/config/backend";
import { initializeDb } from "@repo/db";
import { initializeJobs } from "@repo/jobs";

// Validate and export environment variables
export const ENV = validateBackendEnv();

// Initialize database with validated config
initializeDb({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.IS_DEV ? false : { rejectUnauthorized: false },
});

// Initialize jobs (Redis/BullMQ) with validated config
// Database is already initialized above, so we only pass Redis config
initializeJobs({
  redis: {
    host: ENV.REDIS_HOST,
    port: parseInt(ENV.REDIS_PORT, 10),
    password: ENV.REDIS_PASSWORD || undefined,
    db: parseInt(ENV.REDIS_DB, 10),
  },
});

// Export type for convenience
export type Env = typeof ENV;
