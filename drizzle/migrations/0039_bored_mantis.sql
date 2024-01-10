ALTER TABLE `characters` ADD CONSTRAINT `tiles_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `events` ADD CONSTRAINT `tiles_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `grids` ADD CONSTRAINT `tiles_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `items` ADD CONSTRAINT `tiles_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `locks` ADD CONSTRAINT `tiles_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `requirements` ADD CONSTRAINT `tiles_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `tiles` ADD CONSTRAINT `tiles_name_unique` UNIQUE(`name`);