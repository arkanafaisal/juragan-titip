import { View, Text, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ActionToolbar } from '../../components/shared/action-toolbar';
import { ItemCard } from '../../components/shared/item-card';
import { useGetStores } from '../../api/stores.api';
import { useSettingsStore } from '../../api/settings.api';
import { InfoModal } from '../../components/ui/modal';

export default function StoresScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [errorInfo, setErrorInfo] = useState<{visible: boolean; title: string; message: string}>({ visible: false, title: '', message: '' });

  const storeCategoryLabels = useSettingsStore(state => state.storeCategoryLabels);
  
  const overdueDays = useSettingsStore(state => state.storeOverdueDays);

  const filters = useMemo(() => ({
    search: searchValue || undefined,
    category: activeFilters.category || undefined,
    status: activeFilters.status || undefined,
    visitStatus: activeFilters.visitStatus || undefined,
    sortBy: activeFilters.sortBy || undefined,
    isArchived: activeFilters.isArchived || undefined,
    overdueDays
  }), [searchValue, activeFilters, overdueDays]);

  const { data: stores = [], isLoading, isError, error } = useGetStores(filters);

  if (isError && !errorInfo.visible && error) {
    setErrorInfo({
      visible: true,
      title: 'Gagal Memuat Data',
      message: error.message
    });
  }

  const filterGroups = useMemo(() => {
    return [
      {
        id: "category",
        title: "Kategori Toko",
        options: [
          { label: "Semua", value: "" },
          ...Object.entries(storeCategoryLabels).map(([key, label]) => ({
            label,
            value: key
          }))
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
          { label: "Default (A-Z)", value: "" },
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
    ];
  }, [storeCategoryLabels, overdueDays]);

  const handleFilterChange = (groupId: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value === "") delete newFilters[groupId];
      else newFilters[groupId] = value;
      return newFilters;
    });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4 z-10 bg-background">
        <ActionToolbar 
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onResetFilters={() => setActiveFilters({})}
          onAddClick={() => router.push('/store-form' as any)}
          onSettingClick={() => console.log('Store Setting clicked')}
        />
      </View>
      
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-2 pb-8">
          {isLoading ? (
            <Text className="text-center mt-8 font-body text-text-secondary">Memuat data toko...</Text>
          ) : isError ? (
            <Text className="text-center mt-8 font-body font-bold text-error">Gagal memuat daftar toko.</Text>
          ) : stores.length === 0 ? (
            <Text className="text-center mt-8 font-body text-text-secondary">
              {searchValue || Object.keys(activeFilters).length > 0 ? "Tidak ada toko yang sesuai dengan filter." : "Belum ada toko. Tambahkan toko pertama Anda!"}
            </Text>
          ) : (
            stores.map(store => (
              <ItemCard 
                key={store.id} 
                store={store as any} 
                storeCategoryLabels={storeCategoryLabels} 
              />
            ))
          )}
        </View>
      </ScrollView>

      <InfoModal
        visible={errorInfo.visible}
        title={errorInfo.title}
        message={errorInfo.message}
        onClose={() => setErrorInfo({ ...errorInfo, visible: false })}
      />
    </View>
  );
}
