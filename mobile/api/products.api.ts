import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { eq, like, and, gt, gte, lte, SQL, sql, asc, desc } from 'drizzle-orm';
import { db } from '../db';
import { products, inventoryLogs, InventoryLogType } from '../db/schema';
import { 
  ProductFormValues, 
  AddStockPayload, 
  EditStockPayload, 
  ProcessReturnPayload 
} from '../schemas/product-form.schema';

export interface GetProductsFilters {
  search?: string;
  category?: string;
  isArchived?: string;
  stock?: string;
  lowStockThreshold?: number;
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductFormValues) => {
      try {
        const result = await db.insert(products).values({
          normalizedName: data.name.toLowerCase(),
          ...data
        }).returning();

        return result[0];
      } catch (error: any) {
        if (error?.message?.includes('UNIQUE constraint failed')) {
          throw new Error(`Produk dengan nama "${data.name}" sudah ada di database.`);
        }
        throw new Error("Terjadi kesalahan sistem saat menyimpan produk.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['products'],
        refetchType: 'all'
      });
      Toast.show({
        type: 'success',
        text1: 'Berhasil Disimpan',
        text2: 'Produk baru telah ditambahkan ke database.',
      });
    }
  });
}

export interface UpdateProductPayload {
  id: number;
  data: ProductFormValues;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateProductPayload) => {
      try {
        const result = await db.update(products)
          .set({
            normalizedName: data.name.toLowerCase(),
            ...data
          })
          .where(and(eq(products.id, id), eq(products.isArchived, false)))
          .returning();
          
        if (result.length === 0) throw new Error("Produk tidak ditemukan");
        return result[0];
      } catch (error: any) {
        if (error?.message?.includes('UNIQUE constraint failed')) {
          throw new Error(`Produk dengan nama "${data.name}" sudah ada di database.`);
        }
        if (error?.message === "Produk tidak ditemukan") {
          throw error;
        }
        throw new Error("Terjadi kesalahan sistem saat memperbarui produk.");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      Toast.show({
        type: 'success',
        text1: 'Berhasil Diperbarui',
        text2: 'Data produk telah diperbarui.',
      });
    }
  });
}

export function useGetProducts(filters?: GetProductsFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const conditions: (SQL<unknown> | undefined)[] = [];

      if (filters?.search) {
        conditions.push(like(products.normalizedName, `%${filters.search.toLowerCase()}%`));
      }
      
      if (filters?.category) {
        conditions.push(eq(products.category, filters.category as "1" | "2" | "3" | "4" | "5"));
      }
      
      if (filters?.isArchived === 'true') {
        conditions.push(eq(products.isArchived, true));
      } else {
        conditions.push(eq(products.isArchived, false));
      }

      if (filters?.stock) {
        if (filters.stock === 'out_of_stock') {
          conditions.push(eq(products.warehouseStock, 0));
        } else if (filters.stock === 'low_stock' && filters.lowStockThreshold !== undefined) {
          conditions.push(and(gt(products.warehouseStock, 0), lte(products.warehouseStock, filters.lowStockThreshold)));
        } else if (filters.stock === 'in_stock' && filters.lowStockThreshold !== undefined) {
          conditions.push(gt(products.warehouseStock, filters.lowStockThreshold));
        }
      }

      const queryConditions = conditions.filter(Boolean) as SQL<unknown>[];

      try {
        return await db.select()
          .from(products)
          .where(queryConditions.length > 0 ? and(...queryConditions) : undefined)
          .orderBy(asc(products.name));
      } catch (error) {
        throw new Error("Terjadi kesalahan sistem saat mengambil daftar produk.");
      }
    }
  });
}

export function useGetProductById(id?: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      if (!id) throw new Error("ID Produk tidak valid");
      
      let result;
      try {
        result = await db.select()
          .from(products)
          .where(eq(products.id, id))
          .limit(1);
      } catch (error) {
        throw new Error("Terjadi kesalahan sistem saat mengambil detail produk.");
      }
      
      if (result.length === 0) {
        throw new Error("Produk tidak ditemukan");
      }
      
      return result[0];
    },
    enabled: !!id,
  });
}

export function useGetProductInventoryLogs(productId?: number, typeFilter?: InventoryLogType) {
  return useQuery({
    queryKey: ['inventoryLogs', productId, typeFilter],
    queryFn: async () => {
      if (!productId) throw new Error("ID Produk tidak valid");
      
      const conditions: any[] = [
        eq(inventoryLogs.productId, productId),
        gte(inventoryLogs.createdAt, sql`datetime('now', '-30 days')`)
      ];

      if (typeFilter) {
        conditions.push(eq(inventoryLogs.type, typeFilter as any));
      }

      try {
        return await db.select()
          .from(inventoryLogs)
          .where(and(...conditions))
          .orderBy(desc(inventoryLogs.createdAt));
      } catch (error) {
        throw new Error("Terjadi kesalahan sistem saat mengambil riwayat produk.");
      }
    },
    enabled: !!productId,
  });
}


