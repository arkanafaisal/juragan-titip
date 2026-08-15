export type { Product } from '../db/schema';

export interface Store {
  id: number;
  name: string;
  normalizedName: string;
  ownerName: string | null;
  phone?: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
  debt: number;
  assetValue: number;
  lastVisitAt: string;
  category: "1" | "2" | "3" | "4" | "5";
  isArchived: boolean;
}
