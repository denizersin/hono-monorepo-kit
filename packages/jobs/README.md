# Job Queue System with Bull

A robust job queue implementation using Bull and Redis for background job processing in Node.js.

## 📁 Project Structure

```
jobs/
├── config/
│   └── redis.config.ts         # Redis connection configuration
├── queues/
│   ├── index.ts                # Main queue manager (singleton)
│   ├── email.queue.ts          # Email queue operations
│   └── image.queue.ts          # Image processing queue operations
├── processors/
│   ├── email.processor.ts      # Email job processor
│   └── image.processor.ts      # Image processing job processor
├── types/
│   └── job.types.ts            # TypeScript type definitions
├── workers.ts                  # Worker management and configuration
├── index.ts                    # Main exports
├── example.ts                  # Usage examples
└── README.md                   # This file
```

## 🚀 Features

- ✅ **Multiple Queue Support**: Separate queues for different job types
- ✅ **Job Prioritization**: High-priority jobs processed first
- ✅ **Delayed Jobs**: Schedule jobs for future execution
- ✅ **Retry Logic**: Automatic retry with exponential backoff
- ✅ **Progress Tracking**: Real-time job progress updates
- ✅ **Concurrency Control**: Configure concurrent job processing
- ✅ **Bulk Operations**: Add multiple jobs at once
- ✅ **Queue Statistics**: Monitor queue health and performance
- ✅ **Graceful Shutdown**: Clean worker shutdown on process termination
- ✅ **TypeScript Support**: Full type safety

## 📦 Installation

Install required dependencies:

```bash
npm install bull redis
npm install --save-dev @types/bull
```

Or with pnpm:

```bash
pnpm add bull redis
pnpm add -D @types/bull
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
# Or configure separately:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Redis Setup

Make sure Redis is running:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or install locally (macOS)
brew install redis
brew services start redis
```

## 🎯 Usage

### Basic Setup

```typescript
import { startWorkers, setupGracefulShutdown } from './jobs';

// Start workers
startWorkers();

// Setup graceful shutdown
setupGracefulShutdown();
```

### Sending Emails

```typescript
import { emailQueue, EmailJobData } from './jobs';

// Simple email
const emailData: EmailJobData = {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Thank you for signing up!'
};

const job = await emailQueue.addEmailJob(emailData);
console.log(`Job ID: ${job.id}`);

// Priority email
await emailQueue.sendPriorityEmail(emailData, 1);

// Scheduled email (send in 1 hour)
await emailQueue.scheduleEmail(emailData, 3600000);

// Bulk emails
const emails: EmailJobData[] = [/* ... */];
await emailQueue.addBulkEmailJobs(emails);
```

### Processing Images

```typescript
import { imageQueue, ImageJobData } from './jobs';

const imageData: ImageJobData = {
  imageUrl: 'https://example.com/photo.jpg',
  operations: {
    resize: { width: 800, height: 600 },
    format: 'webp',
    quality: 80
  },
  outputPath: '/output/photo.webp'
};

const job = await imageQueue.addImageJob(imageData);

// Check status
const status = await imageQueue.getImageJobStatus(job.id as string);
console.log(status);
```

### Queue Management

```typescript
import { jobQueue } from './jobs';

// Get queue statistics
const stats = await jobQueue.getQueueStats('send-email');
console.log(stats); // { waiting, active, completed, failed, delayed }

// Pause/Resume queue
await jobQueue.pauseQueue('send-email');
await jobQueue.resumeQueue('send-email');

// Empty queue
await jobQueue.emptyQueue('send-email');
```

## 🔧 Integration Examples

### Express.js Integration

