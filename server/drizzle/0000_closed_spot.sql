CREATE TABLE `core_genre` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `core_trackrequest` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_fee` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`is_paid` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`transaction_id` text DEFAULT '' NOT NULL,
	`payment_token` text NOT NULL,
	`payment_id` text DEFAULT '' NOT NULL,
	`track_id` integer NOT NULL,
	FOREIGN KEY (`track_id`) REFERENCES `core_track`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `core_trackrequest_payment_token_unique` ON `core_trackrequest` (`payment_token`);--> statement-breakpoint
CREATE TABLE `core_track` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`artist` text NOT NULL,
	`icon` text NOT NULL,
	`price` integer NOT NULL,
	`genre_id` integer NOT NULL,
	`venue_id` integer NOT NULL,
	FOREIGN KEY (`genre_id`) REFERENCES `core_genre`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`venue_id`) REFERENCES `core_venue`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `core_transaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`transaction_type` text NOT NULL,
	`created_at` text NOT NULL,
	`track_request_id` integer,
	`venue_id` integer NOT NULL,
	FOREIGN KEY (`track_request_id`) REFERENCES `core_trackrequest`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`venue_id`) REFERENCES `core_venue`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`password` text NOT NULL,
	`last_login` text,
	`is_superuser` integer DEFAULT false NOT NULL,
	`username` text NOT NULL,
	`last_name` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`is_staff` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`date_joined` text NOT NULL,
	`first_name` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_user_username_unique` ON `auth_user` (`username`);--> statement-breakpoint
CREATE TABLE `core_venue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`phone` text NOT NULL,
	`qr_code` text DEFAULT '' NOT NULL,
	`balance` integer DEFAULT 0 NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `core_venue_user_id_unique` ON `core_venue` (`user_id`);--> statement-breakpoint
CREATE TABLE `core_withdrawalrequest` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`yookassa_payout_id` text DEFAULT '' NOT NULL,
	`bank_card_token` text NOT NULL,
	`fee` integer DEFAULT 0 NOT NULL,
	`venue_id` integer NOT NULL,
	FOREIGN KEY (`venue_id`) REFERENCES `core_venue`(`id`) ON UPDATE no action ON DELETE cascade
);
