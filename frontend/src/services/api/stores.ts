// frontend/src/services/api/stores.ts

import type { Store, StoreFormData, ApiResponse, Visit } from "@/types"
import { storageGetOrSeed } from "@/lib/storage"
import { STORAGE_KEYS } from "@/lib/constants"
import { db, type DbStore } from "@/lib/db"

export interface StoreQueryParams {
  search?: string;
  status?: string;
  page?: number;
}

export const storeApi = {
  getAll: async (params?: StoreQueryParams): Promise<ApiResponse<Store[]>> => {
    let collection = db.stores.toCollection();
    
    if (params) {
      if (params.search) {
        const query = params.search.toLowerCase();
        collection = collection.filter(s => 
          s.name.toLowerCase().includes(query) || 
          s.ownerName.toLowerCase().includes(query)
        );
      }
      
      if (params.status) {
        if (params.status === 'lunas') {
          collection = collection.filter(s => s.totalReceivable === 0);
        } else if (params.status === 'piutang') {
          collection = collection.filter(s => s.totalReceivable > 0);
        }
      }
    }

    // Proses Pagination (Limit 6, ambil 7 item untuk cek halaman selanjutnya)
    const page = params?.page || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const stores = await collection.offset(offset).limit(limit + 1).toArray();

    return { success: true, data: stores }
  },

  getById: async (id: number | string): Promise<ApiResponse<{
    store: Store;
    activeItems: { productName: string; remained: number }[];
    visitHistory: Visit[];
  } | null>> => {
    const numericId = Number(id);
    const store = await db.stores.get(numericId);
    if (!store) return { success: false, data: null, message: "Toko tidak ditemukan" }

    const storeIdStr = String(id);
    const allVisits = storageGetOrSeed<Visit[]>(STORAGE_KEYS.VISITS, []);
    const storeVisits = allVisits.filter(v => v.storeId === storeIdStr || v.storeId === numericId as any);

    let activeItems: { productName: string; remained: number }[] = [];
    
    if (storeVisits.length > 0) {
      const lastVisit = storeVisits[storeVisits.length - 1]; // Ambil data terakhir (paling baru)
      activeItems = lastVisit.items.map(item => ({
        productName: item.productName,
        remained: item.remained
      }));
    }

    return { 
      success: true, 
      data: {
        store,
        activeItems,
        visitHistory: storeVisits
      } 
    };
  },

  create: async (data: StoreFormData): Promise<ApiResponse<Store | null>> => {
    const newStore: Omit<DbStore, 'id'> = {
      ...data,
      totalReceivable: 0,
    }

    try {
      const id = await db.stores.add(newStore as DbStore);
      return { success: true, data: { ...newStore, id } as Store }
    } catch (error: any) {
      console.error("Dexie Create Store Error:", error);
      return { success: false, data: null, message: "Gagal menyimpan toko" }
    }
  },

  update: async (id: number | string, data: Partial<StoreFormData>): Promise<ApiResponse<Store | null>> => {
    const numericId = Number(id);
    const store = await db.stores.get(numericId);
    
    if (!store) return { success: false, data: null, message: "Toko tidak ditemukan" }
    
    try {
      await db.stores.update(numericId, data);
      const updatedStore = await db.stores.get(numericId);
      return { success: true, data: updatedStore! }
    } catch (error: any) {
      console.error("Dexie Update Store Error:", error);
      return { success: false, data: null, message: "Gagal memperbarui toko" }
    }
  },

  delete: async (id: number | string, storeNameConfirm: string): Promise<ApiResponse<null>> => {
    const numericId = Number(id);
    const store = await db.stores.get(numericId);

    if (!store) {
      return { 
        success: false, 
        data: null, 
        message: "Nama toko tidak ditemukan di sistem" 
      };
    }

    if (store.name.toLowerCase() !== storeNameConfirm.toLowerCase()) {
      return { 
        success: false, 
        data: null, 
        message: "Konfirmasi nama salah untuk ID toko ini" 
      };
    }

    await db.stores.delete(numericId);
    return { success: true, data: null };
  },

}