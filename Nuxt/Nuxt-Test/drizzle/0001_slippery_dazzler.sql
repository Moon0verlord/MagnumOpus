CREATE TABLE `Ports` (
	`port_id` text PRIMARY KEY NOT NULL,
	`station_id` text,
	`user_by` text,
	`emi3_id` text,
	`status` text,
	FOREIGN KEY (`station_id`) REFERENCES `Stations`(`station_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_by`) REFERENCES `Users`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Stations` (
	`station_id` text PRIMARY KEY NOT NULL,
	`location_id` text,
	`status` text,
	`coordinates` text,
	`address` text,
	`max_power` real,
	`port_ids` text
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`password` text,
	`okta_id` text,
	`isAdmin` integer
);
--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `Users_email_unique` ON `Users` (`email`);