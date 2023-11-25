CREATE TABLE `connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider_name` varchar(256) NOT NULL,
	`provider_id` varchar(256) NOT NULL,
	`user_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `connections_id_unique` UNIQUE(`id`),
	CONSTRAINT `connections_provider_name_unique` UNIQUE(`provider_name`),
	CONSTRAINT `connections_provider_id_unique` UNIQUE(`provider_id`),
	CONSTRAINT `provider_name_index` UNIQUE(`provider_name`),
	CONSTRAINT `provider_id_index` UNIQUE(`provider_id`)
);
--> statement-breakpoint
CREATE TABLE `passwords` (
	`hash` char(60) NOT NULL,
	`user_id` int
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`expiration_date` datetime NOT NULL,
	`user_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_id_unique` UNIQUE(`id`),
	CONSTRAINT `user_id_index` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alt_text` text,
	`content_type` varchar(100) NOT NULL,
	`blob` binary NOT NULL,
	`user_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_images_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_images_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(256) NOT NULL,
	`alias` varchar(256) NOT NULL,
	`name` varchar(256),
	`type` enum('standard','creator','admin') NOT NULL DEFAULT 'standard',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_alias_unique` UNIQUE(`alias`)
);
