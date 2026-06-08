import type { Visit, ApiResponse, InventoryLog } from "@/types"
import { db, type DbVisit } from "@/lib/db"
import { toast } from "sonner"

export interface CreateVisitPayload extends Omit<Visit, "id" | "createdAt"> {
  restockItems: { productId: number; productName?: string; quantity: number }[];
}

export const visitApi = {
  getAll: async (): Promise<ApiResponse<Visit[] >> => {
    try {
      const visits = await db.visits.toArray();
      return { success: true, data: visits }
    } catch (error) {
      console.error("Dexie Get All Visits Error:", error);
      toast.error("Gagal memuat kunjungan")
      return { success: false, message: "Gagal memuat kunjungan" }
    }
  },

  getByStore: async (storeId: number | string, limitCount?: number): Promise<ApiResponse<Visit[] >> => {
    const numericId = Number(storeId);
    try {
      let collection = db.visits.where('storeId').equals(numericId).reverse();
      if (limitCount) {
        collection = collection.limit(limitCount);
      }
      const visits = await collection.toArray();
      return { success: true, data: visits }
    } catch (error) {
      console.error("Dexie Get Visits by Store Error:", error);
      toast.error("Gagal memuat kunjungan toko")
      return { success: false, message: "Gagal memuat kunjungan toko" }
    }
  },

  getById: async (id: number | string): Promise<ApiResponse<Visit >> => {
    const numericId = Number(id);
    try {
      const visit = await db.visits.get(numericId);
      if (!visit) {
        toast.error("Kunjungan tidak ditemukan")
        return { success: false, message: "Kunjungan tidak ditemukan" }
      }
      return { success: true, data: visit }
    } catch (error) {
      console.error("Dexie Get Visit By Id Error:", error);
      toast.error("Gagal memuat kunjungan")
      return { success: false, message: "Gagal memuat kunjungan" }
    }
  },

  create: async (data: CreateVisitPayload): Promise<ApiResponse<Visit >> => {
    try {
      let createdVisit: Visit | null = null;

      await db.transaction('rw', db.visits, db.products, db.stores, db.inventoryLogs, async () => {
        const assetValue = data.items.reduce((acc, item) => acc + (item.remained * item.wholesalePrice), 0);
        
        const newVisit: Omit<DbVisit, 'id'> = {
          storeId: Number(data.storeId),
          storeName: data.storeName,
          items: data.items,
          amountPaid: data.amountPaid,
          currentDebt: data.currentDebt,
          createdAt: new Date().toISOString()
        };

        const id = await db.visits.add(newVisit as DbVisit);
        createdVisit = { ...newVisit, id } as Visit;

        for (const item of data.items) {
          if (item.returned > 0) {
            const product = await db.products.get(item.productId);
            if (!product) {
              throw new Error(`Produk "${item.productName || item.productId}" tidak ditemukan. Mungkin sudah dihapus.`);
            }

            await db.inventoryLogs.add({
              productId: item.productId,
              type: 'TARIK_RETUR',
              quantity: item.returned,
              storeId: newVisit.storeId,
              storeName: newVisit.storeName,
              createdAt: newVisit.createdAt
            } as Omit<InventoryLog, 'id'>);

            await db.products.update(item.productId, {
              returnedStock: (product.returnedStock || 0) + item.returned
            });
          }
        }

        for (const item of data.restockItems) {
          if (item.quantity > 0) {
            const product = await db.products.get(item.productId);
            if (!product) {
              throw new Error(`Produk "${item.productName || item.productId}" tidak ditemukan. Mungkin sudah dihapus.`);
            }

            await db.products.update(item.productId, { 
              warehouseStock: Math.max(0, product.warehouseStock - item.quantity) 
            });
            
            await db.inventoryLogs.add({
              productId: item.productId,
              type: 'TITIPAN',
              quantity: item.quantity,
              storeId: newVisit.storeId,
              storeName: newVisit.storeName,
              createdAt: newVisit.createdAt
            } as Omit<InventoryLog, 'id'>);
          }
        }

        await db.stores.update(Number(data.storeId), {
          debt: data.currentDebt,
          assetValue: assetValue,
          lastVisitAt: newVisit.createdAt
        });
      });

      if (!createdVisit) { throw new Error("createdVisit was not created") }
      toast.success("Kunjungan berhasil disimpan");
      return { success: true, data: createdVisit };
    } catch (error: any) {
      console.error("Dexie Create Visit Transaction Error:", error);
      const message = error.message || "Gagal menyimpan kunjungan";
      toast.error(message);
      return { success: false, message };
    }
  },
}