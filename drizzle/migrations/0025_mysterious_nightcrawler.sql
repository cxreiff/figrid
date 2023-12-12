ALTER TABLE `character_instances` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `item_instances` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `tiles` DROP COLUMN `north_id`;--> statement-breakpoint
ALTER TABLE `tiles` DROP COLUMN `east_id`;--> statement-breakpoint
ALTER TABLE `tiles` DROP COLUMN `south_id`;--> statement-breakpoint
ALTER TABLE `tiles` DROP COLUMN `west_id`;--> statement-breakpoint
ALTER TABLE `tiles` DROP COLUMN `up_id`;--> statement-breakpoint
ALTER TABLE `tiles` DROP COLUMN `down_id`;