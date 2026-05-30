

import type { Store, StoreFormData, ApiResponse, Visit } from "@/types"
import { db, type DbStore } from "@/lib/db"
import { visitApi } from "@/services/api/visits"
import { toast } from "sonner"
import Dexie from "dexie"

export interface StoreQueryParams {
  search?: string;
  status?: string;
  page?: number;
}

export const storeApi = {
  getAll: async (params?: StoreQueryParams): Promise<ApiResponse<Store[]>> => {
    try {
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
            collection = collection.filter(s => s.debt === 0);
          } else if (params.status === 'piutang') {
            collection = collection.filter(s => s.debt > 0);
          }
        }
      }

      const page = params?.page || 1;
      const limit = 6;
      const offset = (page - 1) * limit;

      const stores = await collection.offset(offset).limit(limit + 1).toArray();

      return { success: true, data: stores }
    } catch (error) {
      toast.error("Gagal memuat data toko")
      return { success: false, data: [], message: "Gagal memuat data toko" }
    }
  },

  getById: async (id: number | string): Promise<ApiResponse<{
    store: Store;
    activeItems: { productName: string; remained: number }[];
    visitHistory: Visit[];
  } | null>> => {
    try {
      const numericId = Number(id);
      const store = await db.stores.get(numericId);
      if (!store) {
        toast.error("Toko tidak ditemukan")
        return { success: false, data: null, message: "Toko tidak ditemukan" }
      }

      const visitRes = await visitApi.getByStore(numericId);
      const storeVisits = visitRes.success && visitRes.data ? visitRes.data : [];

      let activeItems: { productName: string; remained: number }[] = [];
      
      if (storeVisits.length > 0) {
        const lastVisit = storeVisits[storeVisits.length - 1]; 
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
    } catch (error) {
      toast.error("Gagal memuat detail toko")
      return { success: false, data: null, message: "Gagal memuat detail toko" }
    }
  },

  create: async (data: StoreFormData): Promise<ApiResponse<Store | null>> => {
    const normalizedName = data.name.toLowerCase();
    const newStore: Omit<DbStore, 'id'> = {
      ...data,
      normalizedName,
      debt: 0,
    }

    try {
      const id = await db.stores.add(newStore as DbStore);
      toast.success("Toko berhasil ditambahkan")
      return { success: true, data: { ...newStore, id } as Store }
    } catch (error: any) {
      console.error("Dexie Create Store Error:", error);
      toast.error("Gagal menyimpan toko")
      return { success: false, data: null, message: "Gagal menyimpan toko" }
    }
  },

  update: async (id: number | string, data: Partial<StoreFormData>): Promise<ApiResponse<Store | null>> => {
    const numericId = Number(id);
    const store = await db.stores.get(numericId);
    
    if (!store) return { success: false, data: null, message: "Toko tidak ditemukan" }
    
    const updateData: Partial<DbStore> = { ...data };
    if (data.name) {
      updateData.normalizedName = data.name.toLowerCase();
    }

    try {
      await db.stores.update(numericId, updateData);
      const updatedStore = await db.stores.get(numericId);
      toast.success("Toko berhasil diperbarui")
      return { success: true, data: updatedStore! }
    } catch (error: any) {
      console.error("Dexie Update Store Error:", error);
      toast.error("Gagal memperbarui toko")
      return { success: false, data: null, message: "Gagal memperbarui toko" }
    }
  },

  checkDuplicateName: async (name: string, excludeId?: number): Promise<boolean> => {
    const normalizedName = name.toLowerCase();
    const existingStore = await db.stores.where('normalizedName').equals(normalizedName).first();
    if (existingStore) {
      if (excludeId !== undefined && existingStore.id === excludeId) return false;
      return true;
    }
    return false;
  },

  checkDuplicatePhone: async (phone: string, excludeId?: number): Promise<boolean> => {
    const existingStore = await db.stores.where('phone').equals(phone).first();
    if (existingStore) {
      if (excludeId !== undefined && existingStore.id === excludeId) return false;
      return true;
    }
    return false;
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