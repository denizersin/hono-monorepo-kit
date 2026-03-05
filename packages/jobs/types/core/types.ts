import { JobOptions } from 'bull';

/**
 * Job Types Enumeration
 */
export enum JobType {
  SEND_EMAIL = 'send-email',
  PROCESS_IMAGE = 'process-image',
  GENERATE_REPORT = 'generate-report'
}

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
export const DEFAULT_JOB_OPTIONS: JobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000
  },
  removeOnComplete: true,
  removeOnFail: false
};
