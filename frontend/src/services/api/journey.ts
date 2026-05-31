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

// Helper: Cek apakah toko overdue
const isStoreOverdue = (store: DbStore, overdueDays: number, now: Date) => {
  if (!store.lastVisitAt) return true;
  const lastVisit = new Date(store.lastVisitAt);
  const diffTime = Math.abs(now.getTime() - lastVisit.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > overdueDays;
};

export const journeyApi = {
  getInitialStores: async (): Promise<StoreWithDistance[]> => {
    const allStores = await db.stores.toArray();
    const overdueDays = settingsApi.getStoreOverdueDays();
    const now = new Date();
    
    return allStores
      .filter(s => isStoreOverdue(s, overdueDays, now))
      .map(s => ({ ...s, distance: 9999, isOverdue: true }));
  },
  
  getOptimalRoute: async (latitude: number, longitude: number): Promise<StoreWithDistance[]> => {
    const allStores = await db.stores.toArray();
    const overdueDays = settingsApi.getStoreOverdueDays();
    const now = new Date();
    
    const overdueStores = allStores.filter(s => isStoreOverdue(s, overdueDays, now));
    
    const processedStores = overdueStores.map(s => {
      const distance = calculateDistance(latitude, longitude, s.latitude, s.longitude);
      return { ...s, distance, isOverdue: true };
    });

    // Urutkan berdasarkan jarak terdekat
    return processedStores.sort((a, b) => a.distance - b.distance);
  }
};
