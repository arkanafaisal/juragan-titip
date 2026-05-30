import { db } from "@/lib/db";
import { startOfMonth, endOfMonth, parseISO, format } from "date-fns";
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

      // 2. Ambil data Pemasukan Bulan Ini (Summary & Chart)
      const now = new Date();
      const start = startOfMonth(now).toISOString();
      const end = endOfMonth(now).toISOString();

      const visitsThisMonth = await db.visits
        .where('createdAt')
        .between(start, end)
        .toArray();

      const chartDataMap = new Map<string, number>();

      visitsThisMonth.forEach(visit => {
        if (visit.amountPaid > 0) {
          result.summary.income.totalThisMonth += visit.amountPaid;
          
          const day = format(parseISO(visit.createdAt), "d");
          const currentDayTotal = chartDataMap.get(day) || 0;
          chartDataMap.set(day, currentDayTotal + visit.amountPaid);
        }
      });

      // Konversi map chart ke array terurut
      const chartData = Array.from(chartDataMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => parseInt(a.date) - parseInt(b.date));
        
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
