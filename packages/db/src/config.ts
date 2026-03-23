import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { schema } from "./schema";

// Database config type
export interface DbConfig {
  connectionString: string;
  ssl: boolean | { rejectUnauthorized: boolean };
  maxConnections?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// Singleton state
let _db: NodePgDatabase<typeof schema> | null = null;
let _pool: Pool | null = null;
let _isInitialized = false;

/**
 * Initialize database connection
 * Called once by the entry point (apps/backend)
 */
export function initializeDb(config: DbConfig): void {
  if (_isInitialized) {
    console.warn("Database already initialized, skipping...");
    return;
  }

  _pool = new Pool({
    connectionString: config.connectionString,
    ssl: config.ssl,
    max: config.maxConnections ?? 20,
    idleTimeoutMillis: config.idleTimeoutMillis ?? 30000,
    connectionTimeoutMillis: config.connectionTimeoutMillis ?? 2000,
  });

  _db = drizzle({ client: _pool, schema });
  _isInitialized = true;

  console.log("✅ Database initialized");
}

/**
 * Get database instance
 * Throws if not initialized
 */
export function getDb(): NodePgDatabase<typeof schema> {
  if (!_db) {
    throw new Error(
      "Database not initialized. Call initializeDb() first from your app entry point."
    );
  }
  return _db;
}

/**
 * Get pool instance
 */
export function getPool(): Pool {
  if (!_pool) {
    throw new Error("Database pool not initialized. Call initializeDb() first.");
  }
  return _pool;
}

/**
 * Check if database is initialized
 */
export function isDbInitialized(): boolean {
  return _isInitialized;
}

/**
 * Legacy compatibility - db export
 * Returns initialized db or throws
 */
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  },
});

export const pool = new Proxy({} as Pool, {
  get(_, prop) {
    return Reflect.get(getPool(), prop);
  },
});

// Type definitions
export type TDB = NodePgDatabase<typeof schema>;
export type TDbTableName = keyof typeof schema;
export type TDbTable = (typeof schema)[TDbTableName];
export type TDBTransaction = Parameters<Parameters<TDB["transaction"]>[0]>[0];

/**
 * Helper to start a transaction with a promise interface
 */
export const startTransactionPromisfy = (): Promise<TDBTransaction> => {
  return new Promise((resolve, reject) => {
    getDb()
      .transaction(async (trx) => {
        resolve(trx);
      })
      .catch(reject);
  });
};

// Export schema for convenience
export { schema };
