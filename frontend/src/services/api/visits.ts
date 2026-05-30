import type { Visit, ApiResponse } from "@/types"
import { db, type DbVisit } from "@/lib/db"
import { toast } from "sonner"

export interface CreateVisitPayload extends Omit<Visit, "id" | "createdAt"> {
  restockItems: { productId: number; quantity: number }[];
  storeActiveItemCount: number;
}

export const visitApi = {
  getAll: async (): Promise<ApiResponse<Visit[] | null>> => {
    try {
      const visits = await db.visits.toArray();
      return { success: true, data: visits }
    } catch (error) {
      console.error("Dexie Get All Visits Error:", error);
      toast.error("Gagal memuat kunjungan")
      return { success: false, data: null, message: "Gagal memuat kunjungan" }
    }
  },

  getByStore: async (storeId: number | string): Promise<ApiResponse<Visit[] | null>> => {
    const numericId = Number(storeId);
    try {
      const visits = await db.visits.where('storeId').equals(numericId).toArray();
      return { success: true, data: visits }
    } catch (error) {
      console.error("Dexie Get Visits by Store Error:", error);
      toast.error("Gagal memuat kunjungan toko")
      return { success: false, data: null, message: "Gagal memuat kunjungan toko" }
    }
  },

  getById: async (id: number | string): Promise<ApiResponse<Visit | null>> => {
    const numericId = Number(id);
    try {
      const visit = await db.visits.get(numericId);
      if (!visit) {
        toast.error("Kunjungan tidak ditemukan")
        return { success: false, data: null, message: "Kunjungan tidak ditemukan" }
      }
      return { success: true, data: visit }
    } catch (error) {
      console.error("Dexie Get Visit By Id Error:", error);
      toast.error("Gagal memuat kunjungan")
      return { success: false, data: null, message: "Gagal memuat kunjungan" }
    }
  },

  create: async (data: CreateVisitPayload): Promise<ApiResponse<Visit | null>> => {
    try {
      let createdVisit: Visit | null = null;

      await db.transaction('rw', db.visits, db.products, db.stores, async () => {
        const assetValue = data.items.reduce((acc, item) => acc + (item.remained * item.wholesalePrice), 0);
        
        const newVisit: Omit<DbVisit, 'id'> = {
          storeId: Number(data.storeId),
          storeName: data.storeName,
          items: data.items,
          amountPaid: data.amountPaid,
          currentDebt: data.currentDebt,
          documentNumber: data.documentNumber,
          createdAt: new Date().toISOString()
        };

        const id = await db.visits.add(newVisit as DbVisit);
        createdVisit = { ...newVisit, id } as Visit;

        for (const item of data.restockItems) {
          if (item.quantity > 0) {
            const product = await db.products.get(item.productId);
            if (product) {
              await db.products.update(item.productId, { 
                warehouseStock: Math.max(0, product.warehouseStock - item.quantity) 
              });
            }
          }
        }

        await db.stores.update(Number(data.storeId), {
          activeItemCount: data.storeActiveItemCount,
          debt: data.currentDebt,
          assetValue: assetValue
        });
      });

      toast.success("Kunjungan berhasil disimpan");
      return { success: true, data: createdVisit };
    } catch (error) {
      console.error("Dexie Create Visit Transaction Error:", error);
      toast.error("Gagal menyimpan kunjungan");
      return { success: false, data: null, message: "Gagal menyimpan kunjungan" };
    }
  },
}