ALTER TABLE `requirements` MODIFY COLUMN `lock_id` int;--> statement-breakpoint
ALTER TABLE `requirements` ADD `item_id` int;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `must_have_item_id`;