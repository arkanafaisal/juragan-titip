import { View, Text, TouchableOpacity } from 'react-native';
import { usePathname, useGlobalSearchParams } from 'expo-router';
import { User } from 'lucide-react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import THEME from '../../constants/css'

export function Header() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const insets = useSafeAreaInsets();

  const getDynamicTitle = (pathname: string) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return "Dashboard";

    const section = parts[0];
    const actionOrId = parts[1];
    const subAction = parts[2];

    const sectionMap: Record<string, string> = {
      "product-list": "Produk",
      "store-list": "Toko",
      finance: "Keuangan",
      reports: "Laporan",
      settings: "Pengaturan"
    };

    const subject = sectionMap[section] || section;

    if (section === "dashboard") return "Dashboard";
    if (section === "finance") return "Keuangan";
    if (section === "product-form") return params.id ? "Edit Produk" : "Tambah Produk";
    if (section === "product-detail") return "Detail Produk";
    if (section === "store-form") return params.id ? "Edit Toko" : "Tambah Toko";
    if (section === "store-detail") return "Detail Toko";
    if (section === "store-visit") return "Kunjungan Toko";
    if (section === "reports") {
      if (actionOrId === "stores") return "Performa Toko";
      if (actionOrId === "tracking") return "Lacak Barang";
      if (actionOrId === "financial") return "Laporan Keuangan";
      return "Laporan";
    }
    if (section === "settings") {
      if (actionOrId === "profile") return "Profil";
      if (actionOrId === "preferences") return "Preferensi";
      return "Pengaturan";
    }

    if (!actionOrId) return `Daftar ${subject}`;
    if (actionOrId === "new") return `Tambah ${subject}`;
    if (!subAction) return `Detail ${subject}`;
    if (subAction === "edit") return `Edit Data ${subject}`;
    if (subAction === "visit" && section === "stores") return "Kunjungan Toko";

    return "JuraganTitip";
  };

  const dynamicTitle = getDynamicTitle(pathname);

  return (
    <View 
      className="bg-primary shadow-sm flex-row justify-between items-center w-full px-md shrink-0 z-30"
      style={{ 
        paddingTop: insets.top,
        height: 64 + insets.top
      }}
    >
      <View className="flex-row items-center gap-sm min-w-0 pr-2">
        <Text className="text-h1 font-bold text-on-primary tracking-tight" numberOfLines={1}>
          {dynamicTitle}
        </Text>
      </View>

      <View className="flex-row items-center gap-sm shrink-0">
        <View className="relative ml-1 flex-row items-center">
          <TouchableOpacity 
            className="w-9 h-9 rounded-full bg-surface flex items-center justify-center"
            activeOpacity={0.7}
          >
            <User size={THEME.iconSize['lg']} color={THEME.colors['primary']} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
