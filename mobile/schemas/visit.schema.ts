import { z } from 'zod';

export const visitOpnameSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  initialStock: z.number().min(0),
  sold: z.number().min(0, "Barang laku tidak boleh minus"),
  returned: z.number().min(0, "Barang ditarik tidak boleh minus"),
  remained: z.number().min(0, "Barang sisa tidak boleh minus"),
  wholesalePrice: z.number(),
}).refine(data => data.sold + data.returned + data.remained === data.initialStock, {
  message: "Total (Laku + Tarik + Sisa) harus persis sama dengan Stok Awal",
  path: ["sold"] 
});

export const visitRestockSchema = z.object({
  productId: z.number(),
  productName: z.string(),
  quantity: z.number().min(1, "Jumlah restock minimal 1"),
  wholesalePrice: z.number(),
  costPrice: z.number(),
  _warehouseStock: z.number()
}).refine(data => data.quantity <= data._warehouseStock, {
  message: "Jumlah restock tidak boleh melebihi sisa stok di gudang utama",
  path: ["quantity"]
});

export const visitCheckoutSchema = z.object({
  amountPaid: z.number().min(0, "Pembayaran tidak boleh minus"),
  subtotalLaku: z.number().min(0),
  oldDebt: z.number().min(0),
});

export const visitFormSchema = z.object({
  storeId: z.number(),
  storeName: z.string(),
  opnameItems: z.array(visitOpnameSchema),
  restockItems: z.array(visitRestockSchema),
  checkout: visitCheckoutSchema,
  notes: z.string().optional().or(z.literal('')),
});

export type VisitOpnameItem = z.infer<typeof visitOpnameSchema>;
export type VisitRestockItem = z.infer<typeof visitRestockSchema>;
export type VisitCheckout = z.infer<typeof visitCheckoutSchema>;
export type VisitFormValues = z.infer<typeof visitFormSchema>;
