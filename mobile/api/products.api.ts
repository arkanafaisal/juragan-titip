import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { eq, like, and, gt, lte, SQL, sql, asc } from 'drizzle-orm';
import { db } from '../db';
import { products } from '../db/schema';
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
        if (error.message?.includes('UNIQUE constraint failed: products.normalized_name')) {
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
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Gagal Menyimpan',
        text2: error.message,
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
          .where(eq(products.id, id))
          .returning();
          
        if (result.length === 0) throw new Error("Produk tidak ditemukan");
        return result[0];
      } catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed: products.normalized_name')) {
          throw new Error(`Produk dengan nama "${data.name}" sudah ada di database.`);
        }
        throw new Error(error.message || "Terjadi kesalahan sistem saat memperbarui produk.");
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
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Gagal Memperbarui',
        text2: error.message,
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

      return await db.select()
        .from(products)
        .where(queryConditions.length > 0 ? and(...queryConditions) : undefined)
        .orderBy(asc(products.name));
    }
  });
}

export function useGetProductById(id?: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      if (!id) throw new Error("ID Produk tidak valid");
      
      const result = await db.select()
        .from(products)
        .where(eq(products.id, id))
        .limit(1);
      
      if (result.length === 0) {
        throw new Error("Produk tidak ditemukan");
      }
      
      return result[0];
    },
    enabled: !!id,
  });
}


export function useAddStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, addedStock }: AddStockPayload) => {
      if (addedStock <= 0) throw new Error("Jumlah stok harus lebih dari 0");
      
      const result = await db.update(products)
        .set({ warehouseStock: sql`${products.warehouseStock} + ${addedStock}` })
        .where(eq(products.id, id))
        .returning();
        
      if (result.length === 0) throw new Error("Produk tidak ditemukan");
      return result[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      Toast.show({
        type: 'success',
        text1: 'Stok Ditambahkan',
        text2: 'Stok baru berhasil ditambahkan.',
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Gagal Menambah Stok',
        text2: error.message,
      });
    }
  });
}


export function useEditStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStock }: EditStockPayload) => {
      if (newStock < 0) throw new Error("Stok tidak boleh kurang dari 0");
      
      const result = await db.update(products)
        .set({ warehouseStock: newStock })
        .where(eq(products.id, id))
        .returning();
        
      if (result.length === 0) throw new Error("Produk tidak ditemukan");
      return result[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      Toast.show({
        type: 'success',
        text1: 'Stok Dikoreksi',
        text2: 'Jumlah stok berhasil disesuaikan.',
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Gagal Mengoreksi Stok',
        text2: error.message,
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
      
      // Verifikasi ketersediaan stok retur
      const currentProduct = await db.select({ returnedStock: products.returnedStock })
        .from(products)
        .where(eq(products.id, id))
        .limit(1);
        
      if (currentProduct.length === 0) throw new Error("Produk tidak ditemukan");
      if (currentProduct[0].returnedStock < totalProcessed) {
        throw new Error("Total olah melebihi jumlah retur yang ada");
      }
      
      const result = await db.update(products)
        .set({ 
          warehouseStock: sql`${products.warehouseStock} + ${resaleQty}`,
          returnedStock: sql`${products.returnedStock} - ${totalProcessed}`
        })
        .where(eq(products.id, id))
        .returning();
        
      return result[0];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      Toast.show({
        type: 'success',
        text1: 'Retur Diolah',
        text2: 'Barang retur berhasil disortir.',
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Gagal Mengolah Retur',
        text2: error.message,
      });
    }
  });
}
