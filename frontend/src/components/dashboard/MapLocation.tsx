// src/components/dashboard/MapLocation.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Impor aset gambar marker bawaan Leaflet secara lokal
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Memperbaiki isu marker bawaan Leaflet pada Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapLocationProps {
  coords: [number, number];
  mode: 'view' | 'drag';
  onCoordsChange?: (coords: [number, number]) => void;
}

export default function MapLocation({ coords, mode, onCoordsChange }: MapLocationProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      // Inisialisasi Peta
      mapInstance.current = L.map(mapRef.current).setView(coords, mode === 'view' ? 16 : 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstance.current);

      // Inisialisasi Marker
      markerInstance.current = L.marker(coords, { draggable: mode === 'drag' }).addTo(mapInstance.current);
      
      if (mode === 'drag') {
        markerInstance.current.on('dragend', function () {
          if (markerInstance.current && onCoordsChange) {
            const position = markerInstance.current.getLatLng();
            onCoordsChange([position.lat, position.lng]);
          }
        });
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [mode]);

  useEffect(() => {
    if (mapInstance.current && markerInstance.current) {
      mapInstance.current.setView(coords, mode === 'view' ? 16 : 15);
      markerInstance.current.setLatLng(coords);
    }
  }, [coords, mode]);

  return <div ref={mapRef} className="w-full h-full z-0"></div>;
}