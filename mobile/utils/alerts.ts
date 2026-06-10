import { Alert } from 'react-native';

/**
 * Memunculkan dialog konfirmasi standar sebelum pengguna keluar dari halaman form
 * yang memiliki data yang belum disimpan (dirty state).
 * 
 * @param onConfirm Callback yang dieksekusi jika pengguna menekan "Ya, Keluar"
 */
export function showLeaveConfirmation(onConfirm: () => void) {
  Alert.alert(
    "Batalkan Perubahan?",
    "Data yang sudah Anda isi akan hilang. Yakin ingin membatalkan?",
    [
      { text: "Tidak", style: "cancel" },
      { text: "Ya, Keluar", style: "destructive", onPress: onConfirm }
    ]
  );
}
