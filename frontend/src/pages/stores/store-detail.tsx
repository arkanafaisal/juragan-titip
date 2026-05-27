// frontend/src/pages/stores/store-detail.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
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
  TrendingUp,
  History,
  StickyNote,
  Loader2
} from "lucide-react";
import { MapPicker } from "@/components/features/map-picker";
import { storeApi } from "@/services/api/stores";
import type { Store } from "@/types";

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("titipan");

  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const response = await storeApi.getById(id);
        if (response.success && response.data) {
          setStore(response.data);
        } else {
          setError(response.message || "Toko tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal memuat data toko.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  // Komponen reusable untuk 3 Card Info (Struktur Responsif: Horizontal di Mobile, Vertikal di Tablet/PC)
  const StatCard = ({ 
    icon: Icon, title, value, unit, bgClass, textClass, 
    valSizePC = "font-h1 text-h1", valSizeMobile = "font-h3 text-h3 font-bold" 
  }: any) => (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-md flex flex-row md:flex-col justify-between items-center md:items-stretch gap-3 md:gap-md">
      
      {/* Top/Left Section */}
      <div className="flex items-center gap-3 md:gap-sm">
        <div className={`p-2 md:p-sm ${bgClass} rounded-lg ${textClass} shrink-0`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        {/* Mobile Layout Text */}
        <div className="flex flex-col md:hidden">
          <span className="font-caption text-caption text-text-secondary">{title}</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-text-primary tracking-tight ${valSizeMobile}`}>{value}</span>
            {unit && <span className="font-caption text-caption text-text-secondary">{unit}</span>}
          </div>
        </div>
        {/* PC Layout Title */}
        <span className="hidden md:block font-h3 text-h3 text-text-secondary">{title}</span>
      </div>

      {/* Bottom/Right Section */}
      <div className="flex flex-col items-end md:items-start md:flex-row md:justify-between md:items-end shrink-0">
        {/* PC Layout Value */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className={`text-text-primary tracking-tight font-bold ${valSizePC}`}>{value}</span>
            {unit && <span className="font-body-sm text-body-sm text-text-secondary">{unit}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-text-secondary">
        <Package className="w-12 h-12 mb-sm text-outline-variant" />
        <p className="font-body text-body">{error || "Toko tidak ditemukan."}</p>
        <button onClick={() => navigate("/stores")} className="mt-md text-primary font-medium hover:underline">
          Kembali ke Daftar Toko
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto space-y-md md:space-y-lg pb-xl">
      
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex text-text-secondary font-body-sm text-body-sm">
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
          <div className="flex-1 p-md md:p-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-sm">
                <div>
                  <div className="inline-flex items-center gap-xs px-2 py-0.5 md:py-1 rounded-full bg-success/10 text-success font-caption text-caption mb-sm font-medium">
                    <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                    Aktif
                  </div>
                  <h1 className="font-h2 text-h2 md:font-h1 md:text-h1 text-text-primary tracking-tight">{store.name}</h1>
                </div>
                <button 
                  onClick={() => navigate(`/stores/${store.id}/edit`)}
                  className="text-primary hover:bg-surface-container-low p-sm rounded-lg transition-colors flex items-center gap-xs font-body-sm text-body-sm md:font-h3 md:text-h3 border border-outline-variant"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="hidden md:inline">Edit</span>
                </button>
              </div>

              <div className="space-y-sm mt-md">
                <div className="flex items-start gap-xs md:gap-sm text-text-secondary font-body-sm text-body-sm md:font-body md:text-body">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mt-0.5 shrink-0" />
                  <p>{store.address}</p>
                </div>
                <div className="flex items-center gap-xs md:gap-sm text-text-secondary font-body-sm text-body-sm md:font-body md:text-body">
                  <User className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <p>{store.ownerName}</p>
                </div>
                <div className="flex items-center gap-xs md:gap-sm text-text-secondary font-body-sm text-body-sm md:font-body md:text-body">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <p>{store.phone}</p>
                </div>
                <div className="flex items-start gap-xs md:gap-sm text-text-secondary font-body-sm text-body-sm md:font-body md:text-body">
                  <StickyNote className="w-4 h-4 md:w-5 md:h-5 mt-0.5 shrink-0" />
                  <p className={!store.notes ? "italic text-text-muted" : ""}>
                    {store.notes || "Tidak ada catatan."}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-md md:mt-lg flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => navigate(`/stores/${store.id}/visit`)}
                className="w-full sm:w-auto bg-primary text-on-primary rounded-lg py-sm md:py-md px-md lg:px-xl flex items-center justify-center gap-sm font-body text-body md:font-h3 md:text-h3 font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] whitespace-nowrap"
              >
                <Navigation className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                MULAI KUNJUNGAN
              </button>
              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${store.latitude},${store.longitude}`, '_blank')}
                className="w-full sm:w-auto bg-surface text-text-secondary border border-outline-variant rounded-lg py-sm md:py-md px-md lg:px-xl flex items-center justify-center gap-sm font-body text-body md:font-h3 md:text-h3 font-semibold hover:text-primary hover:bg-surface-container-low transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                MAPS
              </button>
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full md:w-[320px] lg:w-[400px] h-48 md:h-auto bg-surface-container relative border-t md:border-t-0 md:border-l border-border shrink-0 z-0">
            <MapPicker 
              position={{ lat: store.latitude, lng: store.longitude }}
              readonly={true} 
            />
          </div>
        </div>
      </div>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-sm md:gap-md">
        
        <StatCard 
          icon={Package}
          title="Produk Aktif"
          value="0"
          bgClass="bg-primary/10"
          textClass="text-primary"
          valSizePC="font-h1 text-h1"
          valSizeMobile="font-h3 text-h3 font-bold"
        />

        <StatCard 
          icon={Wallet}
          title="Piutang"
          value="Rp 0"
          bgClass="bg-error/10"
          textClass="text-error"
          valSizePC="font-h2 text-h2"
          valSizeMobile="font-body text-body font-bold"
        />

        <StatCard 
          icon={TrendingUp}
          title="Penjualan"
          value="Rp 0"
          bgClass="bg-success/10"
          textClass="text-success"
          valSizePC="font-h2 text-h2"
          valSizeMobile="font-body text-body font-bold"
        />
        
      </div>

      {/* TABS & DATA CONTENT */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
        
        {/* Tab Header */}
        <div 
          className="flex border-b border-border px-md bg-surface-container-lowest overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden" 
          style={{ scrollbarWidth: 'none' }}
        >
          <button 
            onClick={() => setActiveTab("titipan")}
            className={`px-md py-3 font-body text-body md:font-h3 md:text-h3 whitespace-nowrap transition-colors border-b-2 relative top-[1px] ${activeTab === "titipan" ? "font-bold text-primary border-primary" : "text-text-secondary hover:text-text-primary border-transparent"}`}
          >
            Titipan
          </button>
          <button 
            onClick={() => setActiveTab("riwayat")}
            className={`px-md py-3 font-body text-body md:font-h3 md:text-h3 whitespace-nowrap transition-colors border-b-2 relative top-[1px] ${activeTab === "riwayat" ? "font-bold text-primary border-primary" : "text-text-secondary hover:text-text-primary border-transparent"}`}
          >
            Riwayat
          </button>
        </div>

        {/* Tab Content: Titipan */}
        {activeTab === "titipan" && (
          <div className="py-12 md:py-16 px-md flex flex-col items-center justify-center text-text-secondary min-h-[200px]">
            <Package className="w-12 h-12 mb-sm text-outline-variant" />
            <p className="font-body text-body text-center max-w-[300px]">
              Data barang titipan aktif pada toko ini akan ditampilkan di sini.
            </p>
          </div>
        )}

        {/* Tab Content: Riwayat */}
        {activeTab === "riwayat" && (
          <div className="py-12 md:py-16 px-md flex flex-col items-center justify-center text-text-secondary min-h-[200px]">
            <History className="w-12 h-12 mb-sm text-outline-variant" />
            <p className="font-body text-body text-center max-w-[300px]">
              Data riwayat kunjungan toko ini akan ditampilkan di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}