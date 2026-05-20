export interface Titipan {
  id: number;
  produk: string;
  jumlah: number;
  lokasi: string;
  lastRestock: string;
  nextRestock: string;
  lat: number | null;
  lng: number | null;
  mapLink: string | null;
}

export interface Produk {
  id: number;
  nama: string;
  modal: number;
  jual: number;
}
