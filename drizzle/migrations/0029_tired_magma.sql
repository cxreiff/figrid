ALTER TABLE `events` RENAME COLUMN `required_item_id` TO `must_have_item_id`;--> statement-breakpoint
ALTER TABLE `events` ADD `parent_character_id` int;--> statement-breakpoint
ALTER TABLE `events` ADD `must_be_unlocked_id` int;--> statement-breakpoint
ALTER TABLE `events` ADD `must_be_locked_id` int;--> statement-breakpoint
ALTER TABLE `locks` ADD `unlocked_by_id` int;--> statement-breakpoint
ALTER TABLE `locks` ADD `locked_by_id` int;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `unlock_lock_id`;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `lock_lock_id`;