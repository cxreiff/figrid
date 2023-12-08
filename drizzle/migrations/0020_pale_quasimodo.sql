CREATE TABLE `character_instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`grid_id` int NOT NULL,
	`tile_id` int NOT NULL,
	`character_id` int NOT NULL,
	CONSTRAINT `character_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `item_instances` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`grid_id` int NOT NULL,
	`tile_id` int NOT NULL,
	`item_id` int NOT NULL,
	CONSTRAINT `item_instances_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
DROP TABLE `instances`;