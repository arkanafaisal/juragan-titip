import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Store, PackageSearch, CheckSquare, Clock, 
  Menu, X, Zap, MapPin, PackagePlus,
  LogOut, User as UserIcon, LayoutDashboard, 
  Package, ArrowUpDown, Tags, Plus, PlusCircle, 
  Search, Link2, Calendar, CalendarDays, Info, Loader2, Map
} from 'lucide-react';

import LandingPage from './pages/LandingPage';
import type { User } from './components/landing/AuthModal';

/* ==========================================================================
   TYPES
   ========================================================================== */

interface Titipan {
  id: number;
  produk: string;
  jumlah: number;
  lokasi: string;
  lastRestock: string;
  nextRestock: string;
  lat: number | null;
  lng: number | null;
  mapLink: string | null;
}

interface Produk {
  id: number;
  nama: string;
  modal: number;
  jual: number;
}

/* ==========================================================================
   MAIN APP
   ========================================================================== */

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setCurrentUser(userData);
    window.history.pushState({}, '', '/dashboard');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.history.pushState({}, '', '/');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  const renderPage = () => {
    if (currentPath === '/dashboard' || currentUser) {
      return <Dashboard user={currentUser || { username: 'Guest' }} onLogout={handleLogout} />;
    }

    // Default route
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  };

  return (
    <>
      {renderPage()}
    </>
  );
}

