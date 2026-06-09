import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { Search, SlidersHorizontal, Plus, Settings } from 'lucide-react-native';

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
  onAddClick: () => void;
  addLabel?: string;
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
  addLabel = "Tambah",
  onSettingClick,
  isSettingDisabled = false,
}: ActionToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const hasActiveFilter = Object.values(activeFilters).some(val => val !== "" && val !== "name_asc");

  return (
    <View className="w-full z-10">
      <View className="flex-row items-center gap-2 mb-md w-full">
        
        <View className="relative flex-1 flex-row items-center bg-surface border border-outline-variant rounded-md px-3 h-10">
          <Search size={16} color="#737686" />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            className="flex-1 ml-2 text-body text-text-primary py-0 h-full"
            placeholderTextColor="#737686"
            style={{ includeFontPadding: false }}
          />
        </View>

        
        <TouchableOpacity
          onPress={onSettingClick}
          disabled={isSettingDisabled}
          className={`w-10 h-10 rounded-md border border-outline-variant items-center justify-center bg-surface ${isSettingDisabled ? 'opacity-50' : ''}`}
          activeOpacity={0.7}
        >
          <Settings size={16} color="#0b1c30" />
        </TouchableOpacity>

        
        {filterGroups.length > 0 ? (
          <TouchableOpacity
            onPress={() => setIsFilterOpen(true)}
            className="w-10 h-10 rounded-md border border-outline-variant items-center justify-center bg-surface relative"
            activeOpacity={0.7}
          >
            <SlidersHorizontal size={16} color="#0b1c30" />
            {hasActiveFilter && (
              <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-surface" />
            )}
          </TouchableOpacity>
        ) : (
          <View className="w-10 h-10 rounded-md border border-outline-variant items-center justify-center bg-surface opacity-50">
            <SlidersHorizontal size={16} color="#0b1c30" />
          </View>
        )}

        
        <TouchableOpacity
          onPress={onAddClick}
          className="w-10 h-10 rounded-md bg-success items-center justify-center"
          activeOpacity={0.7}
        >
          <Plus size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      
      <Modal
        visible={isFilterOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsFilterOpen(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsFilterOpen(false)}
        >
          <Pressable 
            className="bg-surface w-full rounded-t-3xl p-6 shadow-lg max-h-[80%]"
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
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
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
