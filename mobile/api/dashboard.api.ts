import { useQuery } from '@tanstack/react-query';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { visits } from '../db/schema';

export interface DashboardData {
  totalVisitsThisWeek: number;
  chartData: { label: string; value: number }[];
  recentHistory: {
    id: number;
    time: string;
    store: string;
    restockedItems: { name: string; quantity: number }[];
  }[];
}

export function useGetDashboardData() {
  return useQuery({
    queryKey: ['dashboardData'],
    queryFn: async (): Promise<DashboardData> => {
      const now = new Date();
      
      // Ambil 7 hari ke belakang dari awal hari ini (lokal)
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      // Kueri database untuk data 7 hari terakhir
      const recentVisits = await db.query.visits.findMany({
        where: sql`${visits.createdAt} >= ${sevenDaysAgo.toISOString()}`,
        with: {
          store: true,
          items: {
            with: { product: true }
          }
        },
        orderBy: (visits, { desc }) => [desc(visits.createdAt)]
      });

      let totalVisitsThisWeek = recentVisits.length;

      // 1. Inisialisasi map untuk grafik 7 hari terakhir (Map mempertahankan urutan insert)
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const chartMap = new Map<string, { label: string, value: number }>();
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        chartMap.set(dateKey, { label: dayNames[d.getDay()], value: 0 });
      }

      const recentHistory: DashboardData['recentHistory'] = [];
      const todayDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // 2. Loop data kunjungan untuk agregasi
      recentVisits.forEach(v => {
        const visitDate = new Date(v.createdAt);
        const vYear = visitDate.getFullYear();
        const vMonth = String(visitDate.getMonth() + 1).padStart(2, '0');
        const vDay = String(visitDate.getDate()).padStart(2, '0');
        const visitDateKey = `${vYear}-${vMonth}-${vDay}`;

        // a. Tambahkan ke grafik jika tanggal masuk dalam range 7 hari terakhir
        if (chartMap.has(visitDateKey)) {
          const existing = chartMap.get(visitDateKey)!;
          existing.value += 1;
        }

        // c. Masukkan ke riwayat 7 hari
        const hours = String(visitDate.getHours()).padStart(2, '0');
        const minutes = String(visitDate.getMinutes()).padStart(2, '0');
        
        const restockedItemsList = v.items
          .filter(item => item.restocked > 0)
          .map(item => ({
            name: item.product?.name || 'Produk',
            quantity: item.restocked
          }));
        
        recentHistory.push({
          id: v.id,
          time: `${dayNames[visitDate.getDay()]} ${hours}:${minutes}`,
          store: v.store?.name || 'Toko Dihapus',
          restockedItems: restockedItemsList
        });
      });

      return {
        totalVisitsThisWeek,
        chartData: Array.from(chartMap.values()),
        recentHistory
      };
    }
  });
}
