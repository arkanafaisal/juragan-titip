import { useQuery } from '@tanstack/react-query';
import { db } from '../db';
import { eq, desc, and, sql, gt } from 'drizzle-orm';
import { stores, visits } from '../db/schema';
import { useSettingsStore } from './settings.api';

// =====================================
// 1. DAFTAR & SUMMARY PEMASUKAN
// =====================================
export function useGetFinanceIncome(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['financeIncome', startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      
      const start = startDate ? new Date(startDate) : new Date();
      if (!startDate) {
        start.setDate(start.getDate() - 6);
      }
      start.setHours(0, 0, 0, 0);

      const startStr = start.toISOString();
      const endStr = end.toISOString();

      const results = await db.query.visits.findMany({
        where: and(
          sql`${visits.createdAt} >= ${startStr}`,
          sql`${visits.createdAt} <= ${endStr}`,
          gt(visits.amountPaid, 0)
        ),
        with: {
          store: true
        },
        orderBy: [desc(visits.createdAt)]
      });

      // 1. Build List
      const list = results.map(r => {
        const date = new Date(r.createdAt);
        const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        
        return {
          visitId: r.id,
          storeName: r.store?.name || 'Toko Dihapus',
          date: formattedDate,
          amount: r.amountPaid
        };
      });

      // 2. Build Chart Data
      let totalThisPeriod = 0;
      let runningTotal = 0;
      const chartData: { value: number }[] = [];

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      for(let i = diffDays - 1; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];

        let dayTotal = 0;
        results.forEach(v => {
          if (v.createdAt.startsWith(dateKey)) {
            dayTotal += v.amountPaid;
          }
        });

        runningTotal += dayTotal;
        chartData.push({ value: runningTotal });
      }

      totalThisPeriod = runningTotal;

      return {
        list,
        summary: {
          totalThisPeriod,
          chartData: chartData.length > 0 ? chartData : [{ value: 0 }]
        }
      };
    }
  });
}

// =====================================
// 2. DAFTAR & SUMMARY PIUTANG
// =====================================
export function useGetFinanceReceivables() {
  const storeOverdueDays = useSettingsStore(state => state.storeOverdueDays);

  return useQuery({
    queryKey: ['financeReceivables', storeOverdueDays],
    queryFn: async () => {
      const results = await db.select()
        .from(stores)
        .where(
          and(eq(stores.isArchived, false), gt(stores.debt, 0))
        )
        .orderBy(desc(stores.debt));

      const now = new Date();
      let totalDebt = 0;
      
      const list = results.map(r => {
        totalDebt += r.debt;

        return {
          storeId: r.id,
          storeName: r.name,
          debt: r.debt
        };
      });

      return {
        list,
        summary: {
          storeCount: list.length,
          totalDebt
        }
      };
    }
  });
}

// =====================================
// 3. DAFTAR & SUMMARY ASET
// =====================================
export function useGetFinanceAssets() {
  return useQuery({
    queryKey: ['financeAssets'],
    queryFn: async () => {
      const results = await db.select()
        .from(stores)
        .where(
          and(eq(stores.isArchived, false), gt(stores.assetValue, 0))
        )
        .orderBy(desc(stores.assetValue));

      let totalAssetValue = 0;

      const list = results.map(r => {
        totalAssetValue += r.assetValue;

        return {
          storeId: r.id,
          storeName: r.name,
          assetValue: r.assetValue
        };
      });

      return {
        list,
        summary: {
          storeCount: list.length,
          totalAssetValue
        }
      };
    }
  });
}
