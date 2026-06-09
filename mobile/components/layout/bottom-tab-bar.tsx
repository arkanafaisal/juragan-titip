import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Package, Store, Banknote, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, isActive: boolean) => {
    // text-primary-container = #2563eb, text-on-surface-variant = #434655
    const color = isActive ? '#2563eb' : '#434655';
    const size = 20;

    switch (routeName) {
      case 'index':
        return <Home size={size} color={color} />;
      case 'products':
        return <Package size={size} color={color} />;
      case 'stores':
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
      className="w-full bg-surface-container-lowest border-t border-outline-variant flex-row justify-between items-center px-1 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
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
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 flex flex-col items-center justify-center py-1"
          >
            <View 
              className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${
                isFocused ? 'bg-primary-fixed' : ''
              }`}
            >
              {getIcon(route.name, isFocused)}
            </View>
            <Text 
              className={`font-caption text-[10px] text-center px-1 ${
                isFocused ? 'font-medium text-primary-container' : 'text-on-surface-variant'
              }`}
              numberOfLines={1}
            >
              {typeof label === 'string' ? label : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
