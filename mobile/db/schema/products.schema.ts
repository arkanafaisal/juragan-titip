import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  normalizedName: text('normalized_name').notNull().unique(),
  category: text('category', { enum: ["1", "2", "3", "4", "5"] }).notNull(),
  costPrice: integer('cost_price').notNull(),
  wholesalePrice: integer('wholesale_price').notNull(),
  retailPrice: integer('retail_price'),
  warehouseStock: integer('warehouse_stock').notNull().default(0),
  returnedStock: integer('returned_stock').notNull().default(0),
  description: text('description'),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
