import Dexie, { type EntityTable } from 'dexie';
import type { User, Product } from '@/types';

// Tabel khusus yang menyimpan data user dan password-nya
export type DbUser = User & { password: string };
export type DbProduct = Product;

const db = new Dexie('JuraganTitipDB') as Dexie & {
  users: EntityTable<DbUser, 'id'>;
  products: EntityTable<DbProduct, 'id'>;
};

// Skema versi pertama
db.version(1).stores({
  users: 'id, email' // id = primary key, email = index biasa
});

// Skema versi 4: Menambahkan tabel products dengan index pencarian
db.version(4).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category'
});

export { db };
