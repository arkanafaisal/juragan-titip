import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '../db';
import { eq, and, sql } from 'drizzle-orm';
import { visits, visitItems, stores, products, inventoryLogs } from '../db/schema';
import { VisitFormValues } from '../schemas/visit.schema';
import Toast from 'react-native-toast-message';

// 1. Ambil Kunjungan Terakhir
export function useGetLastVisit(storeId: number, lastVisitAt?: string | null) {
  return useQuery({
    queryKey: ['lastVisit', storeId, lastVisitAt],
    queryFn: async () => {
      // Jika tidak ada lastVisitAt, berarti belum pernah dikunjungi
      if (!lastVisitAt) {
        return null;
      }
      
      const lastVisitData = await db.query.visits.findFirst({
        where: and(
          eq(visits.storeId, storeId),
          eq(visits.createdAt, lastVisitAt)
        ),
        with: {
          items: {
            with: {
              product: true
            }
          }
        }
      });

      return lastVisitData || null;
    },
    enabled: !!storeId,
  });
}

// 2. Ambil Riwayat & Analisis Kunjungan Toko (90 Hari Terakhir)
export function useGetStoreVisitsAnalysis(storeId?: number) {
  return useQuery({
    queryKey: ['storeVisitsAnalysis', storeId],
    queryFn: async () => {
      if (!storeId) return null;

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const recentVisits = await db.query.visits.findMany({
        where: and(
          eq(visits.storeId, storeId),
          // Menggunakan sql untuk literal comparison datetime ISO8601 di sqlite
          sql`${visits.createdAt} >= ${ninetyDaysAgo.toISOString()}`
        ),
        orderBy: (visits, { desc }) => [desc(visits.createdAt)],
        with: {
          items: {
            with: {
              product: true
            }
          }
        }
      });

      // Mapping visitHistory
      const visitHistory = recentVisits.map(v => ({
        id: v.id,
        amountPaid: v.amountPaid,
        createdAt: v.createdAt
      }));

      // Mapping activeItems (dari kunjungan paling terakhir)
      let activeItems: any[] = [];
      if (recentVisits.length > 0) {
        const lastV = recentVisits[0]; // Kunjungan terbaru
        lastV.items.forEach(item => {
          const remained = (item.initialStock - item.sold - item.returned) + item.restocked;
          if (remained > 0) {
            activeItems.push({
              productName: item.product?.name || 'Produk Dihapus',
              remained: remained
            });
          }
        });
      }

      return {
        visitHistory,
        activeItems
      };
    },
    enabled: !!storeId,
  });
}

