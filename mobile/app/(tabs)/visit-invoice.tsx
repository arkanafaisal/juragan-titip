import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle, Printer, Store, Receipt } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import THEME from '../../constants/css';
import { useGetVisitById } from '../../api/visits.api';
import { BackButton } from '../../components/shared/back-button';
import { formatDate, formatRupiah } from '../../utils/formatter.util';
import { sendVisitReceiptWA } from '../../utils/whatsapp.util';
import { ZigZagEdge } from '../../components/shared/zigzag-edge';
import { useSettingsStore } from '../../api/settings.api';
import { InfoModal } from '../../components/ui/modal';

export default function VisitInvoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const visitId = parseInt(params.id as string) || 0;

  const { data: visit, isLoading, isError } = useGetVisitById(visitId);

  const profile = useSettingsStore(state => state.profile);
  const [isProfileModalVisible, setIsProfileModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (!profile.name) {
      setIsProfileModalVisible(true);
    }
  }, [profile.name]);

  const BUSINESS_NAME = profile.name || "NAMA USAHA ANDA"; 
  const currentUserPhone = profile.phone || "";

  // Keajaiban Matematika
  const subtotalLaku = useMemo(() => {
    if (!visit) return 0;
    return visit.items.reduce((sum: number, item: any) => sum + (item.sold * item.wholesalePrice), 0);
  }, [visit]);

  const totalTagihan = useMemo(() => {
    if (!visit) return 0;
    return visit.amountPaid + visit.currentDebt;
  }, [visit]);

  const piutangLama = useMemo(() => {
    if (!visit) return 0;
    return totalTagihan - subtotalLaku;
  }, [visit, totalTagihan, subtotalLaku]);

  const isLunas = visit?.currentDebt === 0;

  const handlePrint = () => {
    Toast.show({
      type: 'info',
      text1: 'Fitur Belum Tersedia',
      text2: 'Fungsi cetak printer bluetooth akan hadir di versi mendatang.'
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  if (isError || !visit) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Text className="text-h3 font-bold text-text-primary text-center">Gagal Memuat Nota</Text>
        <Text className="text-body text-text-secondary text-center mt-2 mb-4">Nota yang Anda cari tidak ditemukan atau telah dihapus.</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="px-6 py-3 bg-primary rounded-xl"
        >
          <Text className="text-on-primary font-bold">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-variant px-4">
      <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* HEADER KONTROL (Di luar nota, ikut scroll) */}
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <BackButton />
          {/* Fitur cetak di-hide sementara sampai siap diimplementasikan */}
          <TouchableOpacity 
            onPress={handlePrint}
            className="hidden px-4 py-2 bg-primary rounded-xl flex-row items-center gap-2 active:opacity-80"
          >
            <Printer size={THEME.iconSize.sm} color={THEME.colors['on-primary']} />
            <Text className="text-on-primary font-bold text-body-sm">Cetak</Text>
          </TouchableOpacity>
        </View>

        {/* KERTAS STRUK (Dibungkus ZigZag) */}
        <View className="w-full max-w-[484px] mx-auto flex-col mb-4 shadow-xl elevation-xl rounded-sm">
          
          <ZigZagEdge color="#ffffff" position="top" />

          {/* ISI NOTA */}
          <View className="bg-white px-6 py-4">
            {/* KOP NOTA */}
            <View className="items-center mb-6">
              <View className="w-12 h-12 bg-primary/10 rounded-full mb-3 items-center justify-center">
                <Receipt size={THEME.iconSize.lg} color={THEME.colors.primary} />
              </View>
              <Text className="text-h2 font-bold text-text-primary uppercase tracking-wider text-center">{BUSINESS_NAME}</Text>
              <Text className="text-caption text-text-secondary mt-1 text-center">Nota Kunjungan Konsinyasi</Text>
            </View>

            {/* INFO NOTA */}
            <View className="flex-row justify-between border-y-2 border-dashed border-outline-variant py-3 mb-6">
              <View>
                <Text className="text-text-secondary font-body-sm">No. Nota:</Text>
                <Text className="font-bold text-text-primary mt-0.5">#{visit.id}</Text>
              </View>
              <View className="items-end">
                <Text className="text-text-secondary font-body-sm">Tanggal:</Text>
                <Text className="font-medium text-text-primary mt-0.5">{formatDate(visit.createdAt)}</Text>
              </View>
            </View>

            <View className="mb-6 flex-row items-start gap-2">
              <Store size={THEME.iconSize.md} color={THEME.colors['text-secondary']} className="mt-0.5" />
              <View>
                <Text className="font-body-sm text-text-secondary">Kepada Yth:</Text>
                <Text className="font-body font-bold text-text-primary">{visit.storeName}</Text>
              </View>
            </View>

            {/* BARANG LAKU */}
            <View className="mb-6">
              <Text className="font-body-sm font-bold text-text-primary border-b border-outline-variant pb-2 mb-3">Rincian Barang Laku</Text>
              <View className="flex-col gap-3">
                {visit.items.filter((i: any) => i.sold > 0).map((item: any) => (
                  <View key={item.productId} className="flex-row justify-between">
                    <View>
                      <Text className="font-medium text-text-primary text-body-sm">{item.productName}</Text>
                      <Text className="text-text-secondary text-body-sm">{item.sold} x {formatRupiah(item.wholesalePrice)}</Text>
                    </View>
                    <Text className="font-medium text-text-primary">{formatRupiah(item.sold * item.wholesalePrice)}</Text>
                  </View>
                ))}
                {visit.items.filter((i: any) => i.sold > 0).length === 0 && (
                  <Text className="text-text-secondary font-body-sm italic">Tidak ada barang laku kunjungan ini.</Text>
                )}
              </View>
            </View>

            {/* RINGKASAN KEUANGAN */}
            <View className="border-t-2 border-dashed border-outline-variant pt-4 mb-6 flex-col gap-2">
              <View className="flex-row justify-between">
                <Text className="font-body-sm text-text-secondary">Subtotal Laku:</Text>
                <Text className="font-body-sm text-text-secondary">{formatRupiah(subtotalLaku)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-body-sm text-text-secondary">Hutang Lama:</Text>
                <Text className="font-body-sm text-text-secondary">{formatRupiah(piutangLama)}</Text>
              </View>
              
              <View className="flex-row justify-between pt-2">
                <Text className="font-body font-bold text-text-primary">TOTAL TAGIHAN:</Text>
                <Text className="font-body font-bold text-text-primary">{formatRupiah(totalTagihan)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-body text-text-primary">Dibayar (Tunai):</Text>
                <Text className="font-body text-text-primary">{formatRupiah(visit.amountPaid)}</Text>
              </View>

              <View className={`flex-row justify-between pt-3 pb-1 border-t border-outline-variant mt-2`}>
                <Text className={`font-h3 font-bold ${isLunas ? 'text-success' : 'text-error'}`}>{isLunas ? 'LUNAS' : 'SISA HUTANG:'}</Text>
                <Text className={`font-h3 font-bold ${isLunas ? 'text-success' : 'text-error'}`}>{formatRupiah(visit.currentDebt)}</Text>
              </View>
            </View>

            {/* SISA STOK DI TOKO */}
            <View className="bg-surface-container-low p-4 rounded-xl">
              <Text className="font-body-sm font-bold text-text-primary mb-2">📦 Sisa Stok Aktif (Di Toko)</Text>
              <View className="flex-col gap-1">
                {visit.items.filter((i: any) => i.remained > 0).map((item: any) => (
                  <View key={item.productId} className="flex-row justify-between">
                    <Text className="text-text-secondary text-caption">{item.productName}</Text>
                    <Text className="font-medium text-text-primary text-caption">{item.remained} pcs</Text>
                  </View>
                ))}
                {visit.items.filter((i: any) => i.remained > 0).length === 0 && (
                  <Text className="text-text-secondary text-caption italic">Tidak ada stok dititipkan.</Text>
                )}
              </View>
            </View>
          </View>
          <ZigZagEdge color="#ffffff" position="bottom" />
        </View>

        {/* FOOTER ACTION (Di luar nota) */}
        <View className="w-full max-w-[484px] mx-auto flex-col gap-3 pb-12 pt-2">
          
          {!visit.storePhone && (
            <Text className="font-caption text-error text-center px-2">
              * Nomor WhatsApp toko belum diatur.
            </Text>
          )}

          <TouchableOpacity 
            onPress={() => sendVisitReceiptWA({
              visit,
              businessName: BUSINESS_NAME,
              subtotalLaku,
              totalTagihan,
              piutangLama,
              isLunas
            })}
            className="w-full bg-primary py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm active:opacity-80"
          >
            <MessageCircle size={THEME.iconSize.md} color={THEME.colors['on-primary']} />
            <Text className="text-on-primary font-body font-bold">Kirim Nota ke Toko</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              if (!currentUserPhone) {
                Toast.show({
                  type: 'error',
                  text1: 'Pengaturan Belum Lengkap',
                  text2: 'Nomor WhatsApp Anda belum diatur di profil.'
                });
                return;
              }
              sendVisitReceiptWA({
                visit,
                businessName: BUSINESS_NAME,
                subtotalLaku,
                totalTagihan,
                piutangLama,
                isLunas,
                targetPhone: currentUserPhone
              });
            }}
            className="w-full bg-surface-variant border border-outline-variant py-2.5 rounded-xl flex-row items-center justify-center active:opacity-80"
          >
            <Text className="text-text-primary font-body-sm font-bold">Kirim Salinan ke Nomor Saya</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <InfoModal
        visible={isProfileModalVisible}
        title="Profil Usaha Belum Diatur"
        message="Mohon atur profil usaha (Nama & No WhatsApp) melalui menu profil di pojok kanan atas layar agar informasi ini bisa tampil di kop surat struk Anda."
        onClose={() => setIsProfileModalVisible(false)}
      />
    </View>
  );
}
