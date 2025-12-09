import { jobQueue } from './index';
import { JobType, ImageJobData, DEFAULT_JOB_OPTIONS } from '../types/job.types';
import { JobOptions } from 'bull';

/**
 * Image Processing Queue Service
 * Handles image processing job operations
 */
export class ImageQueue {
  private readonly queueName = JobType.PROCESS_IMAGE;

  /**
   * Add image processing job to queue
   */
  async addImageJob(
    imageData: ImageJobData,
    options?: JobOptions
  ) {
    const jobOptions = { 
      ...DEFAULT_JOB_OPTIONS,
      timeout: 60000, // 60 second timeout for image processing
      ...options 
    };
    
    return await jobQueue.addJob(
      this.queueName,
      imageData,
      jobOptions
    );
  }

  /**
   * Add bulk image processing jobs
   */
  async addBulkImageJobs(
    images: ImageJobData[],
    options?: JobOptions
  ) {
    const queue = jobQueue.getQueue(this.queueName);
    const jobOptions = { 
      ...DEFAULT_JOB_OPTIONS,
      timeout: 60000,
      ...options 
    };

    const jobs = images.map(image => ({
      data: image,
      opts: jobOptions
    }));

    return await queue.addBulk(jobs);
  }

  /**
   * Process image with high priority
   */
  async processImagePriority(
    imageData: ImageJobData,
    priority: number = 1
  ) {
    return await jobQueue.addJob(
      this.queueName,
      imageData,
      {
        ...DEFAULT_JOB_OPTIONS,
        timeout: 60000,
        priority
      }
    );
  }

  /**
   * Schedule image processing for later
   */
  async scheduleImageProcessing(
    imageData: ImageJobData,
    delay: number
  ) {
    return await jobQueue.addJob(
      this.queueName,
      imageData,
      {
        ...DEFAULT_JOB_OPTIONS,
        timeout: 60000,
        delay
      }
    );
  }

  /**
   * Get image job status
   */
  async getImageJobStatus(jobId: string) {
    const job = await jobQueue.getJob(this.queueName, jobId);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress();

    return {
      id: job.id,
      state,
      progress,
      data: job.data,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade
    };
  }

  /**
   * Get queue statistics
   */
  async getStats() {
    return await jobQueue.getQueueStats(this.queueName);
  }

  /**
   * Cancel image processing job
   */
  async cancelJob(jobId: string) {
    await jobQueue.removeJob(this.queueName, jobId);
  }
}

// Export singleton instance
export const imageQueue = new ImageQueue();

