import Dexie, { type EntityTable } from 'dexie';
import type { User, Product, Store } from '@/types';

// Tabel khusus yang menyimpan data user dan password-nya
export type DbUser = User & { password: string };
export type DbProduct = Product;
export type DbStore = Store;

const db = new Dexie('JuraganTitipDB') as Dexie & {
  users: EntityTable<DbUser, 'id'>;
  products: EntityTable<DbProduct, 'id'>;
  stores: EntityTable<DbStore, 'id'>;
};

// Skema versi pertama
db.version(1).stores({
  users: 'id, email' // id = primary key, email = index biasa
});

// Skema versi 5: Menambahkan tabel stores dengan auto-increment id (tanpa unique name)
db.version(5).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category',
  stores: '++id'
});

export { db };
