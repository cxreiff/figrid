CREATE TABLE `rooms` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text,
	`description` text,
	`north` int,
	`east` int,
	`south` int,
	`west` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
