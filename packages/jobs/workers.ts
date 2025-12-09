import { jobQueue } from './queues/index';
import { JobType } from './types/job.types';
import processEmail from './processors/email.processor';
import processImageJob from './processors/image.processor';
import logger from '@repo/logger';
/**
 * Worker Configuration
 */
const WORKER_CONFIG = {
  [JobType.SEND_EMAIL]: {
    processor: processEmail,
    concurrency: 5, // Process 5 email jobs concurrently
    name: 'Email Worker'
  },
  [JobType.PROCESS_IMAGE]: {
    processor: processImageJob,
    concurrency: 3, // Process 3 image jobs concurrently
    name: 'Image Worker'
  }
  // Add more workers as needed
};

/**
 * Start all workers
 */
export function startWorkers(): void {
  logger.job('🚀 Starting job workers...');
  console.log('🚀 Starting job workers...');

  Object.entries(WORKER_CONFIG).forEach(([jobType, config]) => {
    const queue = jobQueue.getQueue(jobType);

    // Register processor with concurrency
    queue.process(config.concurrency, config.processor);

    // Setup specific event listeners for this worker
    queue.on('completed', (job, result) => {
      console.log(`[${config.name}] ✓ Job ${job.id} completed successfully`);
      console.log(`[${config.name}] Result:`, result);
    });

    queue.on('failed', (job, err) => {
      console.error(`[${config.name}] ✗ Job ${job.id} failed:`, err.message);
      console.error(`[${config.name}] Failed after ${job.attemptsMade} attempts`);
    });

    queue.on('progress', (job, progress) => {
      console.log(`[${config.name}] Job ${job.id} progress: ${progress}%`);
    });

    console.log(`✓ ${config.name} started with concurrency: ${config.concurrency}`);
  });

  console.log('✓ All workers started successfully');
}

/**
 * Stop all workers gracefully
 */
export async function stopWorkers(): Promise<void> {
  console.log('🛑 Stopping job workers...');

  await jobQueue.closeAll();

  console.log('✓ All workers stopped successfully');
}

/**
 * Handle graceful shutdown
 */
export function setupGracefulShutdown(): void {
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    try {
      await stopWorkers();
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

