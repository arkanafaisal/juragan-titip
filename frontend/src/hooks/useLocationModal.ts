import { useEffect, useRef } from 'react';
import type { Consignment } from '@/types/dashboard';

interface UseLocationModalProps {
  data: Consignment;
  onClose: () => void;
}

export function useLocationModal({ data, onClose }: UseLocationModalProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  
  const hasCoords = data.lat != null && data.lng != null;
  const coords: [number, number] | null = hasCoords ? [data.lat!, data.lng!] : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (!hasCoords || !coords) return;
    let isMounted = true;

    const loadLeaflet = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      if (window.L) {
        delete window.L.Icon.Default.prototype._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      }

      if (isMounted && window.L && mapRef.current && !mapInstance.current) {
        const map = window.L.map(mapRef.current).setView(coords, 16);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        window.L.marker(coords).addTo(map); // View only, no draggable
        mapInstance.current = map;
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coords, hasCoords]);

  // URL Buka Eksternal
  const gmapsLink = hasCoords 
    ? `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lng}` 
    : data.mapLink || '#';

  return {
    mapRef,
    hasCoords,
    gmapsLink
  };
}
