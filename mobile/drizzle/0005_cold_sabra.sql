CREATE INDEX `inventory_log_product_idx` ON `inventory_logs` (`product_id`);--> statement-breakpoint
CREATE INDEX `store_name_idx` ON `stores` (`normalized_name`);--> statement-breakpoint
CREATE INDEX `store_category_idx` ON `stores` (`category`);--> statement-breakpoint
CREATE INDEX `store_archived_idx` ON `stores` (`is_archived`);--> statement-breakpoint
CREATE INDEX `visit_item_visit_idx` ON `visit_items` (`visit_id`);--> statement-breakpoint
CREATE INDEX `visit_item_product_idx` ON `visit_items` (`product_id`);--> statement-breakpoint
CREATE INDEX `visit_store_idx` ON `visits` (`store_id`);