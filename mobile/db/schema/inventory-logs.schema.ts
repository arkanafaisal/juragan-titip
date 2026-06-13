import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { products } from './products.schema';

export const INVENTORY_LOG_TYPES = [
  "KULAKAN", 
  "KOREKSI", 
  "TARIK_RETUR", 
  "OLAH_RETUR", 
  "BUANG_RUSAK", 
  "TITIPAN"
] as const;

export type InventoryLogType = typeof INVENTORY_LOG_TYPES[number];

export const inventoryLogs = sqliteTable('inventory_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),
  type: text('type', { enum: INVENTORY_LOG_TYPES }).notNull(),
  quantity: integer('quantity').notNull(),
  storeName: text('store_name'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  productIdx: index('inventory_log_product_idx').on(table.productId)
}));

export type InventoryLog = typeof inventoryLogs.$inferSelect;
export type InsertInventoryLog = typeof inventoryLogs.$inferInsert;
