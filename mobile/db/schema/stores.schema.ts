import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const stores = sqliteTable('stores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  normalizedName: text('normalized_name').notNull().unique(),
  ownerName: text('owner_name').notNull(),
  phone: text('phone'),
  address: text('address').notNull(),
  
  // Koordinat lokasi
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  
  notes: text('notes'),
  
  // Nilai uang disimpan sebagai integer
  debt: integer('debt').notNull().default(0),
  assetValue: integer('asset_value').notNull().default(0),
  
  lastVisitAt: text('last_visit_at'),
  
  category: text('category', { enum: ["1", "2", "3", "4", "5"] }).notNull(),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  nameIdx: index('store_name_idx').on(table.normalizedName),
  categoryIdx: index('store_category_idx').on(table.category),
  archivedIdx: index('store_archived_idx').on(table.isArchived)
}));

export type Store = typeof stores.$inferSelect;
export type InsertStore = typeof stores.$inferInsert;
