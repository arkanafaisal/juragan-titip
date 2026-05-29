

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Plus, 
  Search, 
  MapPin, 
  Store as StoreIcon, 
  Package, 
  CircleDollarSign,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { Store } from "@/types";
import { storeApi } from "@/services/api/stores";

export default function StoreListPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      try {
        const response = await storeApi.getAll({
          search: debouncedSearch,
          status: statusFilter,
          page: currentPage
        });
        if (response.success) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data toko:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [debouncedSearch, statusFilter, currentPage]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  
  const displayStores = stores.slice(0, 6);
  const hasNextPage = stores.length > 6;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <p className="font-h3 sm:font-h2 text-h3 sm:text-h2 font-bold text-text-primary">Kelola data mitra dan pantau performa konsinyasi.</p>
        </div>
        <button 
          onClick={() => navigate("/stores/new")}
          className="bg-primary text-on-primary font-body text-body px-md py-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-xs w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Tambah Toko
        </button>
      </div>

      
      <div className="bg-surface rounded-xl shadow-sm p-md border border-border flex flex-col md:flex-row gap-md items-center justify-between">
        <div className="w-full md:w-1/2 relative">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
          <input 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-xl pr-md py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary font-body text-body bg-surface-container-lowest outline-none transition-all" 
            placeholder="Toko Berkah Jaya..." 
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

      
      {isLoading ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="animate-pulse text-text-secondary font-body text-body">Memuat data toko...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {displayStores.map((store) => (
            <div key={store.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              <div className="p-md flex-1 flex flex-col cursor-pointer" onClick={() => navigate(`/stores/${store.id}`)}>
                
                <div className="flex items-start justify-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <div>
                      <h3 className="font-h3 text-h3 text-text-primary line-clamp-1">{store.name}</h3>
                      <p className="font-body-sm text-body-sm text-text-secondary">{store.ownerName} • {store.phone}</p>
                    </div>
                  </div>
                </div>
                
                
                <div className="flex items-start gap-xs text-text-secondary mb-md">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-body-sm text-body-sm line-clamp-2">{store.address}</span>
                </div>

                <hr className="border-outline-variant mb-md" />

                
                <div className="grid grid-cols-2 gap-sm mb-xs">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-xs text-text-secondary">
                      <Package className="w-4 h-4 shrink-0" />
                      <span className="font-caption text-caption">Stok Aktif</span>
                    </div>
                    <span className="font-data-md text-data-md text-text-primary">0 item</span>
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

              
              <div className="p-sm bg-surface-bright border-t border-outline-variant flex gap-sm">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    window.open(`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`, '_blank'); 
                  }}
                  className="flex-1 border border-outline-variant text-text-secondary hover:text-primary hover:bg-surface-container-low font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
                >
                  <MapPin className="w-4 h-4" />
                  Maps
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    navigate(`/stores/${store.id}/visit`); 
                  }}
                  className="flex-1 bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
                >
                  <StoreIcon className="w-4 h-4" />
                  Kunjungi
                </button>
              </div>
            </div>
          ))}

          
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

      
      {!isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-md py-sm bg-surface rounded-xl border border-border shadow-sm gap-sm">
          <span className="font-caption text-caption text-text-secondary">
            {displayStores.length > 0 
              ? `Menampilkan ${(currentPage - 1) * 6 + 1}-${(currentPage - 1) * 6 + displayStores.length} toko`
              : "Menampilkan 0 toko"
            }
          </span>
          <div className="flex gap-xs">
            <button 
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={!hasPrevPage}
              className="p-xs rounded border border-outline-variant text-text-secondary hover:bg-surface-container-low disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-sm py-xs rounded bg-primary-container text-on-primary-container font-body-sm text-body-sm font-medium">
              {currentPage}
            </button>
            <button 
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!hasNextPage}
              className="p-xs rounded border border-outline-variant text-text-secondary hover:bg-surface-container-low disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}