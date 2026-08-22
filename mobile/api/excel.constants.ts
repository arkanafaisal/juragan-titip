import { getTableColumns } from 'drizzle-orm';

export const RAW_SHEETS = {
  PRODUCTS: '_Raw_Products',
  STORES: '_Raw_Stores',
  VISITS: '_Raw_Visits',
  VISIT_ITEMS: '_Raw_VisitItems',
  INVENTORY_LOGS: '_Raw_InventoryLogs',
} as const;

export const getTableColumnNames = (table: any): string[] => {
  return Object.keys(getTableColumns(table));
};
