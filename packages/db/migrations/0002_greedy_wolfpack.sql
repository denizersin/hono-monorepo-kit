ALTER TABLE "subscription" DROP CONSTRAINT "subscription_statusId_subscription_status_id_fk";
--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN "statusId";