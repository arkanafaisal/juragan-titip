import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Linking, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { 
  X, MapPin, Map as MapIcon, Play, Navigation, LocateFixed 
} from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import THEME from '../constants/css';
import { formatRupiah } from '../utils/formatter.util';
import { useGetOverdueStores } from '../api/stores.api';

const getDaysAgoText = (dateString?: string | null) => {
  if (!dateString) return "Belum Pernah";
  const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} Hari Lalu`;
};

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

export default function JourneyScreen() {
  const router = useRouter();
  
  const { data: dbStores, isLoading } = useGetOverdueStores();
  
  const [hasGpsAccess, setHasGpsAccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [selectedStore, setSelectedStore] = useState<any | null>(null);
  const mapRef = useRef<MapView>(null);

  const stores = React.useMemo(() => {
    if (!dbStores) return [];
    
    return dbStores.map(store => {
      let dist = 0;
      if (userLocation) {
        dist = getDistanceKm(userLocation.lat, userLocation.lng, store.latitude, store.longitude);
      }
      return {
        ...store,
        distance: dist > 0 ? dist.toFixed(1) : '?'
      };
    }).sort((a, b) => {
      if (a.distance === '?' || b.distance === '?') return 0;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
  }, [dbStores, userLocation]);

  const handleUpdateLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Izin akses lokasi ditolak. Silakan aktifkan di pengaturan.');
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
      setHasGpsAccess(true);
      
      // Center map to user
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      });
      
    } catch (error) {
      console.warn("Failed to get location", error);
      alert('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleMarkerPress = (store: any) => {
    setSelectedStore(store);
    mapRef.current?.animateToRegion({
      latitude: store.latitude,
      longitude: store.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    });
  };

  // STATUS: Loading Data
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center p-6">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </SafeAreaView>
    );
  }

  // STATUS: Minta GPS
  if (!hasGpsAccess) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center p-6">
        <Stack.Screen options={{ headerShown: false }} />
        <LocateFixed size={64} color={THEME.colors.primary} className="mb-6 opacity-80" />
        <Text className="font-h2 text-h2 font-bold mb-3 text-center text-text-primary">
          Akses Lokasi Dibutuhkan
        </Text>
        <Text className="text-text-secondary mb-8 font-body text-body text-center max-w-[300px]">
          Mode keliling memerlukan akses GPS untuk mencarikan rute toko prioritas yang wajib Anda kunjungi (mulai dari yang terdekat).
        </Text>
        
        <TouchableOpacity 
          onPress={handleUpdateLocation}
          disabled={isLocating}
          activeOpacity={0.8}
          className="w-full max-w-[300px] py-4 bg-primary rounded-2xl flex-row justify-center items-center gap-2"
        >
          <Navigation size={20} color={THEME.colors['on-primary']} />
          <Text className="font-bold text-on-primary">
            {isLocating ? 'Mencari Lokasi...' : 'Mulai Cari Lokasi'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-3" activeOpacity={0.7}>
          <Text className="text-text-secondary font-medium">Batal & Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // STATUS: Kosong (Tidak ada toko overdue)
  if (hasGpsAccess && stores.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center p-6">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-3xl mb-4">🎉</Text>
        <Text className="font-h2 text-h2 font-bold mb-3 text-center text-text-primary">
          Luar Biasa!
        </Text>
        <Text className="text-text-secondary mb-8 font-body text-body text-center max-w-[300px]">
          Semua toko sudah dikunjungi tepat waktu. Tidak ada target kunjungan untuk rute keliling saat ini.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="px-6 py-3 bg-primary rounded-full" activeOpacity={0.7}>
          <Text className="text-on-primary font-bold">Tutup Mode Keliling</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-surface relative">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* FULL SCREEN MAP */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={
           userLocation ? {
              latitude: userLocation.lat,
              longitude: userLocation.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
           } : {
              latitude: stores[0]?.latitude || -6.200000,
              longitude: stores[0]?.longitude || 106.816666,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
           }
        }
      >
        {stores.map(store => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            onPress={() => handleMarkerPress(store)}
            pinColor={selectedStore?.id === store.id ? THEME.colors.primary : THEME.colors.error}
          />
        ))}
      </MapView>

      {/* HEADER BAR (Floating) */}
      <SafeAreaView className="absolute top-0 left-0 right-0 pointer-events-box-none">
        <View className="flex-row justify-between items-start p-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-3 bg-surface rounded-full shadow-lg border border-outline-variant items-center justify-center"
          >
            <X size={24} color={THEME.colors['text-primary']} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleUpdateLocation}
            disabled={isLocating}
            className="flex-row items-center gap-2 px-5 py-3 bg-surface rounded-full shadow-lg border border-outline-variant"
          >
            <Navigation size={18} color={THEME.colors['primary']} />
            <Text className="font-bold text-sm text-primary">
              {isLocating ? 'Mencari...' : 'Perbarui Lokasi'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* STORE DETAIL BOTTOM MODAL */}
      {selectedStore && (
        <View className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-20 border-t border-outline-variant/30">
          {/* Drag Handle Dummy */}
          <View className="w-full items-center pt-4 pb-2">
             <View className="w-12 h-1.5 bg-outline-variant/50 rounded-full" />
          </View>
          
          <TouchableOpacity 
            className="absolute top-5 right-5 p-2 bg-surface-container rounded-full z-10"
            onPress={() => setSelectedStore(null)}
          >
             <X size={20} color={THEME.colors['text-primary']} />
          </TouchableOpacity>

          <View className="px-6 pt-2 pb-8 flex-col gap-5">
             <View>
                <View className="flex-row items-center justify-between gap-3 mb-3 pr-10">
                  <Text className="font-h1 text-h1 font-bold text-text-primary flex-1" numberOfLines={2}>
                    {selectedStore.name}
                  </Text>
                </View>
                
                <View className="flex-row items-center gap-2 mb-3">
                   <View className="px-3 py-1.5 bg-error/10 rounded-lg">
                     <Text className="text-error text-[11px] uppercase tracking-wider font-bold">
                       {getDaysAgoText(selectedStore.lastVisitAt)}
                     </Text>
                   </View>
                   <View className="px-3 py-1.5 bg-primary/10 rounded-lg flex-row items-center gap-1.5">
                     <MapPin size={12} color={THEME.colors.primary} />
                     <Text className="text-primary text-[11px] font-bold tracking-wider">
                       {selectedStore.distance} KM
                     </Text>
                   </View>
                </View>

              </View>

              <View className="py-5 my-1" style={{ borderTopWidth: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: THEME.colors['outline-variant'] }}>
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="font-body text-body font-medium text-text-secondary">🔴 Piutang Aktif:</Text>
                  <Text className="font-bold text-xl text-error font-mono">{formatRupiah(selectedStore.debt)}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="font-body text-body font-medium text-text-secondary">📦 Aset Titipan:</Text>
                  <Text className="font-bold text-xl text-success font-mono">{formatRupiah(selectedStore.assetValue)}</Text>
                </View>
              </View>

              {/* Flex Row Actions */}
              <View className="flex-row gap-3 pt-1">
                <TouchableOpacity 
                  onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${selectedStore.latitude},${selectedStore.longitude}`)}
                  activeOpacity={0.8}
                  className="flex-1 items-center justify-center py-4 bg-surface-container-low border border-outline-variant rounded-2xl"
                >
                  <MapIcon size={22} color={THEME.colors['text-primary']} />
                  <Text className="font-bold text-sm mt-1.5 text-text-primary">BUKA MAPS</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => router.push(`/(tabs)/store-visit?storeId=${selectedStore.id}`)}
                  activeOpacity={0.8}
                  className="flex-1 items-center justify-center py-4 bg-primary rounded-2xl"
                >
                  <Play size={22} fill={THEME.colors['on-primary']} color={THEME.colors['on-primary']} />
                  <Text className="font-bold text-sm mt-1.5 text-on-primary">KUNJUNGI</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      )}
    </View>
  );
}
