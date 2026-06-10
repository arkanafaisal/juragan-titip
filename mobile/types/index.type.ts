export type { Product } from '../db/schema';

export interface Store {
  id: number;
  name: string;
  normalizedName: string;
  ownerName: string;
  phone?: string;
  address: string;
  latitude: number;
  longitude: number;
  notes: string;
  debt: number;
  assetValue: number;
  lastVisitAt: string;
  category: "1" | "2" | "3" | "4" | "5";
  isArchived: boolean;
}
