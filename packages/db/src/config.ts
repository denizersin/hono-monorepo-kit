import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { validateBackendEnv } from "@repo/config/backend";
import { schema } from "./schema";

// Load environment variables
const env = validateBackendEnv();

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: env._runtime.DATABASE_URL,
  ssl: env._runtime.IS_DEV ? false : { rejectUnauthorized: false },
  max: 20, // Maximum number of connections in pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
});

// Create Drizzle instance
export const db = drizzle({ client: pool, schema });

// Type definitions
export type TDB = NodePgDatabase<typeof schema>;
export type TDbTableName = keyof typeof schema;
export type TDbTable = typeof schema[TDbTableName];
export type TDBTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Helper to start a transaction with a promise interface
 */
export const startTransactionPromisfy = (): Promise<TDBTransaction> => {
  return new Promise((resolve, reject) => {
    db.transaction(async (trx) => {
      resolve(trx);
    }).catch(reject);
  });
};

// Export schema for convenience
export { schema };

// Export pool for advanced use cases
export { pool };
