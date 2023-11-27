ALTER TABLE `passwords` MODIFY COLUMN `hash` text NOT NULL;--> statement-breakpoint
ALTER TABLE `passwords` MODIFY COLUMN `salt` text NOT NULL;