CREATE TABLE `mail_confirmation_status` (
	`id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `mail_confirmation_status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `role_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int NOT NULL,
	`password` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`surname` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL,
	`mail_confirmation_status_id` int NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
