import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Download, Upload, Trash2, Database, AlertTriangle, Loader2, Package, Store, ChevronDown, ChevronUp, RefreshCw, Save } from 'lucide-react-native';
import { ConfirmModal, InputConfirmModal, BaseModal } from '../../components/ui/modal';
import { 
  useExportDatabase, 
  useImportDatabase, 
  useResetDatabase, 
  useCheckDatabaseHasData,
  useSettingsStore
} from '../../api/settings.api';
import THEME from '../../constants/css';
import Toast from 'react-native-toast-message';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsSchema, SettingsFormData } from '../../schemas/settings.schema';
import { Card } from '../../components/ui/card';

function Accordion({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <Card className="flex-col !p-0 overflow-hidden mb-4 border border-outline-variant">
      <TouchableOpacity 
        onPress={() => setIsOpen(!isOpen)}
        className="w-full flex-row justify-between items-center p-4 bg-surface-container-low"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center gap-2">
          <Icon size={20} color={THEME.colors.primary} />
          <Text className="font-h3 text-h3 font-bold text-text-primary">{title}</Text>
        </View>
        {isOpen ? <ChevronUp size={20} color={THEME.colors['text-secondary']} /> : <ChevronDown size={20} color={THEME.colors['text-secondary']} />}
      </TouchableOpacity>
      {isOpen && (
        <View className="p-4 border-t border-outline-variant bg-surface">
          {children}
        </View>
      )}
    </Card>
  );
}

