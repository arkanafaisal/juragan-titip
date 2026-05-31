import { db } from "@/lib/db";
import { settingsApi } from "@/services/api/settings";
import type { DbStore } from "@/lib/db";

export type StoreWithDistance = DbStore & { distance: number; isOverdue?: boolean };

// Helper: Rumus Haversine untuk menghitung jarak lurus (dalam KM)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999; 
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1)); 
};

export const journeyApi = {
  getInitialStores: async (): Promise<StoreWithDistance[]> => {
    const allStores = await db.stores.toArray();
    return allStores.map(s => ({ ...s, distance: 9999 }));
  },
  
  getOptimalRoute: async (latitude: number, longitude: number): Promise<StoreWithDistance[]> => {
    const allStores = await db.stores.toArray();
    const overdueDays = settingsApi.getStoreOverdueDays();
    const now = new Date();
    
    // Klasifikasi dan hitung jarak
    const processedStores = allStores.map(s => {
      const distance = calculateDistance(latitude, longitude, s.latitude, s.longitude);
      
      let isOverdue = false;
      if (!s.lastVisitAt) {
        isOverdue = true;
      } else {
        const lastVisit = new Date(s.lastVisitAt);
        const diffTime = Math.abs(now.getTime() - lastVisit.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > overdueDays) {
          isOverdue = true;
        }
      }
      
      return { ...s, distance, isOverdue };
    });

    // Urutkan masing-masing grup berdasarkan jarak terdekat
    const overdueGroup = processedStores.filter(s => s.isOverdue).sort((a, b) => a.distance - b.distance);
    const normalGroup = processedStores.filter(s => !s.isOverdue).sort((a, b) => a.distance - b.distance);

    return [...overdueGroup, ...normalGroup];
  }
};
