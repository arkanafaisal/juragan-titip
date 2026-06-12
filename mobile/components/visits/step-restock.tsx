import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native';
import { PackagePlus, Plus, Minus, ArrowRight, ArrowLeft, Trash2, Search, ChevronDown } from 'lucide-react-native';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import THEME from '../../constants/css';
import { Card } from '../ui/card';
import { BottomModal } from '../ui/bottom-modal';
import { VisitFormValues } from '../../schemas/visit.schema';

export interface ProductLight {
  id: number;
  name: string;
  costPrice: number;
  wholesalePrice: number;
  warehouseStock: number;
}

interface StepRestockProps {
  allProducts: ProductLight[];
  suggestedProducts: ProductLight[];
  onNext: () => void;
  onPrev: () => void;
  formatCurrency: (val: number) => string;
}

export function StepRestock({ 
  allProducts, 
  suggestedProducts, 
  onNext, 
  onPrev,
  formatCurrency
}: StepRestockProps) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { control, watch, setValue } = useFormContext<VisitFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'restockItems',
  });

  const currentRestockItems = watch('restockItems') || [];

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !currentRestockItems.some(ri => ri.productId === p.id)
  );

  const handleAddRestock = (product: ProductLight) => {
    if (currentRestockItems.some(i => i.productId === product.id)) return;
    
    append({
      productId: product.id, 
      productName: product.name, 
      quantity: 1, 
      costPrice: product.costPrice, 
      wholesalePrice: product.wholesalePrice, 
      _warehouseStock: product.warehouseStock 
    });
    
    setSearchQuery('');
    setIsModalOpen(false);
  };

  const handleRestockQuantity = (index: number, qty: number, maxStock: number) => {
    let finalQty = isNaN(qty) || qty < 0 ? 0 : qty;
    if (finalQty > maxStock) finalQty = maxStock;
    
    setValue(`restockItems.${index}.quantity`, finalQty, { shouldValidate: true });
  };

  const handleRemoveRestock = (productId: number) => {
    const index = currentRestockItems.findIndex(i => i.productId === productId);
    if (index !== -1) {
      remove(index);
    }
  };

  return (
    <View className="flex-1 flex-col pb-4">
      <View className="mb-4 px-4">
        <Text className="text-h3 font-bold text-text-primary mb-1">Titip Barang Baru (Restock)</Text>
        <Text className="text-body-sm text-text-secondary">Pilih barang dari gudang untuk dititipkan ke toko ini.</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        
        {/* REKOMENDASI RESTOCK DARI LAST VISIT */}
        {suggestedProducts.length > 0 && (
          <View className="mb-6">
            <Text className="font-bold text-text-primary mb-2 text-body-sm">Item terakhir:</Text>
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

        {/* SEARCH PRODUK DROPODOWN BUTTON */}
        <View className="mb-4">
          <TouchableOpacity 
            onPress={() => setIsModalOpen(true)}
            className="flex-row items-center justify-between bg-surface-container-low px-4 py-3 rounded-xl border border-outline-variant"
          >
            <View className="flex-row items-center">
              <Search size={20} color={THEME.colors['text-secondary']} />
              <Text className="ml-2 font-body text-body text-text-secondary">Pilih produk dari gudang...</Text>
            </View>
            <ChevronDown size={20} color={THEME.colors['text-secondary']} />
          </TouchableOpacity>
        </View>

        {/* SELECTED ITEMS */}
        <View className="flex-col gap-3 pb-24 z-0">
          {fields.map((fieldItem, index) => {
            const item = watch(`restockItems.${index}`);

            return (
              <Card key={fieldItem.id} className="flex-row items-center p-3 gap-3">
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

                  <View className="flex-col">
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity 
                        onPress={() => handleRestockQuantity(index, item.quantity - 1, item._warehouseStock)}
                        className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} color={item.quantity <= 1 ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                      </TouchableOpacity>
                      
                      <Controller
                        control={control}
                        name={`restockItems.${index}.quantity`}
                        render={({ field: { onChange, value } }) => (
                          <TextInput 
                            value={String(value)}
                            onChangeText={(val) => handleRestockQuantity(index, parseInt(val) || 0, item._warehouseStock)}
                            keyboardType="numeric"
                            className="w-10 text-center font-bold text-body text-text-primary border-b border-outline p-0 h-6"
                          />
                        )}
                      />
                      
                      <TouchableOpacity 
                        onPress={() => handleRestockQuantity(index, item.quantity + 1, item._warehouseStock)}
                        className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                        disabled={item.quantity >= item._warehouseStock}
                      >
                        <Plus size={14} color={item.quantity >= item._warehouseStock ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}

          {fields.length === 0 && (
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

      {/* SEARCH DROPDOWN MODAL */}
      <BottomModal visible={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setSearchQuery('');
      }}>
        <View className="h-[70vh]">
          <Text className="font-bold text-h3 text-text-primary mb-4">Pilih Produk</Text>
          
          <View className="flex-row items-center bg-surface-container-low px-3 py-2 rounded-xl border border-outline-variant mb-4">
            <Search size={20} color={THEME.colors['text-secondary']} />
            <TextInput 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari produk gudang..."
              className="flex-1 ml-2 font-body text-body text-text-primary p-0 h-10"
              autoFocus
            />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {filteredProducts.map(p => (
              <TouchableOpacity 
                key={p.id}
                onPress={() => {
                  Keyboard.dismiss();
                  handleAddRestock(p);
                }}
                disabled={p.warehouseStock === 0}
                className={`px-2 py-4 border-b border-outline-variant flex-row justify-between items-center ${p.warehouseStock === 0? "bg-error/10" : ""}`}
              >
                <View>
                  <Text className="font-bold text-text-primary text-body">{p.name}</Text>
                  <Text className="text-caption text-text-secondary mt-1">Stok Gudang: <Text className="font-bold">{p.warehouseStock}</Text></Text>
                </View>
                <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center">
                  <Plus size={18} color={THEME.colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
            {filteredProducts.length === 0 && (
              <View className="p-8 items-center">
                <PackagePlus size={32} color={THEME.colors['outline']} className="mb-2" />
                <Text className="text-text-secondary text-center">Tidak ada produk ditemukan</Text>
              </View>
            )}
            <View className="h-10" />
          </ScrollView>
        </View>
      </BottomModal>

    </View>
  );
}
