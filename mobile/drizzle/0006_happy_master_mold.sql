PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`normalized_name` text NOT NULL,
	`owner_name` text,
	`phone` text,
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
INSERT INTO `__new_stores`("id", "name", "normalized_name", "owner_name", "phone", "latitude", "longitude", "notes", "debt", "asset_value", "last_visit_at", "category", "is_archived", "created_at") SELECT "id", "name", "normalized_name", "owner_name", "phone", "latitude", "longitude", "notes", "debt", "asset_value", "last_visit_at", "category", "is_archived", "created_at" FROM `stores`;--> statement-breakpoint
DROP TABLE `stores`;--> statement-breakpoint
ALTER TABLE `__new_stores` RENAME TO `stores`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `stores_normalized_name_unique` ON `stores` (`normalized_name`);--> statement-breakpoint
CREATE INDEX `store_name_idx` ON `stores` (`normalized_name`);--> statement-breakpoint
CREATE INDEX `store_category_idx` ON `stores` (`category`);--> statement-breakpoint
CREATE INDEX `store_archived_idx` ON `stores` (`is_archived`);