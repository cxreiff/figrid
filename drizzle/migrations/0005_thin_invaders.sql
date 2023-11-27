ALTER TABLE `users` ADD CONSTRAINT `email` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `alias` UNIQUE(`alias`);--> statement-breakpoint
ALTER TABLE `connections` DROP INDEX `provider_name_index`;--> statement-breakpoint
ALTER TABLE `connections` DROP INDEX `provider_id_index`;