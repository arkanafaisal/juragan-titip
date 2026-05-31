import { storageGet, storageSet } from "@/lib/storage";
import { db } from "@/lib/db";

const LOW_STOCK_THRESHOLD_KEY = "juragan_titip_low_stock_threshold";
const CATEGORY_LABELS_KEY = "juragan_titip_category_labels";
const STORE_CATEGORY_LABELS_KEY = "juragan_titip_store_category_labels";
const STORE_OVERDUE_DAYS_KEY = "juragan_titip_store_overdue_days";

export type CategoryLabels = {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
};

export const DEFAULT_CATEGORY_LABELS: CategoryLabels = {
  "1": "Minuman",
  "2": "Makanan Basah",
  "3": "Makanan Kering",
  "4": "Non-Makanan",
  "5": "Lainnya"
};

export const DEFAULT_STORE_CATEGORY_LABELS: CategoryLabels = {
  "1": "Kelontong",
  "2": "Warkop / Burjo",
  "3": "Grosir",
  "4": "Apotek",
  "5": "Lainnya"
};

export const settingsApi = {
  getLowStockThreshold: (): number => {
    const val = storageGet<number>(LOW_STOCK_THRESHOLD_KEY);
    return val !== null ? val : 10;
  },
  
  updateLowStockThreshold: (threshold: number): void => {
    storageSet(LOW_STOCK_THRESHOLD_KEY, threshold);
  },

  getCategoryLabels: (): CategoryLabels => {
    const val = storageGet<CategoryLabels>(CATEGORY_LABELS_KEY);
    return val !== null ? val : DEFAULT_CATEGORY_LABELS;
  },
  
  
  updateCategoryLabels: (labels: CategoryLabels): void => {
    storageSet(CATEGORY_LABELS_KEY, labels);
  },

  getStoreCategoryLabels: (): CategoryLabels => {
    const val = storageGet<CategoryLabels>(STORE_CATEGORY_LABELS_KEY);
    return val !== null ? val : DEFAULT_STORE_CATEGORY_LABELS;
  },
  
  updateStoreCategoryLabels: (labels: CategoryLabels): void => {
    storageSet(STORE_CATEGORY_LABELS_KEY, labels);
  },

  getStoreOverdueDays: (): number => {
    const val = storageGet<number>(STORE_OVERDUE_DAYS_KEY);
    return val !== null ? val : 30;
  },
  
  updateStoreOverdueDays: (days: number): void => {
    storageSet(STORE_OVERDUE_DAYS_KEY, days);
  },

  resetSettings: (): void => {
    localStorage.removeItem(LOW_STOCK_THRESHOLD_KEY);
    localStorage.removeItem(CATEGORY_LABELS_KEY);
    localStorage.removeItem(STORE_CATEGORY_LABELS_KEY);
    localStorage.removeItem(STORE_OVERDUE_DAYS_KEY);
  },

  clearAllData: async (): Promise<void> => {
    await db.transaction('rw', db.products, db.stores, db.visits, async () => {
      await db.products.clear();
      await db.stores.clear();
      await db.visits.clear();
    });
  }
};
