import { QueueOptions } from 'bull';

/**
 * Redis Configuration
 */
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: null,
  enableReadyCheck: false
};

/**
 * Bull Queue Options
 */
export const queueOptions: QueueOptions = {
  redis: process.env.REDIS_URL || redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: false
  },
  settings: {
    lockDuration: 30000, // 30 seconds
    stalledInterval: 30000,
    maxStalledCount: 1
  }
};

/**
 * Get Redis connection URL
 */
export function getRedisUrl(): string {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  const { host, port, password, db } = redisConfig;
  if (password) {
    return `redis://:${password}@${host}:${port}/${db}`;
  }
  return `redis://${host}:${port}/${db}`;
}

