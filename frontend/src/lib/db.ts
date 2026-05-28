import Dexie, { type EntityTable } from 'dexie';
import type { User, Product, Store, Visit } from '@/types';

// Tabel khusus yang menyimpan data user dan password-nya
export type DbUser = User & { password: string };
export type DbProduct = Product;
export type DbStore = Store;
export type DbVisit = Visit;

const db = new Dexie('JuraganTitipDB') as Dexie & {
  users: EntityTable<DbUser, 'id'>;
  products: EntityTable<DbProduct, 'id'>;
  stores: EntityTable<DbStore, 'id'>;
  visits: EntityTable<DbVisit, 'id'>;
};

// Skema versi pertama
db.version(1).stores({
  users: 'id, email' // id = primary key, email = index biasa
});

// Skema versi 6: Menambahkan tabel visits dengan index pencarian storeId
db.version(6).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category',
  stores: '++id',
  visits: '++id, storeId'
});

export { db };
