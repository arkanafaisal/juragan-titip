import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { db } from '../db';
import { eq, desc, asc, like, and, or, gt, SQL, sql } from 'drizzle-orm';
import { stores } from '../db/schema';
import { StoreFormValues } from '../schemas/store-form.schema';
import { useSettingsStore } from './settings.api';

export function useAddStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StoreFormValues) => {
      try {
        const result = await db.insert(stores).values({
          normalizedName: data.name.toLowerCase(),
          ...data
        }).returning();
        
        return result[0];
      } catch (error: any) {
        if (error?.message?.includes('UNIQUE constraint failed')) {
          throw new Error(`Toko dengan nama "${data.name}" sudah ada di database.`);
        }
        throw new Error("Terjadi kesalahan sistem saat menyimpan data toko.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['stores'],
        refetchType: 'all'
      });
      queryClient.invalidateQueries({ queryKey: ['overdueStores'] });
      Toast.show({
        type: 'success',
        text1: 'Berhasil Disimpan',
        text2: 'Data toko baru telah ditambahkan ke database.',
      });
    }
  });
}

export interface GetStoresFilters {
  search?: string;
  category?: string;
  status?: string;
  visitStatus?: string;
  isArchived?: string;
  sortBy?: string;
  overdueDays?: number;
}

export function useGetStores(filters?: GetStoresFilters) {
  return useQuery({
    queryKey: ['stores', filters],
    queryFn: async () => {
      try {
        const conditions: (SQL<unknown> | undefined)[] = [];

        if (filters?.search) {
          conditions.push(
            or(
              like(stores.normalizedName, `%${filters.search.toLowerCase()}%`),
              like(stores.ownerName, `%${filters.search}%`)
            )
          );
        }

        if (filters?.category) {
          conditions.push(eq(stores.category, filters.category as any));
        }

        if (filters?.status === 'lunas') {
          conditions.push(eq(stores.debt, 0));
        } else if (filters?.status === 'piutang') {
          conditions.push(gt(stores.debt, 0));
        }

        if (filters?.visitStatus === 'overdue' && filters?.overdueDays !== undefined) {
          conditions.push(
            or(
              sql`${stores.lastVisitAt} IS NULL`,
              sql`${stores.lastVisitAt} < datetime('now', '-' || ${filters.overdueDays} || ' days')`
            )
          );
        }

        if (filters?.isArchived === 'true') {
          conditions.push(eq(stores.isArchived, true));
        } else {
          conditions.push(eq(stores.isArchived, false));
        }

        const queryConditions = conditions.filter(Boolean) as SQL<unknown>[];

        let orderByClause;
        if (filters?.sortBy === 'lastVisitDesc') {
          orderByClause = desc(stores.lastVisitAt);
        } else if (filters?.sortBy === 'lastVisitAsc') {
          orderByClause = asc(stores.lastVisitAt);
        } else {
          orderByClause = asc(stores.name);
        }

        return await db.select()
          .from(stores)
          .where(queryConditions.length > 0 ? and(...queryConditions) : undefined)
          .orderBy(orderByClause);
      } catch (error: any) {
        throw new Error("Gagal memuat data toko dari database.");
      }
    }
  });
}

export function useGetStoreById(id?: number) {
  return useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const storeData = await db.select()
          .from(stores)
          .where(eq(stores.id, id))
          .limit(1);

        if (storeData.length === 0) {
          throw new Error("Toko tidak ditemukan");
        }

        return storeData[0];
      } catch (error: any) {
        throw new Error(error.message || "Gagal memuat detail toko.");
      }
    },
    enabled: !!id
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof stores.$inferInsert> }) => {
      try {
        await db.update(stores)
          .set({
            ...data,
            ...(data.name ? { normalizedName: data.name.toLowerCase() } : {})
          })
          .where(eq(stores.id, id));
      } catch (error: any) {
        throw new Error(error.message || "Gagal memperbarui toko ke database.");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['store', variables.id] });
    }
  });
}

export function useGetOverdueStores() {
  const storeOverdueDays = useSettingsStore(state => state.storeOverdueDays);

  return useQuery({
    queryKey: ['overdueStores', storeOverdueDays],
    queryFn: async () => {
      const results = await db.select()
        .from(stores)
        .where(
          and(
            eq(stores.isArchived, false),
            or(
              sql`${stores.lastVisitAt} IS NULL`,
              sql`cast((julianday('now') - julianday(${stores.lastVisitAt})) as integer) >= ${storeOverdueDays}`
            )
          )
        )
        .orderBy(sql`COALESCE(${stores.lastVisitAt}, ${stores.createdAt}) ASC`, stores.name);
        
      return results;
    }
  });
}
