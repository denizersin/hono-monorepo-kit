import { Job } from 'bullmq';
import { db } from '@repo/db';
import { tblUser, tblLog } from '@repo/shared/schema';
import { eq } from 'drizzle-orm';
import { UserSyncJobData, UserSyncResult, userSyncJobSchema } from '../types/user-sync/types';
import { JobResult } from '../types';

/**
 * User Sync Processor
 * Example processor that demonstrates database usage in jobs
 *
 * This processor:
 * 1. Fetches user from database
 * 2. Performs sync operation
 * 3. Logs the activity to database
 */
export async function processUserSync(job: Job<UserSyncJobData>): Promise<JobResult> {
  try {
    await job.updateProgress(10);
    await job.log('Starting user sync job');

    // Validate input
    const parsed = userSyncJobSchema.safeParse(job.data);
    if (!parsed.success) {
      throw new Error(`Invalid user sync job payload: ${parsed.error.message}`);
    }

    const { userId, action, force } = parsed.data;

    await job.updateProgress(20);
    await job.log(`Fetching user ${userId} from database`);

    // Fetch user from database
    const user = await db.query.tblUser.findFirst({
      where: eq(tblUser.id, userId),
    });

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    await job.updateProgress(40);
    await job.log(`User found: ${user.email}`);

    // Perform sync based on action
    const changes: UserSyncResult['changes'] = [];

    switch (action) {
      case 'sync_profile':
        await job.log('Syncing user profile...');
        // Example: sync profile data from external service
        // In real implementation, you would call external APIs here
        break;

      case 'sync_subscription':
        await job.log('Syncing user subscription...');
        // Example: sync subscription status
        break;

      case 'sync_all':
        await job.log('Syncing all user data...');
        // Example: full sync
        break;
    }

    await job.updateProgress(70);
    await job.log('Sync completed, logging activity');

    // Log the sync activity to database
    await db.insert(tblLog).values({
      eventId: 100, // USER_SYNC event
      eventName: `user_sync_${action}`,
      eventData: {
        userId,
        action,
        force,
        jobId: job.id,
        changes,
        syncedAt: new Date().toISOString(),
      },
    });

    await job.updateProgress(100);
    await job.log('User sync job completed successfully');

    const result: UserSyncResult = {
      userId,
      action,
      syncedAt: new Date(),
      changes,
    };

    return {
      success: true,
      message: `User ${userId} synced successfully`,
      data: result,
      completedAt: new Date(),
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await job.log(`Error: ${errorMessage}`);

    // Log error to database
    try {
      await db.insert(tblLog).values({
        eventId: 101, // USER_SYNC_ERROR event
        eventName: 'user_sync_error',
        eventData: {
          userId: job.data.userId,
          action: job.data.action,
          jobId: job.id,
          error: errorMessage,
          failedAt: new Date().toISOString(),
        },
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }

    throw new Error(`User sync failed: ${errorMessage}`);
  }
}

export default processUserSync;
