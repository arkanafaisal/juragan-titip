import { View, Text } from 'react-native';
import { useState } from 'react';
import { ActionToolbar } from '../../components/shared/action-toolbar';

export default function ProductsScreen() {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filterGroups = [
    {
      id: "category",
      title: "Kategori Produk",
      options: [
        { label: "Semua", value: "" },
        { label: "Makanan", value: "1" },
        { label: "Minuman", value: "2" },
      ]
    },
    {
      id: "stock",
      title: "Level Stock",
      options: [
        { label: "Semua", value: "" },
        { label: "Habis", value: "out_of_stock" },
        { label: "Tersedia", value: "in_stock" }
      ]
    }
  ];

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
    <View className="flex-1 bg-background px-4 pt-4">
      <ActionToolbar 
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterGroups={filterGroups}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onAddClick={() => console.log('Add clicked')}
        onSettingClick={() => console.log('Setting clicked')}
      />
      
      <View className="flex-1 items-center justify-center mt-4 border border-border rounded-xl bg-surface">
        <Text className="font-body text-text-secondary">Daftar produk akan tampil di sini</Text>
      </View>
    </View>
  );
}
