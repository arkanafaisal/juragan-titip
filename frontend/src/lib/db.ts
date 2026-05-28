import Dexie, { type EntityTable } from 'dexie';
import type { User } from '@/types';

// Tabel khusus yang menyimpan data user dan password-nya
export type DbUser = User & { password: string };

const db = new Dexie('JuraganTitipDB') as Dexie & {
  users: EntityTable<DbUser, 'id'>;
};

// Skema versi pertama
db.version(1).stores({
  users: 'id, email' // id = primary key, email = index biasa
});

// Skema versi 3: Menjadikan id Auto-Increment (++) dan email Unique (&)
db.version(3).stores({
  users: '++id, &email'
});

export { db };
