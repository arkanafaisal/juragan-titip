import { storageGet, storageSet } from "@/lib/storage";

const LOW_STOCK_THRESHOLD_KEY = "juragan_titip_low_stock_threshold";
const CATEGORY_LABELS_KEY = "juragan_titip_category_labels";

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
  }
};
