import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { User, Building2 } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import THEME from '../../constants/css';
import { useSettingsStore } from '../../api/settings.api';
import { profileSchema, ProfileFormData } from '../../schemas/profile.schema';
import { Card } from '../ui/card';

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();
  
  const profile = useSettingsStore(state => state.profile);
  const setProfile = useSettingsStore(state => state.setProfile);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || '',
      phone: profile.phone || ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: profile.name || '',
        phone: profile.phone || ''
      });
    }
  }, [isOpen, profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    setProfile({
      name: data.name || '',
      phone: data.phone || ''
    });
    Toast.show({ type: 'success', text1: 'Profil Usaha berhasil disimpan!' });
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View>
      <TouchableOpacity 
        className="w-9 h-9 rounded-full bg-surface flex items-center justify-center border border-primary/20"
        activeOpacity={0.7}
        onPress={() => setIsOpen(true)}
      >
        {profile?.name ? (
          <Text className="text-body-sm font-bold tracking-wider text-primary">
            {getInitials(profile.name)}
          </Text>
        ) : (
          <User size={THEME.iconSize['lg']} color={THEME.colors['primary']} />
        )}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View className="flex-1 bg-black/40 justify-center items-center px-4">
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="w-full max-w-[320px]"
              >
                <Card className="flex-col shadow-xl bg-surface p-4">
                  
                  {/* Header */}
                  <View className="flex-row items-center gap-3 pb-3 border-b border-outline-variant mb-4">
                    <View className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                      <Building2 size={20} color={THEME.colors['text-secondary']} />
                    </View>
                    <View className="flex-1 flex-col overflow-hidden">
                      <Text className="font-bold text-body text-text-primary" numberOfLines={1}>
                        {profile?.name || "Profil Belum Diatur"}
                      </Text>
                      <Text className="text-caption text-text-secondary" numberOfLines={1}>
                        Data ini digunakan untuk kop struk
                      </Text>
                    </View>
                  </View>

                  {/* Form */}
                  <View className="flex-col gap-4 mb-5">
                    <View className="flex-col gap-1.5">
                      <Text className={`font-body-sm font-medium ${errors.name ? 'text-error' : 'text-text-secondary'}`}>
                        Nama Usaha / Pemilik
                      </Text>
                      <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            placeholder="Misal: Budi Santoso"
                            className={`bg-surface-container-low px-3 py-2.5 rounded-xl border font-body text-text-primary ${errors.name ? 'border-error' : 'border-outline-variant'}`}
                            placeholderTextColor={THEME.colors['text-muted']}
                          />
                        )}
                      />
                      {errors.name && <Text className="text-caption text-error">{errors.name.message}</Text>}
                    </View>

                    <View className="flex-col gap-1.5">
                      <Text className={`font-body-sm font-medium ${errors.phone ? 'text-error' : 'text-text-secondary'}`}>
                        No. WhatsApp (Opsional)
                      </Text>
                      <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            value={value}
                            onChangeText={onChange}
                            keyboardType="phone-pad"
                            placeholder="081234567890"
                            className={`bg-surface-container-low px-3 py-2.5 rounded-xl border font-body text-text-primary ${errors.phone ? 'border-error' : 'border-outline-variant'}`}
                            placeholderTextColor={THEME.colors['text-muted']}
                          />
                        )}
                      />
                      {errors.phone && <Text className="text-caption text-error">{errors.phone.message}</Text>}
                    </View>
                  </View>

                  {/* Actions */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity 
                      className="flex-1 py-2.5 rounded-xl border border-outline-variant bg-error items-center justify-center"
                      activeOpacity={0.7}
                      onPress={() => setIsOpen(false)}
                    >
                      <Text className="text-on-error font-bold">Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="flex-1 py-2.5 rounded-xl bg-primary items-center justify-center"
                      activeOpacity={0.7}
                      onPress={handleSubmit(onSubmit)}
                    >
                      <Text className="text-on-primary font-bold">Simpan Profil</Text>
                    </TouchableOpacity>
                  </View>

                </Card>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
