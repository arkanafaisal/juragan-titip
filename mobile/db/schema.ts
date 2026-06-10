import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const products = sqliteTable('products', {
  // ID otomatis digenerate oleh SQLite
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  name: text('name').notNull(),
  
  // normalizedName digunakan untuk fitur pencarian (huruf kecil semua)
  normalizedName: text('normalized_name').notNull().unique(),
  
  // Kategori disimpan sebagai text enum
  category: text('category', { enum: ["1", "2", "3", "4", "5"] }).notNull(),
  
  // Harga dan Stok menggunakan integer (SQLite tidak memiliki tipe boolean atau float spesifik yang aman untuk uang)
  costPrice: integer('cost_price').notNull(),
  wholesalePrice: integer('wholesale_price').notNull(),
  retailPrice: integer('retail_price'),
  
  // Default nilai stok saat produk baru dibuat adalah 0
  warehouseStock: integer('warehouse_stock').notNull().default(0),
  returnedStock: integer('returned_stock').notNull().default(0),
  
  description: text('description'),
  
  // Boolean di SQLite disimpan sebagai integer (0 = false, 1 = true). Mode boolean akan mengonversinya otomatis.
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  
  // Timestamp otomatis saat baris dibuat
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Ekstraksi tipe untuk digunakan oleh TanStack Query / Service layer
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;