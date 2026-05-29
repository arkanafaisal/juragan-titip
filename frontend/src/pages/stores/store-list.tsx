

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Search } from "lucide-react";
import { StoreCard } from "@/components/stores/store-card";
import type { Store } from "@/types";
import { storeApi } from "@/services/api/stores";
import { Pagination } from "@/components/shared/pagination";
import { LIMIT } from "@/lib/constants";

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

  // const displayStores = stores.slice(0, 6);

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <button 
          onClick={() => navigate("/stores/new")}
          className="bg-primary text-on-primary font-body text-body px-md py-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-xs w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Tambah Toko
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="animate-pulse text-text-secondary font-body text-body">Memuat data toko...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {stores.map((store, index) => {
            if (index >= LIMIT) { return }
            return <StoreCard key={store.id} store={store} />
          })}

        </div>
      )}

      
      {!isLoading && (
        <Pagination
        currentPage={currentPage}
        hasNextPage={stores.length > LIMIT}
        onPageChange={(page) => {setCurrentPage(page)}}
        />
      )}
    </div>
  );
}