/* ==========================================================================
   DASHBOARD COMPONENT 
   ========================================================================== */

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('Daftar Titipan');

  // STATE TRANSAKSIONAL DENGAN LAT/LNG
  const [titipanData, setTitipanData] = useState<Titipan[]>([
    { id: 1, produk: "Keripik Singkong Pedas", jumlah: 15, lokasi: "Warung Bu Siti - Jl. Mawar No. 2", lastRestock: "2026-05-15", nextRestock: "2026-05-22", lat: -7.5666, lng: 110.8166, mapLink: null },
    { id: 2, produk: "Roti Coklat Mini Lumer", jumlah: 20, lokasi: "Toko Berkah - Jl. Melati No. 10", lastRestock: "2026-05-18", nextRestock: "2026-05-25", lat: -7.5566, lng: 110.8266, mapLink: null },
    { id: 3, produk: "Kacang Telur Garuda Premium", jumlah: 12, lokasi: "Warkop Cak Min - Gg. Kencana", lastRestock: "2026-05-10", nextRestock: "2026-05-17", lat: -7.5766, lng: 110.8066, mapLink: null },
    { id: 4, produk: "Kue Sus Kering Rasa Keju", jumlah: 8, lokasi: "Kantin Sekolah SD 01", lastRestock: "2026-05-19", nextRestock: "2026-05-26", lat: -7.5866, lng: 110.8366, mapLink: null },
  ]);

  // STATE MASTER DATA
  const [produkData] = useState<Produk[]>([
    { id: 1, nama: "Keripik Singkong Pedas", modal: 8000, jual: 10000 },
    { id: 2, nama: "Roti Coklat Mini Lumer", modal: 2000, jual: 3000 },
    { id: 3, nama: "Kacang Telur Garuda Premium", modal: 5000, jual: 6500 },
    { id: 4, nama: "Kue Sus Kering Rasa Keju", modal: 12000, jual: 15000 },
    { id: 5, nama: "Makaroni Pedas Daun Jeruk", modal: 3500, jual: 5000 },
  ]);

  // Handler Update Data Titipan
  const handleAddTitipan = (newData: Titipan) => {
    setTitipanData(prevData => [newData, ...prevData]);
  };

  useEffect(() => {
    if (isProfileOpen || isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isProfileOpen, isSidebarOpen]);

  const handleMenuChange = (menuName: string) => {
    setCurrentMenu(menuName);
    setIsSidebarOpen(false); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 leading-tight">JuraganTitip</span>
            <span className="font-extrabold text-gray-900 text-base sm:text-lg leading-tight">{currentMenu}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-sm font-bold text-gray-700 truncate max-w-[120px] sm:max-w-[200px]">
            {user.username}
          </span>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="bg-rose-100 text-rose-600 p-2 sm:p-2.5 rounded-full shadow-sm hover:bg-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
            title="Buka Profil"
          >
            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {currentMenu === 'Daftar Titipan' && <TitipanView titipanData={titipanData} onChangeMenu={handleMenuChange} />}
        {currentMenu === 'Tambah Titipan' && <FormTitipanView produkData={produkData} onAddTitipan={handleAddTitipan} onChangeMenu={handleMenuChange} />}
        {currentMenu === 'Katalog Produk' && <ProdukView produkData={produkData} />}
      </main>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="h-7 w-7 text-rose-600" />
                <span className="font-extrabold text-xl text-gray-900 tracking-tight">Menu Utama</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button onClick={() => handleMenuChange('Daftar Titipan')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'Daftar Titipan' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <PackageSearch className="h-5 w-5" /> Daftar Titipan
              </button>
              <button onClick={() => handleMenuChange('Tambah Titipan')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'Tambah Titipan' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <PackagePlus className="h-5 w-5" /> Tambah Titipan
              </button>
              <button onClick={() => handleMenuChange('Katalog Produk')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'Katalog Produk' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Tags className="h-5 w-5" /> Katalog Produk
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:bg-gray-50 rounded-2xl font-bold transition-colors cursor-not-allowed" title="Segera Hadir">
                <LayoutDashboard className="h-5 w-5" /> Dashboard Analitik
              </button>
            </div>
            
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 text-left">
                <div className="bg-white p-2 rounded-full shadow-sm text-gray-400"><Zap className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Versi 1.0.0</p>
                  <p className="text-[10px] font-medium text-gray-500">Up to date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Profile */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsProfileOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 text-center">
            <button onClick={() => setIsProfileOpen(false)} className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors focus:outline-none">
              <X className="h-5 w-5" />
            </button>
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner"><UserIcon className="h-10 w-10" /></div>
            <h3 className="text-xl font-extrabold text-gray-900 leading-none mb-2">{user.username}</h3>
            <p className="text-sm text-gray-500 font-medium mb-8">{user.email || 'Belum ada email yang ditambahkan'}</p>
            <div className="border-t border-gray-100 pt-6">
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 text-gray-700 hover:text-rose-600 font-bold rounded-xl transition-all shadow-sm">
                <LogOut className="h-4 w-4" /> Keluar Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   VIEW: DAFTAR TITIPAN 
   ========================================================================== */

interface TitipanViewProps {
  titipanData: Titipan[];
  onChangeMenu: (menu: string) => void;
}

function TitipanView({ titipanData, onChangeMenu }: TitipanViewProps) {
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedLocationMap, setSelectedLocationMap] = useState<Titipan | null>(null);

  const sortedData = useMemo(() => {
    return [...titipanData].sort((a, b) => {
      const dateA = new Date(a.nextRestock).getTime();
      const dateB = new Date(b.nextRestock).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [titipanData, sortOrder]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-gray-900">Data Stok Warung</h2>
          <p className="text-sm text-gray-500">Daftar produk yang sedang dititipkan di lokasi.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none">
            <ArrowUpDown className="h-4 w-4 text-gray-400 shrink-0" />
            <select 
              className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none w-full appearance-none cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Terbaru (Restock Terdekat)</option>
              <option value="oldest">Terlama (Restock Terjauh)</option>
            </select>
          </div>
          <button 
            onClick={() => onChangeMenu('Tambah Titipan')}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Titipan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah (Pcs)</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi Warung</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Terakhir Restock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Restock Selanjutnya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.length > 0 ? sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-rose-600" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">{item.produk}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 text-gray-800 font-bold text-sm rounded-lg">
                      {item.jumlah}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-[280px]">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedLocationMap(item)}
                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl shrink-0 transition-colors shadow-sm"
                        title="Lihat Peta Lokasi"
                      >
                        <MapPin className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-600 truncate block" title={item.lokasi}>
                        {item.lokasi}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-500">{formatDate(item.lastRestock)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 font-bold text-sm rounded-lg">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(item.nextRestock)}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium text-sm">
                    Belum ada data titipan barang. Silakan tambah data baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between text-sm text-gray-500 font-medium">
          <span>Menampilkan {sortedData.length} data</span>
        </div>
      </div>

      {/* MODAL PETA VIEW ONLY */}
      {selectedLocationMap && (
        <LocationModal 
          data={selectedLocationMap} 
          onClose={() => setSelectedLocationMap(null)} 
        />
      )}
    </>
  );
}

/* ==========================================================================
   KOMPONEN MODAL PETA LOKASI (VIEW ONLY)
   ========================================================================== */

interface LocationModalProps {
  data: Titipan;
  onClose: () => void;
}

declare global {
  interface Window {
    L: any;
  }
}

function LocationModal({ data, onClose }: LocationModalProps) {
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 text-gray-900">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        <div className="flex items-start justify-between mb-5">
          <div className="pr-4 text-left">
            <h3 className="text-xl font-extrabold text-gray-900 leading-tight">Lokasi Warung</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2" title={data.lokasi}>{data.lokasi}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors focus:outline-none shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {hasCoords ? (
          <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 relative mb-6">
             <div ref={mapRef} className="w-full h-full z-0"></div>
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-50 rounded-2xl border border-gray-200 border-dashed flex flex-col items-center justify-center mb-6 text-gray-400">
             <MapPin className="h-10 w-10 mb-2 opacity-40" />
             <p className="text-sm font-medium">Peta Interaktif Tidak Tersedia.</p>
             <p className="text-xs mt-1 text-center px-4">Pengguna mencatat lokasi ini menggunakan Link Eksternal atau Teks Alamat Manual.</p>
          </div>
        )}

        <a 
          href={gmapsLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full h-12 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-md"
        >
           <Map className="h-4 w-4" /> Buka di Google Maps
        </a>
      </div>
    </div>
  );
}

/* ==========================================================================
   VIEW: TAMBAH TITIPAN (FORM DENGAN LEAFLET & NOMINATIM)
   ========================================================================== */

interface FormTitipanViewProps {
  produkData: Produk[];
  onAddTitipan: (newData: Titipan) => void;
  onChangeMenu: (menu: string) => void;
}

function FormTitipanView({ produkData, onAddTitipan, onChangeMenu }: FormTitipanViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form
  const [selectedProdukId, setSelectedProdukId] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [lokasiType, setLokasiType] = useState<'map' | 'link'>('map'); 
  const [alamatLokasi, setAlamatLokasi] = useState('');
  const [linkMap, setLinkMap] = useState('');
  
  // Tanggal Hari Ini & Next Restock
  const todayDate = new Date().toISOString().split('T')[0];
  const [lastRestock, setLastRestock] = useState(todayDate);
  const [nextRestockType, setNextRestockType] = useState<'tanggal' | 'hari'>('hari'); 
  const [nextRestockDate, setNextRestockDate] = useState('');
  const [nextRestockDays, setNextRestockDays] = useState('7'); // Default 1 minggu

  // State Map
  const [coords, setCoords] = useState<[number, number]>([-7.5666, 110.8166]); // Default Surakarta
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCoords([position.coords.latitude, position.coords.longitude]),
        (error) => console.log("GPS Ditolak/Gagal, menggunakan default kota.", error)
      );
    }
  }, []);

  useEffect(() => {
    if (lokasiType !== 'map') return;

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
        const map = window.L.map(mapRef.current).setView(coords, 15);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const marker = window.L.marker(coords, { draggable: true }).addTo(map);
        
        marker.on('dragend', function () {
          const position = marker.getLatLng();
          setCoords([position.lat, position.lng]);
        });

        mapInstance.current = map;
        markerInstance.current = marker;
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [lokasiType]);

  useEffect(() => {
    if (mapInstance.current && markerInstance.current) {
      mapInstance.current.setView(coords, 15);
      markerInstance.current.setLatLng(coords);
    }
  }, [coords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdukId || !jumlah || !lastRestock) {
      alert("Mohon lengkapi field Nama Produk, Jumlah, dan Tanggal Terakhir Restock.");
      return;
    }

    setIsSubmitting(true);

    const selectedProductObj = produkData.find(p => p.id === parseInt(selectedProdukId));
    const namaProdukStr = selectedProductObj ? selectedProductObj.nama : "Produk Tidak Dikenal";

    let finalLokasi = alamatLokasi.trim();
    
    if (!finalLokasi) {
      if (lokasiType === 'map') {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`);
          const data = await response.json();
          finalLokasi = data.display_name || `Titik Koordinat: ${coords[0]}, ${coords[1]}`;
        } catch (error) {
          finalLokasi = `Titik Koordinat: ${coords[0]}, ${coords[1]}`;
        }
      } else {
        finalLokasi = linkMap.trim() || "Lokasi Tidak Diketahui";
      }
    }

    let finalNextRestock = nextRestockDate;
    if (nextRestockType === 'hari') {
      const restockDateObj = new Date(lastRestock);
      restockDateObj.setDate(restockDateObj.getDate() + parseInt(nextRestockDays || '0'));
      finalNextRestock = restockDateObj.toISOString().split('T')[0];
    }

    // Include data koordinat & link ke payload state
    const newTitipan: Titipan = {
      id: Date.now(),
      produk: namaProdukStr,
      jumlah: parseInt(jumlah),
      lokasi: finalLokasi,
      lastRestock: lastRestock,
      nextRestock: finalNextRestock,
      lat: lokasiType === 'map' ? coords[0] : null,
      lng: lokasiType === 'map' ? coords[1] : null,
      mapLink: lokasiType === 'link' ? linkMap : null
    };

    onAddTitipan(newTitipan);
    setIsSubmitting(false);
    onChangeMenu('Daftar Titipan');
  };

  return (
    <div className="max-w-3xl mx-auto w-full text-gray-900">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-gray-900">Form Tambah Titipan</h2>
          <p className="text-sm text-gray-500">Catat penyebaran produk ke warung baru atau lama.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk (Dari Katalog)</label>
              <select 
                value={selectedProdukId}
                onChange={(e) => setSelectedProdukId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium"
              >
                <option value="">-- Pilih Produk --</option>
                {produkData.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Dititipkan (Pcs)</label>
              <input 
                type="number" min="1" placeholder="Contoh: 15" 
                value={jumlah} onChange={(e) => setJumlah(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <label className="block text-sm font-bold text-gray-700">Tandai Lokasi Warung</label>
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button 
                  type="button"
                  onClick={() => setLokasiType('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lokasiType === 'map' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <MapPin className="h-3.5 w-3.5" /> Peta (Map)
                </button>
                <button 
                  type="button"
                  onClick={() => setLokasiType('link')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lokasiType === 'link' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Link2 className="h-3.5 w-3.5" /> Link Maps
                </button>
              </div>
            </div>

            <div className="mb-4 text-left">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Nama/Alamat Lengkap (Opsional)</label>
              <input 
                type="text" 
                placeholder="Jika dikosongkan, sistem akan generate otomatis dari titik Map" 
                value={alamatLokasi}
                onChange={(e) => setAlamatLokasi(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" 
              />
            </div>

            {lokasiType === 'link' ? (
              <input 
                type="url" placeholder="Paste https://maps.google.com/..." 
                value={linkMap} onChange={(e) => setLinkMap(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" 
              />
            ) : (
              <div className="space-y-3">
                <div className="relative w-full h-64 sm:h-72 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 z-10" id="map-container">
                  <div ref={mapRef} className="w-full h-full"></div>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                  <Info className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  Geser pin merah ke lokasi warung. Sistem akan mendeteksi nama alamat otomatis (Reverse Geocoding).
                </p>
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Mulai Titip (Restock)</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input 
                  type="date" 
                  value={lastRestock}
                  onChange={(e) => setLastRestock(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium text-gray-700" 
                />
              </div>
            </div>
            
            <div className="text-left">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">Tanggal Next Restock</label>
                <button 
                  type="button" 
                  onClick={() => setNextRestockType(prev => prev === 'tanggal' ? 'hari' : 'tanggal')}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline uppercase tracking-wider"
                >
                  Ubah ke Format {nextRestockType === 'tanggal' ? 'Hari' : 'Tanggal'}
                </button>
              </div>
              
              <div className="relative">
                {nextRestockType === 'tanggal' ? (
                  <>
                    <CalendarDays className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="date" 
                      value={nextRestockDate}
                      onChange={(e) => setNextRestockDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium text-gray-700" 
                    />
                  </>
                ) : (
                  <>
                    <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="number" min="1" placeholder="Berapa hari lagi?" 
                      value={nextRestockDays}
                      onChange={(e) => setNextRestockDays(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium text-gray-700" 
                    />
                    <span className="absolute right-4 top-3.5 text-sm font-bold text-gray-400">Hari</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="text-left">
            <label className="block text-sm font-bold text-gray-700 mb-2">Status Pembayaran</label>
            <select disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed appearance-none">
              <option>Draft (Sistem Akan Melacak Otomatis Nanti)</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Menyimpan Data & Melacak Lokasi...</>
              ) : (
                <><CheckSquare className="h-5 w-5" /> Simpan Data Titipan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================================================
   VIEW: KATALOG PRODUK (MASTER DATA)
   ========================================================================== */

interface ProdukViewProps {
  produkData: Produk[];
}

function ProdukView({ produkData }: ProdukViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProduk = produkData.filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-gray-900">Katalog Produk</h2>
          <p className="text-sm text-gray-500">Kelola master data produk dan harga dasar agar mudah dipilih saat menitipkan barang.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Pencarian */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm flex-1 sm:flex-none">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none w-full"
            />
          </div>
          <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Informasi Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Modal / Pcs</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Jual / Pcs</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estimasi Laba (Margin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProduk.length > 0 ? filteredProduk.map((item) => {
                const margin = item.jual - item.modal;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Tags className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{item.nama}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{formatRupiah(item.modal)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{formatRupiah(item.jual)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-green-50 text-green-700 font-bold text-sm rounded-lg border border-green-100">
                        + {formatRupiah(margin)}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium text-sm">
                    Produk tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
