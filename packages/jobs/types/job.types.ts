import { Job, JobOptions } from 'bull';

/**
 * Job Types Enumeration
 */
export enum JobType {
  SEND_EMAIL = 'send-email',
  PROCESS_IMAGE = 'process-image',
  GENERATE_REPORT = 'generate-report'
}

/**
 * Email Job Data Interface
 */
export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

/**
 * Image Processing Job Data Interface
 */
export interface ImageJobData {
  imageUrl: string;
  operations: {
    resize?: { width: number; height: number };
    crop?: { x: number; y: number; width: number; height: number };
    format?: 'jpeg' | 'png' | 'webp';
    quality?: number;
  };
  outputPath: string;
}

/**
 * Report Generation Job Data Interface
 */
export interface ReportJobData {
  reportType: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  userId: string;
  format: 'pdf' | 'excel' | 'csv';
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

