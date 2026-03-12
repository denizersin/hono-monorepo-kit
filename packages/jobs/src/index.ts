/**
 * Main entry point for job queue system
 * Export all job-related functionality
 */

// Queue exports
export { jobQueue } from './queues/index';
export { emailQueue } from './queues/email.queue';
export { imageQueue } from './queues/image.queue';

// Type exports
export * from './types';


// Processor exports
export { default as processEmail } from './processors/email.processor';
export { default as processImageJob } from './processors/image.processor';

// Config exports
export * from './config/redis.config';

