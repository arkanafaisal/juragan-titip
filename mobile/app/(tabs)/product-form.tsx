import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Archive, ChevronDown } from 'lucide-react-native';
import { useSettingsStore } from '../../api/settings';
import { Card } from '../../components/ui/card';
import { BottomModal } from '../../components/ui/bottom-modal';
import { showLeaveConfirmation } from '@/utils/alerts';
import { productFormSchema, ProductFormValues } from '../../schemas/product-form';

export default function ProductFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const categoryLabels = useSettingsStore(state => state.categoryLabels);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      category: '' as any, // initial empty state
      description: '',
      costPrice: 0,
      wholesalePrice: 0,
      retailPrice: undefined,
    }
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log("Form Submitted:", data);
    Alert.alert("Sukses", "Data valid! (Mode UI Only)");
    // router.back();
  };

  const handleArchive = () => {
    Alert.alert(
      "Arsipkan Produk",
      "Tindakan ini permanen. Histori barang ini di invoice sebelumnya tetap aman, namun Anda tidak bisa lagi menambahkannya ke kunjungan baru.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Arsipkan", style: "destructive", onPress: () => console.log("Archived") }
      ]
    );
  };

  const handleCancel = () => {
    showLeaveConfirmation(() => router.back());
  };

  useEffect(() => {
    const backAction = () => {
      handleCancel();
      return true; // prevent default physical back button behavior
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  const watchedCategory = watch('category');

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

          {/* INFORMASI DASAR */}
          <Card className="flex-col gap-3">
            <Text className="text-h3 font-bold text-text-primary mb-1">Informasi Dasar</Text>
            
            <View className="flex-col gap-1">
              <Text className="text-caption font-medium text-text-secondary">Nama Produk</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    className={`w-full bg-surface-variant border ${errors.name ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 font-body text-body text-text-primary`}
                    placeholder="kripik singkong (pedas)"
                    placeholderTextColor="#737686"
                  />
                )}
              />
              {errors.name && <Text className="text-[10px] font-bold text-error mt-0.5">{errors.name.message}</Text>}
            </View>

            <View className="flex-col gap-1 mt-1">
              <Text className="text-caption font-medium text-text-secondary">Kategori</Text>
              <TouchableOpacity
                onPress={() => setIsCategoryModalOpen(true)}
                className={`w-full flex-row items-center justify-between bg-surface-variant border ${errors.category ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2.5`}
                activeOpacity={0.7}
              >
                <Text className={`font-body text-body ${watchedCategory ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {watchedCategory ? categoryLabels[watchedCategory as keyof typeof categoryLabels] : 'Pilih Kategori...'}
                </Text>
                <ChevronDown size={18} color="#737686" />
              </TouchableOpacity>
              {errors.category && <Text className="text-[10px] font-bold text-error mt-0.5">{errors.category.message}</Text>}
            </View>

            <View className="flex-col gap-1 mt-1">
              <Text className="text-caption font-medium text-text-secondary">Deskripsi (Opsional)</Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={3}
                    className={`w-full bg-surface-variant border ${errors.description ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 font-body text-body text-text-primary min-h-[80px] text-top`}
                    placeholder="sedang | 100 gram"
                    placeholderTextColor="#737686"
                    style={{ textAlignVertical: 'top' }}
                  />
                )}
              />
              {errors.description && <Text className="text-[10px] font-bold text-error mt-0.5">{errors.description.message}</Text>}
            </View>
          </Card>

          {/* PENGATURAN HARGA */}
          <Card className="flex-col gap-3 mt-4">
            <Text className="text-h3 font-bold text-text-primary mb-1">Pengaturan Harga</Text>
            
            <View className="flex-col gap-1">
              <Text className="text-caption font-medium text-text-secondary">Harga Modal - Kulakan</Text>
              <Controller
                control={control}
                name="costPrice"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value ? String(value) : ''}
                    onChangeText={(val) => {
                      const numStr = val.replace(/[^0-9]/g, '');
                      onChange(numStr ? Number(numStr) : 0);
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    className={`w-full bg-surface-variant border ${errors.costPrice ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 font-body text-body text-text-primary`}
                    placeholder="1000"
                    placeholderTextColor="#737686"
                  />
                )}
              />
              {errors.costPrice && <Text className="text-[10px] font-bold text-error mt-0.5">{errors.costPrice.message}</Text>}
            </View>

            <View className="flex-col gap-1 mt-1">
              <Text className="text-caption font-medium text-text-secondary">Harga Jual - Grosir/Toko</Text>
              <Controller
                control={control}
                name="wholesalePrice"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value ? String(value) : ''}
                    onChangeText={(val) => {
                      const numStr = val.replace(/[^0-9]/g, '');
                      onChange(numStr ? Number(numStr) : 0);
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    className={`w-full bg-surface-variant border ${errors.wholesalePrice ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 font-body text-body text-text-primary`}
                    placeholder="1200"
                    placeholderTextColor="#737686"
                  />
                )}
              />
              {errors.wholesalePrice && <Text className="text-[10px] font-bold text-error mt-0.5">{errors.wholesalePrice.message}</Text>}
            </View>

            <View className="flex-col gap-1 mt-1">
              <Text className="text-caption font-medium text-text-secondary">Harga Eceran - Ke Konsumen (opsional)</Text>
              <Controller
                control={control}
                name="retailPrice"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value ? String(value) : ''}
                    onChangeText={(val) => {
                      const numStr = val.replace(/[^0-9]/g, '');
                      onChange(numStr ? Number(numStr) : undefined);
                    }}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    className={`w-full bg-surface-variant border ${errors.retailPrice ? 'border-error' : 'border-outline-variant'} rounded-lg px-3 py-2 font-body text-body text-text-primary`}
                    placeholder="1500"
                    placeholderTextColor="#737686"
                  />
                )}
              />
              {errors.retailPrice && <Text className="text-[10px] font-bold text-error mt-0.5">{errors.retailPrice.message}</Text>}
            </View>
          </Card>

          {/* BUTTONS ACTION */}
          <View className="flex-col gap-3 mt-6 pb-8">
            <TouchableOpacity 
              onPress={handleSubmit(onSubmit)}
              className="w-full py-3.5 bg-primary rounded-xl flex-row items-center justify-center gap-2"
              activeOpacity={0.8}
            >
              <Save size={20} color="#ffffff" />
              <Text className="text-on-primary font-bold">{id ? "SIMPAN PERUBAHAN" : "TAMBAH PRODUK"}</Text>
            </TouchableOpacity>

            {id && (
              <TouchableOpacity 
                onPress={handleArchive}
                className="w-full py-3.5 bg-error rounded-xl flex-row items-center justify-center gap-2"
                activeOpacity={0.8}
              >
                <Archive size={20} color="#ffffff" />
                <Text className="text-on-error font-bold">ARSIPKAN PRODUK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* SELECT CATEGORY MODAL */}
      <BottomModal 
        visible={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)}
      >
        <View className="flex-col gap-4 pb-4">
          <Text className="text-h3 font-bold text-text-primary text-center">Pilih Kategori</Text>
          <View className="flex-col gap-2 mt-2">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setValue('category', key as ProductFormValues['category'], { shouldValidate: true });
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
    </View>
  );
}
