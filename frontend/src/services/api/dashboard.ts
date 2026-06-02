import { db } from "@/lib/db";
import { subDays, startOfDay, endOfDay, isSameDay, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export interface DashboardHistory {
  id: number;
  time: string;
  store: string;
  amount: number;
  isDebt: boolean;
}

export interface DashboardData {
  weeklyRevenue: number;
  totalVisitsThisWeek: number;
  chartData: { name: string; visits: number }[];
  todayHistory: DashboardHistory[];
}

export const dashboardApi = {
  getDashboardData: async (): Promise<DashboardData> => {
    // 1. Determine the date ranges (Rolling 7 days: 6 days ago to today)
    const now = new Date();
    const weekStart = startOfDay(subDays(now, 6));
    const weekEnd = endOfDay(now);

    const weekStartISO = weekStart.toISOString();
    
    // 2. Fetch all visits starting from weekStartISO using Dexie index
    const visitsThisWeek = await db.visits
      .where('createdAt')
      .aboveOrEqual(weekStartISO)
      .toArray();

    // Ensure we only process visits up to the end of this week
    const validVisits = visitsThisWeek.filter(v => new Date(v.createdAt) <= weekEnd);

    // 3. Process data
    let weeklyRevenue = 0;
    let totalVisitsThisWeek = 0;
    
    const chartDataMap = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(now, 6 - i);
      return {
        name: format(d, 'EEE', { locale: idLocale }),
        dateString: format(d, 'yyyy-MM-dd'),
        visits: 0
      };
    });

    const todayHistory: DashboardHistory[] = [];

    validVisits.forEach(visit => {
      weeklyRevenue += visit.amountPaid;
      totalVisitsThisWeek++;

      const visitDate = new Date(visit.createdAt);
      const visitDateString = format(visitDate, 'yyyy-MM-dd');
      
      const chartItem = chartDataMap.find(c => c.dateString === visitDateString);
      if (chartItem) {
        chartItem.visits++;
      }

      if (isSameDay(visitDate, now)) {
        // Calculate if it's debt: amountPaid < totalBill
        const totalBill = visit.items.reduce((sum, item) => sum + (item.sold * item.wholesalePrice), 0);
        const isDebt = visit.amountPaid < totalBill;

        todayHistory.push({
          id: visit.id,
          time: visitDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          store: visit.storeName,
          amount: visit.amountPaid,
          isDebt: isDebt
        });
      }
    });

    // Sort today history by newest first
    todayHistory.sort((a, b) => {
      // If we had exact time parsing we could compare date objects, but comparing IDs or string times works.
      // IDs are incremental so this safely puts the latest visits first
      return b.id - a.id;
    });

    const chartData = chartDataMap.map(({ name, visits }) => ({ name, visits }));

    return {
      weeklyRevenue,
      totalVisitsThisWeek,
      chartData,
      todayHistory
    };
  }
};
