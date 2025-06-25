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
	`id` int AUTO_INCREMENT NOT NULL,
	`company_id` int NOT NULL,
	`password` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`surname` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`phone_code_id` int NOT NULL,
	`phone_number` varchar(255) NOT NULL,
	`wallet` float NOT NULL DEFAULT 0,
	`totalReward` float NOT NULL DEFAULT 0,
	`invitation_code` varchar(255) NOT NULL,
	`ref_code` varchar(255),
	`full_phone` varchar(255) NOT NULL,
	`role` enum('ADMIN','USER','OWNER'),
	`test` varchar(255) NOT NULL,
	`mail_confirmation_status_id` int NOT NULL,
	`phone_verification_code_send_at` timestamp,
	`is_phone_verified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat-type` (
	`id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `chat-type_id` PRIMARY KEY(`id`),
	CONSTRAINT `chat-type_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `group-chat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`modelId` int NOT NULL,
	`characterId` int,
	`promptTokens` int NOT NULL DEFAULT 0,
	`completionTokens` int NOT NULL DEFAULT 0,
	`totalTokens` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL,
	CONSTRAINT `group-chat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chatId` int,
	`isManualWithPrompt` boolean,
	`imageBase64` text,
	`message` text NOT NULL,
	CONSTRAINT `message_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `private-chat` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recipientFullPhoneNumber` varchar(255) NOT NULL,
	`modelId` int NOT NULL,
	`characterId` int,
	`promptTokens` int NOT NULL DEFAULT 0,
	`completionTokens` int NOT NULL DEFAULT 0,
	`totalTokens` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL,
	CONSTRAINT `private-chat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai-model` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`isHaveReasoning` boolean,
	`oneMillionInputPrice` float NOT NULL,
	`oneMillionOutputPrice` float NOT NULL,
	`oneMillionReasoningOutputPrice` float,
	`score` int NOT NULL,
	`order` int DEFAULT 0,
	`featuredText` varchar(255),
	`commission` float NOT NULL,
	`isActive` boolean,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL,
	CONSTRAINT `ai-model_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `character` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`imageUrl` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL,
	`adminInstruction` text NOT NULL,
	`userInstruction` text,
	`exampleUserInstructions` json NOT NULL DEFAULT ('[]'),
	CONSTRAINT `character_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `country` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phoneCode` varchar(255) NOT NULL,
	`code` varchar(255) NOT NULL,
	CONSTRAINT `country_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `language` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(255) NOT NULL,
	CONSTRAINT `language_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verify_code` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` int NOT NULL,
	`is_mobile` boolean DEFAULT false,
	`is_mail` boolean DEFAULT false,
	`generated_for_phone_or_mail` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `verify_code_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `group-chat` ADD CONSTRAINT `group-chat_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group-chat` ADD CONSTRAINT `group-chat_modelId_ai-model_id_fk` FOREIGN KEY (`modelId`) REFERENCES `ai-model`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group-chat` ADD CONSTRAINT `group-chat_characterId_character_id_fk` FOREIGN KEY (`characterId`) REFERENCES `character`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `message` ADD CONSTRAINT `message_chatId_private-chat_id_fk` FOREIGN KEY (`chatId`) REFERENCES `private-chat`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat` ADD CONSTRAINT `private-chat_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat` ADD CONSTRAINT `private-chat_modelId_ai-model_id_fk` FOREIGN KEY (`modelId`) REFERENCES `ai-model`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat` ADD CONSTRAINT `private-chat_characterId_character_id_fk` FOREIGN KEY (`characterId`) REFERENCES `character`(`id`) ON DELETE no action ON UPDATE no action;