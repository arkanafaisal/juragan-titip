import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { eq, like, and, gt, lte, SQL } from 'drizzle-orm';
import { db } from '../db';
import { products } from '../db/schema';
import { ProductFormValues } from '../schemas/product-form';

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
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
        .where(queryConditions.length > 0 ? and(...queryConditions) : undefined);
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
