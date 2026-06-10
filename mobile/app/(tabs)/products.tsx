import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { ActionToolbar } from '../../components/shared/action-toolbar';
import { ItemCard } from '../../components/shared/item-card';
import type { Product } from '../../types';

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
          onAddClick={() => console.log('Add clicked')}
          onSettingClick={() => console.log('Setting clicked')}
        />
      </View>
      
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-2 pb-8">
          {sampleProducts.map(product => (
            <ItemCard 
              key={product.id} 
              product={product} 
              categoryLabels={{ "1": "Sembako", "2": "Minuman" }} 
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