// 3. Buat Kunjungan Baru
export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VisitFormValues) => {
      return await db.transaction(async (tx) => {
        
        // --- A. Hitung Subtotal dan Piutang ---
        let subtotal = 0;
        const opnameItemsMerged = data.opnameItems.map(item => {
          subtotal += (item.sold * item.wholesalePrice);
          return item;
        });

        const totalBilled = data.checkout.oldDebt + subtotal;
        
        // Aturan: amountPaid tidak boleh melebihi total tagihan untuk data yang disimpan (sisanya adalah kembalian)
        let actualAmountPaid = data.checkout.amountPaid;
        let newDebt = totalBilled - actualAmountPaid;
        
        if (actualAmountPaid >= totalBilled) {
          actualAmountPaid = totalBilled; // Cap it
          newDebt = 0;
        }

        // --- B. Simpan Kunjungan ---
        const now = new Date().toISOString();
        const [newVisit] = await tx.insert(visits).values({
          storeId: data.storeId,
          subtotal: subtotal,
          amountPaid: actualAmountPaid,
          debt: newDebt,
          createdAt: now,
        }).returning({ id: visits.id });

        // --- C. Simpan Detail Item Kunjungan ---
        const allItemsMap = new Map<number, any>();

        // 1. Masukkan data Opname
        for (const item of data.opnameItems) {
          // Jika tidak ada transaksi sama sekali, tetap simpan sebagai jejak (dengan sold=0, ditarik=0)
          allItemsMap.set(item.productId, {
            visitId: newVisit.id,
            productId: item.productId,
            initialStock: item.initialStock,
            sold: item.sold,
            returned: item.returned,
            restocked: 0,
            price: item.wholesalePrice,
          });

          // Logika Inventory untuk Retur (Tarik Barang)
          if (item.returned > 0) {
            await tx.insert(inventoryLogs).values({
              productId: item.productId,
              type: 'TARIK_RETUR',
              quantity: item.returned,
              storeName: data.storeName,
            });
            // Update returnedStock di tabel produk
            const [prod] = await tx.select({ returnedStock: products.returnedStock }).from(products).where(eq(products.id, item.productId));
            await tx.update(products)
              .set({ returnedStock: prod.returnedStock + item.returned })
              .where(eq(products.id, item.productId));
          }
        }

        // 2. Masukkan data Restock
        for (const item of data.restockItems) {
          if (item.quantity > 0) {
            if (allItemsMap.has(item.productId)) {
              // Gabung dengan opname yang sudah ada
              const existing = allItemsMap.get(item.productId);
              existing.restocked = item.quantity;
            } else {
              // Buat baru jika tidak ada di opname
              allItemsMap.set(item.productId, {
                visitId: newVisit.id,
                productId: item.productId,
                initialStock: 0,
                sold: 0,
                returned: 0,
                restocked: item.quantity,
                price: item.wholesalePrice,
              });
            }

            // Logika Inventory untuk Titipan Baru
            await tx.insert(inventoryLogs).values({
              productId: item.productId,
              type: 'TITIPAN',
              quantity: item.quantity,
              storeName: data.storeName,
            });
            // Update warehouseStock di tabel produk (berkurang)
            const [prod] = await tx.select({ warehouseStock: products.warehouseStock }).from(products).where(eq(products.id, item.productId));
            await tx.update(products)
              .set({ warehouseStock: prod.warehouseStock - item.quantity })
              .where(eq(products.id, item.productId));
          }
        }

        const allItemsToInsert = Array.from(allItemsMap.values());
        if (allItemsToInsert.length > 0) {
          await tx.insert(visitItems).values(allItemsToInsert);
        }

        // --- D. Update Status Toko ---
        await tx.update(stores)
          .set({
            debt: newDebt,
            lastVisitAt: now
          })
          .where(eq(stores.id, data.storeId));

        return newVisit.id;
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['lastVisit', variables.storeId] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Karena warehouseStock & returnedStock berubah
      queryClient.invalidateQueries({ queryKey: ['inventoryLogs'] });
      
      Toast.show({
        type: 'success',
        text1: 'Kunjungan Selesai',
        text2: 'Data kunjungan berhasil disimpan.'
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Gagal Menyimpan',
        text2: error.message || 'Terjadi kesalahan saat memproses kunjungan.'
      });
    }
  });
}

// 4. Ambil Detail Kunjungan by ID (Invoice)
export function useGetVisitById(id?: number) {
  return useQuery({
    queryKey: ['visit', id],
    queryFn: async () => {
      if (!id) return null;
      
      const visitData = await db.query.visits.findFirst({
        where: eq(visits.id, id),
        with: {
          store: true,
          items: {
            with: {
              product: true
            }
          }
        }
      });

      if (!visitData) return null;

      // Format ulang data agar mirip dengan struktur respons yang dibutuhkan komponen UI invoice
      // karena prototype web menggunakan visit.items dengan properti tambahan
      const mappedItems = visitData.items.map(item => {
        const remained = (item.initialStock - item.sold - item.returned) + item.restocked;
        return {
          productId: item.productId,
          productName: item.product?.name || 'Produk Dihapus',
          initialStock: item.initialStock,
          sold: item.sold,
          returned: item.returned,
          restocked: item.restocked,
          remained: remained,
          wholesalePrice: item.price,
        };
      });

      return {
        id: visitData.id,
        storeId: visitData.storeId,
        storeName: visitData.store?.name || 'Toko Dihapus',
        storePhone: visitData.store?.phone || '',
        subtotal: visitData.subtotal,
        amountPaid: visitData.amountPaid,
        currentDebt: visitData.debt,
        createdAt: visitData.createdAt,
        items: mappedItems,
      };
    },
    enabled: !!id,
  });
}
