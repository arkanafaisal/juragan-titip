import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { PackagePlus, Plus, Minus, ArrowRight, ArrowLeft, Trash2, Search } from 'lucide-react-native';
import THEME from '../../constants/css';
import { Card } from '../ui/card';

export interface RestockItem {
  productId: number;
  productName: string;
  quantity: number;
  costPrice: number;
  wholesalePrice: number;
  _warehouseStock: number;
}

export interface ProductLight {
  id: number;
  name: string;
  costPrice: number;
  wholesalePrice: number;
  warehouseStock: number;
}

interface StepRestockProps {
  allProducts: ProductLight[];
  restockItems: RestockItem[];
  suggestedProducts: { id: number; name: string }[];
  handleAddRestock: (product: { id: number; name: string }) => void;
  handleRestockQuantity: (productId: number, qty: number) => void;
  handleRemoveRestock: (productId: number) => void;
  onNext: () => void;
  onPrev: () => void;
  formatCurrency: (val: number) => string;
}

export function StepRestock({ 
  allProducts, 
  restockItems, 
  suggestedProducts, 
  handleAddRestock, 
  handleRestockQuantity, 
  handleRemoveRestock, 
  onNext, 
  onPrev,
  formatCurrency
}: StepRestockProps) {
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !restockItems.some(ri => ri.productId === p.id)
  );

  return (
    <View className="flex-1 flex-col pb-4">
      <View className="mb-4 px-4">
        <Text className="text-h3 font-bold text-text-primary mb-1">Titip Barang Baru (Restock)</Text>
        <Text className="text-body-sm text-text-secondary">Pilih barang dari gudang untuk dititipkan ke toko ini.</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        
        {/* REKOMENDASI RESTOCK */}
        {suggestedProducts.length > 0 && (
          <View className="mb-6">
            <Text className="font-bold text-text-primary mb-2 text-body-sm">Rekomendasi (Stok Titipan Habis):</Text>
            <View className="flex-row flex-wrap gap-2">
              {suggestedProducts.map(p => (
                <TouchableOpacity 
                  key={p.id}
                  onPress={() => handleAddRestock(p)}
                  className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full flex-row items-center gap-1"
                >
                  <Plus size={14} color={THEME.colors.primary} />
                  <Text className="text-primary font-medium text-caption">{p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* SEARCH PRODUK */}
        <View className="mb-4">
          <View className="flex-row items-center bg-surface-container-low px-3 py-2 rounded-xl border border-outline-variant">
            <Search size={20} color={THEME.colors['text-secondary']} />
            <TextInput 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari produk gudang..."
              className="flex-1 ml-2 font-body text-body text-text-primary p-0 h-8"
            />
          </View>
          
          {/* SEARCH RESULTS */}
          {searchQuery.length > 0 && (
            <View className="bg-surface border border-outline-variant rounded-xl mt-1 max-h-48 overflow-hidden absolute top-12 left-0 right-0 z-50 shadow-lg">
              <ScrollView nestedScrollEnabled>
                {filteredProducts.map(p => (
                  <TouchableOpacity 
                    key={p.id}
                    onPress={() => {
                      handleAddRestock(p);
                      setSearchQuery('');
                    }}
                    className="px-4 py-3 border-b border-outline-variant flex-row justify-between items-center"
                  >
                    <View>
                      <Text className="font-bold text-text-primary">{p.name}</Text>
                      <Text className="text-caption text-text-secondary">Stok Gudang: {p.warehouseStock}</Text>
                    </View>
                    <Plus size={20} color={THEME.colors.primary} />
                  </TouchableOpacity>
                ))}
                {filteredProducts.length === 0 && (
                  <View className="p-4 items-center">
                    <Text className="text-text-secondary">Tidak ada produk ditemukan</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* SELECTED ITEMS */}
        <View className="flex-col gap-3 pb-24 z-0">
          {restockItems.map(item => (
            <Card key={item.productId} className="flex-row items-center p-3 gap-3">
              <View className="flex-1">
                <Text className="font-bold text-text-primary text-body truncate">{item.productName}</Text>
                <Text className="text-caption text-text-secondary mt-0.5">Maks Gudang: <Text className="font-bold">{item._warehouseStock}</Text></Text>
                <Text className="text-primary font-bold text-caption mt-1">{formatCurrency(item.wholesalePrice)} /pcs</Text>
              </View>

              <View className="flex-col items-end gap-2">
                <TouchableOpacity 
                  onPress={() => handleRemoveRestock(item.productId)}
                  className="p-1"
                >
                  <Trash2 size={16} color={THEME.colors.error} />
                </TouchableOpacity>

                <View className="flex-row items-center gap-2">
                  <TouchableOpacity 
                    onPress={() => handleRestockQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} color={item.quantity <= 1 ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                  </TouchableOpacity>
                  
                  <TextInput 
                    value={String(item.quantity)}
                    onChangeText={(val) => handleRestockQuantity(item.productId, parseInt(val) || 0)}
                    keyboardType="numeric"
                    className="w-10 text-center font-bold text-body text-text-primary border-b border-outline p-0 h-6"
                  />
                  
                  <TouchableOpacity 
                    onPress={() => handleRestockQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                    disabled={item.quantity >= item._warehouseStock}
                  >
                    <Plus size={14} color={item.quantity >= item._warehouseStock ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}

          {restockItems.length === 0 && (
            <View className="items-center justify-center py-10 opacity-50">
              <PackagePlus size={48} color={THEME.colors['text-secondary']} className="mb-3" />
              <Text className="font-bold text-text-secondary">Belum ada barang dipilih</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FIXED FOOTER */}
      <View className="absolute bottom-0 inset-x-0 p-4 bg-background border-t border-outline-variant flex-row gap-3">
        <TouchableOpacity 
          onPress={onPrev}
          className="flex-1 bg-surface-container-low py-3.5 rounded-xl flex-row items-center justify-center gap-2 border border-outline-variant"
        >
          <ArrowLeft size={20} color={THEME.colors['text-primary']} />
          <Text className="text-text-primary font-bold">Kembali</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onNext}
          className="flex-1 bg-primary py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
          activeOpacity={0.8}
        >
          <Text className="text-on-primary font-bold">Lanjut</Text>
          <ArrowRight size={20} color={THEME.colors['on-primary']} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
