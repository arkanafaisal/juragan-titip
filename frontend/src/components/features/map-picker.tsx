import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { Store, Info } from "lucide-react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  position: { lat: number; lng: number };
  onChange?: (lat: number, lng: number) => void;
  readonly?: boolean;
}
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
const customViewIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `
    <div class="flex flex-col items-center drop-shadow-md">
      <div class="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center text-on-primary shadow-lg border-2 border-surface">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-2.205a2 2 0 0 1 1.79 0L12 7l3.8-1.905a2 2 0 0 1 1.79 0L22 7v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Z"/><path d="M2 13h20"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/></svg>
      </div>
      <div class="w-2 h-2 bg-primary/80 rounded-full mt-1"></div>
    </div>
  `,
  iconSize: [40, 52],
  iconAnchor: [20, 52], 
});

export function MapPicker({ position, onChange, readonly = false }: MapPickerProps) {
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    if (map && !readonly) {
      const currentCenter = map.getCenter();
      const distance = currentCenter.distanceTo([position.lat, position.lng]);
      if (distance > 10) { 
        map.flyTo([position.lat, position.lng], map.getZoom());
      }
    }
  }, [position.lat, position.lng, map, readonly]);

  return (
    <div className="relative w-full h-full bg-surface-container-high overflow-hidden z-0">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={16}
        zoomControl={true} 
        dragging={true} 
        scrollWheelZoom={true}
        doubleClickZoom={true}
        className="w-full h-full absolute inset-0 z-0"
        ref={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapEvents onChange={onChange} readonly={readonly} />

        {readonly && (
          <Marker position={[position.lat, position.lng]} icon={customViewIcon} />
        )}
      </MapContainer>
      
      {!readonly && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center drop-shadow-md pointer-events-none z-10 transition-transform">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-lg border-2 border-surface">
            <Store className="w-5 h-5" />
          </div>
          <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
        </div>
      )}
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