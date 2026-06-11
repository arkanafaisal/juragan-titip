import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const INVENTORY_LOG_TYPES = [
  "KULAKAN", 
  "KOREKSI", 
  "TARIK_RETUR", 
  "OLAH_RETUR", 
  "BUANG_RUSAK", 
  "TITIPAN"
] as const;

export type InventoryLogType = typeof INVENTORY_LOG_TYPES[number];

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
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Ekstraksi tipe untuk digunakan oleh TanStack Query / Service layer
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export const inventoryLogs = sqliteTable('inventory_logs', {
  // ID otomatis digenerate oleh SQLite
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Relasi ke tabel products (restrict delete untuk menjaga integritas log)
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),
  
  // Tipe aktivitas log
  type: text('type', { enum: INVENTORY_LOG_TYPES }).notNull(),
  
  // Jumlah perubahan stok (bisa positif atau negatif)
  quantity: integer('quantity').notNull(),
  
  // Opsional: Untuk mencatat nama toko saat tipe aktivitas adalah TITIPAN atau TARIK_RETUR
  storeName: text('store_name'),
  
  // Timestamp otomatis saat log dibuat
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type InventoryLog = typeof inventoryLogs.$inferSelect;
export type InsertInventoryLog = typeof inventoryLogs.$inferInsert;
