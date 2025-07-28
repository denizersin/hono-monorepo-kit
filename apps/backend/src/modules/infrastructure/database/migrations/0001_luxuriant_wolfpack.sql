CREATE TABLE `log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`eventName` varchar(255) NOT NULL,
	`eventData` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `log-status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `log-status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `character` MODIFY COLUMN `mainPersonaId` int NOT NULL;