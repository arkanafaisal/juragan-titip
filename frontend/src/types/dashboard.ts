export interface Consignment {
  id: number;
  productId: number;
  sum: number;
  address: string;
  lastRestock: string;
  nextRestock: string;
  lat: number;
  lng: number;
}

export interface Product {
  id: number;
  name: string;
  capital: number;
  sell: number;
}
