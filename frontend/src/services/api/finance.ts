import { db } from "@/lib/db";
import { subDays, startOfDay, endOfDay, parseISO, format } from "date-fns";
import { id } from "date-fns/locale";

export interface FinanceDashboardData {
  summary: {
    income: {
      totalThisMonth: number;
      chartData: { date: string; amount: number }[];
    };
    receivables: {
      totalDebt: number;
      storeCount: number;
    };
    assets: {
      totalAssetValue: number;
      storeCount: number;
    };
  };
  lists: {
    incomes: Array<{
      visitId: number;
      storeName: string;
      date: string;
      amount: number;
    }>;
    receivables: Array<{
      storeId: number;
      storeName: string;
      debt: number;
      status: "merah" | "kuning";
    }>;
    assets: Array<{
      storeId: number;
      storeName: string;
      assetValue: number;
    }>;
  };
}

export const financeApi = {
  getDashboardData: async (): Promise<FinanceDashboardData> => {
    try {
      const result: FinanceDashboardData = {
        summary: {
          income: { totalThisMonth: 0, chartData: [] },
          receivables: { totalDebt: 0, storeCount: 0 },
          assets: { totalAssetValue: 0, storeCount: 0 },
        },
        lists: {
          incomes: [],
          receivables: [],
          assets: [],
        },
      };

      // 1. Ambil data Toko untuk Aset & Piutang
      const stores = await db.stores.toArray();
      
      stores.forEach(store => {
        // Proses Aset
        if (store.assetValue > 0) {
          result.summary.assets.totalAssetValue += store.assetValue;
          result.summary.assets.storeCount += 1;
          
          result.lists.assets.push({
            storeId: store.id,
            storeName: store.name,
            assetValue: store.assetValue
          });
        }

        // Proses Piutang
        if (store.debt > 0) {
          result.summary.receivables.totalDebt += store.debt;
          result.summary.receivables.storeCount += 1;
          
          result.lists.receivables.push({
            storeId: store.id,
            storeName: store.name,
            debt: store.debt,
            status: store.debt > 500000 ? "merah" : "kuning"
          });
        }
      });

      // 2. Ambil data Pemasukan 30 Hari Terakhir (Summary & Chart)
      const now = new Date();
      const startDate = startOfDay(subDays(now, 29));
      const endDate = endOfDay(now);
      const start = startDate.toISOString();
      const end = endDate.toISOString();

      const visitsThisMonth = await db.visits
        .where('createdAt')
        .between(start, end)
        .toArray();

      const chartDataMap = new Map<string, number>();
      for (let i = 29; i >= 0; i--) {
        const d = subDays(now, i);
        const dayStr = format(d, "yyyy-MM-dd");
        chartDataMap.set(dayStr, 0);
      }

      visitsThisMonth.forEach(visit => {
        if (visit.amountPaid > 0) {
          result.summary.income.totalThisMonth += visit.amountPaid;
          
          const visitDateStr = format(parseISO(visit.createdAt), "yyyy-MM-dd");
          if (chartDataMap.has(visitDateStr)) {
            const currentDayTotal = chartDataMap.get(visitDateStr)!;
            chartDataMap.set(visitDateStr, currentDayTotal + visit.amountPaid);
          }
        }
      });

      // Konversi map chart ke array terurut
      const chartData = Array.from(chartDataMap.entries())
        .map(([date, amount]) => ({ 
          date: format(parseISO(date), "d MMM", { locale: id }), 
          amount 
        }));
        
      result.summary.income.chartData = chartData;

      // 3. Ambil data Riwayat Pemasukan Terbaru (List Tab Masuk)
      // Gunakan reverse index 'id' untuk efisiensi ekstrim
      const recentIncomes = await db.visits
        .orderBy('id')
        .reverse()
        .filter(v => v.amountPaid > 0)
        .limit(20)
        .toArray();

      result.lists.incomes = recentIncomes.map(visit => ({
        visitId: visit.id,
        storeName: visit.storeName,
        date: format(parseISO(visit.createdAt), "d MMMM yyyy", { locale: id }),
        amount: visit.amountPaid
      }));

      // Sort assets & receivables list based on value
      result.lists.assets.sort((a, b) => b.assetValue - a.assetValue);
      result.lists.receivables.sort((a, b) => b.debt - a.debt);

      return result;
    } catch (error) {
      console.error("Gagal memuat data finance:", error);
      throw error;
    }
  }
};
