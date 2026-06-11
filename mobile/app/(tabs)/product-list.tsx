import { View, Text, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ActionToolbar } from '../../components/shared/action-toolbar';
import { ItemCard } from '../../components/shared/item-card';
import { useSettingsStore } from '../../api/settings.api';
import { useGetProducts } from '../../api/products.api';

export default function ProductsScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const categoryLabels = useSettingsStore(state => state.categoryLabels);
  const lowStockThreshold = useSettingsStore(state => state.lowStockThreshold);

  const { data: products = [], isLoading } = useGetProducts({
    search: searchValue,
    category: activeFilters.category,
    isArchived: activeFilters.isArchived,
    stock: activeFilters.stock,
    lowStockThreshold
  });

  const filterGroups = useMemo(() => [
    {
      id: "category",
      title: "Kategori Produk",
      options: [
        { label: "Semua", value: "" },
        ...Object.entries(categoryLabels).map(([key, label]) => ({
          label,
          value: key
        }))
      ]
    },
    {
      id: "stock",
      title: "Level Stok",
      options: [
        { label: "Semua", value: "" },
        { label: "0", value: "out_of_stock" },
        { label: `1-${lowStockThreshold}`, value: "low_stock" },
        { label: `>${lowStockThreshold}`, value: "in_stock" }
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
  ], [categoryLabels, lowStockThreshold]);

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
          onSettingClick={() => console.log('Setting clicked')}
        />
      </View>
      
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-2 pb-8">
          {isLoading ? (
            <Text className="text-center mt-8 font-body text-text-secondary">Memuat data produk...</Text>
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
    </View>
  );
}
