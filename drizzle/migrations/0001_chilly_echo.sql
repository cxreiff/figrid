ALTER TABLE `event_instances` RENAME COLUMN `parent_tile_id` TO `tile_id`;--> statement-breakpoint
ALTER TABLE `event_instances` RENAME COLUMN `parent_character_id` TO `character_id`;--> statement-breakpoint
ALTER TABLE `event_instances` RENAME COLUMN `parent_gate_id` TO `gate_id`;--> statement-breakpoint
ALTER TABLE `gates` ADD `active` boolean DEFAULT true NOT NULL;