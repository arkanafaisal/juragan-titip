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
})
// Validasi silang: Harga jual harus lebih besar dari harga modal
.refine((data) => data.costPrice < data.wholesalePrice, {
  message: "Harga jual harus lebih besar dari modal",
  path: ["wholesalePrice"], // Error akan diarahkan ke field wholesalePrice
});

// Tipe yang akan digunakan oleh React Hook Form di UI
export type ProductFormValues = z.infer<typeof productFormSchema>;