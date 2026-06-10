import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// 1. TIPE & KONSTANTA (Sesuai dengan file lama Anda)
// ==========================================
export type CategoryLabels = {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
};

export const DEFAULT_CATEGORY_LABELS: CategoryLabels = {
  "1": "Makanan Kering",
  "2": "Makanan Basah",
  "3": "Minuman",
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

export const DEFAULT_LOW_STOCK_THRESHOLD = 10;
export const DEFAULT_STORE_OVERDUE_DAYS = 30;

// ==========================================
// 2. ANTARMUKA STATE ZUSTAND
// ==========================================
interface SettingsState {
  // --- Data (State) ---
  categoryLabels: CategoryLabels;
  storeCategoryLabels: CategoryLabels;
  lowStockThreshold: number;
  storeOverdueDays: number;

  // --- Fungsi Pengubah (Actions) ---
  setCategoryLabels: (labels: CategoryLabels) => void;
  setStoreCategoryLabels: (labels: CategoryLabels) => void;
  setLowStockThreshold: (threshold: number) => void;
  setStoreOverdueDays: (days: number) => void;
  
  // Fungsi tambahan untuk mereset semua pengaturan ke bawaan pabrik
  resetSettings: () => void;
}

// ==========================================
// 3. INISIALISASI ZUSTAND STORE + PERSIST
// ==========================================
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Nilai bawaan (Default Values)
      categoryLabels: DEFAULT_CATEGORY_LABELS,
      storeCategoryLabels: DEFAULT_STORE_CATEGORY_LABELS,
      lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
      storeOverdueDays: DEFAULT_STORE_OVERDUE_DAYS,

      // Logika untuk mengubah state
      setCategoryLabels: (labels) => set({ categoryLabels: labels }),
      setStoreCategoryLabels: (labels) => set({ storeCategoryLabels: labels }),
      setLowStockThreshold: (threshold) => set({ lowStockThreshold: threshold }),
      setStoreOverdueDays: (days) => set({ storeOverdueDays: days }),

      resetSettings: () => set({
        categoryLabels: DEFAULT_CATEGORY_LABELS,
        storeCategoryLabels: DEFAULT_STORE_CATEGORY_LABELS,
        lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
        storeOverdueDays: DEFAULT_STORE_OVERDUE_DAYS,
      }),
    }),
    {
      name: 'juragantitip-settings', // Kunci unik di AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Menggunakan AsyncStorage

      // Meniru fitur "Telemetry & Data Healing" dari file lama Anda
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('[Settings Store] Failed to parse data from AsyncStorage. Data corrupted.', error);
          // Zustand otomatis membuang data yang korup dan kembali menggunakan nilai default
        }
      },
    }
  )
);