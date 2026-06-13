import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Search, SlidersHorizontal, Plus, Settings, X } from 'lucide-react-native';
import { BottomModal } from '../ui/bottom-modal';
import THEME from '../../constants/css';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

interface ActionToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterGroups?: FilterGroup[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (groupId: string, value: string) => void;
  onResetFilters?: () => void;
  onAddClick: () => void;
  onSettingClick?: () => void;
  isSettingDisabled?: boolean;
}

export function ActionToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  onAddClick,
  onSettingClick,
  isSettingDisabled = false,
  onResetFilters,
}: ActionToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilter = Object.values(activeFilters).some(val => val !== "" && val !== "name_asc");

  const activeFilterChips = useMemo(() => {
    return Object.entries(activeFilters).map(([key, value]) => {
      if (value === "" || value === "name_asc") return null;
      
      const group = filterGroups.find(g => g.id === key);
      const option = group?.options.find(o => o.value === value);
      
      let title = group?.title || key;
      if (title === "Kategori Produk") title = "Kategori";
      if (title === "Status Arsip") title = "Status";
      
      const optionLabel = option?.label || value;
      return {
        key,
        label: `${title}: ${optionLabel}`
      };
    }).filter(Boolean) as { key: string, label: string }[];
  }, [activeFilters, filterGroups]);

  return (
    <View className="w-full z-10">
      <View className="flex-row items-center gap-2 mb-sm w-full">
        
        <View className={`relative flex-1 flex-row items-center border rounded-md px-3 h-10 ${
          searchValue 
            ? 'bg-primary/10 border-primary' 
            : 'bg-surface border-outline-variant'
        }`}>
          {searchValue ? (
            <TouchableOpacity onPress={() => onSearchChange('')} activeOpacity={0.7} className="mr-1 bg-error rounded-full">
              <X size={THEME.iconSize['md']} color={THEME.colors['on-error']} />
            </TouchableOpacity>
          ) : (
            <Search size={THEME.iconSize['md']} color={THEME.colors['outline']} />
          )}
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            className={`flex-1 ml-1 text-body py-0 h-full ${searchValue ? 'text-primary font-medium' : 'text-text-primary'}`}
            placeholderTextColor={THEME.colors['outline']}
            style={{ includeFontPadding: false }}
          />
        </View>

        
        <TouchableOpacity
          onPress={onSettingClick}
          disabled={isSettingDisabled}
          className={`w-10 h-10 rounded-md border border-outline-variant items-center justify-center bg-surface ${isSettingDisabled ? 'opacity-50' : ''}`}
          activeOpacity={0.7}
        >
          <Settings size={THEME.iconSize['sm']} color={THEME.colors['on-surface']} />
        </TouchableOpacity>

        
        {filterGroups.length > 0 ? (
          <TouchableOpacity
            onPress={() => setIsFilterOpen(true)}
            className="w-10 h-10 rounded-md border border-outline-variant items-center justify-center bg-surface relative"
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={THEME.iconSize['sm']} color={THEME.colors['on-surface']} />
            {hasActiveFilter && (
              <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-surface" />
            )}
          </TouchableOpacity>
        ) : (
          <View className="w-10 h-10 rounded-md border border-outline-variant items-center justify-center bg-surface opacity-50">
            <SlidersHorizontal size={THEME.iconSize['sm']} color={THEME.colors['on-surface']} />
          </View>
        )}

        
        <TouchableOpacity
          onPress={onAddClick}
          className="w-10 h-10 rounded-md bg-success items-center justify-center"
          activeOpacity={0.7}
        >
          <Plus size={THEME.iconSize['sm']} color={THEME.colors['on-success']} />
        </TouchableOpacity>
      </View>

      {activeFilterChips.length > 0 && (
        <View className="-mx-4 px-4 pb-2">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mt-1 flex-row"
            contentContainerStyle={{ gap: 8, paddingRight: 32 }}
          >
            {onResetFilters && (
              <TouchableOpacity 
                onPress={onResetFilters}
                className="bg-error px-3 py-1.5 rounded-full justify-center items-center shrink-0"
                activeOpacity={0.8}
              >
                <Text className="text-on-error text-xs font-bold">Reset</Text>
              </TouchableOpacity>
            )}

            {activeFilterChips.map((chip) => (
              <View 
                key={chip.key}
                className="bg-primary flex-row items-center pl-3 pr-2 py-1 rounded-full shrink-0 gap-1.5"
              >
                <Text className="text-on-primary text-xs font-medium">{chip.label}</Text>
                <TouchableOpacity 
                  onPress={() => onFilterChange && onFilterChange(chip.key, "")}
                  className="ml-1"
                  activeOpacity={0.7}
                >
                  <X size={THEME.iconSize['sm']} color={THEME.colors['on-primary']} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <BottomModal
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      >
        <View className="flex-col gap-6 pb-4">
          {filterGroups.map((group) => (
            <View key={group.id} className="flex-col gap-3">
              <Text className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                {group.title}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {group.options.map((opt) => {
                  const isActive = (activeFilters[group.id] || "") === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => {
                        if (onFilterChange) {
                          onFilterChange(group.id, opt.value);
                        }
                        setIsFilterOpen(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl border ${
                        isActive
                          ? "bg-primary border-primary shadow-sm"
                          : "bg-surface border-outline-variant"
                      }`}
                      activeOpacity={0.7}
                    >
                      <Text className={`text-[13px] font-medium ${
                        isActive ? "text-on-primary" : "text-text-secondary"
                      }`}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </BottomModal>
    </View>
  );
}
