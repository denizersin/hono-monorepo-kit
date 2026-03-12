import { Worker, Job } from 'bullmq';
import processEmail from './processors/email.processor';
import processImageJob from './processors/image.processor';
import { queueOptions } from './config/redis.config';
import logger from '@repo/logger';
import { SahredEnums } from '@repo/shared/enums';

/**
 * Worker Configuration
 */
const WORKER_CONFIG = {
  [SahredEnums.QUEUE_KEY.SEND_EMAIL]: {
    processor: processEmail,
    concurrency: 5,
    name: 'Email Worker'
  },
  [SahredEnums.QUEUE_KEY.PROCESS_IMAGE]: {
    processor: processImageJob,
    concurrency: 3,
    name: 'Image Worker'
  }
};

const activeWorkers: Worker[] = [];

/**
 * Start all workers
 */
export function startWorkers(): void {
  logger.job('🚀 Starting job workers...');
  console.log('🚀 Starting job workers...');

  Object.entries(WORKER_CONFIG).forEach(([jobType, config]) => {
    const worker = new Worker(
      jobType,
      async (job: Job) => config.processor(job as any),
      {
        connection: queueOptions.connection,
        concurrency: config.concurrency
      }
    );

    worker.on('completed', (job, result) => {
      console.log(`[${config.name}] ✓ Job ${job.id} completed successfully`);
      console.log(`[${config.name}] Result:`, result);
    });

    worker.on('failed', (job, err) => {
      console.error(`[${config.name}] ✗ Job ${job?.id} failed:`, err.message);
      console.error(`[${config.name}] Failed after ${job?.attemptsMade} attempts`);
    });

    worker.on('progress', (job, progress) => {
      console.log(`[${config.name}] Job ${job.id} progress: ${progress}`);
    });

    worker.on('error', (err) => {
      console.error(`[${config.name}] Worker error:`, err);
    });

    activeWorkers.push(worker);
    console.log(`✓ ${config.name} started with concurrency: ${config.concurrency}`);
  });

  console.log('✓ All workers started successfully');
}

/**
 * Stop all workers gracefully
 */
export async function stopWorkers(): Promise<void> {
  console.log('🛑 Stopping job workers...');

  await Promise.all(activeWorkers.map(worker => worker.close()));
  activeWorkers.length = 0;

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
