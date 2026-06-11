import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sql } from 'drizzle-orm';
import { db } from '../db';
import { products, inventoryLogs } from '../db/schema';

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

// ==========================================
// 4. MANAJEMEN DATABASE LOKAL (EXPORT / IMPORT / RESET)
// ==========================================

export const useCheckDatabaseHasData = () => {
  return useQuery({
    queryKey: ['checkDatabaseHasData'],
    queryFn: async () => {
      const pCount = await db.select({ count: sql<number>`count(*)` }).from(products);
      const lCount = await db.select({ count: sql<number>`count(*)` }).from(inventoryLogs);
      return (pCount[0].count + lCount[0].count) > 0;
    }
  });
};

export const useExportDatabase = () => {
  return useMutation({
    mutationFn: async () => {
      const allProducts = await db.select().from(products);
      const allLogs = await db.select().from(inventoryLogs);

      const exportData = {
        version: 1,
        exportDate: new Date().toISOString(),
        data: {
          products: allProducts,
          inventoryLogs: allLogs
        }
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      
      const fileUri = FileSystem.documentDirectory + 'juragantitip_backup.json';
      await FileSystem.writeAsStringAsync(fileUri, jsonString, { encoding: FileSystem.EncodingType.UTF8 });
      
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Simpan Backup Database JuraganTitip'
        });
      } else {
        throw new Error("Fitur berbagi tidak tersedia di perangkat ini");
      }
    }
  });
};

export const useImportDatabase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', '*/*'],
        copyToCacheDirectory: true
      });

      if (result.canceled) return false;

      const file = result.assets[0];
      const jsonString = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 });
      
      let parsed;
      try {
        parsed = JSON.parse(jsonString);
      } catch (e) {
        throw new Error("Format file JSON rusak dan tidak bisa dibaca.");
      }

      if (!parsed.version || !parsed.data) {
        throw new Error("File tidak valid. Pastikan file ini adalah hasil export dari JuraganTitip.");
      }

      await db.transaction(async (tx) => {
        // Hapus data lama
        await tx.delete(inventoryLogs);
        await tx.delete(products);
        
        // Insert ulang jika ada
        if (parsed.data.products && parsed.data.products.length > 0) {
          await tx.insert(products).values(parsed.data.products);
        }
        
        if (parsed.data.inventoryLogs && parsed.data.inventoryLogs.length > 0) {
          await tx.insert(inventoryLogs).values(parsed.data.inventoryLogs);
        }
      });
      
      return true;
    },
    onSuccess: (didImport) => {
      if (didImport) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['inventoryLogs'] });
        queryClient.invalidateQueries({ queryKey: ['checkDatabaseHasData'] });
      }
    }
  });
};

export const useResetDatabase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await db.transaction(async (tx) => {
        await tx.delete(inventoryLogs);
        await tx.delete(products);
      });
      
      // Opsional: hapus urutan auto increment agar kembali mulai dari 1
      try {
        await db.run(sql`DELETE FROM sqlite_sequence WHERE name IN ('products', 'inventory_logs')`);
      } catch (e) {
        // Abaikan jika tabel sqlite_sequence belum ada
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLogs'] });
      queryClient.invalidateQueries({ queryKey: ['checkDatabaseHasData'] });
    }
  });
};