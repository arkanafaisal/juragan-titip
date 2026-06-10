import { View, Text, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { ActionToolbar } from '../../components/shared/action-toolbar';
import { ItemCard } from '../../components/shared/item-card';
import { useSettingsStore } from '../../api/settings';
import type { Product } from '../../types';

export default function ProductsScreen() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const categoryLabels = useSettingsStore(state => state.categoryLabels);
  const lowStockThreshold = useSettingsStore(state => state.lowStockThreshold);

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
  ], [categoryLabels]);

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

  const sampleProducts: Product[] = [
    {
      id: 1,
      name: "Beras Maknyus 5kg",
      normalizedName: "beras maknyus 5kg",
      category: "1",
      costPrice: 60000,
      wholesalePrice: 62000,
      retailPrice: null,
      warehouseStock: 50,
      returnedStock: 0,
      description: "Beras kualitas premium",
      isArchived: false,
      createdAt: null,
    },
    {
      id: 2,
      name: "Minyak Goreng Sunco 2L",
      normalizedName: "minyak goreng sunco 2l",
      category: "2",
      costPrice: 32000,
      wholesalePrice: 34000,
      retailPrice: null,
      warehouseStock: 0,
      returnedStock: 2,
      description: "Minyak goreng kemasan pouch",
      isArchived: false,
      createdAt: null,
    },
    {
      id: 3,
      name: "Minyak Goreng Sunco 2L",
      normalizedName: "minyak goreng sunco 2l",
      category: "2",
      costPrice: 32000,
      wholesalePrice: 34000,
      retailPrice: null,
      warehouseStock: 0,
      returnedStock: 2,
      description: "Minyak goreng kemasan pouch",
      isArchived: false,
      createdAt: null,
    },
    {
      id: 4,
      name: "Minyak Goreng Sunco 2L",
      normalizedName: "minyak goreng sunco 2l",
      category: "2",
      costPrice: 32000,
      wholesalePrice: 34000,
      retailPrice: null,
      warehouseStock: 0,
      returnedStock: 2,
      description: "Minyak goreng kemasan pouch",
      isArchived: false,
      createdAt: null,
    },
    {
      id: 5,
      name: "Minyak Goreng Sunco 2L",
      normalizedName: "minyak goreng sunco 2l",
      category: "2",
      costPrice: 32000,
      wholesalePrice: 34000,
      retailPrice: null,
      warehouseStock: 0,
      returnedStock: 2,
      description: "Minyak goreng kemasan pouch",
      isArchived: false,
      createdAt: null,
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4 z-10 bg-background">
        <ActionToolbar 
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onAddClick={() => router.push('/product-form')}
          onSettingClick={() => console.log('Setting clicked')}
        />
      </View>
      
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-2 pb-8">
          {sampleProducts.map(product => (
            <ItemCard 
              key={product.id} 
              product={product} 
              categoryLabels={categoryLabels} 
              lowStockThreshold={lowStockThreshold}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