export default function SettingsScreen() {
  const { data: hasData } = useCheckDatabaseHasData();
  
  const { mutate: exportDb, isPending: isExporting } = useExportDatabase();
  const { mutate: importDb, isPending: isImporting } = useImportDatabase();
  const { mutate: resetDb, isPending: isResetting } = useResetDatabase();

  const settingsStore = useSettingsStore();

  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetSettingsModalVisible, setResetSettingsModalVisible] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');

  // Initialize React Hook Form
  const { control, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      lowStockThreshold: settingsStore.lowStockThreshold,
      storeOverdueDays: settingsStore.storeOverdueDays,
      categoryLabels: settingsStore.categoryLabels,
      storeCategoryLabels: settingsStore.storeCategoryLabels,
    }
  });

  const onSubmit = (data: SettingsFormData) => {
    settingsStore.setLowStockThreshold(data.lowStockThreshold);
    settingsStore.setStoreOverdueDays(data.storeOverdueDays);
    settingsStore.setCategoryLabels(data.categoryLabels);
    settingsStore.setStoreCategoryLabels(data.storeCategoryLabels);
    Toast.show({ type: 'success', text1: 'Pengaturan berhasil disimpan' });
  };

  const handleResetSettings = () => {
    settingsStore.resetSettings();
    const freshStore = useSettingsStore.getState();
    reset({
      lowStockThreshold: freshStore.lowStockThreshold,
      storeOverdueDays: freshStore.storeOverdueDays,
      categoryLabels: freshStore.categoryLabels,
      storeCategoryLabels: freshStore.storeCategoryLabels,
    });
    setResetSettingsModalVisible(false);
    Toast.show({ type: 'success', text1: 'Pengaturan dikembalikan ke bawaan pabrik' });
  };

  const handleExport = () => {
    exportDb(setExportProgress, {
      onSuccess: () => {
        setExportModalVisible(false);
        setExportProgress('');
        Toast.show({ type: 'success', text1: 'Export Berhasil' });
      },
      onError: (err) => {
        setExportModalVisible(false);
        setExportProgress('');
        Toast.show({ type: 'error', text1: 'Export Gagal', text2: err.message });
      }
    });
  };

  const handleImport = () => {
    importDb(undefined, {
      onSuccess: (didImport) => {
        setImportModalVisible(false);
        if (didImport) {
          Toast.show({ type: 'success', text1: 'Import Berhasil', text2: 'Data telah dipulihkan' });
        }
      },
      onError: (err) => {
        setImportModalVisible(false);
        Toast.show({ type: 'error', text1: 'Import Gagal', text2: err.message });
      }
    });
  };

  const handleReset = () => {
    resetDb(undefined, {
      onSuccess: () => {
        setResetModalVisible(false);
        Toast.show({ type: 'success', text1: 'Reset Berhasil', text2: 'Semua data telah dihapus' });
      },
      onError: (err) => {
        setResetModalVisible(false);
        Toast.show({ type: 'error', text1: 'Reset Gagal', text2: err.message });
      }
    });
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-h2 font-bold text-text-primary mb-2">Pengaturan Umum</Text>
          <Text className="text-body text-text-secondary">
            Atur preferensi aplikasi Anda, mulai dari label kategori kustom hingga batas peringatan stok dan kunjungan.
          </Text>
        </View>

        <Accordion title="Pengaturan Produk" icon={Package}>
          <View className="mb-4">
            <Text className="font-body-sm font-medium text-text-secondary mb-1.5">Batas Peringatan Stok Menipis</Text>
            <Controller
              control={control}
              name="lowStockThreshold"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  keyboardType="numeric"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(val) => onChange(val === '' ? '' : parseInt(val, 10))}
                  className={`w-full px-3 py-3 bg-surface border rounded-xl font-body text-text-primary focus:border-primary ${errors.lowStockThreshold ? 'border-error' : 'border-outline'}`}
                />
              )}
            />
            {errors.lowStockThreshold && (
              <Text className="text-error text-caption mt-1">{errors.lowStockThreshold.message}</Text>
            )}
            <Text className="text-caption text-text-secondary mt-1">Produk dengan stok di bawah angka ini akan ditandai kritis.</Text>
          </View>
          <View className="pt-2 border-t border-outline-variant">
            <Text className="font-body-sm font-bold text-text-primary mb-3 mt-2">Label Kategori Produk (1 - 5)</Text>
            <View className="flex-col gap-3">
              {(['1', '2', '3', '4', '5'] as const).map((num) => (
                <View key={num} className="flex-col gap-1">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-surface-container-low px-3 py-3 rounded-lg border border-outline-variant items-center justify-center w-12">
                      <Text className="font-mono text-text-secondary font-bold">{num}</Text>
                    </View>
                    <Controller
                      control={control}
                      name={`categoryLabels.${num}`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder={`Kategori ${num}`}
                          className={`flex-1 px-3 py-2 bg-surface border rounded-xl font-body text-text-primary ${errors.categoryLabels?.[num] ? 'border-error' : 'border-outline'}`}
                        />
                      )}
                    />
                  </View>
                  {errors.categoryLabels?.[num] && (
                    <Text className="text-error text-caption ml-15">{errors.categoryLabels[num]?.message}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </Accordion>

        <Accordion title="Pengaturan Toko" icon={Store}>
          <View className="mb-4">
            <Text className="font-body-sm font-medium text-text-secondary mb-1.5">Batas Hari Belum Dikunjungi</Text>
            <Controller
              control={control}
              name="storeOverdueDays"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  keyboardType="numeric"
                  value={value !== undefined ? String(value) : ''}
                  onChangeText={(val) => onChange(val === '' ? '' : parseInt(val, 10))}
                  className={`w-full px-3 py-3 bg-surface border rounded-xl font-body text-text-primary focus:border-primary ${errors.storeOverdueDays ? 'border-error' : 'border-outline'}`}
                />
              )}
            />
            {errors.storeOverdueDays && (
              <Text className="text-error text-caption mt-1">{errors.storeOverdueDays.message}</Text>
            )}
            <Text className="text-caption text-text-secondary mt-1">Toko yang belum dikunjungi lebih dari angka ini bisa difilter di Daftar Toko.</Text>
          </View>
          <View className="pt-2 border-t border-outline-variant">
            <Text className="font-body-sm font-bold text-text-primary mb-3 mt-2">Label Kategori Toko (1 - 5)</Text>
            <View className="flex-col gap-3">
              {(['1', '2', '3', '4', '5'] as const).map((num) => (
                <View key={num} className="flex-col gap-1">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-surface-container-low px-3 py-3 rounded-lg border border-outline-variant items-center justify-center w-12">
                      <Text className="font-mono text-text-secondary font-bold">{num}</Text>
                    </View>
                    <Controller
                      control={control}
                      name={`storeCategoryLabels.${num}`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder={`Kategori Toko ${num}`}
                          className={`flex-1 px-3 py-2 bg-surface border rounded-xl font-body text-text-primary ${errors.storeCategoryLabels?.[num] ? 'border-error' : 'border-outline'}`}
                        />
                      )}
                    />
                  </View>
                  {errors.storeCategoryLabels?.[num] && (
                    <Text className="text-error text-caption ml-15">{errors.storeCategoryLabels[num]?.message}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </Accordion>

        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)}
          className="w-full bg-success py-3.5 rounded-xl flex-row items-center justify-center gap-2 shadow-sm mb-4"
          activeOpacity={0.8}
        >
          <Save size={20} color={THEME.colors['on-success']} />
          <Text className="text-on-success font-bold">Simpan Pengaturan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setResetSettingsModalVisible(true)}
          className="w-full bg-warning border border-outline-variant py-3.5 rounded-xl flex-row items-center justify-center gap-2 mb-8"
          activeOpacity={0.7}
        >
          <RefreshCw size={20} color={THEME.colors['on-warning']} />
          <Text className="font-bold text-on-warning">Kembalikan ke Bawaan</Text>
        </TouchableOpacity>

        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Database size={20} color={THEME.colors['text-secondary']} />
            <Text className="text-h3 font-bold text-text-primary">Manajemen Data</Text>
          </View>
          <Text className="text-body text-text-secondary">
            Cadangkan data Anda secara berkala untuk menghindari kehilangan informasi stok.
          </Text>
        </View>

        <View className="flex-col gap-4 pb-12">
          <TouchableOpacity 
            onPress={() => setExportModalVisible(true)}
            disabled={isExporting}
            className="bg-primary p-4 rounded-2xl flex-row items-center border border-outline-variant"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 bg-on-primary rounded-full items-center justify-center mr-4">
              {isExporting ? <Loader2 size={24} color={THEME.colors.primary} /> : <Upload size={24} color={THEME.colors.primary} />}
            </View>
            <View className="flex-1">
              <Text className="text-h4 font-bold text-on-primary">Export Database</Text>
              <Text className="text-caption text-on-primary mt-1">Simpan data ke file Excel</Text>
            </View>
          </TouchableOpacity>

          {/* IMPORT BUTTON */}
          <TouchableOpacity 
            onPress={() => setImportModalVisible(true)}
            disabled={isImporting}
            className="bg-success p-4 rounded-2xl flex-row items-center border border-outline-variant"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 bg-on-primary rounded-full items-center justify-center mr-4">
              {isImporting ? <Loader2 size={24} color={THEME.colors.success} /> : <Download size={24} color={THEME.colors.success} />}
            </View>
            <View className="flex-1">
              <Text className="text-h4 font-bold text-on-success">Import / Pulihkan</Text>
              <Text className="text-caption text-on-success mt-1">Kembalikan data dari file backup</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setResetModalVisible(true)}
            disabled={isResetting}
            className="bg-error p-4 rounded-2xl flex-row items-center border border-error/20"
            activeOpacity={0.7}
          >
            <View className="w-12 h-12 bg-on-error rounded-full items-center justify-center mr-4">
              {isResetting ? <Loader2 size={24} color={THEME.colors.error} /> : <Trash2 size={24} color={THEME.colors.error} />}
            </View>
            <View className="flex-1">
              <Text className="text-h4 font-bold text-on-error">Hapus Semua Data</Text>
              <Text className="text-caption text-on-error mt-1">Reset aplikasi ke kondisi awal pabrik</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODALS */}
      <BaseModal visible={exportModalVisible} onClose={isExporting ? undefined : () => setExportModalVisible(false)}>
        <Text className="text-h2 font-bold text-on-primary text-center">Export Database</Text>
        <Text className="text-body text-on-primary text-center mt-2">
          {isExporting ? (exportProgress || 'Menyiapkan backup...') : 'Simpan seluruh data stok dan riwayat ke dalam file Excel yang bisa disimpan atau dibagikan.'}
        </Text>
        
        <View className="flex-row gap-3 mt-6">
          {!isExporting && (
            <TouchableOpacity 
              onPress={() => setExportModalVisible(false)} 
              className="flex-1 py-3 rounded-xl items-center justify-center bg-success"
              activeOpacity={0.8}
            >
              <Text className="text-on-success text-h3 font-bold">Batal</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={handleExport} 
            disabled={isExporting}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${isExporting ? 'bg-outline-variant' : 'bg-error'}`}
            activeOpacity={0.8}
          >
            {isExporting && <Loader2 size={16} color={THEME.colors['on-error']} />}
            <Text className="text-on-error text-h3 font-bold">{isExporting ? 'Proses...' : 'Expor'}</Text>
          </TouchableOpacity>
        </View>
      </BaseModal>

      {hasData ? (
        <InputConfirmModal
          visible={importModalVisible}
          title="Peringatan Timpa Data!"
          message="Aplikasi mendeteksi adanya data. Jika Anda memulihkan data dari file Excel, maka SEMUA data yang ada di aplikasi saat ini akan DIHAPUS dan digantikan sepenuhnya oleh data dari file backup."
          expectedInput="timpa data"
          onCancel={() => setImportModalVisible(false)}
          onConfirm={handleImport}
          confirmText="Timpa Data"
          isLoading={isImporting}
        />
      ) : (
        <ConfirmModal
          visible={importModalVisible}
          title="Import Database"
          message="Pilih file backup (.xlsx) untuk memulihkan data Anda."
          onCancel={() => setImportModalVisible(false)}
          onConfirm={handleImport}
          confirmText="Pilih File"
          isLoading={isImporting}
        />
      )}

      <InputConfirmModal
        visible={resetModalVisible}
        title="Bahaya: Reset Database!"
        message="Aksi ini akan menghapus permanen SELURUH data produk dan riwayat. Anda tidak bisa membatalkan aksi ini kecuali Anda sudah memiliki file export."
        expectedInput="reset data"
        onCancel={() => setResetModalVisible(false)}
        onConfirm={handleReset}
        confirmText="Reset data"
        isLoading={isResetting}
      />

      <ConfirmModal
        visible={resetSettingsModalVisible}
        title="Kembalikan Pengaturan"
        message="Apakah Anda yakin ingin mengembalikan semua preferensi dan pengaturan ke nilai bawaan pabrik?"
        onCancel={() => setResetSettingsModalVisible(false)}
        onConfirm={handleResetSettings}
        confirmText="Kembalikan"
      />
    </View>
  );
}
