CREATE TABLE `mail_confirmation_status` (
	`id` int NOT NULL,
	`name` enum('pending','confirmed','rejected') NOT NULL,
	CONSTRAINT `mail_confirmation_status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role` (
	`id` int NOT NULL,
	`name` enum('ADMIN','USER','OWNER') NOT NULL,
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
	`role` enum('ADMIN','USER','OWNER') NOT NULL,
	`test` varchar(255) NOT NULL,
	`mail_confirmation_status_id` int NOT NULL,
	`phone_verification_code_send_at` timestamp,
	`is_phone_verified` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
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
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `group-chat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group-chat-messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupChatId` int,
	`messageId` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `group-chat-messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` int AUTO_INCREMENT NOT NULL,
	`isManualWithPrompt` boolean,
	`imageBase64` text,
	`message` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
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
	`chatLanguageId` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `private-chat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `private-chat-messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`privateChatId` int,
	`messageId` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `private-chat-messages_id` PRIMARY KEY(`id`)
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
	`mainPersonaId` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `character_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `character-image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageUrl` varchar(255) NOT NULL,
	`width` int,
	`height` int,
	`characterId` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `character-image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `character-instruction` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rating` float,
	`order` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`isAdminInstruction` boolean NOT NULL DEFAULT false,
	`characterId` int NOT NULL,
	CONSTRAINT `character-instruction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `character-instruction-translation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`characterInstructionId` int NOT NULL,
	`languageId` int NOT NULL,
	CONSTRAINT `character-instruction-translation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `character-persona` (
	`id` int AUTO_INCREMENT NOT NULL,
	`characterId` int NOT NULL,
	`personaId` int NOT NULL,
	CONSTRAINT `character-persona_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `persona` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`imageUrl` varchar(255),
	`icon` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `persona_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `persona-translation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`personaId` int NOT NULL,
	`languageId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `persona-translation_id` PRIMARY KEY(`id`)
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
ALTER TABLE `group-chat-messages` ADD CONSTRAINT `group-chat-messages_groupChatId_group-chat_id_fk` FOREIGN KEY (`groupChatId`) REFERENCES `group-chat`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `group-chat-messages` ADD CONSTRAINT `group-chat-messages_messageId_message_id_fk` FOREIGN KEY (`messageId`) REFERENCES `message`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat` ADD CONSTRAINT `private-chat_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat` ADD CONSTRAINT `private-chat_modelId_ai-model_id_fk` FOREIGN KEY (`modelId`) REFERENCES `ai-model`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat` ADD CONSTRAINT `private-chat_characterId_character_id_fk` FOREIGN KEY (`characterId`) REFERENCES `character`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat` ADD CONSTRAINT `private-chat_chatLanguageId_country_id_fk` FOREIGN KEY (`chatLanguageId`) REFERENCES `country`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat-messages` ADD CONSTRAINT `private-chat-messages_privateChatId_private-chat_id_fk` FOREIGN KEY (`privateChatId`) REFERENCES `private-chat`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `private-chat-messages` ADD CONSTRAINT `private-chat-messages_messageId_message_id_fk` FOREIGN KEY (`messageId`) REFERENCES `message`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character` ADD CONSTRAINT `character_mainPersonaId_persona_id_fk` FOREIGN KEY (`mainPersonaId`) REFERENCES `persona`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character-image` ADD CONSTRAINT `character-image_characterId_character_id_fk` FOREIGN KEY (`characterId`) REFERENCES `character`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character-instruction` ADD CONSTRAINT `character-instruction_characterId_character_id_fk` FOREIGN KEY (`characterId`) REFERENCES `character`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character-instruction-translation` ADD CONSTRAINT `fk_char_instr_trans_instr` FOREIGN KEY (`characterInstructionId`) REFERENCES `character-instruction`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character-instruction-translation` ADD CONSTRAINT `fk_char_instr_trans_lang` FOREIGN KEY (`languageId`) REFERENCES `language`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character-persona` ADD CONSTRAINT `character-persona_characterId_character_id_fk` FOREIGN KEY (`characterId`) REFERENCES `character`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `character-persona` ADD CONSTRAINT `character-persona_personaId_persona_id_fk` FOREIGN KEY (`personaId`) REFERENCES `persona`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persona-translation` ADD CONSTRAINT `persona-translation_personaId_persona_id_fk` FOREIGN KEY (`personaId`) REFERENCES `persona`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persona-translation` ADD CONSTRAINT `persona-translation_languageId_language_id_fk` FOREIGN KEY (`languageId`) REFERENCES `language`(`id`) ON DELETE cascade ON UPDATE no action;