CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`image_url` varchar(2083),
	`user_id` int,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_id_unique` UNIQUE(`id`)
);
