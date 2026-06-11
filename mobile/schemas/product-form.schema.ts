import { z } from 'zod';

// Meniru batas nilai dari src/lib/product-validation.ts
export const PRODUCT_VALIDATION_RULES = {
  NAME_MIN: 3,
  NAME_MAX: 24,
  DESC_MAX: 200,
  PRICE_MAX: 100000,
};

export const productFormSchema = z.object({
  name: z.string()
    .min(PRODUCT_VALIDATION_RULES.NAME_MIN, `Nama produk minimal ${PRODUCT_VALIDATION_RULES.NAME_MIN} karakter`)
    .max(PRODUCT_VALIDATION_RULES.NAME_MAX, `Nama produk maksimal ${PRODUCT_VALIDATION_RULES.NAME_MAX} karakter`),
  
  // Menggunakan enum kategori "1" sampai "5" seperti di src/types/models.ts
  category: z.enum(["1", "2", "3", "4", "5"], {
    error: "Kategori produk wajib dipilih",
  }),
  
  costPrice: z.number()
    .positive("Harga modal tidak valid")
    .max(PRODUCT_VALIDATION_RULES.PRICE_MAX, `Harga modal maksimal ${PRODUCT_VALIDATION_RULES.PRICE_MAX}`),
  
  wholesalePrice: z.number()
    .positive("Harga jual tidak valid")
    .max(PRODUCT_VALIDATION_RULES.PRICE_MAX, `Harga jual maksimal ${PRODUCT_VALIDATION_RULES.PRICE_MAX}`),
  
  retailPrice: z.number()
    .positive("Harga eceran tidak valid")
    .max(PRODUCT_VALIDATION_RULES.PRICE_MAX, `Harga eceran maksimal ${PRODUCT_VALIDATION_RULES.PRICE_MAX}`)
    .optional()
    .nullable(),
    
  description: z.string()
    .max(PRODUCT_VALIDATION_RULES.DESC_MAX, `Deskripsi maksimal ${PRODUCT_VALIDATION_RULES.DESC_MAX} karakter`)
    .optional(),
}).refine((data) => data.costPrice < data.wholesalePrice, {
  message: "Harga jual harus lebih besar dari modal",
  path: ["wholesalePrice"], // Error akan diarahkan ke field wholesalePrice
});

// Tipe yang akan digunakan oleh React Hook Form di UI
export type ProductFormValues = z.infer<typeof productFormSchema>;

// ==========================================
// Skema Operasi Stok & Retur
// ==========================================

export const addStockSchema = z.object({
  id: z.number(),
  addedStock: z.number().int().positive("Jumlah stok harus lebih dari 0"),
});
export type AddStockPayload = z.infer<typeof addStockSchema>;

export const editStockSchema = z.object({
  id: z.number(),
  newStock: z.number().int().min(0, "Stok tidak boleh kurang dari 0"),
});
export type EditStockPayload = z.infer<typeof editStockSchema>;

export const processReturnSchema = z.object({
  id: z.number(),
  resaleQty: z.number().int().min(0, "Jumlah tidak valid"),
  wasteQty: z.number().int().min(0, "Jumlah tidak valid"),
}).refine((data) => data.resaleQty > 0 || data.wasteQty > 0, {
  message: "Tidak ada barang yang diolah",
  path: ["resaleQty"],
});
export type ProcessReturnPayload = z.infer<typeof processReturnSchema>;