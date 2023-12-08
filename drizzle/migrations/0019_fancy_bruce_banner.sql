ALTER TABLE `instances` MODIFY COLUMN `item_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `instances` DROP COLUMN `character_id`;