import { Job } from 'bullmq';
import { ImageJobData, JobResult } from '../types';

/**
 * Mock image processing function
 * Replace this with actual image processing library (Sharp, Jimp, etc.)
 */
async function processImage(
  imageUrl: string,
  operations: ImageJobData['operations'],
  outputPath: string
): Promise<{ processedUrl: string; size: number }> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('🖼️  Processing image:', {
    imageUrl,
    operations,
    outputPath
  });

  const processedSize = Math.floor(Math.random() * 1000000) + 100000;

  if (Math.random() < 0.05) {
    throw new Error('Image processing failed: Invalid image format');
  }

  return {
    processedUrl: outputPath,
    size: processedSize
  };
}

/**
 * Process Image Job
 * BullMQ processor: receives a Job instance and returns the result
 */
export async function processImageJob(job: Job<ImageJobData>): Promise<JobResult> {
  const { imageUrl, operations, outputPath } = job.data;

  try {
    await job.updateProgress(10);
    await job.log('Downloading image...');

    if (!imageUrl || !outputPath) {
      throw new Error('Invalid image data: missing required fields');
    }

    await job.updateProgress(20);
    await job.log('Image data validated');

    await job.updateProgress(40);
    await job.log('Processing image...');

    const result = await processImage(imageUrl, operations, outputPath);

    await job.updateProgress(80);
    await job.log('Saving processed image...');

    await new Promise(resolve => setTimeout(resolve, 500));

    await job.updateProgress(100);
    await job.log('Image processing completed successfully');

    return {
      success: true,
      message: 'Image processed successfully',
      data: {
        originalUrl: imageUrl,
        processedUrl: result.processedUrl,
        size: result.size,
        operations
      },
      completedAt: new Date()
    };

  } catch (error: any) {
    await job.log(`Error: ${error.message}`);

    const isRetryable =
      error.message.includes('Network error') ||
      error.message.includes('Timeout') ||
      error.message.includes('Connection') ||
      error.message.includes('Download failed');

    if (isRetryable && job.attemptsMade < (job.opts.attempts ?? 3)) {
      throw new Error(`Image processing failed (attempt ${job.attemptsMade + 1}): ${error.message}`);
    } else {
      throw new Error(`Image processing failed permanently: ${error.message}`);
    }
  }
}

export default processImageJob;
