CREATE TABLE `connections` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`provider_name` varchar(256) NOT NULL,
	`provider_id` varchar(256) NOT NULL,
	`user_id` int,
	CONSTRAINT `connections_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `connections_provider_name_unique` UNIQUE(`provider_name`),
	CONSTRAINT `connections_provider_id_unique` UNIQUE(`provider_id`),
	CONSTRAINT `provider` UNIQUE(`provider_id`,`provider_name`)
);
--> statement-breakpoint
CREATE TABLE `passwords` (
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`hash` text NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `passwords_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`image_url` varchar(2083),
	`user_id` int,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiration_date` datetime NOT NULL,
	`user_id` int,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`email` varchar(256) NOT NULL,
	`alias` varchar(256) NOT NULL,
	`name` varchar(256),
	`type` enum('standard','creator','admin') NOT NULL DEFAULT 'standard',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_alias_unique` UNIQUE(`alias`),
	CONSTRAINT `email` UNIQUE(`email`),
	CONSTRAINT `alias` UNIQUE(`alias`)
);
--> statement-breakpoint
CREATE TABLE `character_instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`tile_id` int NOT NULL,
	`character_id` int NOT NULL,
	CONSTRAINT `character_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	CONSTRAINT `characters_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `locks_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `event_instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`event_id` int NOT NULL,
	`parent_tile_id` int,
	`parent_character_id` int,
	`parent_gate_id` int,
	CONSTRAINT `event_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	`parent_id` int,
	`trigger` varchar(256),
	`triggers_unlock_id` int,
	`triggers_lock_id` int,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `locks_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `gates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	`type` enum('north','east','south','west','up','down','other') NOT NULL,
	`from_tile_id` int NOT NULL,
	`to_tile_id` int NOT NULL,
	CONSTRAINT `gates_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `locks_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `grids` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	`user_id` int NOT NULL,
	`player_id` int NOT NULL,
	`first_tile_id` int NOT NULL,
	CONSTRAINT `grids_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `locks_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `item_instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`item_id` int NOT NULL,
	`tile_id` int,
	`event_id` int,
	CONSTRAINT `item_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	`type` enum('key','pass','other') NOT NULL DEFAULT 'other',
	CONSTRAINT `items_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `locks_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `lock_instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`lock_id` int NOT NULL,
	`event_id` int,
	`gate_id` int,
	`inverse` boolean NOT NULL DEFAULT false,
	`visible` boolean NOT NULL DEFAULT true,
	CONSTRAINT `lock_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `locks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	`required_item_id` int,
	`consumes` boolean NOT NULL DEFAULT false,
	CONSTRAINT `locks_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `locks_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `tiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	CONSTRAINT `tiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`),
	CONSTRAINT `locks_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE INDEX `user_id_index` ON `sessions` (`user_id`);