CREATE TABLE `assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`resource_type` text NOT NULL,
	`asset_type` text DEFAULT 'images' NOT NULL,
	`filename` text(256) NOT NULL,
	`label` text(256)
);
--> statement-breakpoint
CREATE TABLE `connections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`provider_name` text(256) NOT NULL,
	`provider_id` text(256) NOT NULL,
	`user_id` integer
);
--> statement-breakpoint
CREATE TABLE `passwords` (
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`hash` text NOT NULL,
	`user_id` integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`image_url` text(2083),
	`user_id` integer
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`expiration_date` integer NOT NULL,
	`user_id` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`email` text(256) NOT NULL,
	`alias` text(256) NOT NULL,
	`name` text(256),
	`type` text DEFAULT 'standard' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `character_instances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`tile_id` integer NOT NULL,
	`character_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`name` text(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_asset_id` integer
);
--> statement-breakpoint
CREATE TABLE `event_instances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`event_id` integer NOT NULL,
	`tile_id` integer,
	`character_id` integer,
	`gate_id` integer
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`name` text(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_asset_id` integer,
	`parent_id` integer,
	`trigger` text(256) DEFAULT 'trigger' NOT NULL,
	`triggers_unlock_id` integer,
	`triggers_lock_id` integer
);
--> statement-breakpoint
CREATE TABLE `gates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`name` text(256) NOT NULL,
	`summary` text,
	`description` text,
	`type` text NOT NULL,
	`from_tile_id` integer NOT NULL,
	`to_tile_id` integer NOT NULL,
	`active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `grids` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`name` text(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_asset_id` integer,
	`user_id` integer NOT NULL,
	`player_id` integer NOT NULL,
	`first_tile_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `item_instances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`item_id` integer NOT NULL,
	`tile_id` integer,
	`event_id` integer
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`name` text(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_asset_id` integer,
	`type` text DEFAULT 'basic' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lock_instances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`lock_id` integer NOT NULL,
	`event_id` integer,
	`gate_id` integer,
	`inverse` integer DEFAULT false NOT NULL,
	`hidden` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `locks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`name` text(256) NOT NULL,
	`summary` text,
	`description` text,
	`required_item_id` integer,
	`consumes` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` integer DEFAULT (current_timestamp) NOT NULL,
	`user_id` integer NOT NULL,
	`grid_id` integer NOT NULL,
	`name` text(256) NOT NULL,
	`summary` text,
	`description` text,
	`image_asset_id` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `connections_provider_name_unique` ON `connections` (`provider_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `connections_provider_id_unique` ON `connections` (`provider_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `provider` ON `connections` (`provider_id`,`provider_name`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_alias_unique` ON `users` (`alias`);--> statement-breakpoint
CREATE UNIQUE INDEX `email` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `alias` ON `users` (`alias`);--> statement-breakpoint
CREATE UNIQUE INDEX `characters_grid_id_name_unique` ON `characters` (`grid_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `events_grid_id_name_unique` ON `events` (`grid_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `grids_name_unique` ON `grids` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `items_grid_id_name_unique` ON `items` (`grid_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `locks_grid_id_name_unique` ON `locks` (`grid_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tiles_grid_id_name_unique` ON `tiles` (`grid_id`,`name`);