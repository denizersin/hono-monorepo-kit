import { JobsOptions } from 'bullmq';

/**
 * Job Types Enumeration
 */


/**
 * Generic Job Result Interface
 */
export interface JobResult {
  success: boolean;
  message?: string;
  data?: any;
  completedAt: Date;
}

/**
 * Job Progress Interface
 */
export interface JobProgress {
  percentage: number;
  message?: string;
}

/**
 * Default Job Options
 */
export const DEFAULT_JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000
  },
  removeOnComplete: true,
  removeOnFail: false
};
