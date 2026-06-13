import { View, Text, ScrollView } from 'react-native';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActionToolbar } from '../../components/shared/action-toolbar';
import { ItemCard } from '../../components/shared/item-card';
import { useSettingsStore } from '../../api/settings.api';
import { useGetProducts } from '../../api/products.api';
import { InfoModal } from '../../components/ui/modal';
import { getProductFilterGroups } from '../../utils/filter-configs';

export default function ProductsScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const categoryLabels = useSettingsStore(state => state.categoryLabels);
  const lowStockThreshold = useSettingsStore(state => state.lowStockThreshold);

  const [errorInfo, setErrorInfo] = useState<{visible: boolean; title: string; message: string; onContinue?: () => void; buttonText?: string}>({ visible: false, title: '', message: '' });

  const { data: products = [], isLoading, isError, error } = useGetProducts({
    search: searchValue,
    category: activeFilters.category,
    isArchived: activeFilters.isArchived,
    stock: activeFilters.stock,
    lowStockThreshold
  });

  useEffect(() => {
    if (isError && error) {
      setErrorInfo({ visible: true, title: 'Gagal Memuat Produk', message: (error as Error).message, buttonText: 'Tutup' });
    }
  }, [isError, error]);

  const filterGroups = useMemo(() => getProductFilterGroups(categoryLabels, lowStockThreshold), [categoryLabels, lowStockThreshold]);

  const handleFilterChange = (groupId: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value === "") {
        delete newFilters[groupId];
      } else {
        newFilters[groupId] = value;
      }
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
          onAddClick={() => router.push('/product-form')}
          onSettingClick={() => router.push('/settings' as any)}
        />
      </View>
      
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-2 pb-8">
          {isLoading ? (
            <Text className="text-center mt-8 font-body text-text-secondary">Memuat data produk...</Text>
          ) : isError ? (
            <Text className="text-center mt-8 font-body font-bold text-error">Gagal memuat daftar produk.</Text>
          ) : products.length === 0 ? (
            <Text className="text-center mt-8 font-body text-text-secondary">
              {searchValue || Object.keys(activeFilters).length > 0 ? "Tidak ada produk yang sesuai dengan filter." : "Belum ada produk. Tambahkan produk pertama Anda!"}
            </Text>
          ) : (
            products.map(product => (
              <ItemCard 
                key={product.id} 
                product={product} 
                categoryLabels={categoryLabels} 
                lowStockThreshold={lowStockThreshold}
              />
            ))
          )}
        </View>
      </ScrollView>

      <InfoModal
        visible={errorInfo.visible}
        title={errorInfo.title}
        message={errorInfo.message}
        buttonText={errorInfo.buttonText}
        onContinue={errorInfo.onContinue}
        onClose={() => setErrorInfo({ ...errorInfo, visible: false })}
      />
    </View>
  );
}
