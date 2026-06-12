import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Package, Plus, Minus, ArrowRight } from 'lucide-react-native';
import THEME from '../../constants/css';
import { Card } from '../ui/card';

export interface OpnameItem {
  productId: number;
  productName: string;
  initialStock: number;
  sold: number;
  returned: number;
  remained: number;
  costPrice: number;
  wholesalePrice: number;
}

interface StepOpnameProps {
  opnameItems: OpnameItem[];
  handleOpnameChange: (productId: number, field: 'sold' | 'returned', value: number) => void;
  onNext: () => void;
}

export function StepOpname({ opnameItems, handleOpnameChange, onNext }: StepOpnameProps) {
  
  if (opnameItems.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Package size={48} color={THEME.colors['outline-variant']} className="mb-4" />
        <Text className="text-h3 font-bold text-text-primary mb-2 text-center">Tidak Ada Titipan Aktif</Text>
        <Text className="text-body text-text-secondary text-center mb-6">
          Toko ini tidak memiliki barang titipan yang harus dicek (Opname). Silakan langsung lanjut ke langkah Restock.
        </Text>
        <TouchableOpacity 
          onPress={onNext}
          className="w-full bg-primary py-3.5 rounded-xl flex-row items-center justify-center gap-2"
          activeOpacity={0.8}
        >
          <Text className="text-on-primary font-bold">Lanjutkan ke Restock</Text>
          <ArrowRight size={20} color={THEME.colors['on-primary']} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 flex-col pb-4">
      <View className="mb-4 px-4">
        <Text className="text-h3 font-bold text-text-primary mb-1">Cek Titipan Lama (Opname)</Text>
        <Text className="text-body-sm text-text-secondary">Berapa banyak barang yang laku dan yang harus ditarik/retur?</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-col gap-4 pb-24">
          {opnameItems.map((item) => (
            <Card key={item.productId} className="flex-col !p-0 overflow-hidden">
              <View className="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="font-bold text-text-primary text-body truncate">{item.productName}</Text>
                  <Text className="text-caption text-text-secondary mt-0.5">Sisa sebelumnya: <Text className="font-bold text-primary">{item.initialStock}</Text> pcs</Text>
                </View>
                <View className="bg-primary/10 px-2 py-1 rounded-md">
                  <Text className="text-primary font-bold text-caption">{item.remained} sisa</Text>
                </View>
              </View>

              <View className="p-4 flex-col gap-4">
                {/* LAKU */}
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-text-primary flex-1">Laku (Terjual)</Text>
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity 
                      onPress={() => handleOpnameChange(item.productId, 'sold', item.sold - 1)}
                      className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                      disabled={item.sold <= 0}
                    >
                      <Minus size={16} color={item.sold <= 0 ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                    </TouchableOpacity>
                    <TextInput 
                      value={String(item.sold)}
                      onChangeText={(val) => handleOpnameChange(item.productId, 'sold', parseInt(val) || 0)}
                      keyboardType="numeric"
                      className="w-12 text-center font-bold text-body text-text-primary border-b border-outline p-0"
                    />
                    <TouchableOpacity 
                      onPress={() => handleOpnameChange(item.productId, 'sold', item.sold + 1)}
                      className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                      disabled={item.sold + item.returned >= item.initialStock}
                    >
                      <Plus size={16} color={item.sold + item.returned >= item.initialStock ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* RETUR */}
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-text-primary flex-1">Ditarik (Retur)</Text>
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity 
                      onPress={() => handleOpnameChange(item.productId, 'returned', item.returned - 1)}
                      className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                      disabled={item.returned <= 0}
                    >
                      <Minus size={16} color={item.returned <= 0 ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                    </TouchableOpacity>
                    <TextInput 
                      value={String(item.returned)}
                      onChangeText={(val) => handleOpnameChange(item.productId, 'returned', parseInt(val) || 0)}
                      keyboardType="numeric"
                      className="w-12 text-center font-bold text-body text-text-primary border-b border-outline p-0"
                    />
                    <TouchableOpacity 
                      onPress={() => handleOpnameChange(item.productId, 'returned', item.returned + 1)}
                      className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                      disabled={item.sold + item.returned >= item.initialStock}
                    >
                      <Plus size={16} color={item.sold + item.returned >= item.initialStock ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 inset-x-0 p-4 bg-background border-t border-outline-variant">
        <TouchableOpacity 
          onPress={onNext}
          className="w-full bg-primary py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
          activeOpacity={0.8}
        >
          <Text className="text-on-primary font-bold">Lanjutkan ke Restock</Text>
          <ArrowRight size={20} color={THEME.colors['on-primary']} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
