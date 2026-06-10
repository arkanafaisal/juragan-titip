CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`normalized_name` text NOT NULL,
	`category` text NOT NULL,
	`cost_price` integer NOT NULL,
	`wholesale_price` integer NOT NULL,
	`retail_price` integer,
	`warehouse_stock` integer DEFAULT 0 NOT NULL,
	`returned_stock` integer DEFAULT 0 NOT NULL,
	`description` text,
	`is_archived` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
