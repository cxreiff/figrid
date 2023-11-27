ALTER TABLE `sessions` DROP INDEX `user_id_index`;--> statement-breakpoint
CREATE INDEX `user_id_index` ON `sessions` (`user_id`);