CREATE TABLE `grids` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` text,
	`description` text,
	`first_tile` int NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `grids_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `tiles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` text,
	`description` text,
	`north` int,
	`east` int,
	`south` int,
	`west` int,
	`grid_id` int NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `tiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
DROP TABLE `rooms`;--> statement-breakpoint
ALTER TABLE `connections` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `profiles` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `connections` ADD CONSTRAINT `users_id_unique` UNIQUE(`id`);--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `users_id_unique` UNIQUE(`id`);--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `users_id_unique` UNIQUE(`id`);--> statement-breakpoint
ALTER TABLE `connections` DROP INDEX `connections_id_unique`;--> statement-breakpoint
ALTER TABLE `profiles` DROP INDEX `profiles_id_unique`;--> statement-breakpoint
ALTER TABLE `sessions` DROP INDEX `sessions_id_unique`;