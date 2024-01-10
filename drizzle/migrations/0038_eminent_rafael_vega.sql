CREATE TABLE `event_instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`event_id` int NOT NULL,
	`parent_tile_id` int,
	`parent_character_id` int,
	CONSTRAINT `event_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `parent_character_id`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `parent_tile_id`;