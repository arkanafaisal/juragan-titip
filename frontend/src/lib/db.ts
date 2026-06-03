import Dexie, { type EntityTable } from 'dexie';
import type { User, Product, Store, Visit, InventoryLog } from '@/types';


export type DbUser = User & { password: string };
export type DbProduct = Product;
export type DbStore = Store;
export type DbVisit = Visit;

const db = new Dexie('JuraganTitipDB') as Dexie & {
  users: EntityTable<DbUser, 'id'>;
  products: EntityTable<DbProduct, 'id'>;
  stores: EntityTable<DbStore, 'id'>;
  visits: EntityTable<DbVisit, 'id'>;
  inventoryLogs: EntityTable<InventoryLog, 'id'>;
};


db.version(1).stores({
  users: 'id, email' 
});


db.version(8).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category',
  stores: '++id, normalizedName, phone',
  visits: '++id, storeId'
});

db.version(9).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category',
  stores: '++id, normalizedName, phone',
  visits: '++id, storeId, createdAt'
});

db.version(10).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category',
  stores: '++id, normalizedName, phone, lastVisitAt',
  visits: '++id, storeId, createdAt'
});

db.version(11).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category',
  stores: '++id, normalizedName, phone, lastVisitAt, category',
  visits: '++id, storeId, createdAt'
});

db.version(12).stores({
  users: '++id, &email',
  products: '++id, &normalizedName, category',
  stores: '++id, normalizedName, phone, lastVisitAt, category',
  visits: '++id, storeId, createdAt',
  inventoryLogs: '++id, productId, type, storeId, createdAt'
});

export { db };
