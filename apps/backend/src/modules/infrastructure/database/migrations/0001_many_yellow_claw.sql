ALTER TABLE `verify_code` DROP FOREIGN KEY `verify_code_user_id_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `verify_code` DROP COLUMN `user_id`;