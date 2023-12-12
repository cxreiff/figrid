CREATE TABLE `events` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`parent_id` int,
	`trigger` varchar(256),
	`required_item_id` int,
	`unlock_lock_id` int,
	`lock_lock_id` int,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `locks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`locked` boolean NOT NULL DEFAULT true,
	CONSTRAINT `locks_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `requirements` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`lock_id` int NOT NULL,
	`event_id` int,
	`gate_id` int,
	CONSTRAINT `requirements_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `gates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`grid_id` int NOT NULL,
	`user_id` int NOT NULL,
	`type` enum('north','east','south','west','up','down','other') NOT NULL,
	`from_id` int NOT NULL,
	`to_id` int NOT NULL,
	`event_id` int,
	CONSTRAINT `gates_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `item_instances` MODIFY COLUMN `tile_id` int;--> statement-breakpoint
ALTER TABLE `item_instances` ADD `event_id` int;