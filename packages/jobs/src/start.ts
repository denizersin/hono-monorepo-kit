/**
 * Standalone Worker Entry Point
 * Use this when running workers as a separate process
 *
 * This initializes both Redis (for queues) and Database (for processors)
 */
import "dotenv/config";
import { validateJobsEnv } from "@repo/config/jobs";
import { initializeJobs } from "./config/redis.config";
import { startWorkers, setupGracefulShutdown } from "./workers";

// Validate environment variables
const env = validateJobsEnv();

console.log("🔧 Environment:", env.NODE_ENV);
console.log("🔧 Redis:", env.REDIS_URL);
console.log("🔧 Database:", env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));

// Initialize jobs with Redis + Database config
initializeJobs({
  redis: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT, 10),
    password: env.REDIS_PASSWORD,
    db: parseInt(env.REDIS_DB, 10),
  },
  database: {
    connectionString: env.DATABASE_URL,
    ssl: env.IS_DEV ? false : { rejectUnauthorized: false },
  },
});

// Start workers
startWorkers();
setupGracefulShutdown();
