

import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ItemCard } from "@/components/shared/item-card";
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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchInput = searchParams.get('search') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  
  const storeCategoryLabels = settingsApi.getStoreCategoryLabels();
  const overdueDays = settingsApi.getStoreOverdueDays();

  const filters = useMemo(() => ({
    status: searchParams.get('status') || "",
    category: searchParams.get('category') || "",
    visitStatus: searchParams.get('visitStatus') || "",
    sortBy: searchParams.get('sortBy') || "",
    isArchived: searchParams.get('isArchived') || ""
  }), [searchParams]);

  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
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
    },
    {
      id: "isArchived",
      title: "Status Arsip",
      options: [
        { label: "Aktif", value: "" },
        { label: "Diarsipkan", value: "true" }
      ]
    }
  ], [storeCategoryLabels, overdueDays]);

  const handleSearchChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('search', value);
    else newParams.delete('search');
    
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  };

  const handleFilterChange = useCallback((groupId: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(groupId, value);
    else newParams.delete(groupId);
    
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams, { replace: true });
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      
      const response = await storeApi.getAll({
        search: debouncedSearch,
        status: filters.status,
        category: filters.category,
        visitStatus: filters.visitStatus,
        isArchived: filters.isArchived,
        sortBy: filters.sortBy,
        page: currentPage
      });
      
      if (response.success) {
        setStores(response.data);
      }
      
      setIsLoading(false);
    };

    fetchStores();
  }, [debouncedSearch, filters, currentPage]);

  // const displayStores = stores.slice(0, 6);

  return (
    <div className="flex flex-col">
      <div className="sticky top-[-16px] z-20 bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest/90 to-transparent -mx-4 px-4 pt-4 pb-8 -mb-4">
        <ActionToolbar
          className="mb-0"
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Cari toko mitra..."
          onAddClick={() => navigate("/stores/new")}
          onSettingClick={() => navigate("/settings?section=toko")}
          
          // Cukup passing 3 baris ini, Boom! Filter beres.
          filterGroups={storeFilterConfig}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      

      {isLoading ? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="animate-pulse text-text-secondary font-body text-body">Memuat data toko...</div>
        </div>
      ) : stores.length === 0? (
        <div className="flex justify-center py-xl bg-surface rounded-xl border border-border">
          <div className="text-text-secondary font-body text-body">Pencarian tidak menemukan toko.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1   gap-md">
          {stores.map((store, index) => {
            if (index >= LIMIT) { return }
            return <ItemCard key={store.id} store={store} storeCategoryLabels={storeCategoryLabels} />
          })}

        </div>
      )}

      
      {!isLoading && (
        <Pagination
        currentPage={currentPage}
        hasNextPage={stores.length > LIMIT}
        onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}