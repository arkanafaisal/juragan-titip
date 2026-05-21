import { useEffect, useRef } from 'react';
import { X, MapPin, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Consignment } from '../../types/dashboard';

interface LocationModalProps {
  data: Consignment;
  onClose: () => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function LocationModal({ data, onClose }: LocationModalProps) {
  const { t } = useTranslation();
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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 jt-text-heading">
      <div className="absolute inset-0 jt-bg-overlay backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        <div className="flex items-start justify-between mb-5">
          <div className="pr-4 text-left">
            <h3 className="text-xl font-extrabold jt-text-heading leading-tight">{t('dashboard.locationModal.title')}</h3>
            <p className="text-sm jt-text-muted mt-1 line-clamp-2" title={data.address}>{data.address}</p>
          </div>
          <button onClick={onClose} className="p-2 jt-bg-surface hover:jt-bg-primary-soft jt-text-light hover:jt-text-primary rounded-full transition-colors focus:outline-none shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {hasCoords ? (
          <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden border jt-border-base relative mb-6">
             <div ref={mapRef} className="w-full h-full z-0"></div>
          </div>
        ) : (
          <div className="w-full h-64 jt-bg-surface rounded-2xl border jt-border-base border-dashed flex flex-col items-center justify-center mb-6 jt-text-light">
             <MapPin className="h-10 w-10 mb-2 opacity-40" />
             <p className="text-sm font-medium">{t('dashboard.locationModal.noMap')}</p>
             <p className="text-xs mt-1 text-center px-4">{t('dashboard.locationModal.noMapDesc')}</p>
          </div>
        )}

        <a 
          href={gmapsLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full h-12 flex items-center justify-center gap-2 jt-bg-primary hover:jt-bg-primary-hover text-white rounded-xl font-bold transition-all shadow-md"
        >
           <Map className="h-4 w-4" /> {t('dashboard.locationModal.btnOpenGmaps')}
        </a>
      </div>
    </div>
  );
}
