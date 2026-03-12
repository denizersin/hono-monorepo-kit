/**
 * Example usage of the job queue system
 * This file demonstrates how to use the job queue in your application
 */

import { emailQueue, imageQueue } from './index';
import { EmailJobData, ImageJobData } from './types';
import { startWorkers, setupGracefulShutdown } from "./workers";

/**
 * Example: Sending emails
 */
async function exampleSendEmail() {
  const emailData: EmailJobData = {
    to: 'user@example.com',
    template: 'welcome',
    variables: {
      fullName: 'Jane Doe'
    },
    cc: ['admin@example.com'],
  };

  // Add email job to queue
  const job = await emailQueue.addEmailJob(emailData);
  console.log(`Email job added with ID: ${job.id}`);

  // Check job status
  setTimeout(async () => {
    const status = await emailQueue.getEmailJobStatus(job.id as string);
    console.log('Email job status:', status);
  }, 2000);
}

/**
 * Example: Sending priority email
 */
async function examplePriorityEmail() {
  const emailData: EmailJobData = {
    to: 'urgent@example.com',
    subject: 'Urgent: Password Reset',
    template: 'invite',
    variables: {
      locale: 'en',
      email: 'urgent@example.com',
      invitedByEmail: 'admin@example.com',
      invitedByName: 'Admin User',
      teamName: 'Core Team',
      ip: '127.0.0.1'
    },
  };

  const job = await emailQueue.sendPriorityEmail(emailData, 1);
  console.log(`Priority email job added with ID: ${job.id}`);
}

/**
 * Example: Scheduling email for later
 */
async function exampleScheduledEmail() {
  const emailData: EmailJobData = {
    to: 'user@example.com',
    subject: 'Your Weekly Report',
    template: 'welcome',
    variables: {
      fullName: 'Weekly User'
    },
  };

  // Schedule email to be sent in 1 hour (3600000 ms)
  const job = await emailQueue.scheduleEmail(emailData, 3600000);
  console.log(`Scheduled email job added with ID: ${job.id}`);
}

/**
 * Example: Sending bulk emails
 */
async function exampleBulkEmails() {
  const emails: EmailJobData[] = [
    { to: 'user1@example.com', template: 'welcome', variables: { fullName: 'User One' } },
    { to: 'user2@example.com', template: 'welcome', variables: { fullName: 'User Two' } },
    { to: 'user3@example.com', template: 'welcome', variables: { fullName: 'User Three' } },
  ];

  const jobs = await emailQueue.addBulkEmailJobs(emails);
  console.log(`Added ${jobs.length} email jobs to queue`);
}

/**
 * Example: Processing images
 */
async function exampleProcessImage() {
  const imageData: ImageJobData = {
    imageUrl: 'https://example.com/images/photo.jpg',
    operations: {
      resize: { width: 800, height: 600 },
      format: 'webp',
      quality: 80,
    },
    outputPath: '/output/processed-photo.webp',
  };

  const job = await imageQueue.addImageJob(imageData);
  console.log(`Image processing job added with ID: ${job.id}`);

  // Check job status
  setTimeout(async () => {
    const status = await imageQueue.getImageJobStatus(job.id as string);
    console.log('Image job status:', status);
  }, 3000);
}

/**
 * Example: Processing bulk images
 */
async function exampleBulkImages() {
  const images: ImageJobData[] = [
    {
      imageUrl: 'https://example.com/images/photo1.jpg',
      operations: { resize: { width: 800, height: 600 }, format: 'webp' },
      outputPath: '/output/photo1.webp',
    },
    {
      imageUrl: 'https://example.com/images/photo2.jpg',
      operations: { resize: { width: 800, height: 600 }, format: 'webp' },
      outputPath: '/output/photo2.webp',
    },
  ];

  const jobs = await imageQueue.addBulkImageJobs(images);
  console.log(`Added ${jobs.length} image processing jobs to queue`);
}

/**
 * Example: Get queue statistics
 */
async function exampleQueueStats() {
  const emailStats = await emailQueue.getStats();
  console.log('Email Queue Stats:', emailStats);

  const imageStats = await imageQueue.getStats();
  console.log('Image Queue Stats:', imageStats);
}

/**
 * Main function to run examples
 */
async function main() {
  console.log('=== Job Queue Examples ===\n');

  // Start workers
  startWorkers();
  setupGracefulShutdown();

  // Run examples (uncomment to test)
  await exampleSendEmail();
  // await examplePriorityEmail();
  // await exampleScheduledEmail();
  // await exampleBulkEmails();
  // await exampleProcessImage();
  // await exampleBulkImages();

  // Check stats after a delay
  setTimeout(async () => {
    await exampleQueueStats();
  }, 5000);
}

// Uncomment to run examples
// main().catch(console.error);

export {
  exampleSendEmail,
  examplePriorityEmail,
  exampleScheduledEmail,
  exampleBulkEmails,
  exampleProcessImage,
  exampleBulkImages,
  exampleQueueStats,
};