export function useAddStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, addedStock }: AddStockPayload) => {
      if (addedStock <= 0) throw new Error("Jumlah stok harus lebih dari 0");
      
      let updatedProduct;
      try {
        updatedProduct = await db.transaction(async (tx) => {
          const updated = await tx.update(products)
            .set({ warehouseStock: sql`${products.warehouseStock} + ${addedStock}` })
            .where(and(eq(products.id, id), eq(products.isArchived, false)))
            .returning();
            
          if (updated.length > 0) {
            await tx.insert(inventoryLogs).values({
              productId: id,
              type: "KULAKAN",
              quantity: addedStock,
            });
          }
          
          return updated;
        });
      } catch (error) {
        throw new Error("Terjadi kesalahan sistem saat menambah stok.");
      }
      
      if (updatedProduct.length === 0) throw new Error("Produk tidak ditemukan");
      return updatedProduct[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLogs', variables.id] });
      Toast.show({
        type: 'success',
        text1: 'Stok Ditambahkan',
        text2: 'Stok baru berhasil ditambahkan.',
      });
    }
  });
}


export function useEditStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStock }: EditStockPayload) => {
      if (newStock < 0) throw new Error("Stok tidak boleh kurang dari 0");
      
      let currentProduct;
      try {
        currentProduct = await db.select()
          .from(products)
          .where(and(eq(products.id, id), eq(products.isArchived, false)))
          .limit(1);
      } catch (error) {
        throw new Error("Terjadi kesalahan sistem saat memverifikasi data produk.");
      }
          
      if (currentProduct.length === 0) throw new Error("Produk tidak ditemukan");
      
      const diff = newStock - currentProduct[0].warehouseStock;
      
      if (diff === 0) {
        return currentProduct[0];
      }
      
      let updatedProduct;
      try {
        updatedProduct = await db.transaction(async (tx) => {
          const updated = await tx.update(products)
            .set({ warehouseStock: newStock })
            .where(eq(products.id, id))
            .returning();
            
          await tx.insert(inventoryLogs).values({
            productId: id,
            type: "KOREKSI",
            quantity: diff,
          });
          
          return updated;
        });
      } catch (error) {
        throw new Error("Terjadi kesalahan sistem saat mengoreksi stok.");
      }
      
      return updatedProduct[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLogs', variables.id] });
      Toast.show({
        type: 'success',
        text1: 'Stok Dikoreksi',
        text2: 'Jumlah stok berhasil disesuaikan.',
      });
    }
  });
}


export function useProcessReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, resaleQty, wasteQty }: ProcessReturnPayload) => {
      if (resaleQty < 0 || wasteQty < 0) throw new Error("Jumlah tidak valid");
      if (resaleQty === 0 && wasteQty === 0) throw new Error("Tidak ada barang yang diolah");
      
      const totalProcessed = resaleQty + wasteQty;
      
      let currentProduct;
      try {
        currentProduct = await db.select({ returnedStock: products.returnedStock })
          .from(products)
          .where(and(eq(products.id, id), eq(products.isArchived, false)))
          .limit(1);
      } catch (error) {
        throw new Error("Terjadi kesalahan sistem saat memverifikasi data produk.");
      }
          
      if (currentProduct.length === 0) throw new Error("Produk tidak ditemukan");
      if (currentProduct[0].returnedStock < totalProcessed) {
        throw new Error("Total olah melebihi jumlah retur yang ada");
      }
      
      let updatedProduct;
      try {
        updatedProduct = await db.transaction(async (tx) => {
          const updated = await tx.update(products)
            .set({ 
              warehouseStock: sql`${products.warehouseStock} + ${resaleQty}`,
              returnedStock: sql`${products.returnedStock} - ${totalProcessed}`
            })
            .where(eq(products.id, id))
            .returning();
            
          if (resaleQty > 0) {
            await tx.insert(inventoryLogs).values({
              productId: id,
              type: "OLAH_RETUR",
              quantity: resaleQty,
            });
          }
          
          if (wasteQty > 0) {
            await tx.insert(inventoryLogs).values({
              productId: id,
              type: "BUANG_RUSAK",
              quantity: -wasteQty,
            });
          }
          
          return updated;
        });
      } catch (error) {
        throw new Error("Terjadi kesalahan sistem saat mengolah retur.");
      }
      
      return updatedProduct[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLogs', variables.id] });
      Toast.show({
        type: 'success',
        text1: 'Retur Diolah',
        text2: 'Barang retur berhasil disortir.',
      });
    }
  });
}

export function useArchiveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      let result;
      try {
        result = await db.update(products)
          .set({ isArchived: true })
          .where(eq(products.id, id))
          .returning();
      } catch (error: any) {
        throw new Error("Terjadi kesalahan sistem saat mengarsipkan produk.");
      }
        
      if (result.length === 0) throw new Error("Produk tidak ditemukan atau sudah diarsipkan");
      return result[0];
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      Toast.show({
        type: 'success',
        text1: 'Berhasil Diarsipkan',
        text2: 'Produk telah diarsipkan dan tidak akan muncul di daftar utama.',
      });
    }
  });
}

export function useRecoverProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      let result;
      try {
        result = await db.update(products)
          .set({ isArchived: false })
          .where(eq(products.id, id))
          .returning();
      } catch (error: any) {
        throw new Error("Terjadi kesalahan sistem saat memulihkan produk.");
      }
        
      if (result.length === 0) throw new Error("Produk tidak ditemukan atau sudah aktif");
      return result[0];
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
      Toast.show({
        type: 'success',
        text1: 'Berhasil Dipulihkan',
        text2: 'Produk telah aktif kembali dan muncul di daftar utama.',
      });
    }
  });
}
