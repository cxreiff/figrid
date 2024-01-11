ALTER TABLE `locks` RENAME COLUMN `unlocked_by_item_id` TO `required_item_id`;--> statement-breakpoint
ALTER TABLE `locks` DROP COLUMN `unlocked_by_event_id`;--> statement-breakpoint
ALTER TABLE `locks` DROP COLUMN `locked_by_event_id`;