```typescript
import express from 'express';
import { startWorkers, setupGracefulShutdown, emailQueue } from './jobs';
import { JobType } from './jobs/types/job.types';

const app = express();
app.use(express.json());

// Start workers
startWorkers();
setupGracefulShutdown();

// API endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const job = await emailQueue.addEmailJob(req.body, {
      attempts: 3,
      backoff: 5000
    });
    
    res.json({ 
      success: true, 
      jobId: job.id 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Check job status
app.get('/api/jobs/:jobId', async (req, res) => {
  const status = await emailQueue.getEmailJobStatus(req.params.jobId);
  res.json(status);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Hono Integration

```typescript
import { Hono } from 'hono';
import { startWorkers, setupGracefulShutdown, emailQueue } from './jobs';

const app = new Hono();

// Start workers
startWorkers();
setupGracefulShutdown();

app.post('/api/send-email', async (c) => {
  const body = await c.req.json();
  
  const job = await emailQueue.addEmailJob(body);
  
  return c.json({ 
    success: true, 
    jobId: job.id 
  });
});

app.get('/api/jobs/:jobId', async (c) => {
  const jobId = c.req.param('jobId');
  const status = await emailQueue.getEmailJobStatus(jobId);
  
  return c.json(status);
});

export default app;
```

## 🎛️ Advanced Configuration

### Custom Job Options

```typescript
import { JobOptions } from 'bull';

const customOptions: JobOptions = {
  priority: 1,           // Higher priority (1 = highest)
  delay: 5000,           // Delay in milliseconds
  attempts: 5,           // Retry attempts
  backoff: {
    type: 'exponential',
    delay: 5000
  },
  removeOnComplete: true,
  removeOnFail: false,
  timeout: 30000         // Job timeout
};

await emailQueue.addEmailJob(emailData, customOptions);
```

### Adding New Job Types

1. Add job type to `types/job.types.ts`:

```typescript
export enum JobType {
  SEND_EMAIL = 'send-email',
  PROCESS_IMAGE = 'process-image',
  GENERATE_REPORT = 'generate-report'  // New type
}

export interface ReportJobData {
  userId: string;
  reportType: 'daily' | 'weekly';
  format: 'pdf' | 'excel';
}
```

2. Create processor in `processors/report.processor.ts`:

```typescript
import { Job } from 'bull';
import { ReportJobData, JobResult } from '../types/job.types';

export async function processReport(job: Job<ReportJobData>): Promise<JobResult> {
  // Implementation
}
```

3. Add worker configuration in `workers.ts`:

```typescript
import processReport from './processors/report.processor';

const WORKER_CONFIG = {
  [JobType.GENERATE_REPORT]: {
    processor: processReport,
    concurrency: 2,
    name: 'Report Worker'
  }
};
```

## 📊 Monitoring

### Bull Board (Optional)

Install Bull Board for a web UI:

```bash
npm install @bull-board/express bull-board
```

```typescript
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { jobQueue } from './jobs';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullAdapter(jobQueue.getQueue('send-email')),
    new BullAdapter(jobQueue.getQueue('process-image'))
  ],
  serverAdapter
});

app.use('/admin/queues', serverAdapter.getRouter());
```

## 🧪 Testing

See `example.ts` for comprehensive usage examples:

```bash
# Run examples
ts-node jobs/example.ts
```

## 🛠️ Troubleshooting

### Common Issues

1. **Redis Connection Error**
   - Ensure Redis is running: `redis-cli ping`
   - Check REDIS_URL environment variable

2. **Jobs Not Processing**
   - Verify workers are started: `startWorkers()`
   - Check queue statistics: `await jobQueue.getQueueStats('queue-name')`

3. **Memory Issues**
   - Enable `removeOnComplete: true` to clean up old jobs
   - Set up periodic cleanup with `queue.clean()`

## 📝 Best Practices

1. **Idempotent Jobs**: Design jobs to be safely retryable
2. **Error Handling**: Distinguish between retryable and permanent errors
3. **Timeout**: Set appropriate timeouts for long-running jobs
4. **Monitoring**: Track job metrics and set up alerts
5. **Graceful Shutdown**: Always use `setupGracefulShutdown()`
6. **Resource Limits**: Configure concurrency based on available resources

## 📄 License

MIT

