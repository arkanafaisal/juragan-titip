import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Store, Info } from "lucide-react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  position: { lat: number; lng: number };
  onChange?: (lat: number, lng: number) => void;
  readonly?: boolean;
}

// Sub-komponen untuk mendengarkan event drag peta
function MapEvents({ onChange, readonly }: { onChange?: (lat: number, lng: number) => void, readonly: boolean }) {
  const map = useMapEvents({
    moveend: () => {
      if (!readonly && onChange) {
        const center = map.getCenter();
        onChange(center.lat, center.lng);
      }
    },
  });
  return null;
}

export function MapPicker({ position, onChange, readonly = false }: MapPickerProps) {
  const [map, setMap] = useState<LeafletMap | null>(null);

  // Menangani perubahan dari luar (misal: tombol deteksi GPS ditekan)
  useEffect(() => {
    if (map) {
      const currentCenter = map.getCenter();
      // Jarak dihitung agar peta tidak jitter (bergetar) akibat rounding pixel dari Leaflet
      const distance = currentCenter.distanceTo([position.lat, position.lng]);
      if (distance > 10) {
        map.flyTo([position.lat, position.lng], map.getZoom());
      }
    }
  }, [position.lat, position.lng, map]);

  return (
    <div className="relative w-full h-full bg-surface-container-high overflow-hidden z-0">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={16}
        zoomControl={!readonly}
        dragging={!readonly}
        scrollWheelZoom={!readonly}
        doubleClickZoom={!readonly}
        className="w-full h-full absolute inset-0 z-0"
        ref={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapEvents onChange={onChange} readonly={readonly} />
      </MapContainer>

      {/* Pin Overlay - Selalu berada persis di tengah peta. 
          Triks ini menghindarkan kita dari setup Custom Marker Leaflet yang rumit. */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center drop-shadow-md pointer-events-none z-10 transition-transform">
        <div className={`w-10 h-10 ${readonly ? 'bg-primary/80' : 'bg-primary'} rounded-full flex items-center justify-center text-on-primary shadow-lg border-2 border-surface`}>
          <Store className="w-5 h-5" />
        </div>
        <div className={`w-2 h-2 ${readonly ? 'bg-primary/80' : 'bg-primary'} rounded-full mt-1`}></div>
      </div>

      {/* Hint Overlay (Hanya muncul jika mode pick/pilih) */}
      {!readonly && (
        <div className="absolute bottom-2 left-2 right-2 bg-surface/90 backdrop-blur-sm rounded px-3 py-2 border border-outline-variant shadow-sm flex items-center gap-2 z-10">
          <Info className="w-4 h-4 text-text-secondary shrink-0" />
          <span className="font-caption text-caption text-text-secondary">
            Geser peta untuk menyesuaikan titik lokasi akurat.
          </span>
        </div>
      )}
    </div>
  );
}