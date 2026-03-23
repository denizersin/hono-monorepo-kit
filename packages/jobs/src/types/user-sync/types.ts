import { z } from 'zod';

/**
 * User Sync Job Data Schema
 */
export const userSyncJobSchema = z.object({
  userId: z.number(),
  action: z.enum(['sync_profile', 'sync_subscription', 'sync_all']),
  force: z.boolean().optional().default(false),
});

export type UserSyncJobData = z.infer<typeof userSyncJobSchema>;

/**
 * User Sync Result
 */
export interface UserSyncResult {
  userId: number;
  action: string;
  syncedAt: Date;
  changes: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
}
