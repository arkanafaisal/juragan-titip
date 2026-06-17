import { useQuery } from '@tanstack/react-query';
import { db } from '../db';
import { eq, desc, and, sql, gt } from 'drizzle-orm';
import { stores, visits } from '../db/schema';
import { useSettingsStore } from './settings.api';

// =====================================
// 1. SUMMARY KEUANGAN
// =====================================
export function useGetFinanceSummary() {
  return useQuery({
    queryKey: ['financeSummary'],
    queryFn: async () => {
      // Batas 30 hari terakhir
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

      const recentVisits = await db.select({
        amountPaid: visits.amountPaid,
        createdAt: visits.createdAt
      }).from(visits).where(
        sql`${visits.createdAt} >= ${thirtyDaysAgoStr}`
      );

      let totalThisMonth = 0;
      let runningTotal = 0;
      const chartData: { value: number }[] = [];

      for(let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];

        // Hitung total pemasukan khusus di hari ini
        let dayTotal = 0;
        recentVisits.forEach(v => {
          if (v.createdAt.startsWith(dateKey)) {
            dayTotal += v.amountPaid;
          }
        });

        runningTotal += dayTotal;
        chartData.push({ value: runningTotal });
      }

      totalThisMonth = runningTotal;

      // Summary Piutang
      const receivablesResult = await db.select({
        count: sql<number>`count(*)`,
        total: sql<number>`sum(${stores.debt})`
      }).from(stores).where(
        and(eq(stores.isArchived, false), gt(stores.debt, 0))
      );

      // Summary Aset
      const assetsResult = await db.select({
        count: sql<number>`count(*)`,
        total: sql<number>`sum(${stores.assetValue})`
      }).from(stores).where(
        and(eq(stores.isArchived, false), gt(stores.assetValue, 0))
      );

      return {
        income: {
          totalThisMonth,
          chartData: chartData.length > 0 ? chartData : [{ value: 0 }]
        },
        receivables: {
          storeCount: receivablesResult[0].count || 0,
          totalDebt: receivablesResult[0].total || 0
        },
        assets: {
          storeCount: assetsResult[0].count || 0,
          totalAssetValue: assetsResult[0].total || 0
        }
      };
    }
  });
}

// =====================================
// 2. DAFTAR PEMASUKAN (30 Hari Terakhir)
// =====================================
export function useGetFinanceIncomeList() {
  return useQuery({
    queryKey: ['financeIncomeList'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

      const results = await db.query.visits.findMany({
        where: and(
          sql`${visits.createdAt} >= ${thirtyDaysAgoStr}`,
          gt(visits.amountPaid, 0)
        ),
        with: {
          store: true
        },
        orderBy: [desc(visits.createdAt)]
      });

      return results.map(r => {
        const date = new Date(r.createdAt);
        const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        
        return {
          visitId: r.id,
          storeName: r.store?.name || 'Toko Dihapus',
          date: formattedDate,
          amount: r.amountPaid
        };
      });
    }
  });
}

// =====================================
// 3. DAFTAR PIUTANG (Berjalan)
// =====================================
export function useGetFinanceReceivableList() {
  const storeOverdueDays = useSettingsStore(state => state.storeOverdueDays);

  return useQuery({
    queryKey: ['financeReceivableList', storeOverdueDays],
    queryFn: async () => {
      const results = await db.select()
        .from(stores)
        .where(
          and(eq(stores.isArchived, false), gt(stores.debt, 0))
        )
        .orderBy(desc(stores.debt)); // Urutkan dari piutang terbesar

      const now = new Date();
      
      return results.map(r => {
        const refDate = r.lastVisitAt ? new Date(r.lastVisitAt) : new Date(r.createdAt);
        const diffDays = Math.ceil(Math.abs(now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          storeId: r.id,
          storeName: r.name,
          debt: r.debt
        };
      });
    }
  });
}

// =====================================
// 4. DAFTAR ASET (Berjalan)
// =====================================
export function useGetFinanceAssetList() {
  return useQuery({
    queryKey: ['financeAssetList'],
    queryFn: async () => {
      const results = await db.select()
        .from(stores)
        .where(
          and(eq(stores.isArchived, false), gt(stores.assetValue, 0))
        )
        .orderBy(desc(stores.assetValue)); // Urutkan dari aset terbesar

      return results.map(r => ({
        storeId: r.id,
        storeName: r.name,
        assetValue: r.assetValue
      }));
    }
  });
}
