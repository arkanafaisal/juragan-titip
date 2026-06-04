import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { 
  X, MapPin, Map as MapIcon, Play, ChevronDown, ChevronUp, 
  ChevronLeft, ChevronRight, Navigation, LocateFixed 
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
    map.setView(center, zoom);
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
  const [stores, setStores] = useState<StoreWithDistance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalStoresCount, setTotalStoresCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [hasGpsAccess, setHasGpsAccess] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
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

  const [showMiniMenu, setShowMiniMenu] = useState(true);
  const miniMenuRef = useRef<HTMLDivElement>(null);

  // Helper: Format Rupiah
  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  // 1. Muat toko dari IndexedDB
  useEffect(() => {
    const loadStores = async () => {
      try {
        setIsLoading(true);
        const total = await storeApi.countTotal();
        setTotalStoresCount(total);
        
        if (total === 0) {
          setStores([]);
        } else {
          const initialStores = await journeyApi.getInitialStores();
          setStores(initialStores);
        }
      } catch (error) {
        showNotif("Gagal memuat data toko.", 'error');
      } finally {
        setIsLoading(false);
      }
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
        
        try {
          const optimalRoute = await journeyApi.getOptimalRoute(latitude, longitude);
          setStores(optimalRoute);
          setHasGpsAccess(true);
          setCurrentIndex(0); 
          setIsLocating(false);
          showNotif("Lokasi diperbarui! Menampilkan rute optimal.", 'info');
        } catch (error) {
          showNotif("Gagal menghitung rute optimal.", 'error');
          setIsLocating(false);
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

  // 3. Efek Auto-Scroll pada Mini Menu
  useEffect(() => {
    if (miniMenuRef.current && hasGpsAccess && showMiniMenu) {
      const activeEl = miniMenuRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        const container = miniMenuRef.current;
        const scrollPos = activeEl.offsetLeft - (container.clientWidth / 2) + (activeEl.clientWidth / 2);
        container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  }, [currentIndex, hasGpsAccess, showMiniMenu]);

  const handleClose = () => {
    navigate('/dashboard'); 
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

  const currentStore = stores[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < stores.length - 1;

  const goPrev = () => { if (hasPrev) setCurrentIndex(prev => prev - 1); };
  const goNext = () => { if (hasNext) setCurrentIndex(prev => prev + 1); };
  
  const openMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${currentStore.latitude},${currentStore.longitude}`, '_blank');
  };

  const startVisit = () => {
    navigate(`/stores/${currentStore.id}/visit`); 
  };

  return (
    // FULLSCREEN OVERLAY
    <div className="h-dvh overflow-hidden w-full bg-inverse-surface flex flex-col font-body animate-in fade-in duration-300 relative">
      
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

      {/* HEADER BAR */}
      <div className="flex justify-between items-center p-4 text-inverse-on-surface shrink-0">
        <button onClick={handleClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <button 
          onClick={() => handleUpdateLocation()} 
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-fixed border border-primary/30 rounded-full font-medium text-sm hover:bg-primary/30 transition-colors"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Mencari...' : 'Perbarui Lokasi'}
        </button>
      </div>

      {/* MAIN CAROUSEL AREA */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="relative w-full max-w-[360px] flex items-center justify-center">
          
          {/* FAKE BORDER LEFT (Klik Mundur) */}
          {hasPrev && (
            <button 
              onClick={goPrev}
              className="absolute -left-6  w-10  h-[85%] bg-surface rounded-r-3xl opacity-40 hover:opacity-80 transition-opacity flex items-center justify-end pr-1  shadow-2xl z-10 border-y border-r border-outline-variant"
            >
              <ChevronLeft className="w-6 h-6 text-text-primary" />
            </button>
          )}

          {/* MAIN CARD ACTIVE */}
          <div className="w-full bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col mx-4 z-20 transition-all duration-300">
            
            {/* Peta Interaktif Leaflet */}
            <div className="h-40 relative z-0 bg-surface-container-low">
              <MapContainer 
                center={[currentStore.latitude || -6.200000, currentStore.longitude || 106.816666]} 
                zoom={16} 
                zoomControl={false}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                {currentStore.latitude && currentStore.longitude && (
                  <Marker position={[currentStore.latitude, currentStore.longitude]}>
                    <Popup>{currentStore.name}</Popup>
                  </Marker>
                )}
                {userLocation && (
                  <CircleMarker 
                    center={userLocation} 
                    radius={7} 
                    pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
                  >
                    <Popup>Posisi Anda (terakhir diperbarui)</Popup>
                  </CircleMarker>
                )}
                {/* Komponen pembantu untuk memindahkan kamera */}
                <ChangeView center={[currentStore.latitude || -6.2, currentStore.longitude || 106.8]} zoom={16} />
              </MapContainer>

              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-surface/50 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-3 right-3 bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-lg border border-white/10 z-10">
                <MapPin className="w-4 h-4 text-primary-fixed" />
                {currentStore.distance === 9999 ? '?' : currentStore.distance} km
              </div>
            </div>

            {/* Info Toko */}
            <div className="p-5 flex flex-col gap-4 bg-surface z-20">
              <div>
                <h2 className="font-h2 text-h2 font-bold text-text-primary line-clamp-1 flex items-center gap-2">
                  {currentStore.name}
                  <span className="px-2 py-0.5 bg-error text-on-error text-[10px] uppercase rounded-full tracking-wider whitespace-nowrap">
                    {getDaysAgoText(currentStore.lastVisitAt)}
                  </span>
                </h2>
                <p className="font-body-sm text-body-sm text-text-secondary mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{currentStore.address || 'Alamat tidak tersedia'}</span>
                </p>
              </div>

              <div className="space-y-1.5 border-y border-dashed border-outline-variant py-3">
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-secondary">🔴 Piutang Aktif:</span>
                  <span className="font-bold text-error font-mono">{formatRp(currentStore.debt || 0)}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-text-secondary">📦 Aset Titipan:</span>
                  <span className="font-bold text-success font-mono">{formatRp(currentStore.assetValue || 0)}</span>
                </div>
              </div>

              {/* Flex Row Actions */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={openMaps}
                  className="w-1/2 flex flex-col items-center justify-center py-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-xl transition-colors text-text-primary gap-1"
                >
                  <MapIcon className="w-5 h-5" />
                  <span className="font-bold text-xs">BUKA MAPS</span>
                </button>
                <button 
                  onClick={startVisit}
                  className="w-1/2 flex flex-col items-center justify-center py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-xl transition-colors shadow-md gap-1"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span className="font-bold text-xs">KUNJUNGI</span>
                </button>
              </div>
            </div>
          </div>

          {/* FAKE BORDER RIGHT (Klik Maju) */}
          {hasNext && (
            <button 
              onClick={goNext}
              className="absolute -right-6  w-10  h-[85%] bg-surface rounded-l-3xl opacity-40 hover:opacity-80 transition-opacity flex items-center justify-start pl-1  shadow-2xl z-10 border-y border-l border-outline-variant"
            >
              <ChevronRight className="w-6 h-6 text-text-primary" />
            </button>
          )}

        </div>
      </div>

      {/* MINI JUMPER MENU (Bottom Sheet/Drawer) */}
      <div 
        className={`absolute bottom-0 inset-x-0 bg-on-surface/95 backdrop-blur-lg border-t border-white/10 transition-transform duration-300 ease-in-out z-50 ${
          showMiniMenu ? "translate-y-0" : "translate-y-[calc(100%-40px)]"
        }`}
      >
        <button 
          onClick={() => setShowMiniMenu(!showMiniMenu)} 
          className="w-full h-10 flex items-center justify-center gap-2 text-inverse-on-surface/50 hover:text-inverse-on-surface/80 transition-colors font-medium text-xs tracking-wider uppercase"
        >
          {showMiniMenu ? <ChevronDown className="w-4 h-4"/> : <ChevronUp className="w-4 h-4"/>}
          {showMiniMenu ? `Sembunyikan (Posisi ${currentIndex + 1} dari ${stores.length})` : 'Tampilkan Radar Rute'}
        </button>
        
        {/* Scrollable Mini Cards */}
        <div 
          ref={miniMenuRef}
          className="flex overflow-x-auto gap-3 px-4 pb-6 pt-2 snap-x snap-mandatory no-scrollbar relative"
        >
          {stores.map((store, idx) => (
            <button
              key={store.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-[4.5rem] h-20 rounded-2xl flex flex-col items-center justify-center snap-center transition-all duration-200 ${
                idx === currentIndex 
                  ? 'bg-surface-tint/30 text-inverse-on-surface ring-2 ring-primary scale-105 shadow-xl' 
                  : 'bg-inverse-surface/50 text-inverse-on-surface/60 border border-white/5 hover:bg-surface-tint/30'
              }`}
            >

              <span className="font-bold text-lg leading-none">
                {store.distance === 9999 ? '?' : store.distance}
              </span>
              <span className="font-caption text-[10px] mt-1 opacity-70">km</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
