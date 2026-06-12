import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { stores } from './stores.schema';
import { products } from './products.schema';

export const visits = sqliteTable('visits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  storeId: integer('store_id').notNull().references(() => stores.id, { onDelete: 'restrict' }),
  subtotal: integer('subtotal').notNull().default(0), // Total tagihan barang laku
  amountPaid: integer('amount_paid').notNull().default(0), // Kas dibayar
  debt: integer('debt').notNull().default(0), // Total piutang toko setelah kunjungan ini
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const visitItems = sqliteTable('visit_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  visitId: integer('visit_id').notNull().references(() => visits.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),
  initialStock: integer('initial_stock').notNull().default(0), // 0 jika ini murni restock (baru)
  sold: integer('sold').notNull().default(0),
  returned: integer('returned').notNull().default(0),
  restocked: integer('restocked').notNull().default(0),
  price: integer('price').notNull(), // Harga partai/wholesale saat dikunjungi
});

export const visitsRelations = relations(visits, ({ one, many }) => ({
  store: one(stores, {
    fields: [visits.storeId],
    references: [stores.id],
  }),
  items: many(visitItems),
}));

export const visitItemsRelations = relations(visitItems, ({ one }) => ({
  visit: one(visits, {
    fields: [visitItems.visitId],
    references: [visits.id],
  }),
  product: one(products, {
    fields: [visitItems.productId],
    references: [products.id],
  }),
}));

export type Visit = typeof visits.$inferSelect;
export type InsertVisit = typeof visits.$inferInsert;
export type VisitItem = typeof visitItems.$inferSelect;
export type InsertVisitItem = typeof visitItems.$inferInsert;
