import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSmartBack } from "@/hooks/use-smart-back";
import { 
  X, MapPin, Map as MapIcon, Play, Navigation, LocateFixed 
} from "lucide-react";
import { journeyApi, type StoreWithDistance } from "@/services/api/journey";
import { storeApi } from "@/services/api/stores";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically change map view
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.5 });
  }, [center[0], center[1], zoom, map]);
  return null;
}

const getDaysAgoText = (dateString?: string) => {
  if (!dateString) return "Belum Pernah";
  const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} Hari Lalu`;
};

export default function JourneyPage() {
  const navigate = useNavigate();
  const { goBack } = useSmartBack();
  const [stores, setStores] = useState<StoreWithDistance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalStoresCount, setTotalStoresCount] = useState(0);
  
  const [isLocating, setIsLocating] = useState(false);
  const [hasGpsAccess, setHasGpsAccess] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const [selectedStore, setSelectedStore] = useState<StoreWithDistance | null>(null);
  
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'info' } | null>(null);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotif = (message: string, type: 'error' | 'info' = 'info') => {
    setNotification({ message, type });
  };

  // Helper: Format Rupiah
  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  // 1. Muat toko dari IndexedDB
  useEffect(() => {
    const loadStores = async () => {
      setIsLoading(true);
      const total = await storeApi.countTotal();
      setTotalStoresCount(total);
      
      if (total === 0) {
        setStores([]);
      } else {
        const initialStores = await journeyApi.getStoresRoute();
        setStores(initialStores);
      }
      setIsLoading(false);
    };
    loadStores();
  }, []);

  // 2. Fungsi Perbarui Lokasi GPS
  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      showNotif("GPS tidak didukung di perangkat ini.", 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        
        const optimalRoute = await journeyApi.getStoresRoute({ latitude, longitude });
        setStores(optimalRoute);
        setHasGpsAccess(true);
        setIsLocating(false);
        if (optimalRoute.length > 0) {
          showNotif("Lokasi diperbarui! Menampilkan rute optimal.", 'info');
        }
      },
      (err) => {
        showNotif(`Gagal mendapatkan lokasi: ${err.message}`, 'error');
        setIsLocating(false);
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleClose = () => {
    goBack('/dashboard'); 
  };

  if (isLoading) {
    return (
      <div className="h-dvh bg-inverse-surface flex items-center justify-center text-inverse-on-surface">
        <Navigation className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="h-dvh overflow-hidden bg-inverse-surface flex flex-col items-center justify-center text-inverse-on-surface p-6 text-center relative">
        {notification && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 w-max max-w-[90vw]">
            <div className={`px-5 py-2.5 rounded-full shadow-lg font-body-sm text-body-sm font-bold flex items-center justify-center text-center gap-2 ${
              notification.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
            }`}>
              {notification.message}
            </div>
          </div>
        )}
        <MapPin className="w-12 h-12 text-outline mb-4" />
        <h2 className="font-h2 text-h2 font-bold mb-2">
          {totalStoresCount === 0 ? "Belum Ada Toko" : "Semua Toko Sudah Dikunjungi"}
        </h2>
        <p className="text-inverse-on-surface/70 mb-6 font-body text-body">
          {totalStoresCount === 0 
            ? "Tambahkan data toko terlebih dahulu untuk menggunakan Mode Keliling."
            : "Saat ini tidak ada toko yang melewati batas hari kunjungan."}
        </p>
        <button onClick={handleClose} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  // STATUS: Minta GPS
  if (!hasGpsAccess) {
    return (
      <div className="h-dvh overflow-hidden bg-inverse-surface flex flex-col items-center justify-center text-inverse-on-surface p-6 text-center animate-in fade-in duration-300 relative">
        {notification && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 w-max max-w-[90vw]">
            <div className={`px-5 py-2.5 rounded-full shadow-lg font-body-sm text-body-sm font-bold flex items-center justify-center text-center gap-2 ${
              notification.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
            }`}>
              {notification.message}
            </div>
          </div>
        )}
        <LocateFixed className="w-16 h-16 text-primary mb-6 animate-pulse" />
        <h2 className="font-h2 text-h2 font-bold mb-3">Akses Lokasi Dibutuhkan</h2>
        <p className="text-inverse-on-surface/70 mb-8 font-body text-body max-w-[300px]">
          Mode keliling memerlukan akses GPS untuk mencarikan rute toko prioritas yang wajib Anda kunjungi (mulai dari yang terdekat).
        </p>
        <button 
          onClick={handleUpdateLocation} 
          disabled={isLocating}
          className="w-full max-w-[300px] py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2"
        >
          {isLocating ? (
             <>
               <Navigation className="w-5 h-5 animate-spin" />
               Mencari Lokasi...
             </>
          ) : (
             <>
               <Navigation className="w-5 h-5" />
               Mulai Cari Lokasi
             </>
          )}
        </button>
        <button onClick={handleClose} className="mt-4 px-6 py-3 text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">
          Batal & Kembali
        </button>
      </div>
    );
  }

  const openMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  const startVisit = (storeId: number) => {
    navigate(`/stores/${storeId}/visit`); 
  };

  const defaultCenter: [number, number] = userLocation || [stores[0]?.latitude || -6.2, stores[0]?.longitude || 106.8];

  return (
    // FULLSCREEN OVERLAY
    <div className="h-dvh overflow-hidden w-full bg-surface flex flex-col font-body animate-in fade-in duration-300 relative">
      
      {/* CUSTOM NOTIFICATION */}
      {notification && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 w-max max-w-[90vw]">
          <div className={`px-5 py-2.5 rounded-full shadow-lg font-body-sm text-body-sm font-bold flex items-center justify-center text-center gap-2 ${
            notification.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
          }`}>
            {notification.message}
          </div>
        </div>
      )}

      {/* HEADER BAR (Floating overlay) */}
      <div className="absolute top-0 inset-x-0 z-[100] flex justify-between items-start p-4 pointer-events-none">
        <button onClick={handleClose} className="p-3 bg-surface rounded-full shadow-lg border border-outline-variant hover:bg-surface-container transition-colors pointer-events-auto">
          <X className="w-6 h-6 text-text-primary" />
        </button>
        <button 
          onClick={() => handleUpdateLocation()} 
          disabled={isLocating}
          className="flex items-center gap-2 px-5 py-3 bg-surface text-primary border border-outline-variant rounded-full font-bold text-sm shadow-lg hover:bg-surface-container transition-colors pointer-events-auto"
        >
          <Navigation className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Mencari...' : 'Perbarui Lokasi'}
        </button>
      </div>

      {/* FULL SCREEN MAP */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer 
          center={defaultCenter} 
          zoom={14} 
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {stores.map(store => (
            store.latitude && store.longitude && (
              <Marker 
                key={store.id} 
                position={[store.latitude, store.longitude]}
                eventHandlers={{
                  click: () => {
                    setSelectedStore(store);
                  },
                }}
              >
                <Popup>{store.name}</Popup>
              </Marker>
            )
          ))}

          {userLocation && (
            <CircleMarker 
              center={userLocation} 
              radius={8} 
              pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
            >
              <Popup>Posisi Anda (terakhir diperbarui)</Popup>
            </CircleMarker>
          )}

          {/* Jika ada toko yang dipilih, geser view perlahan */}
          {selectedStore && selectedStore.latitude && selectedStore.longitude && (
            <ChangeView center={[selectedStore.latitude, selectedStore.longitude]} zoom={16} />
          )}
        </MapContainer>
      </div>

      {/* STORE DETAIL BOTTOM SHEET (Floating Card) */}
      {selectedStore && (
        <div className="absolute bottom-0 inset-x-0 z-[100] flex justify-center pb-0 animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-none">
          <div className="w-full max-w-[400px] bg-surface rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-outline-variant/30 pointer-events-auto flex flex-col pb-8">
            
            {/* Drag Handle Dummy */}
            <div className="w-full flex justify-center pt-4 pb-2">
               <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full" />
            </div>
            
            <button 
              onClick={() => setSelectedStore(null)}
              className="absolute top-5 right-5 p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors"
            >
               <X className="w-5 h-5 text-text-primary" />
            </button>

            <div className="px-6 pt-2 flex flex-col gap-5">
               <div>
                  <div className="flex items-center gap-3 mb-3 pr-10">
                    <h1 className="font-h1 text-h1 font-bold text-text-primary line-clamp-2">
                      {selectedStore.name}
                    </h1>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                     <div className="px-3 py-1.5 bg-error/10 rounded-lg">
                       <span className="text-error text-[11px] uppercase tracking-wider font-bold">
                         {getDaysAgoText(selectedStore.lastVisitAt)}
                       </span>
                     </div>
                     <div className="px-3 py-1.5 bg-primary/10 rounded-lg flex items-center gap-1.5">
                       <MapPin className="w-3.5 h-3.5 text-primary" />
                       <span className="text-primary text-[11px] font-bold tracking-wider">
                         {selectedStore.distance === undefined ? '?' : selectedStore.distance} KM
                       </span>
                     </div>
                  </div>
                </div>

                <div className="py-5 my-1 border-y border-dashed border-outline-variant">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-body text-body font-medium text-text-secondary">🔴 Piutang Aktif:</span>
                    <span className="font-bold text-xl text-error font-mono">{formatRp(selectedStore.debt || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-body font-medium text-text-secondary">📦 Aset Titipan:</span>
                    <span className="font-bold text-xl text-success font-mono">{formatRp(selectedStore.assetValue || 0)}</span>
                  </div>
                </div>

                {/* Flex Row Actions */}
                <div className="flex gap-3 pt-1">
                  <button 
                    onClick={() => openMaps(selectedStore.latitude, selectedStore.longitude)}
                    className="flex-1 flex flex-col items-center justify-center py-4 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-2xl transition-colors active:scale-[0.98]"
                  >
                    <MapIcon className="w-5 h-5 text-text-primary" />
                    <span className="font-bold text-sm mt-1.5 text-text-primary">BUKA MAPS</span>
                  </button>
                  <button 
                    onClick={() => startVisit(selectedStore.id)}
                    className="flex-1 flex flex-col items-center justify-center py-4 bg-primary hover:bg-primary/90 rounded-2xl transition-colors shadow-md active:scale-[0.98]"
                  >
                    <Play className="w-5 h-5 fill-current text-on-primary" />
                    <span className="font-bold text-sm mt-1.5 text-on-primary">KUNJUNGI</span>
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
