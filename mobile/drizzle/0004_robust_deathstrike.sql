CREATE TABLE `visit_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`visit_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`initial_stock` integer DEFAULT 0 NOT NULL,
	`sold` integer DEFAULT 0 NOT NULL,
	`returned` integer DEFAULT 0 NOT NULL,
	`restocked` integer DEFAULT 0 NOT NULL,
	`price` integer NOT NULL,
	FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` integer NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`amount_paid` integer DEFAULT 0 NOT NULL,
	`debt` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE restrict
);
