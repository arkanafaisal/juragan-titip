import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { PackagePlus, Loader2 } from 'lucide-react-native';
import { BottomModal } from '../ui/bottom-modal';
import { Input } from '../ui/input';
import { useAddStock } from '../../api/products.api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addStockSchema, AddStockPayload } from '../../schemas/product-form.schema';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string | number;
}

export function AddStockModal({ isOpen, onClose, productId }: AddStockModalProps) {
  const { mutate: addStock, isPending: isSaving } = useAddStock();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<AddStockPayload>({
    resolver: zodResolver(addStockSchema),
    defaultValues: {
      id: productId ? Number(productId) : 0,
      addedStock: undefined as any,
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({ id: productId ? Number(productId) : 0, addedStock: undefined as any });
    }
  }, [isOpen, productId, reset]);

  const onSubmit = (data: AddStockPayload) => {
    addStock(data, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <BottomModal visible={isOpen} onClose={onClose}>
      <Text className="text-h3 font-bold text-text-primary mb-1">Tambah Stok</Text>
      <Text className="text-body-sm text-text-secondary mb-5">
        Masukkan jumlah barang baru dari pabrik/agen.
      </Text>
      
      <View className="mb-6">
        <Controller
          control={control}
          name="addedStock"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              value={value ? String(value) : ''}
              onChangeText={(val) => {
                onChange(val ? Number(val) : 0);
              }}
              onBlur={onBlur}
              keyboardType="numeric"
              placeholder="0"
              className="text-center font-bold text-[24px]"
              error={errors.addedStock?.message}
            />
          )}
        />
      </View>

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity 
          onPress={onClose} 
          disabled={isSaving}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center ${isSaving ? 'opacity-50' : ''} bg-error`}
          activeOpacity={0.8}
        >
          <Text className="font-bold text-on-error">Batal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)} 
          disabled={isSaving}
          className={`flex-[2] py-3 px-4 rounded-xl flex-row items-center justify-center gap-2 ${isSaving ? 'opacity-50' : ''} bg-primary`}
          activeOpacity={0.8}
        >
          {isSaving ? <Loader2 size={20} color="#ffffff" /> : <PackagePlus size={20} color="#ffffff" />}
          <Text className="font-bold text-on-primary">
            {isSaving ? "MEMPROSES..." : "SIMPAN STOK"}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomModal>
  );
}
