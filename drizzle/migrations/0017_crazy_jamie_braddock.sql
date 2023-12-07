CREATE TABLE `items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`type` enum('key','pass'),
	`name` text NOT NULL,
	`summary` text,
	`description` text,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`tile_id` int NOT NULL,
	CONSTRAINT `items_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `tiles` MODIFY COLUMN `name` text NOT NULL;