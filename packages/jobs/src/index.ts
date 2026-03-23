/**
 * Main entry point for job queue system
 * Export all job-related functionality
 */

// Initialize function - MUST be called before using queues
export {
  initializeJobs,
  isJobsInitialized,
  type JobsConfig,
  type JobsRedisConfig,
  type JobsDbConfig
} from './config/redis.config';

// Queue exports
export { jobQueue } from './queues/index';
export { emailQueue } from './queues/email.queue';
export { imageQueue } from './queues/image.queue';

// Type exports
export * from './types';

// Processor exports
export { default as processEmail } from './processors/email.processor';
export { default as processImageJob } from './processors/image.processor';
export { default as processUserSync } from './processors/user-sync.processor';

// Config exports (legacy compatibility)
export { redisConfig, queueOptions, getRedisConfig, getQueueOptions, getRedisUrl } from './config/redis.config';

