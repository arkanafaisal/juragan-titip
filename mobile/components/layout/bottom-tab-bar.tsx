import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Package, Store, Banknote, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmModal } from '../ui/modal';

import THEME from '../../constants/css';

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [pendingRoute, setPendingRoute] = useState<{ name: string, params: any } | null>(null);

  const getIcon = (routeName: string, isActive: boolean) => {
    const color = isActive ? THEME.colors['on-primary'] : THEME.colors['on-surface']; // on-primary for active
    const size = THEME.iconSize['md'];

    switch (routeName) {
      case 'index':
        return <Home size={size} color={color} />;
      case 'product-list':
        return <Package size={size} color={color} />;
      case 'store-list':
        return <Store size={size} color={color} />;
      case 'finance':
        return <Banknote size={size} color={color} />;
      case 'settings':
        return <Settings size={size} color={color} />;
      default:
        return <Home size={size} color={color} />;
    }
  };

  return (
    <View 
      className="w-full bg-surface-container-lowest border-t border-outline-variant flex-row justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        
        // Sembunyikan tab yang tidak diinginkan (seperti form)
        const nonPrimaryRoute =  new Set(['product-form', 'store-form', 'store-detail', 'store-visit', 'product-detail']);
        if (options.tabBarButton || nonPrimaryRoute.has(route.name)) return null;

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const activeRouteName = state.routes[state.index].name;
        const isNativelyFocused = state.index === index;
        
        // Tetap aktifkan tab jika yang sedang dibuka adalah sub-halamannya
        const isProductSubPage = (activeRouteName === 'product-form' || activeRouteName === 'product-detail') && route.name === 'product-list';
        const isStoreSubPage = (activeRouteName === 'store-form' || activeRouteName === 'store-detail' || activeRouteName === 'store-visit') && route.name === 'store-list';
        const isVisuallyFocused = isNativelyFocused || isProductSubPage || isStoreSubPage;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          // Izinkan navigasi jika tidak sedang di rute aslinya
          if (!isNativelyFocused && !event.defaultPrevented) {
            // Hardcoded confirmation logic untuk form pages
            if (activeRouteName === 'product-form' || activeRouteName === 'store-form') {
              setPendingRoute({ name: route.name, params: route.params });
            } else {
              navigation.navigate(route.name, route.params);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isVisuallyFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className={`flex-1 flex flex-col items-center justify-center py-2 ${
              isVisuallyFocused ? 'bg-primary' : ''
            }`}
            style={{ paddingBottom: Math.max(insets.bottom, 8) }}
          >
            <View className="flex items-center justify-center mb-1">
              {getIcon(route.name, isVisuallyFocused)}
            </View>
            <Text 
              className={`font-caption text-[10px] text-center px-1 ${
                isVisuallyFocused ? 'font-medium text-on-primary' : 'text-on-surface-variant'
              }`}
              numberOfLines={1}
            >
              {typeof label === 'string' ? label : ''}
            </Text>
          </Pressable>
        );
      })}
      <ConfirmModal
        visible={!!pendingRoute}
        title="Keluar dari Form?"
        message="Perubahan yang belum disimpan akan hilang. Yakin ingin keluar?"
        cancelText="Batal"
        confirmText="Keluar"
        onCancel={() => setPendingRoute(null)}
        onConfirm={() => {
          if (pendingRoute) {
            navigation.navigate(pendingRoute.name, pendingRoute.params);
          }
          setPendingRoute(null);
        }}
      />
    </View>
  );
}
