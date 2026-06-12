import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Package, Plus, Minus, ArrowRight } from 'lucide-react-native';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import THEME from '../../constants/css';
import { Card } from '../ui/card';
import { VisitFormValues } from '../../schemas/visit.schema';

interface StepOpnameProps {
  onNext: () => void;
}

export function StepOpname({ onNext }: StepOpnameProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext<VisitFormValues>();
  const { fields } = useFieldArray({
    control,
    name: 'opnameItems',
  });

  const opnameErrors = errors.opnameItems as any;

  if (fields.length === 0) {
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

  const handleValueChange = (index: number, field: 'sold' | 'returned', newValue: number, initialStock: number) => {
    const currentSold = watch(`opnameItems.${index}.sold`);
    const currentReturned = watch(`opnameItems.${index}.returned`);
    
    let finalSold = field === 'sold' ? newValue : currentSold;
    let finalReturned = field === 'returned' ? newValue : currentReturned;

    // Cegah melebihi stok awal
    if (finalSold + finalReturned > initialStock) {
      if (field === 'sold') finalSold = initialStock - finalReturned;
      else finalReturned = initialStock - finalSold;
    }

    setValue(`opnameItems.${index}.sold`, finalSold, { shouldValidate: true });
    setValue(`opnameItems.${index}.returned`, finalReturned, { shouldValidate: true });
    setValue(`opnameItems.${index}.remained`, initialStock - finalSold - finalReturned, { shouldValidate: true });
  };

  return (
    <View className="flex-1 flex-col pb-4">
      <View className="mb-4 px-4">
        <Text className="text-h3 font-bold text-text-primary mb-1">Cek Titipan Lama (Opname)</Text>
        <Text className="text-body-sm text-text-secondary">Berapa banyak barang yang laku dan yang harus ditarik/retur?</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-col gap-4 pb-24">
          {fields.map((fieldItem, index) => {
            const item = watch(`opnameItems.${index}`);

            return (
              <Card key={fieldItem.id} className="flex-col !p-0 overflow-hidden">
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
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-medium text-text-primary flex-1">Laku (Terjual)</Text>
                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity 
                          onPress={() => handleValueChange(index, 'sold', item.sold - 1, item.initialStock)}
                          className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                          disabled={item.sold <= 0}
                        >
                          <Minus size={16} color={item.sold <= 0 ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                        </TouchableOpacity>
                        
                        <Controller
                          control={control}
                          name={`opnameItems.${index}.sold`}
                          render={({ field: { onChange, value } }) => (
                            <TextInput 
                              value={String(value)}
                              onChangeText={(val) => handleValueChange(index, 'sold', parseInt(val) || 0, item.initialStock)}
                              keyboardType="numeric"
                              className="w-12 text-center font-bold text-body text-text-primary border-b border-outline p-0"
                            />
                          )}
                        />

                        <TouchableOpacity 
                          onPress={() => handleValueChange(index, 'sold', item.sold + 1, item.initialStock)}
                          className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                          disabled={item.sold + item.returned >= item.initialStock}
                        >
                          <Plus size={16} color={item.sold + item.returned >= item.initialStock ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* RETUR */}
                  <View className="flex-col">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-medium text-text-primary flex-1">Ditarik (Retur)</Text>
                      <View className="flex-row items-center gap-3">
                        <TouchableOpacity 
                          onPress={() => handleValueChange(index, 'returned', item.returned - 1, item.initialStock)}
                          className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                          disabled={item.returned <= 0}
                        >
                          <Minus size={16} color={item.returned <= 0 ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                        </TouchableOpacity>

                        <Controller
                          control={control}
                          name={`opnameItems.${index}.returned`}
                          render={({ field: { onChange, value } }) => (
                            <TextInput 
                              value={String(value)}
                              onChangeText={(val) => handleValueChange(index, 'returned', parseInt(val) || 0, item.initialStock)}
                              keyboardType="numeric"
                              className="w-12 text-center font-bold text-body text-text-primary border-b border-outline p-0"
                            />
                          )}
                        />

                        <TouchableOpacity 
                          onPress={() => handleValueChange(index, 'returned', item.returned + 1, item.initialStock)}
                          className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant"
                          disabled={item.sold + item.returned >= item.initialStock}
                        >
                          <Plus size={16} color={item.sold + item.returned >= item.initialStock ? THEME.colors['outline'] : THEME.colors['text-primary']} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
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
