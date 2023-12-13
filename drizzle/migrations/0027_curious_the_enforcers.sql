ALTER TABLE `requirements` ADD `name` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `requirements` ADD `summary` text;--> statement-breakpoint
ALTER TABLE `requirements` ADD `description` text;--> statement-breakpoint
ALTER TABLE `requirements` ADD `image_url` varchar(2083);