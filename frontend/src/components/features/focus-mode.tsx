import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { 
  X, MapPin, Map, Play, ChevronDown, ChevronUp, 
  ChevronLeft, ChevronRight, Navigation 
} from "lucide-react";
import { db, DbStore } from "@/lib/db";
import { toast } from "sonner";

// Extend tipe Store dengan properti jarak sementara
type StoreWithDistance = DbStore & { distance: number };

interface FocusModeProps {
  onClose: () => void;
}

export function FocusMode({ onClose }: FocusModeProps) {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreWithDistance[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [showMiniMenu, setShowMiniMenu] = useState(true);
  const miniMenuRef = useRef<HTMLDivElement>(null);

  // Helper: Format Rupiah
  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  // Helper: Rumus Haversine untuk menghitung jarak (dalam KM)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 9999; // Fallback jika tidak ada kordinat
    const R = 6371; // Radius bumi dalam KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1)); // 1 angka di belakang koma (misal: 1.2)
  };

  // 1. Muat toko dari IndexedDB (Hanya yang tidak diarsipkan)
  useEffect(() => {
    const loadStores = async () => {
      try {
        const allStores = await db.stores.toArray(); // Bisa tambahkan filter isArchived jika schema sudah update
        
        // Default distance 9999 sebelum lokasi diketahui
        const initialStores = allStores.map(s => ({ ...s, distance: 9999 }));
        setStores(initialStores);
        
        // Auto fetch lokasi saat pertama buka
        handleUpdateLocation(initialStores);
      } catch (error) {
        toast.error("Gagal memuat data toko.");
      }
    };
    loadStores();
  }, []);

  // 2. Fungsi Perbarui Lokasi GPS
  const handleUpdateLocation = (storeList = stores) => {
    if (!navigator.geolocation) {
      toast.error("GPS tidak didukung di perangkat ini.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        
        // Kalkulasi jarak dan urutkan
        const sorted = storeList.map(s => ({
          ...s,
          distance: calculateDistance(latitude, longitude, s.latitude, s.longitude)
        })).sort((a, b) => a.distance - b.distance);

        setStores(sorted);
        setCurrentIndex(0); // Reset ke toko terdekat (urutan 1)
        setIsLocating(false);
        toast.success("Lokasi diperbarui! Menampilkan toko terdekat.");
      },
      (err) => {
        setIsLocating(false);
        toast.error("Gagal mendapatkan lokasi GPS.");
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // 3. Efek Auto-Scroll pada Mini Menu saat Index Berubah
  useEffect(() => {
    if (miniMenuRef.current) {
      const activeEl = miniMenuRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentIndex]);

  if (stores.length === 0) return null;

  const currentStore = stores[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < stores.length - 1;

  // Aksi Tombol
  const goPrev = () => { if (hasPrev) setCurrentIndex(prev => prev - 1); };
  const goNext = () => { if (hasNext) setCurrentIndex(prev => prev + 1); };
  
  const openMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${currentStore.latitude},${currentStore.longitude}`, '_blank');
  };

  const startVisit = () => {
    navigate(`/stores/${currentStore.id}/visit`);
    onClose(); // Tutup mode fokus saat mulai kunjungan
  };

  return (
    // FULLSCREEN OVERLAY
    <div className="fixed inset-0 z-[100] bg-neutral-900 flex flex-col font-body animate-in fade-in duration-300">
      
      {/* HEADER BAR */}
      <div className="flex justify-between items-center p-4 text-white shrink-0">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
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
      <div className="flex-1 flex items-center justify-center relative overflow-hidden pb-20">
        
        <div className="relative w-full max-w-[360px] flex items-center justify-center">
          
          {/* FAKE BORDER LEFT (Klik Mundur) */}
          {hasPrev && (
            <button 
              onClick={goPrev}
              className="absolute -left-6 sm:-left-12 w-10 sm:w-16 h-[85%] bg-surface rounded-r-3xl opacity-40 hover:opacity-80 transition-opacity flex items-center justify-end pr-1 sm:pr-2 shadow-2xl z-10 border-y border-r border-outline-variant"
            >
              <ChevronLeft className="w-6 h-6 text-text-primary" />
            </button>
          )}

          {/* MAIN CARD ACTIVE */}
          <div className="w-full bg-surface rounded-3xl shadow-2xl overflow-hidden flex flex-col mx-4 z-20 transition-all duration-300">
            
            {/* Peta Read-Only (Iframe Google Maps) */}
            <div className="h-40 bg-surface-container-low relative">
              <iframe 
                src={`https://maps.google.com/maps?q=${currentStore.latitude || 0},${currentStore.longitude || 0}&z=16&output=embed`}
                className="w-full h-full border-0 pointer-events-none opacity-80" 
                loading="lazy"
                title="Map"
              />
              <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-surface/50 to-transparent pointer-events-none" />
              
              {/* Badge Jarak di Atas Peta */}
              <div className="absolute bottom-3 right-3 bg-neutral-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                <MapPin className="w-4 h-4 text-primary-fixed" />
                {currentStore.distance === 9999 ? '?' : currentStore.distance} km
              </div>
            </div>

            {/* Info Toko */}
            <div className="p-5 flex flex-col gap-4">
              <div>
                <h2 className="font-h2 text-h2 font-bold text-text-primary line-clamp-1">{currentStore.name}</h2>
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
                  <Map className="w-5 h-5" />
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
              className="absolute -right-6 sm:-right-12 w-10 sm:w-16 h-[85%] bg-surface rounded-l-3xl opacity-40 hover:opacity-80 transition-opacity flex items-center justify-start pl-1 sm:pl-2 shadow-2xl z-10 border-y border-l border-outline-variant"
            >
              <ChevronRight className="w-6 h-6 text-text-primary" />
            </button>
          )}

        </div>
      </div>

      {/* MINI JUMPER MENU (Bottom Sheet/Drawer) */}
      <div 
        className={`absolute bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-lg border-t border-white/10 transition-transform duration-300 ease-in-out ${
          showMiniMenu ? "translate-y-0" : "translate-y-[calc(100%-40px)]"
        }`}
      >
        <button 
          onClick={() => setShowMiniMenu(!showMiniMenu)} 
          className="w-full h-10 flex items-center justify-center gap-2 text-white/50 hover:text-white/80 transition-colors font-medium text-xs tracking-wider uppercase"
        >
          {showMiniMenu ? <ChevronDown className="w-4 h-4"/> : <ChevronUp className="w-4 h-4"/>}
          {showMiniMenu ? `Sembunyikan (Posisi ${currentIndex + 1} dari ${stores.length})` : 'Tampilkan Radar Rute'}
        </button>
        
        {/* Scrollable Mini Cards */}
        <div 
          ref={miniMenuRef}
          className="flex overflow-x-auto gap-3 px-4 pb-6 pt-2 snap-x snap-mandatory no-scrollbar"
        >
          {stores.map((store, idx) => (
            <button
              key={store.id}
              onClick={() => setCurrentIndex(idx)}
              className={`shrink-0 w-[4.5rem] h-20 rounded-2xl flex flex-col items-center justify-center snap-center transition-all duration-200 ${
                idx === currentIndex 
                  ? 'bg-neutral-800 text-white ring-2 ring-primary scale-105 shadow-xl' 
                  : 'bg-neutral-900/50 text-white/60 border border-white/5 hover:bg-neutral-800'
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