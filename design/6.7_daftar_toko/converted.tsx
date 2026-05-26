// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
  Plus, 
  Search, 
  MapPin, 
  Store as StoreIcon, 
  Package, 
  CircleDollarSign 
} from "lucide-react";
import type { Store } from "@/types";
// import { storeApi } from "@/services/api/stores"; // Uncomment nanti saat API service sudah siap

export default function StoreListPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // TODO: Ganti dengan pemanggilan API (storeApi.getAll)
  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      // Simulasi fetch data
      setTimeout(() => {
        setStores([
          {
            id: "1",
            name: "Toko Berkah",
            ownerName: "Pak Hasan",
            phone: "0812-3456-7890",
            address: "Jl. Raya No. 15, Bandung",
            latitude: -6.914744,
            longitude: 107.609810,
            notes: "",
            activeItemCount: 45,
            totalReceivable: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Toko Makmur",
            ownerName: "Bu Siti",
            phone: "0813-9876-5432",
            address: "Jl. Merdeka 8, Jakarta",
            latitude: -6.200000,
            longitude: 106.816666,
            notes: "",
            activeItemCount: 30,
            totalReceivable: 800000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Toko Jaya",
            ownerName: "Mas Budi",
            phone: "0857-1122-3344",
            address: "Jl. Veteran 22, Surabaya",
            latitude: -7.250445,
            longitude: 112.768845,
            notes: "",
            activeItemCount: 12,
            totalReceivable: 1500000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchStores();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          store.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "lunas") return matchesSearch && store.totalReceivable === 0;
    if (statusFilter === "piutang") return matchesSearch && store.totalReceivable > 0;
    return matchesSearch;
  });

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-text-primary">Toko Mitra</h2>
          <p className="font-body text-body text-text-secondary mt-xs">Kelola data mitra dan pantau performa konsinyasi.</p>
        </div>
        <button 
          onClick={() => navigate("/stores/new")}
          className="bg-primary text-on-primary font-body text-body px-md py-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-xs w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Tambah Toko
        </button>
      </div>

      {/* Toolbar (Search & Filters) */}
      <div className="bg-surface rounded-xl shadow-sm p-md border border-border flex flex-col md:flex-row gap-md items-center justify-between">
        <div className="w-full md:w-1/2 relative">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-xl pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary font-body text-body bg-surface-container-lowest outline-none transition-all" 
            placeholder="Cari nama toko atau pemilik..." 
            type="text" 
          />
        </div>
        <div className="flex w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-outline-variant rounded-lg px-md py-sm font-body text-body bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="piutang">Ada Piutang</option>
            <option value="lunas">Lunas</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex justify-center py-xl">
          <div className="animate-pulse text-text-secondary font-body text-body">Memuat data toko...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              <div className="p-md flex-1 flex flex-col cursor-pointer" onClick={() => navigate(`/stores/${store.id}`)}>
                {/* Identity */}
                <div className="flex items-start justify-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary-container text-primary flex items-center justify-center shrink-0">
                      <StoreIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-h3 text-h3 text-text-primary line-clamp-1">{store.name}</h3>
                      <p className="font-body-sm text-body-sm text-text-secondary">{store.ownerName} • {store.phone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Address */}
                <div className="flex items-start gap-xs text-text-secondary mb-md">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-body-sm text-body-sm line-clamp-2">{store.address}</span>
                </div>

                <hr className="border-outline-variant mb-md" />

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-sm mb-xs">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-xs text-text-secondary">
                      <Package className="w-4 h-4 shrink-0" />
                      <span className="font-caption text-caption">Stok Aktif</span>
                    </div>
                    <span className="font-data-md text-data-md text-text-primary">{store.activeItemCount} item</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-xs text-text-secondary">
                      <CircleDollarSign className="w-4 h-4 shrink-0" />
                      <span className="font-caption text-caption">Piutang</span>
                    </div>
                    <span className={`font-data-md text-data-md ${
                      store.totalReceivable === 0 
                        ? 'text-success' 
                        : store.totalReceivable > 1000000 ? 'text-error' : 'text-warning'
                    }`}>
                      {store.totalReceivable === 0 ? "Rp 0" : formatCurrency(store.totalReceivable)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Dari code.html) */}
              <div className="p-sm bg-surface-bright border-t border-outline-variant flex gap-sm">
                <button 
                  onClick={(e) => { e.stopPropagation(); window.open(`https://maps.google.com/?q=${store.latitude},${store.longitude}`, '_blank'); }}
                  className="flex-1 border border-outline-variant text-text-secondary hover:text-primary hover:bg-surface-container-low font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
                >
                  <MapPin className="w-4 h-4" />
                  Maps
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/stores/${store.id}/visit`); }}
                  className="flex-1 bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
                >
                  <StoreIcon className="w-4 h-4" />
                  Kunjungi
                </button>
              </div>
            </div>
          ))}

          {/* Card: Empty/New State (Dari code.html) */}
          <div 
            onClick={() => navigate('/stores/new')}
            className="bg-surface-bright rounded-xl border-2 border-dashed border-outline-variant p-md flex flex-col items-center justify-center gap-sm text-center min-h-[220px] hover:bg-surface-container-low transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-xs group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-h3 text-h3 text-on-surface">Tambah Toko Baru</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[200px]">
              Daftarkan mitra toko baru untuk mulai menitipkan barang.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}