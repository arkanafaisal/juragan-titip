import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { products } from './schema/products.schema';
import { inventoryLogs } from './schema/inventory-logs.schema';

const expoDb = openDatabaseSync('juragantitip.db');

export const db = drizzle(expoDb, { schema: { products, inventoryLogs } });