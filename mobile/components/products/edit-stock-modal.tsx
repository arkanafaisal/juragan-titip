import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Loader2 } from 'lucide-react-native';
import { BottomModal } from '../ui/bottom-modal';
import { Input } from '../ui/input';
import { useEditStock } from '../../api/products.api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editStockSchema, EditStockPayload } from '../../schemas/product-form.schema';

interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStock: number;
  productId: number;
}

export function EditStockModal({ isOpen, onClose, currentStock, productId }: EditStockModalProps) {
  const { mutate: editStock, isPending: isSubmitting } = useEditStock();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<EditStockPayload>({
    resolver: zodResolver(editStockSchema),
    defaultValues: {
      id: productId ? Number(productId) : 0,
      newStock: currentStock,
      reason: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({ id: productId ? Number(productId) : 0, newStock: currentStock, reason: '' });
    }
  }, [isOpen, productId, currentStock, reset]);

  const onSubmit = (data: EditStockPayload) => {
    editStock(data, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <BottomModal visible={isOpen} onClose={onClose}>
      <Text className="text-h3 font-bold text-text-primary mb-1">Koreksi Stok Utama</Text>
      <Text className="text-body-sm text-text-secondary mb-5">
        Tercatat di aplikasi: <Text className="font-bold text-primary">{currentStock} Pcs</Text>
      </Text>
      
      <View className="space-y-4 mb-6">
        <Controller
          control={control}
          name="newStock"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              label="Jumlah stok di gudang saat ini?"
              value={value !== undefined ? String(value) : ''}
              onChangeText={(val) => {
                const number = Number(val)
                onChange(isNaN(number)? 0 : number);
              }}
              onBlur={onBlur}
              keyboardType="numeric"
              placeholder={currentStock.toString()}
              containerClassName="mb-4"
              error={errors.newStock?.message}
            />
          )}
        />
        
        <Controller
          control={control}
          name="reason"
          render={({ field: { onChange, value, onBlur } }) => (
            <Input
              label="Alasan (Opsional)"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Misal: Salah ketik, Barang hilang"
              error={errors.reason?.message}
            />
          )}
        />
      </View>

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity 
          onPress={onClose} 
          disabled={isSubmitting}
          className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center ${isSubmitting ? 'opacity-50' : ''} bg-error`}
          activeOpacity={0.8}
        >
          <Text className="font-bold text-on-error">Batal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)} 
          disabled={isSubmitting}
          className={`flex-[2] py-3 px-4 rounded-xl flex-row items-center justify-center gap-2 ${isSubmitting ? 'opacity-50' : ''} bg-primary`}
          activeOpacity={0.8}
        >
          {isSubmitting && <Loader2 size={20} color="#ffffff" />}
          <Text className="font-bold text-on-primary">
            {isSubmitting ? "MEMPROSES..." : "SESUAIKAN STOK"}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomModal>
  );
}
