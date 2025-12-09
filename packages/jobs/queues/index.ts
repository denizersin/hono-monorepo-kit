import Queue from 'bull';
import { queueOptions } from '../config/redis.config';
import { JobType } from '../types/job.types';

/**
 * Job Queue Manager
 * Manages multiple Bull queues
 */
class JobQueue {
  private queues: Map<string, Queue.Queue> = new Map();
  private static instance: JobQueue;

  private constructor() {
    // Initialize with predefined queues
    this.initializeQueues();
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
   * Initialize predefined queues
   */
  private initializeQueues(): void {
    // Initialize queues for each job type
    Object.values(JobType).forEach((jobType) => {
      this.createQueue(jobType);
    });
  }

  /**
   * Create a new queue
   */
  private createQueue(name: string): Queue.Queue {
    const queue = new Queue(name, queueOptions);

    // Setup queue event listeners
    this.setupQueueListeners(queue, name);

    this.queues.set(name, queue);
    return queue;
  }

  /**
   * Setup queue event listeners
   */
  private setupQueueListeners(queue: Queue.Queue, name: string): void {
    queue.on('error', (error) => {
      console.error(`[Queue:${name}] Error:`, error);
    });

    queue.on('waiting', (jobId) => {
      console.log(`[Queue:${name}] Job ${jobId} is waiting`);
    });

    queue.on('active', (job) => {
      console.log(`[Queue:${name}] Job ${job.id} is now active`);
    });

    queue.on('stalled', (job) => {
      console.warn(`[Queue:${name}] Job ${job.id} has stalled`);
    });

    queue.on('progress', (job, progress) => {
      console.log(`[Queue:${name}] Job ${job.id} progress: ${progress}%`);
    });

    queue.on('completed', (job, result) => {
      console.log(`[Queue:${name}] ✓ Job ${job.id} completed successfully`);
    });

    queue.on('failed', (job, err) => {
      console.error(`[Queue:${name}] ✗ Job ${job.id} failed:`, err.message);
    });

    queue.on('removed', (job) => {
      console.log(`[Queue:${name}] Job ${job.id} removed`);
    });

    queue.on('cleaned', (jobs, type) => {
      console.log(`[Queue:${name}] Cleaned ${jobs.length} ${type} jobs`);
    });
  }

  /**
   * Get or create a queue
   */
  public getQueue(name: string): Queue.Queue {
    if (!this.queues.has(name)) {
      return this.createQueue(name);
    }
    return this.queues.get(name)!;
  }

  /**
   * Add a job to a queue
   */
  public async addJob<T>(
    queueName: string,
    data: T,
    options?: Queue.JobOptions
  ): Promise<Queue.Job<T>> {
    const queue = this.getQueue(queueName);
    return await queue.add(data, options);
  }

  /**
   * Get job by ID
   */
  public async getJob(queueName: string, jobId: string): Promise<Queue.Job | null> {
    const queue = this.getQueue(queueName);
    return await queue.getJob(jobId);
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
    await queue.empty();
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

