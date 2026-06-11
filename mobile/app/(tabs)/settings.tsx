import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Download, Upload, Trash2, Database, AlertTriangle, Loader2 } from 'lucide-react-native';
import { ConfirmModal, InputConfirmModal } from '../../components/ui/modal';
import { 
  useExportDatabase, 
  useImportDatabase, 
  useResetDatabase, 
  useCheckDatabaseHasData 
} from '../../api/settings.api';
import THEME from '../../constants/css';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
  const { data: hasData } = useCheckDatabaseHasData();
  
  const { mutate: exportDb, isPending: isExporting } = useExportDatabase();
  const { mutate: importDb, isPending: isImporting } = useImportDatabase();
  const { mutate: resetDb, isPending: isResetting } = useResetDatabase();

  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const handleExport = () => {
    exportDb(undefined, {
      onSuccess: () => {
        setExportModalVisible(false);
        Toast.show({ type: 'success', text1: 'Export Berhasil' });
      },
      onError: (err) => {
        setExportModalVisible(false);
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
        <View className="mb-8">
          <Text className="text-h3 font-bold text-text-primary mb-2">Manajemen Data</Text>
          <Text className="text-body text-text-secondary">
            Cadangkan data Anda secara berkala untuk menghindari kehilangan informasi stok.
          </Text>
        </View>

        <View className="flex-col gap-4">
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
              <Text className="text-caption text-on-primary mt-1">Simpan data ke file JSON</Text>
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
      <ConfirmModal
        visible={exportModalVisible}
        title="Export Database"
        message="Simpan seluruh data stok dan riwayat ke dalam file JSON yang bisa disimpan atau dibagikan."
        onCancel={() => setExportModalVisible(false)}
        onConfirm={handleExport}
        confirmText="Expor"
      />

      {hasData ? (
        <InputConfirmModal
          visible={importModalVisible}
          title="Peringatan Timpa Data!"
          message="Aplikasi mendeteksi adanya data. Jika Anda memulihkan data dari file, maka SEMUA data yang ada di aplikasi saat ini akan DIHAPUS dan digantikan sepenuhnya oleh data dari file backup."
          expectedInput="timpa data"
          onCancel={() => setImportModalVisible(false)}
          onConfirm={handleImport}
          confirmText="Timpa Data"
        />
      ) : (
        <ConfirmModal
          visible={importModalVisible}
          title="Import Database"
          message="Pilih file backup (.json) untuk memulihkan data Anda."
          onCancel={() => setImportModalVisible(false)}
          onConfirm={handleImport}
          confirmText="Pilih File"
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
      />
    </View>
  );
}
