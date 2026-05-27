// frontend/src/services/api/stores.ts

import type { Store, StoreFormData, ApiResponse } from "@/types"
import { storageGetOrSeed, storageSet, storageGet } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { seedStores } from "@/seed-data/stores"
import { generateId } from "@/lib/utils"

export interface StoreQueryParams {
  search?: string;
  status?: string;
}

export const storeApi = {
  getAll: async (params?: StoreQueryParams): Promise<ApiResponse<Store[]>> => {
    // Simulasi delay jaringan
    await new Promise((resolve) => setTimeout(resolve, 300));

    let stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, [])
    
    if (params) {
      if (params.search) {
        const query = params.search.toLowerCase();
        stores = stores.filter(s => 
          s.name.toLowerCase().includes(query) || 
          s.ownerName.toLowerCase().includes(query)
        );
      }
      
      if (params.status) {
        if (params.status === 'lunas') {
          stores = stores.filter(s => s.totalReceivable === 0);
        } else if (params.status === 'piutang') {
          stores = stores.filter(s => s.totalReceivable > 0);
        }
      }
    }

    return { success: true, data: stores }
  },

  getById: async (id: string): Promise<ApiResponse<Store>> => {
    const stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, [])
    const store = stores.find((s) => s.id === id)
    if (!store) return { success: false, data: null as unknown as Store, message: "Toko tidak ditemukan" }
    return { success: true, data: store }
  },

  create: async (data: StoreFormData): Promise<ApiResponse<Store>> => {
    const stores = storageGet<Store[]>(STORAGE_KEYS.STORES) || []
    const newStore: Store = {
      id: generateId("store"),
      ...data,
      activeItemCount: 0,
      totalReceivable: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    storageSet(STORAGE_KEYS.STORES, [...stores, newStore])
    return { success: true, data: newStore }
  },

  update: async (id: string, data: Partial<StoreFormData>): Promise<ApiResponse<Store>> => {
    const stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, [])
    const index = stores.findIndex((s) => s.id === id)
    if (index === -1) return { success: false, data: null as unknown as Store, message: "Toko tidak ditemukan" }
    stores[index] = { ...stores[index], ...data, updatedAt: new Date().toISOString() }
    storageSet(STORAGE_KEYS.STORES, stores)
    return { success: true, data: stores[index] }
  },

  delete: async (id: string, storeNameConfirm: string): Promise<ApiResponse<null>> => {
    // Simulasi delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const stores = storageGetOrSeed<Store[]>(STORAGE_KEYS.STORES, [])

    // 1. Cek dulu apakah nama toko yang diinput ada atau tidak di database
    const isNameExists = stores.some((s) => s.name.toLowerCase() === storeNameConfirm.toLowerCase());
    
    if (!isNameExists) {
      return { 
        success: false, 
        data: null as unknown as null, 
        message: "Nama toko tidak ditemukan di sistem" 
      };
    }

    // 2. Jika ada, cek double field (id dan name harus sinkron)
    const storeIndex = stores.findIndex(
      (s) => s.id === id && s.name.toLowerCase() === storeNameConfirm.toLowerCase()
    );

    if (storeIndex === -1) {
      return { 
        success: false, 
        data: null as unknown as null, 
        message: "Konfirmasi nama salah untuk ID toko ini" 
      };
    }

    // 3. Proses hapus
    stores.splice(storeIndex, 1);
    storageSet(STORAGE_KEYS.STORES, stores);
    
    return { success: true, data: null as unknown as null };
  },
}