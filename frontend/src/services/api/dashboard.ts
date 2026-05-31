import { db } from "@/lib/db";
import { startOfWeek, endOfWeek, isSameDay } from "date-fns";

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
    // 1. Determine the date ranges (Monday start)
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

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
    
    const chartDataMap = [
      { name: 'Sen', visits: 0, dayIndex: 1 },
      { name: 'Sel', visits: 0, dayIndex: 2 },
      { name: 'Rab', visits: 0, dayIndex: 3 },
      { name: 'Kam', visits: 0, dayIndex: 4 },
      { name: 'Jum', visits: 0, dayIndex: 5 },
      { name: 'Sab', visits: 0, dayIndex: 6 },
      { name: 'Min', visits: 0, dayIndex: 0 },
    ];

    const todayHistory: DashboardHistory[] = [];

    validVisits.forEach(visit => {
      weeklyRevenue += visit.amountPaid;
      totalVisitsThisWeek++;

      const visitDate = new Date(visit.createdAt);
      const dayIndex = visitDate.getDay(); 
      
      const chartItem = chartDataMap.find(c => c.dayIndex === dayIndex);
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
