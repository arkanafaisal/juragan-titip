import { Tabs } from 'expo-router';
import React from 'react';
import { BottomTabBar } from '../../components/layout/bottom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs 
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Beranda' }}
      />
      <Tabs.Screen
        name="products"
        options={{ title: 'Produk' }}
      />
      <Tabs.Screen
        name="stores"
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
    </Tabs>
  );
}