CREATE TABLE `characters` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`summary` text,
	`description` text,
	`image_url` varchar(2083),
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	CONSTRAINT `characters_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`grid_id` int NOT NULL,
	`tile_id` int NOT NULL,
	`item_id` int,
	`character_id` int,
	CONSTRAINT `instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `grids` ADD `summary` text;--> statement-breakpoint
ALTER TABLE `grids` ADD `image_url` varchar(2083);--> statement-breakpoint
ALTER TABLE `grids` ADD `player_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `items` ADD `image_url` varchar(2083);--> statement-breakpoint
ALTER TABLE `items` DROP COLUMN `tile_id`;