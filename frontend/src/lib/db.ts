import Dexie, { type EntityTable } from 'dexie';
import type { User, Product, Store, Visit } from '@/types';


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


db.version(1).stores({
  users: 'id, email' 
});


db.version(7).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category',
  stores: '++id, &normalizedName',
  visits: '++id, storeId'
});

export { db };
