// @ts-nocheck
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ChevronRight,
  CheckCircle2,
  Pencil,
  MapPin,
  User,
  Phone,
  Navigation,
  Package,
  Wallet,
  AlertTriangle,
  TrendingUp,
  ArrowUp,
  Search,
  Croissant,
  Coffee,
  Cookie,
  MoreVertical
} from "lucide-react";
import { MapPicker } from "@/components/features/map-picker";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  unit: string;
  price: number;
  lastUpdate: string;
  icon: React.ReactNode;
  warning?: boolean;
}

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ringkasan");

  // Data Statis Dummy (Akan diganti saat integrasi API LocalStorage nanti)
  const store = {
    id: "1",
    name: "Warkop Berkah Jaya",
    owner: "Bpk. Budi Santoso",
    phone: "0812-3456-7890",
    address: "Jl. Sudirman No. 45, RT 02/RW 05, Kuningan, Jakarta Selatan. Patokan sebelah warteg Bahari.",
    lat: -6.200000,
    lng: 106.816666,
    activeStock: 245,
    receivable: 450000,
    salesThisMonth: 1200000,
    salesGrowth: 12,
  };

  const inventory: InventoryItem[] = [
    {
      id: "1",
      name: "Roti Sobek Coklat",
      sku: "RSB-001",
      stock: 24,
      unit: "pcs",
      price: 4500,
      lastUpdate: "Hari ini, 08:30",
      icon: <Croissant className="w-5 h-5" />
    },
    {
      id: "2",
      name: "Kopi Seduh Botol",
      sku: "KSB-002",
      stock: 5,
      unit: "btl",
      price: 12000,
      lastUpdate: "Kemarin, 16:45",
      icon: <Coffee className="w-5 h-5" />,
      warning: true
    },
    {
      id: "3",
      name: "Keripik Singkong Balado",
      sku: "KSB-003",
      stock: 18,
      unit: "bks",
      price: 8000,
      lastUpdate: "2 Hari lalu",
      icon: <Cookie className="w-5 h-5" />
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-container-max mx-auto space-y-lg pb-xl">
      
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex text-text-secondary font-body-sm text-body-sm mb-md">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center transition-colors">
            <Link to="/stores" className="hover:text-primary transition-colors cursor-pointer">
              Toko
            </Link>
          </li>
          <li><ChevronRight className="w-4 h-4 text-text-muted" /></li>
          <li aria-current="page" className="text-text-primary font-medium">
            {store.name}
          </li>
        </ol>
      </nav>

      {/* STORE HEADER CARD */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Info Section */}
          <div className="flex-1 p-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-sm">
                <div>
                  <div className="inline-flex items-center gap-xs px-2 py-1 rounded-full bg-success/10 text-success font-caption text-caption mb-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Aktif
                  </div>
                  <h1 className="font-h1 text-h1 text-text-primary tracking-tight">{store.name}</h1>
                </div>
                <button 
                  onClick={() => navigate(`/stores/${store.id}/edit`)}
                  className="text-primary hover:bg-surface-container-low p-sm rounded-lg transition-colors flex items-center gap-xs font-h3 text-h3 border border-outline-variant"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="hidden md:inline">Edit</span>
                </button>
              </div>

              <div className="space-y-sm mt-md">
                <div className="flex items-start gap-sm text-text-secondary font-body text-body">
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                  <p className="max-w-md">{store.address}</p>
                </div>
                <div className="flex items-center gap-sm text-text-secondary font-body text-body">
                  <User className="w-5 h-5 shrink-0" />
                  <p>{store.owner}</p>
                </div>
                <div className="flex items-center gap-sm text-text-secondary font-body text-body">
                  <Phone className="w-5 h-5 shrink-0" />
                  <p>{store.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-lg">
              <button 
                onClick={() => navigate(`/stores/${store.id}/visit`)}
                className="w-full md:w-auto bg-primary text-on-primary rounded-lg py-md px-xl flex items-center justify-center gap-sm font-h3 text-h3 font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
              >
                <Navigation className="w-5 h-5" />
                MULAI KUNJUNGAN
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full md:w-[320px] lg:w-[400px] h-64 md:h-auto bg-surface-container relative border-t md:border-t-0 md:border-l border-border shrink-0 z-0">
            <MapPicker 
              position={{ lat: store.lat, lng: store.lng }}
              readonly={true} 
            />
          </div>
        </div>
      </div>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        
        {/* Stat 1: Stock */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-md flex flex-col justify-between">
          <div className="flex items-center gap-sm text-text-secondary font-h3 text-h3 mb-md">
            <div className="p-sm bg-primary/10 rounded-lg text-primary">
              <Package className="w-5 h-5" />
            </div>
            Total Stok Aktif
          </div>
          <div className="flex items-end justify-between">
            <div className="font-display text-display text-text-primary">{store.activeStock}</div>
            <div className="font-body-sm text-body-sm text-text-secondary mb-1">Items</div>
          </div>
        </div>

        {/* Stat 2: Receivable */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-md flex flex-col justify-between">
          <div className="flex items-center gap-sm text-text-secondary font-h3 text-h3 mb-md">
            <div className="p-sm bg-error/10 rounded-lg text-error">
              <Wallet className="w-5 h-5" />
            </div>
            Total Piutang
          </div>
          <div className="flex flex-col">
            <div className="font-display text-display text-text-primary">{formatCurrency(store.receivable)}</div>
            <div className="font-caption text-caption text-error flex items-center gap-xs mt-xs">
              <AlertTriangle className="w-4 h-4" />
              Belum ditagih
            </div>
          </div>
        </div>

        {/* Stat 3: Sales */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-md flex flex-col justify-between">
          <div className="flex items-center gap-sm text-text-secondary font-h3 text-h3 mb-md">
            <div className="p-sm bg-success/10 rounded-lg text-success">
              <TrendingUp className="w-5 h-5" />
            </div>
            Total Penjualan (Bulan Ini)
          </div>
          <div className="flex items-end justify-between">
            <div className="font-display text-display text-text-primary">{formatCurrency(store.salesThisMonth)}</div>
            <div className="font-caption text-caption text-success flex items-center gap-xs mb-1">
              <ArrowUp className="w-4 h-4" />
              {store.salesGrowth}%
            </div>
          </div>
        </div>
      </div>

      {/* TABS & DATA CONTENT */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
        
        {/* Tab Header */}
        <div className="flex border-b border-border px-md pt-sm bg-surface-container-lowest overflow-x-auto custom-scrollbar">
          <button 
            onClick={() => setActiveTab("ringkasan")}
            className={`px-md py-sm font-h3 text-h3 whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${activeTab === "ringkasan" ? "font-bold text-primary border-primary" : "text-text-secondary hover:text-text-primary border-transparent"}`}
          >
            Ringkasan
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-md py-sm font-h3 text-h3 whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${activeTab === "history" ? "font-bold text-primary border-primary" : "text-text-secondary hover:text-text-primary border-transparent"}`}
          >
            History Titipan
          </button>
          <button 
            onClick={() => setActiveTab("custom_prices")}
            className={`px-md py-sm font-h3 text-h3 whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${activeTab === "custom_prices" ? "font-bold text-primary border-primary" : "text-text-secondary hover:text-text-primary border-transparent"}`}
          >
            Custom Prices
          </button>
        </div>

        {/* Tab Content: Ringkasan (Live Inventory) */}
        {activeTab === "ringkasan" && (
          <div className="p-0">
            <div className="px-lg py-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-border bg-surface-bright">
              <h3 className="font-h2 text-h2 text-text-primary">Live Inventory</h3>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                <input 
                  className="w-full sm:w-64 pl-xl pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body text-body text-on-surface focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-shadow placeholder:text-text-muted" 
                  placeholder="Cari produk..." 
                  type="text"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-border">
                    <th className="py-sm px-lg font-caption text-caption text-text-secondary font-medium uppercase tracking-wider">Produk</th>
                    <th className="py-sm px-lg font-caption text-caption text-text-secondary font-medium uppercase tracking-wider">Stok Saat Ini</th>
                    <th className="py-sm px-lg font-caption text-caption text-text-secondary font-medium uppercase tracking-wider text-right">Harga Titip</th>
                    <th className="py-sm px-lg font-caption text-caption text-text-secondary font-medium uppercase tracking-wider">Update Terakhir</th>
                    <th className="py-sm px-lg font-caption text-caption text-text-secondary font-medium uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-md px-lg">
                        <div className="flex items-center gap-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface-container border border-border flex items-center justify-center text-text-secondary shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-h3 text-h3 text-text-primary">{item.name}</div>
                            <div className="font-caption text-caption text-text-muted">SKU: {item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-md px-lg">
                        <div className={`inline-flex items-center gap-1 font-data-md text-data-md ${item.warning ? 'text-warning' : 'text-text-primary'}`}>
                          {item.stock} <span className="text-text-muted font-body-sm text-body-sm font-normal">{item.unit}</span>
                          {item.warning && <AlertTriangle className="w-4 h-4 ml-1" />}
                        </div>
                      </td>
                      <td className="py-md px-lg font-data-md text-data-md text-text-primary text-right whitespace-nowrap">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-md px-lg font-body-sm text-body-sm text-text-secondary whitespace-nowrap">
                        {item.lastUpdate}
                      </td>
                      <td className="py-md px-lg text-right">
                        <button className="p-sm text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-low">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-md border-t border-border flex justify-center bg-surface-container-lowest">
              <button className="text-primary font-h3 text-h3 hover:underline font-medium">Lihat Semua Produk</button>
            </div>
          </div>
        )}

        {/* Tab Content: Placeholder untuk History dan Custom Prices */}
        {activeTab !== "ringkasan" && (
          <div className="p-xl flex flex-col items-center justify-center text-text-secondary">
            <Package className="w-12 h-12 mb-sm text-outline-variant" />
            <p className="font-body text-body">
              Data untuk tab {activeTab === "history" ? "History Titipan" : "Custom Prices"} akan segera tersedia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}