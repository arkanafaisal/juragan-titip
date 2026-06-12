import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Save, MapPin } from 'lucide-react-native';

import THEME from '../../constants/css';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { InfoModal, ConfirmModal } from '../../components/ui/modal';
import { BottomModal } from '@/components/ui/bottom-modal';
import { MapPicker } from '../../components/shared/map-picker';

import { storeFormSchema, StoreFormValues } from '../../schemas/store-form.schema';
import { useAddStore, useUpdateStore, useGetStoreById } from '../../api/stores.api';
import { useSettingsStore } from '../../api/settings.api';

export default function StoreFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const storeId = id ? Number(id) : undefined;
  const isEdit = !!storeId;
  
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{visible: boolean; title: string; message: string; onContinue?: () => void; buttonText?: string}>({ visible: false, title: '', message: '' });

  const storeCategoryLabels = useSettingsStore(state => state.storeCategoryLabels);
  
  const addStore = useAddStore();
  const updateStore = useUpdateStore();
  const { data: storeData, isLoading: isLoadingStore } = useGetStoreById(storeId);

  const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: '',
      ownerName: '',
      phone: '',
      address: '',
      category: '' as any,
      notes: '',
      latitude: 0,
      longitude: 0,
    }
  });

  const watchedCategory = watch('category');

  const showError = (title: string, message: string, onContinue?: () => void, buttonText?: string) => {
    setErrorInfo({ visible: true, title, message, onContinue, buttonText });
  };

  const handleCancel = () => {
    setIsLeaveModalOpen(true);
  };

  useFocusEffect(
    useCallback(() => {
      // Hardware back press handler
      const backAction = () => {
        handleCancel();
        return true;
      };
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

      // Cleanup & Reset form on leave/enter
      return () => {
        backHandler.remove();
        if (!isEdit) {
          reset({
            name: '',
            ownerName: '',
            phone: '',
            address: '',
            category: '' as any,
            notes: '',
            latitude: 0,
            longitude: 0,
          });
        }
      };
    }, [reset, isEdit])
  );

  useEffect(() => {
    if (isEdit && storeData?.store) {
      const s = storeData.store;
      reset({
        name: s.name,
        ownerName: s.ownerName,
        phone: s.phone || '',
        address: s.address,
        category: s.category as any,
        notes: s.notes || '',
        latitude: s.latitude,
        longitude: s.longitude,
      });
    }
  }, [storeData, isEdit, reset]);

  const onSubmit = (data: StoreFormValues) => {
    if (isEdit && storeId) {
      updateStore.mutate({ id: storeId, data }, {
        onSuccess: () => {
          router.back();
        },
        onError: (err) => showError('Gagal Memperbarui', err.message)
      });
    } else {
      addStore.mutate(data, {
        onSuccess: () => {
          router.back();
        },
        onError: (err) => showError('Gagal Menyimpan', err.message)
      });
    }
  };

  if (isEdit && isLoadingStore) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-4">
          
          <View className="mb-2 flex-row items-center">
            <TouchableOpacity 
              onPress={handleCancel}
              className="flex-row items-center justify-center px-4 py-2 bg-error rounded-xl shadow-sm active:opacity-80"
              activeOpacity={0.7}
            >
              <Text className="text-body-sm font-medium text-on-error">Batal</Text>
            </TouchableOpacity>
          </View>

          <Card className="flex-col gap-3">
            <Text className="text-h3 font-bold text-text-primary mb-1">Informasi Toko</Text>
            
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Nama Toko"
                  error={errors.name?.message}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Contoh: Toko Makmur Jaya"
                />
              )}
            />

            <Controller
              control={control}
              name="ownerName"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Nama Pemilik"
                  error={errors.ownerName?.message}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Contoh: Bpk. Budi"
                  containerClassName="mt-1"
                />
              )}
            />

            <View className="flex-col gap-1 mt-1">
              <Text className="text-caption font-medium text-text-secondary">Kategori</Text>
              <TouchableOpacity
                onPress={() => setIsCategoryModalOpen(true)}
                className={`w-full flex-row items-center justify-between bg-surface-variant border ${errors.category ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2.5`}
                activeOpacity={0.7}
              >
                <Text className={`font-body text-body ${watchedCategory ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {watchedCategory ? storeCategoryLabels[watchedCategory as keyof typeof storeCategoryLabels] : 'Pilih Rute...'}
                </Text>
                <ChevronDown size={THEME.iconSize['md']} color={THEME.colors['on-surface-variant']} />
              </TouchableOpacity>
              {errors.category && <Text className="text-[10px] font-bold text-error mt-0.5">{errors.category.message}</Text>}
            </View>

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Nomor WhatsApp (Opsional)"
                  error={errors.phone?.message}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="phone-pad"
                  placeholder="Contoh: 081234567890"
                  containerClassName="mt-1"
                />
              )}
            />
          </Card>

          <Card className="flex-col gap-3 mt-4">
            <Text className="text-h3 font-bold text-text-primary mb-1">Lokasi & Catatan</Text>

            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Alamat"
                  error={errors.address?.message}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={2}
                  className="min-h-[60px] text-top"
                  placeholder="Contoh: Jl. Merdeka No. 123"
                  style={{ textAlignVertical: 'top' }}
                />
              )}
            />

            <View className="mt-1 flex-col gap-3">
              <MapPicker 
                key={isEdit ? (isLoadingStore ? 'loading' : `loaded-${storeId}`) : 'new'}
                initialLatitude={isEdit && storeData?.store ? storeData.store.latitude : (watchedCategory ? -6.200000 : undefined)} 
                initialLongitude={isEdit && storeData?.store ? storeData.store.longitude : (watchedCategory ? 106.816666 : undefined)} 
                onLocationChange={(lat, lng) => {
                  setValue('latitude', lat, { shouldValidate: true, shouldDirty: true });
                  setValue('longitude', lng, { shouldValidate: true, shouldDirty: true });
                }}
              />

              <View className="flex-row items-start gap-4">
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="latitude"
                    render={({ field: { value } }) => (
                      <Input
                        label="Latitude"
                        error={errors.latitude?.message}
                        value={String(value)}
                        onChangeText={() => {}}
                        editable={false}
                        className="bg-surface-variant text-text-secondary"
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="longitude"
                    render={({ field: { value } }) => (
                      <Input
                        label="Longitude"
                        error={errors.longitude?.message}
                        value={String(value)}
                        onChangeText={() => {}}
                        editable={false}
                        className="bg-surface-variant text-text-secondary"
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Catatan Khusus (Opsional)"
                  error={errors.notes?.message}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={2}
                  className="min-h-[60px] text-top"
                  placeholder="Contoh: Toko tutup setiap jumat kliwon"
                  style={{ textAlignVertical: 'top' }}
                  containerClassName="mt-1"
                />
              )}
            />
          </Card>

          <View className="flex-col gap-3 mt-6 pb-8">
            <TouchableOpacity 
              onPress={handleSubmit(onSubmit)}
              disabled={addStore.isPending || updateStore.isPending}
              className={`w-full py-3.5 rounded-xl flex-row items-center justify-center gap-2 ${(addStore.isPending || updateStore.isPending) ? 'bg-primary/70' : 'bg-primary'}`}
              activeOpacity={0.8}
            >
              <Save size={THEME.iconSize['md']} color={THEME.colors['on-primary']} />
              <Text className="text-on-primary font-bold">
                {(addStore.isPending || updateStore.isPending) ? "MENYIMPAN..." : (isEdit ? "SIMPAN PERUBAHAN" : "TAMBAH TOKO")}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      <BottomModal 
        visible={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)}
      >
        <View className="flex-col gap-4 pb-4">
          <Text className="text-h3 font-bold text-text-primary text-center">Pilih Rute / Kategori</Text>
          <View className="flex-col gap-2 mt-2">
            {Object.entries(storeCategoryLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setValue('category', key as StoreFormValues['category'], { shouldValidate: true });
                  setIsCategoryModalOpen(false);
                }}
                className={`py-3 px-4 rounded-xl border ${
                  watchedCategory === key ? 'bg-primary/10 border-primary' : 'bg-surface border-outline-variant'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-body text-center font-medium ${
                  watchedCategory === key ? 'text-primary' : 'text-text-primary'
                }`}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BottomModal>

      <ConfirmModal
        visible={isLeaveModalOpen}
        title="Keluar dari Form?"
        message="Data toko yang belum disimpan akan hilang. Yakin ingin keluar?"
        cancelText="Batal"
        confirmText="Keluar"
        onCancel={() => setIsLeaveModalOpen(false)}
        onConfirm={() => {
          setIsLeaveModalOpen(false);
          router.back();
        }}
      />

      <InfoModal
        visible={errorInfo.visible}
        title={errorInfo.title}
        message={errorInfo.message}
        buttonText={errorInfo.buttonText}
        onContinue={errorInfo.onContinue}
        onClose={() => setErrorInfo({ ...errorInfo, visible: false })}
      />
    </View>
  );
}
