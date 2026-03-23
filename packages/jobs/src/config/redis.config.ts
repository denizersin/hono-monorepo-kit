import { QueueOptions, RedisOptions } from 'bullmq';
import { initializeDb, type DbConfig } from '@repo/db';

/**
 * Jobs Redis Configuration Interface
 */
export interface JobsRedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

/**
 * Jobs Database Configuration Interface
 */
export interface JobsDbConfig {
  connectionString: string;
  ssl: boolean | { rejectUnauthorized: boolean };
}

/**
 * Full Jobs Configuration Interface
 * database is optional - if not provided, db must be initialized separately
 */
export interface JobsConfig {
  redis: JobsRedisConfig;
  database?: JobsDbConfig;
}

// Singleton state
let _redisConfig: RedisOptions | null = null;
let _queueOptions: QueueOptions | null = null;
let _isInitialized = false;

/**
 * Initialize jobs configuration (Redis + Database)
 * Called once by the entry point (apps/backend or standalone worker)
 */
export function initializeJobs(config: JobsConfig): void {
  if (_isInitialized) {
    console.warn("Jobs already initialized, skipping...");
    return;
  }

  // Initialize Redis config
  _redisConfig = {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
    db: config.redis.db,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  };

  _queueOptions = {
    connection: _redisConfig,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: true,
      removeOnFail: false
    }
  };

  // Initialize Database (if config provided)
  if (config.database) {
    initializeDb({
      connectionString: config.database.connectionString,
      ssl: config.database.ssl,
    });
    console.log("✅ Jobs initialized (Redis + Database)");
  } else {
    console.log("✅ Jobs initialized (Redis only)");
  }

  _isInitialized = true;
}

/**
 * Get Redis configuration
 * Throws if not initialized
 */
export function getRedisConfig(): RedisOptions {
  if (!_redisConfig) {
    throw new Error(
      "Jobs not initialized. Call initializeJobs() first from your app entry point."
    );
  }
  return _redisConfig;
}

/**
 * Get BullMQ Queue Options
 * Throws if not initialized
 */
export function getQueueOptions(): QueueOptions {
  if (!_queueOptions) {
    throw new Error(
      "Jobs not initialized. Call initializeJobs() first from your app entry point."
    );
  }
  return _queueOptions;
}

/**
 * Check if jobs is initialized
 */
export function isJobsInitialized(): boolean {
  return _isInitialized;
}

/**
 * Get Redis connection URL
 */
export function getRedisUrl(): string {
  const config = getRedisConfig();
  const { host, port, password, db } = config;
  if (password) {
    return `redis://:${password}@${host}:${port}/${db}`;
  }
  return `redis://${host}:${port}/${db}`;
}

/**
 * Legacy compatibility exports using Proxy for lazy evaluation
 */
export const redisConfig = new Proxy({} as RedisOptions, {
  get(_, prop) {
    return Reflect.get(getRedisConfig(), prop);
  }
});

export const queueOptions = new Proxy({} as QueueOptions, {
  get(_, prop) {
    return Reflect.get(getQueueOptions(), prop);
  }
});
