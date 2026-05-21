export interface Consignment {
  id: number;
  product: string;
  sum: number;
  address: string;
  lastRestock: string;
  nextRestock: string;
  lat: number | null;
  lng: number | null;
  mapLink: string | null;
}

export interface Product {
  id: number;
  name: string;
  capital: number;
  sell: number;
}
