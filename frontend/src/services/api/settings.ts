import { storageGet, storageSet } from "@/lib/storage";

const LOW_STOCK_THRESHOLD_KEY = "juragan_titip_low_stock_threshold";

export const settingsApi = {
  getLowStockThreshold: (): number => {
    const val = storageGet<number>(LOW_STOCK_THRESHOLD_KEY);
    return val !== null ? val : 10;
  },
  
  updateLowStockThreshold: (threshold: number): void => {
    storageSet(LOW_STOCK_THRESHOLD_KEY, threshold);
  }
};
