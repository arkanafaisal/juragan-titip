import { Tabs } from 'expo-router';
import React from 'react';
import { BottomTabBar } from '../../components/layout/bottom-tab-bar';
import { Header } from '../../components/layout/header';
import { useExitAppConfirmation } from '../../hooks/use-exit-app-confirmation';
import { ConfirmModal } from '../../components/ui/modal';

export default function TabLayout() {
  const { isExitModalVisible, confirmExit, cancelExit } = useExitAppConfirmation();

  return (
    <>
      <Tabs 
        tabBar={(props) => <BottomTabBar {...props} />}
        screenOptions={{ header: () => <Header /> }}
        backBehavior="history"
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Beranda' }}
        />
        <Tabs.Screen
          name="product-list"
          options={{ title: 'Produk' }}
        />
        <Tabs.Screen
          name="store-list"
          options={{ title: 'Toko' }}
        />
        <Tabs.Screen
          name="finance"
          options={{ title: 'Uang' }}
        />
        <Tabs.Screen
          name="settings"
          options={{ title: 'Pengaturan' }}
        />
        <Tabs.Screen
          name="product-form"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="product-detail"
          options={{ href: null }}
        />
      </Tabs>

      <ConfirmModal
        visible={isExitModalVisible}
        title="Keluar Aplikasi"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
        confirmText="Keluar"
        cancelText="Batal"
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />
    </>
  );
}