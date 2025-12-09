import { Job } from 'bull';
import { EmailJobData, JobResult } from '../types/job.types';

/**
 * Mock email sending function
 * Replace this with your actual email service (SendGrid, Nodemailer, etc.)
 */
async function sendEmail(
  to: string,
  subject: string,
  body: string,
  cc?: string[],
  bcc?: string[],
  attachments?: Array<{ filename: string; path: string }>
): Promise<void> {
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // TODO: Implement actual email sending logic
  console.log('📧 Sending email:', {
    to,
    subject,
    body: body.substring(0, 50) + '...',
    cc,
    bcc,
    attachments: attachments?.map(a => a.filename)
  });

  // Simulate occasional failures for testing retry logic
  if (Math.random() < 0.1) {
    throw new Error('Network error: Could not connect to email server');
  }
}

/**
 * Process Email Job
 * Handles email sending with progress tracking and error handling
 */
export async function processEmail(job: Job<EmailJobData>): Promise<JobResult> {
  const { to, subject, body, cc, bcc, attachments } = job.data;
  
  try {
    // Update progress: preparing
    await job.progress(10);
    await job.log('Preparing to send email');

    // Validate email data
    if (!to || !subject || !body) {
      throw new Error('Invalid email data: missing required fields');
    }

    // Update progress: validating
    await job.progress(30);
    await job.log('Email data validated');

    // Send email
    await job.progress(50);
    await job.log('Sending email...');
    
    await sendEmail(to, subject, body, cc, bcc, attachments);
    
    // Update progress: completed
    await job.progress(100);
    await job.log('Email sent successfully');

    return {
      success: true,
      message: 'Email sent successfully',
      data: {
        to,
        subject,
        sentAt: new Date()
      },
      completedAt: new Date()
    };

  } catch (error: any) {
    // Log error
    await job.log(`Error: ${error.message}`);
    
    // Determine if error is retryable
    const isRetryable = 
      error.message.includes('Network error') ||
      error.message.includes('Timeout') ||
      error.message.includes('Connection');

    if (isRetryable && job.attemptsMade < (job.opts.attempts || 3)) {
      // Let Bull retry the job
      throw new Error(`Email could not be sent (attempt ${job.attemptsMade + 1}): ${error.message}`);
    } else {
      // Final failure
      throw new Error(`Email sending failed permanently: ${error.message}`);
    }
  }
}

/**
 * Email processor with concurrency support
 * Export this function to be used by the worker
 */
export default processEmail;

