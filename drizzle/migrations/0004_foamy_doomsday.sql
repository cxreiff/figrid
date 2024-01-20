ALTER TABLE `lock_instances` RENAME COLUMN `visible` TO `hidden`;--> statement-breakpoint
ALTER TABLE `lock_instances` MODIFY COLUMN `hidden` boolean NOT NULL DEFAULT false;