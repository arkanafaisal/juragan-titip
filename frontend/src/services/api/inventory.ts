import type { InventoryLog, ApiResponse } from "@/types"
import { db } from "@/lib/db"
import { toast } from "sonner"

export type CreateInventoryLogPayload = Omit<InventoryLog, "id" | "createdAt">;

export const inventoryApi = {
  create: async (data: CreateInventoryLogPayload): Promise<ApiResponse<InventoryLog >> => {
    try {
      const newLog: Omit<InventoryLog, 'id'> = {
        ...data,
        createdAt: new Date().toISOString()
      };

      const id = await db.inventoryLogs.add(newLog as InventoryLog);
      return { success: true, data: { ...newLog, id } as InventoryLog };
    } catch (error) {
      console.error("Dexie Create Inventory Log Error:", error);
      toast.error("Gagal menyimpan log inventory");
      return { success: false, message: "Gagal menyimpan log inventory" };
    }
  }
}
