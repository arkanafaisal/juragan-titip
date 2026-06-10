import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { db } from '../db';
import { products } from '../db/schema';
import { ProductFormValues } from '../schemas/product-form';

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
    },
    onError: (error: Error) => {
      Alert.alert(error.message);
    }
  });
}
