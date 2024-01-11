CREATE TABLE `lock_instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` int NOT NULL,
	`grid_id` int NOT NULL,
	`lock_id` int,
	`event_id` int,
	`gate_id` int,
	`inverse` boolean NOT NULL DEFAULT false,
	`visible` boolean NOT NULL DEFAULT true,
	CONSTRAINT `lock_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
ALTER TABLE `locks` RENAME COLUMN `unlocked_by_id` TO `unlocked_by_event_id`;--> statement-breakpoint
ALTER TABLE `locks` RENAME COLUMN `locked_by_id` TO `locked_by_event_id`;--> statement-breakpoint
ALTER TABLE `locks` ADD `unlocked_by_item_id` int;--> statement-breakpoint
ALTER TABLE `locks` ADD `consumes` boolean DEFAULT false NOT NULL;