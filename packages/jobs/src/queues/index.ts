import { Queue, Job, JobsOptions } from 'bullmq';
import { getQueueOptions, isJobsInitialized } from '../config/redis.config';
import { SahredEnums } from '@repo/shared/enums';

/**
 * Job Queue Manager
 * Manages multiple BullMQ queues with lazy initialization
 */
class JobQueue {
  private queues: Map<string, Queue> = new Map();
  private static instance: JobQueue;
  private initialized = false;

  private constructor() {
    // Don't initialize queues here - wait for first use
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): JobQueue {
    if (!JobQueue.instance) {
      JobQueue.instance = new JobQueue();
    }
    return JobQueue.instance;
  }

  /**
   * Ensure jobs is initialized before queue operations
   */
  private ensureInitialized(): void {
    if (!isJobsInitialized()) {
      throw new Error(
        "Jobs not initialized. Call initializeJobs() first from your app entry point."
      );
    }

    // Initialize predefined queues on first use
    if (!this.initialized) {
      this.initializeQueues();
      this.initialized = true;
    }
  }

  /**
   * Initialize predefined queues
   */
  private initializeQueues(): void {
    Object.values(SahredEnums.QUEUE_KEY).forEach((jobType) => {
      this.createQueue(jobType);
    });
  }

  /**
   * Create a new queue
   */
  private createQueue(name: string): Queue {
    const queue = new Queue(name, getQueueOptions());

    this.setupQueueListeners(queue, name);

    this.queues.set(name, queue);
    return queue;
  }

  /**
   * Setup queue event listeners
   * BullMQ emits events on a QueueEvents instance, but Queue itself supports
   * a limited set of local events (error). For richer events use QueueEvents.
   */
  private setupQueueListeners(queue: Queue, name: string): void {
    queue.on('error', (error) => {
      console.error(`[Queue:${name}] Error:`, error);
    });
  }

  /**
   * Get or create a queue
   */
  public getQueue(name: string): Queue {
    this.ensureInitialized();

    if (!this.queues.has(name)) {
      return this.createQueue(name);
    }
    return this.queues.get(name)!;
  }

  /**
   * Add a job to a queue
   */
  public async addJob<T extends object>(
    queueName: string,
    jobName: string,
    data: T,
    options?: JobsOptions
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    return await queue.add(jobName, data, options) as Job<T>;
  }

  /**
   * Get job by ID
   */
  public async getJob(queueName: string, jobId: string): Promise<Job | null> {
    const queue = this.getQueue(queueName);
    return await queue.getJob(jobId) ?? null;
  }

  /**
   * Remove a job
   */
  public async removeJob(queueName: string, jobId: string): Promise<void> {
    const job = await this.getJob(queueName, jobId);
    if (job) {
      await job.remove();
    }
  }

  /**
   * Get queue stats
   */
  public async getQueueStats(queueName: string) {
    const queue = this.getQueue(queueName);
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount()
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed
    };
  }

  /**
   * Pause a queue
   */
  public async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.pause();
  }

  /**
   * Resume a queue
   */
  public async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.resume();
  }

  /**
   * Empty a queue
   */
  public async emptyQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.drain();
  }

  /**
   * Close all queues
   */
  public async closeAll(): Promise<void> {
    const closePromises = Array.from(this.queues.values()).map((queue) =>
      queue.close()
    );
    await Promise.all(closePromises);
    this.queues.clear();
    this.initialized = false;
  }

  /**
   * Get all queue names
   */
  public getQueueNames(): string[] {
    return Array.from(this.queues.keys());
  }
}

// Export singleton instance
export const jobQueue = JobQueue.getInstance();
