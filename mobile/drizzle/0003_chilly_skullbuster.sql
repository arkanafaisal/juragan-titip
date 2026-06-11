CREATE TABLE `stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`normalized_name` text NOT NULL,
	`owner_name` text NOT NULL,
	`phone` text,
	`address` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`notes` text,
	`debt` integer DEFAULT 0 NOT NULL,
	`asset_value` integer DEFAULT 0 NOT NULL,
	`last_visit_at` text,
	`category` text NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stores_normalized_name_unique` ON `stores` (`normalized_name`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_inventory_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`type` text NOT NULL,
	`quantity` integer NOT NULL,
	`store_name` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_inventory_logs`("id", "product_id", "type", "quantity", "store_name", "created_at") SELECT "id", "product_id", "type", "quantity", "store_name", "created_at" FROM `inventory_logs`;--> statement-breakpoint
DROP TABLE `inventory_logs`;--> statement-breakpoint
ALTER TABLE `__new_inventory_logs` RENAME TO `inventory_logs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_products` (
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
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "name", "normalized_name", "category", "cost_price", "wholesale_price", "retail_price", "warehouse_stock", "returned_stock", "description", "is_archived", "created_at") SELECT "id", "name", "normalized_name", "category", "cost_price", "wholesale_price", "retail_price", "warehouse_stock", "returned_stock", "description", "is_archived", "created_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE UNIQUE INDEX `products_normalized_name_unique` ON `products` (`normalized_name`);