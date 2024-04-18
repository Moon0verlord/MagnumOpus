CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name` text,
	`last_name` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP
);
