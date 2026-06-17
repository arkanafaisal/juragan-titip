import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Region, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, Navigation, Info } from 'lucide-react-native';
import THEME from '../../constants/css';

interface MapPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  readonly?: boolean;
  height?: number;
}

export function MapPicker({ initialLatitude = -7.55556, initialLongitude = 110.80639, onLocationChange, readonly = false, height = 280 }: MapPickerProps) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude || -7.55556,
    longitude: initialLongitude || 110.80639,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Izin akses lokasi ditolak. Tidak bisa mengambil lokasi saat ini.');
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      
      mapRef.current?.animateToRegion(newRegion, 1000);
      
      // Update local state & trigger callback
      setRegion(newRegion);
      if (onLocationChange) {
        onLocationChange(newRegion.latitude, newRegion.longitude);
      }
    } catch (error) {
      alert('Gagal mengambil lokasi. Pastikan GPS perangkat Anda aktif.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    if (readonly) return;
    setRegion(newRegion);
    if (onLocationChange) {
      onLocationChange(newRegion.latitude, newRegion.longitude);
    }
  };

  return (
    <View style={{ height }} className="relative w-full bg-surface-variant rounded-xl overflow-hidden border border-outline-variant">
      <MapView
        ref={mapRef}
        style={{ flex: 1, width: '100%' }}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={!readonly}
        showsMyLocationButton={false}
        loadingEnabled={true}
        loadingBackgroundColor={THEME.colors['surface-variant']}
      >
        {readonly && (
          <Marker coordinate={{ latitude: initialLatitude, longitude: initialLongitude }}>
            <View className="flex-col items-center">
              <View className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-surface">
                <MapPin size={20} color={THEME.colors['on-primary']} />
              </View>
              <View className="w-2 h-2 bg-primary rounded-full mt-1"></View>
            </View>
          </Marker>
        )}
      </MapView>
      
      {!readonly && (
        <View className="absolute top-1/2 left-1/2 -ml-5 -mt-10 flex-col items-center pointer-events-none z-10">
          <View className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-surface">
            <MapPin size={20} color={THEME.colors['on-primary']} />
          </View>
          <View className="w-2 h-2 bg-primary rounded-full mt-1"></View>
        </View>
      )}

      {!readonly && (
        <TouchableOpacity 
          onPress={handleGetCurrentLocation}
          disabled={isLocating}
          className="absolute top-3 right-3 bg-surface/95 flex-row items-center justify-center gap-2 px-3 py-2 rounded-full shadow-sm border border-outline-variant active:opacity-80 z-20"
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={THEME.colors.primary} />
          ) : (
            <Navigation size={16} color={THEME.colors.primary} />
          )}
          <Text className="text-primary font-bold text-[12px]">Pakai Lokasi Saya</Text>
        </TouchableOpacity>
      )}

      {!readonly && (
        <View className="absolute bottom-2 left-2 right-2 bg-surface/95 rounded-lg px-3 py-2.5 border border-outline-variant flex-row items-start gap-2 shadow-sm z-20">
          <Info size={16} color={THEME.colors['text-secondary']} className="mt-0.5 shrink-0" />
          <Text className="flex-1 font-body text-[11px] leading-tight text-text-secondary">
            Geser peta untuk menetapkan titik. Jika peta <Text className="font-bold">blank/lag</Text> (karena offline), langsung tekan tombol "Pakai Lokasi Saya".
          </Text>
        </View>
      )}
    </View>
  );
}
