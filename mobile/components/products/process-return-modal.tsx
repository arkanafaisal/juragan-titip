import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { RefreshCw, Trash2, Scale, Loader2 } from 'lucide-react-native';
import { BottomModal } from '../ui/bottom-modal';
import { InfoModal } from '../ui/modal';
import { Input } from '../ui/input';
import { useProcessReturn } from '../../api/products.api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { processReturnSchema, ProcessReturnPayload } from '../../schemas/product-form.schema';
import THEME from '../../constants/css';

interface ProcessReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnedStock: number;
  productId?: string | number;
}

export function ProcessReturnModal({ isOpen, onClose, returnedStock, productId }: ProcessReturnModalProps) {
  const { mutate: processReturn, isPending: isSaving } = useProcessReturn();
  const [errorInfo, setErrorInfo] = useState<{visible: boolean; title: string; message: string}>({ visible: false, title: '', message: '' });

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ProcessReturnPayload>({
    resolver: zodResolver(processReturnSchema),
    defaultValues: {
      id: productId ? Number(productId) : 0,
      resaleQty: undefined as any,
      wasteQty: undefined as any,
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({ id: productId ? Number(productId) : 0, resaleQty: undefined as any, wasteQty: undefined as any });
    }
  }, [isOpen, productId, reset]);

  const onSubmit = (data: ProcessReturnPayload) => {
    const rQty = data.resaleQty || 0;
    const wQty = data.wasteQty || 0;
    
    if (rQty + wQty > returnedStock) {
      setErrorInfo({ visible: true, title: 'Error Validasi', message: 'Total melebihi jumlah retur yang ada' });
      return;
    }

    processReturn(
      { id: data.id, resaleQty: rQty, wasteQty: wQty },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => setErrorInfo({ visible: true, title: 'Gagal Mengolah Retur', message: err.message })
      }
    );
  };

  return (
    <>
      <BottomModal visible={isOpen} onClose={onClose}>
      <Text className="text-h3 font-bold text-text-primary mb-1">Sortir Barang Retur</Text>
      <Text className="text-body-sm text-text-secondary mb-5">
        Belum Diolah: <Text className="font-bold text-error">{returnedStock} Pcs</Text>
      </Text>
      
      <View className="space-y-4 mb-6">
        <View className="p-4 rounded-2xl border border-success bg-[#f0fdf4]">
          <View className="flex-row items-center gap-1.5 mb-2">
            <RefreshCw size={THEME.iconSize['sm']} color={THEME.colors['success']} />
            <Text className="font-body-sm font-bold text-success">SIAP JUAL LAGI?</Text>
          </View>
          <Controller
            control={control}
            name="resaleQty"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input
                value={value !== undefined ? String(value) : ''}
                onChangeText={(val) => {
                  const num = Number(val);
                  onChange(val? Number(val) : undefined);
                }}
                onBlur={onBlur}
                keyboardType="numeric"
                placeholder="0"
                className="text-success font-bold"
                containerClassName="mb-0"
                error={errors.resaleQty?.message}
              />
            )}
          />
        </View>
        
        <View className="p-4 rounded-2xl border border-error bg-[#fef2f2]">
          <View className="flex-row items-center gap-1.5 mb-2">
            <Trash2 size={THEME.iconSize['sm']} color={THEME.colors['error']} />
            <Text className="font-body-sm font-bold text-error">BASI / RUSAK (Dibuang)?</Text>
          </View>
          <Controller
            control={control}
            name="wasteQty"
            render={({ field: { onChange, value, onBlur } }) => (
              <Input
                value={value !== undefined ? String(value) : ''}
                onChangeText={(val) => {
                  const num = Number(val);
                  onChange(val === '' || isNaN(num) ? undefined : num);
                }}
                onBlur={onBlur}
                keyboardType="numeric"
                placeholder="0"
                className="text-error font-bold"
                containerClassName="mb-0"
                error={errors.wasteQty?.message}
              />
            )}
          />
        </View>
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
          className={`flex-[2] py-3 px-4 rounded-xl flex-row items-center justify-center gap-2 ${isSaving ? 'opacity-50' : ''} bg-warning`}
          activeOpacity={0.8}
        >
          {isSaving ? <Loader2 size={THEME.iconSize['md']} color={THEME.colors['on-warning']} /> : <Scale size={THEME.iconSize['md']} color={THEME.colors['on-warning']} />}
          <Text className="font-bold text-on-warning">
            {isSaving ? "MEMPROSES..." : "SELESAI OLAH"}
          </Text>
        </TouchableOpacity>
      </View>
      </BottomModal>
      <InfoModal
        visible={errorInfo.visible}
        title={errorInfo.title}
        message={errorInfo.message}
        onClose={() => setErrorInfo({ ...errorInfo, visible: false })}
      />
    </>
  );
}
