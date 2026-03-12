import { jobQueue } from './index';
import { EmailJobData, EmailJobDataFor, EmailTemplateType, DEFAULT_JOB_OPTIONS } from '../types';
import { JobsOptions } from 'bullmq';
import { SahredEnums } from '@repo/shared/enums';

/**
 * Email Queue Service
 * Handles email job operations
 */
export class EmailQueue {
  private readonly queueName = SahredEnums.QUEUE_KEY.SEND_EMAIL;

  /**
   * Add email job to queue
   */
  async addEmailJob(
    emailData: EmailJobData,
    options?: JobsOptions
  ) {
    const jobOptions = { ...DEFAULT_JOB_OPTIONS, ...options };

    return await jobQueue.addJob(
      this.queueName,
      SahredEnums.QUEUE_KEY.SEND_EMAIL,
      emailData,
      jobOptions
    );
  }

  async addTemplatedEmailJob<T extends EmailTemplateType>(
    emailData: EmailJobDataFor<T>,
    options?: JobsOptions
  ) {
    return this.addEmailJob(emailData, options);
  }

  /**
   * Add bulk email jobs
   */
  async addBulkEmailJobs(
    emails: EmailJobData[],
    options?: JobsOptions
  ) {
    const queue = jobQueue.getQueue(this.queueName);
    const jobOptions = { ...DEFAULT_JOB_OPTIONS, ...options };

    const jobs = emails.map(email => ({
      name: 'send-email',
      data: email,
      opts: jobOptions
    }));

    return await queue.addBulk(jobs);
  }

  /**
   * Schedule email for later
   */
  async scheduleEmail(
    emailData: EmailJobData,
    delay: number // delay in milliseconds
  ) {
    return await jobQueue.addJob(
      this.queueName,
      'send-email',
      emailData,
      {
        ...DEFAULT_JOB_OPTIONS,
        delay
      }
    );
  }

  /**
   * Send email with priority
   */
  async sendPriorityEmail(
    emailData: EmailJobData,
    priority: number = 1 // 1 is highest
  ) {
    return await jobQueue.addJob(
      this.queueName,
      'send-email',
      emailData,
      {
        ...DEFAULT_JOB_OPTIONS,
        priority
      }
    );
  }

  /**
   * Get email job status
   */
  async getEmailJobStatus(jobId: string) {
    const job = await jobQueue.getJob(this.queueName, jobId);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progress = job.progress;

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
}

// Export singleton instance
export const emailQueue = new EmailQueue();
