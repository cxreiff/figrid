CREATE TABLE `rooms` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`description` text,
	`north` int,
	`east` int,
	`south` int,
	`west` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
