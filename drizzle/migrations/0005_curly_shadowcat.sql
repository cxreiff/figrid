CREATE TABLE `assets` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`resource_type` enum('grid','tile','event','character','item') NOT NULL,
	`asset_type` enum('image') NOT NULL DEFAULT 'image',
	`filename` varchar(256) NOT NULL,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `characters` ADD `image_asset_id` int;--> statement-breakpoint
ALTER TABLE `events` ADD `image_asset_id` int;--> statement-breakpoint
ALTER TABLE `grids` ADD `image_asset_id` int;--> statement-breakpoint
ALTER TABLE `items` ADD `image_asset_id` int;--> statement-breakpoint
ALTER TABLE `tiles` ADD `image_asset_id` int;--> statement-breakpoint
ALTER TABLE `characters` DROP COLUMN `image_url`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `image_url`;--> statement-breakpoint
ALTER TABLE `gates` DROP COLUMN `image_url`;--> statement-breakpoint
ALTER TABLE `grids` DROP COLUMN `image_url`;--> statement-breakpoint
ALTER TABLE `items` DROP COLUMN `image_url`;--> statement-breakpoint
ALTER TABLE `locks` DROP COLUMN `image_url`;--> statement-breakpoint
ALTER TABLE `tiles` DROP COLUMN `image_url`;