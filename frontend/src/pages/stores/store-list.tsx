

import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { StoreCard } from "@/components/stores/store-card";
import type { Store } from "@/types";
import { storeApi } from "@/services/api/stores";
import { Pagination } from "@/components/shared/pagination";
import { LIMIT } from "@/lib/constants";
import { ActionToolbar, type FilterGroup } from "@/components/shared/action-toolbar";
import { settingsApi } from "@/services/api/settings";

export default function StoreListPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  
  const storeCategoryLabels = settingsApi.getStoreCategoryLabels();
  const overdueDays = settingsApi.getStoreOverdueDays();

  const [filters, setFilters] = useState<Record<string, string>>({
    status: "",
    category: "",
    visitStatus: "",
    sortBy: ""
  });
  const storeFilterConfig: FilterGroup[] = useMemo(() => [
    {
      id: "category",
      title: "Kategori Toko",
      options: [
        { label: "Semua", value: "" },
        { label: storeCategoryLabels["1"], value: "1" },
        { label: storeCategoryLabels["2"], value: "2" },
        { label: storeCategoryLabels["3"], value: "3" },
        { label: storeCategoryLabels["4"], value: "4" },
        { label: storeCategoryLabels["5"], value: "5" }
      ]
    },
    {
      id: "status",
      title: "Status Operasional",
      options: [
        { label: "Semua", value: "" },
        { label: "Lunas", value: "lunas" },
        { label: "Piutang", value: "piutang" }
      ]
    },
    {
      id: "visitStatus",
      title: "Kunjungan Toko",
      options: [
        { label: "Semua", value: "" },
        { label: `> ${overdueDays} Hari`, value: "overdue" }
      ]
    },
    {
      id: "sortBy",
      title: "Urutkan Berdasarkan",
      options: [
        { label: "Default", value: "" },
        { label: "Kunjungan Terbaru", value: "lastVisitDesc" },
        { label: "Kunjungan Terlama", value: "lastVisitAsc" }
      ]
    }
  ], [storeCategoryLabels, overdueDays]);

  const handleFilterChange = useCallback((groupId: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [groupId]: value
    }))
  }, []);


  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters]);

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      try {
        const response = await storeApi.getAll({
          search: debouncedSearch,
          status: filters.status,
          category: filters.category,
          visitStatus: filters.visitStatus,
          sortBy: filters.sortBy,
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
  }, [debouncedSearch, filters, currentPage]);

  // const displayStores = stores.slice(0, 6);

  return (
    <div className="flex flex-col">
      <ActionToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Cari toko mitra..."
        onAddClick={() => navigate("/stores/new")}
        onSettingClick={() => navigate("/settings?section=toko")}
        
        // Cukup passing 3 baris ini, Boom! Filter beres.
        filterGroups={storeFilterConfig}
        activeFilters={filters}
        onFilterChange={handleFilterChange}
      />
      

      {isLoading ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="animate-pulse text-text-secondary font-body text-body">Memuat data toko...</div>
        </div>
      ) : stores.length === 0? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="text-text-secondary font-body text-body">Pencarian tidak menemukan toko.</div>
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