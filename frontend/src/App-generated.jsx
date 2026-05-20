/*
===========================================================================
KOMITMEN SENIOR DEVELOPER (Fiksasi Tabel, Modal Peta & Sinkronisasi Data)
===========================================================================
1. Design System: Tetap mematuhi "airbnb.md" (Rose theme, rounded-3xl).
2. Perbaikan Fungsionalitas Data:
   - Menambahkan key `lat`, `lng`, dan `mapLink` pada objek data titipan 
     agar koordinat bisa disimpan dan dilempar ke modal tabel.
   - Sinkronisasi Form -> Tabel dipastikan berfungsi memunculkan row baru.
3. Fitur Baru pada Tabel Daftar Titipan:
   - Kolom Lokasi kini memiliki tombol Ikon Pin Peta.
   - Klik Ikon -> Muncul Modal `LocationModal` (View Only Map).
   - Di dalam modal terdapat tombol "Buka di Google Maps" yang mereferensikan
     titik koordinat atau link peta dari input pengguna.
4. Code Style: React, Vite, TailwindCSS v4, 1 file modular.
===========================================================================
*/

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Store, PackageSearch, CheckSquare, Clock, 
  BarChart3, MessageCircle, Menu, X, ArrowRight, 
  ChevronRight, Activity, Zap, BookOpen, 
  MapPin, PackagePlus, Wallet, Wrench, Star,
  LogOut, User, AlertCircle, LayoutDashboard, Package, ArrowUpDown,
  Tags, Plus, PlusCircle, Search, Link2, Calendar, CalendarDays, Info, Loader2, Map
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModal, setAuthModal] = useState(null); 

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setAuthModal(null);
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      <Navbar onLogin={() => setAuthModal('login')} onRegister={() => setAuthModal('register')} />
      <main>
        <HeroSection onRegister={() => setAuthModal('register')} />
        <CurrentFeaturesSection />
        <GuidebookSection />
        <UpcomingFeaturesSection />
        <ChangelogSection />
        <CtaSection onRegister={() => setAuthModal('register')} />
      </main>
      <Footer />
      
      {authModal && (
        <AuthModal 
          initialMode={authModal} 
          onClose={() => setAuthModal(null)} 
          onSuccess={handleAuthSuccess} 
        />
      )}
    </div>
  );
}

/* ==========================================================================
   DASHBOARD COMPONENT 
   ========================================================================== */

function Dashboard({ user, onLogout }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('Daftar Titipan');

  // STATE TRANSAKSIONAL DENGAN LAT/LNG
  const [titipanData, setTitipanData] = useState([
    { id: 1, produk: "Keripik Singkong Pedas", jumlah: 15, lokasi: "Warung Bu Siti - Jl. Mawar No. 2", lastRestock: "2026-05-15", nextRestock: "2026-05-22", lat: -7.5666, lng: 110.8166, mapLink: null },
    { id: 2, produk: "Roti Coklat Mini Lumer", jumlah: 20, lokasi: "Toko Berkah - Jl. Melati No. 10", lastRestock: "2026-05-18", nextRestock: "2026-05-25", lat: -7.5566, lng: 110.8266, mapLink: null },
    { id: 3, produk: "Kacang Telur Garuda Premium", jumlah: 12, lokasi: "Warkop Cak Min - Gg. Kencana", lastRestock: "2026-05-10", nextRestock: "2026-05-17", lat: -7.5766, lng: 110.8066, mapLink: null },
    { id: 4, produk: "Kue Sus Kering Rasa Keju", jumlah: 8, lokasi: "Kantin Sekolah SD 01", lastRestock: "2026-05-19", nextRestock: "2026-05-26", lat: -7.5866, lng: 110.8366, mapLink: null },
  ]);

  // STATE MASTER DATA
  const [produkData, setProdukData] = useState([
    { id: 1, nama: "Keripik Singkong Pedas", modal: 8000, jual: 10000 },
    { id: 2, nama: "Roti Coklat Mini Lumer", modal: 2000, jual: 3000 },
    { id: 3, nama: "Kacang Telur Garuda Premium", modal: 5000, jual: 6500 },
    { id: 4, nama: "Kue Sus Kering Rasa Keju", modal: 12000, jual: 15000 },
    { id: 5, nama: "Makaroni Pedas Daun Jeruk", modal: 3500, jual: 5000 },
  ]);

  // Handler Update Data Titipan
  const handleAddTitipan = (newData) => {
    setTitipanData(prevData => [newData, ...prevData]);
  };

  useEffect(() => {
    if (isProfileOpen || isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => document.body.style.overflow = 'unset';
  }, [isProfileOpen, isSidebarOpen]);

  const handleMenuChange = (menuName) => {
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
          <div className="flex flex-col">
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
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
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
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
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
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner"><User className="h-10 w-10" /></div>
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

function TitipanView({ titipanData, onChangeMenu }) {
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedLocationMap, setSelectedLocationMap] = useState(null); // State untuk modal peta

  const sortedData = useMemo(() => {
    return [...titipanData].sort((a, b) => {
      const dateA = new Date(a.nextRestock);
      const dateB = new Date(b.nextRestock);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [titipanData, sortOrder]);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
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
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium text-sm">
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

function LocationModal({ data, onClose }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  
  const hasCoords = data.lat != null && data.lng != null;
  const coords = hasCoords ? [data.lat, data.lng] : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, []);

  useEffect(() => {
    if (!hasCoords) return;
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
        await new Promise((resolve) => { script.onload = resolve; });
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        <div className="flex items-start justify-between mb-5">
          <div className="pr-4">
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

function FormTitipanView({ produkData, onAddTitipan, onChangeMenu }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form
  const [selectedProdukId, setSelectedProdukId] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [lokasiType, setLokasiType] = useState('map'); // 'link' or 'map'
  const [alamatLokasi, setAlamatLokasi] = useState('');
  const [linkMap, setLinkMap] = useState('');
  
  // Tanggal Hari Ini & Next Restock
  const todayDate = new Date().toISOString().split('T')[0];
  const [lastRestock, setLastRestock] = useState(todayDate);
  const [nextRestockType, setNextRestockType] = useState('hari'); // 'tanggal' or 'hari'
  const [nextRestockDate, setNextRestockDate] = useState('');
  const [nextRestockDays, setNextRestockDays] = useState('7'); // Default 1 minggu

  // State Map
  const [coords, setCoords] = useState([-7.5666, 110.8166]); // Default Surakarta
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);

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

  const handleSubmit = async (e) => {
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
      restockDateObj.setDate(restockDateObj.getDate() + parseInt(nextRestockDays || 0));
      finalNextRestock = restockDateObj.toISOString().split('T')[0];
    }

    // Include data koordinat & link ke payload state
    const newTitipan = {
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
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Form Tambah Titipan</h2>
          <p className="text-sm text-gray-500">Catat penyebaran produk ke warung baru atau lama.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
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
            <div>
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

            <div className="mb-4">
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
            <div>
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
            
            <div>
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

          <div>
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

function ProdukView({ produkData }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProduk = produkData.filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
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
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 font-medium text-sm">
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

/* ==========================================================================
   MODAL AUTENTIKASI 
   ========================================================================== */

function AuthModal({ initialMode, onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode); 
  const [formData, setFormData] = useState({ identifier: '', username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (mode === 'register') {
      if (!formData.username) newErrors.username = "Wajib diisi.";
      else if (formData.username.length > 20) newErrors.username = "Maksimal 20 karakter.";

      if (formData.email && formData.email.length > 255) newErrors.email = "Maksimal 255 karakter.";

      if (!formData.password) newErrors.password = "Wajib diisi.";
      else if (formData.password.length < 6) newErrors.password = "Minimal 6 karakter.";
      else if (formData.password.length > 255) newErrors.password = "Maksimal 255 karakter.";

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Tidak cocok.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      onSuccess({ username: formData.username, email: formData.email });

    } else {
      if (!formData.identifier) newErrors.identifier = "Wajib diisi.";
      else if (formData.identifier.length > 255) newErrors.identifier = "Melebihi batas.";

      if (!formData.password) newErrors.password = "Wajib diisi.";
      else if (formData.password.length < 6) newErrors.password = "Minimal 6 karakter.";
      else if (formData.password.length > 255) newErrors.password = "Maksimal 255 karakter.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      onSuccess({ username: formData.identifier, email: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 sm:mb-6 text-center">
          <div className="mx-auto bg-rose-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-4">
            <Store className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Gratis'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            {mode === 'login' ? 'Kelola kembali catatan warung Anda.' : 'Mulai sistematiskan usaha titip Anda hari ini.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'login' ? (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Username / Email</label>
                <input type="text" name="identifier" value={formData.identifier} onChange={handleChange} placeholder="Masukkan username atau email" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.identifier ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.identifier && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.identifier}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.password && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.password}</p>}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Username <span className="text-rose-500">*</span></label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Maks 20 karakter" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.username && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.username}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(Opsional)</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nama@email.com" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.email && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Password <span className="text-rose-500">*</span></label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimal 6 karakter" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.password && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1">Konfirmasi Password <span className="text-rose-500">*</span></label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Ulangi password" className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-50 border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm`} />
                {errors.confirmPassword && <p className="text-red-500 text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          <button type="submit" className="w-full h-10 sm:h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-sm sm:text-base transition-colors shadow-md mt-4 sm:mt-6">
            {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm font-medium text-gray-500">
          {mode === 'login' ? (
            <>Belum punya akun? <button onClick={() => setMode('register')} className="text-rose-600 hover:underline">Daftar di sini</button></>
          ) : (
            <>Sudah punya akun? <button onClick={() => setMode('login')} className="text-rose-600 hover:underline">Masuk</button></>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   LANDING PAGE COMPONENTS 
   ========================================================================== */

function Navbar({ onLogin, onRegister }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-2.5">
            <div className="text-rose-600"><Store className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.5} /></div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-rose-600">JuraganTitip</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#fitur" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Fitur</a>
            <a href="#panduan" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Panduan</a>
            <a href="#roadmap" className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">Roadmap</a>
            <button onClick={onLogin} className="text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors ml-4">Masuk</button>
            <button onClick={onRegister} className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm">Mulai Gratis</button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-rose-600 p-2 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 shadow-lg">
          <a href="#fitur" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Fitur</a>
          <a href="#panduan" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Panduan</a>
          <a href="#roadmap" className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Roadmap</a>
          <hr className="border-gray-100 my-2" />
          <button onClick={onLogin} className="w-full text-left px-4 py-3 text-base font-semibold text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl">Masuk</button>
          <button onClick={onRegister} className="w-full mt-2 bg-rose-600 text-white px-4 py-3.5 rounded-full text-base font-semibold text-center shadow-sm">Mulai Gratis</button>
        </div>
      )}
    </nav>
  );
}

function HeroSection({ onRegister }) {
  return (
    <section className="relative pt-28 pb-10 md:pt-36 md:pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Activity className="h-4 w-4" /><span>Sistem Manajemen Titip Warung</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
          Sistematiskan Bisnis <br className="hidden sm:block" /> Titip Barang Anda.
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Catat stok, pantau tagihan lunas/bon, dan hitung keuntungan per warung dalam satu layar yang ringkas dan bebas pusing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onRegister} className="w-full sm:w-auto h-12 md:h-14 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
            Mulai Pencatatan <ArrowRight className="h-5 w-5" />
          </button>
          <a href="#panduan" className="w-full sm:w-auto h-12 md:h-14 px-8 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 rounded-full font-bold text-base transition-colors flex items-center justify-center">
            Baca Panduan
          </a>
        </div>
      </div>
    </section>
  );
}

function CurrentFeaturesSection() {
  const features = [
    { icon: <PackageSearch />, title: "Data Produk & Pemetaan Warung", desc: "Kelola daftar produk beserta rincian jumlah stoknya, serta pantau di warung mana saja barang tersebut didistribusikan dalam satu database terpusat." },
    { icon: <CheckSquare />, title: "Tagihan Piutang & Kalkulasi Laba", desc: "Tandai otomatis warung yang masih berstatus bon atau sudah lunas. Sistem akan langsung merekap margin keuntungan bersih Anda pada periode tersebut." },
    { icon: <Clock />, title: "Penjadwalan Restock Otomatis", desc: "Tidak ada lagi warung yang terlewat. Atur tanggal pengiriman terakhir dan sistem akan mengingatkan jadwal penarikan barang kadaluarsa atau restock." },
  ];

  return (
    <section id="fitur" className="pt-12 pb-12 md:pb-16 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-gray-900">Operasional Lapangan Lebih Terukur</h2>
          <p className="text-base text-gray-600 max-w-2xl">Modul inti yang dirancang seringkas mungkin agar input data bisa dilakukan dengan cepat dari HP saat Anda sedang berada di lapangan.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feat, index) => (
            <div key={index} className="bg-white border border-gray-200 p-6 md:p-8 rounded-3xl hover:shadow-xl hover:border-rose-100 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full shrink-0 bg-rose-100 flex items-center justify-center text-rose-600">{React.cloneElement(feat.icon, { className: "h-6 w-6" })}</div>
                <h3 className="text-lg font-bold leading-tight text-gray-900">{feat.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidebookSection() {
  const steps = [
    { icon: <MapPin />, title: "1. Daftarkan Titik Warung", desc: "Masukkan nama warung dan lokasi. Anda hanya perlu melakukan ini sekali di awal kerja sama." },
    { icon: <PackagePlus />, title: "2. Input Barang Titipan", desc: "Pilih produk, masukkan jumlah yang dititipkan, dan tentukan harga dasar serta harga jual." },
    { icon: <Wallet />, title: "3. Pantau & Tarik Laba", desc: "Saat jadwal restock tiba, perbarui sisa barang. Sistem otomatis menghitung uang yang harus ditagih." }
  ];

  return (
    <section id="panduan" className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full mb-4">
            <BookOpen className="h-4 w-4 text-rose-600" /><span className="text-xs font-bold uppercase tracking-widest text-rose-600">Buku Panduan</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3 text-gray-900">3 Langkah Mudah Memulai</h2>
          <p className="text-base text-gray-600">Tidak butuh waktu lama untuk memindahkan catatan manual Anda. Prosesnya kami buat sesederhana mungkin.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-center relative z-10 hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-600 flex items-center justify-center text-white mb-5 shadow-lg shadow-rose-200">{React.cloneElement(step.icon, { className: "h-7 w-7" })}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingFeaturesSection() {
  const upcoming = [
    { icon: <BarChart3 />, title: "Analitik Data & Pencarian Lanjutan", desc: "Visualisasi metrik tren performa warung terbaik dan pencarian riwayat data menggunakan kombinasi filter yang spesifik." },
    { icon: <MessageCircle />, title: "Automasi WhatsApp & Export Excel", desc: "Kirim rincian tagihan ke pemilik warung via WA dengan sekali klik, dan unduh rekapitulasi data format XLSX untuk pembukuan eksternal." },
  ];

  return (
    <section id="roadmap" className="py-12 md:py-16 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-3 block">Roadmap Mendatang</span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 text-gray-900">Persiapan Skala Besar</h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">Kami sedang menyiapkan fitur-fitur ini agar aplikasi tidak hanya menjadi buku catatan, tetapi juga asisten bisnis proaktif Anda.</p>
          </div>
          <div className="flex flex-col gap-4">
            {upcoming.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-5 md:p-6 rounded-3xl border border-gray-100 hover:border-rose-200 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">{React.cloneElement(item.icon, { className: "h-5 w-5" })}</div>
                <div>
                  <h4 className="text-base font-bold mb-2 text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const changelogData = [
  { version: "v1.0.0", date: "19 Mei 2026", title: "Rilis Publik Perdana (MVP)", isMajor: true, items: ["Peluncuran resmi sistem untuk wirausaha skala kecil & menengah.", "Penambahan fitur pengingat jadwal penarikan otomatis.", "Perbaikan UI/UX berdasarkan masukan dari tahap Beta."] },
  { version: "v0.9.5", date: "5 Mei 2026", title: "Optimalisasi Kalkulasi & Kecepatan", isMajor: false, items: ["Memperbaiki bug pembulatan desimal pada kalkulasi margin laba.", "Meningkatkan kecepatan muat (loading) data warung hingga 40%.", "Penyesuaian responsivitas layout untuk perangkat layar kecil."] },
  { version: "v0.9.0", date: "15 April 2026", title: "Sistem Keuangan & Tagihan", isMajor: true, items: ["Modul penandaan tagihan (Bon/Lunas) untuk setiap titik warung.", "Kalkulator otomatis untuk menghitung laba kotor & bersih.", "Penambahan ringkasan kas (summary) di dashboard utama."] },
  { version: "v0.8.5", date: "28 Maret 2026", title: "Dukungan Mode Cache", isMajor: false, items: ["Sistem kini menyimpan data sementara (cache) agar tetap bisa dibuka meski sinyal internet lemah di lapangan.", "Memperbaiki isu gagal simpan koordinat map warung."] },
  { version: "v0.8.0", date: "10 Maret 2026", title: "Versi Beta Internal", isMajor: true, items: ["Pembuatan modul awal: database pendaftaran lokasi warung.", "Manajemen inventaris (input nama, harga, dan kuantitas produk).", "Sinkronisasi data multi-perangkat via Cloud dasar."] }
];

function ChangelogSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const majorReleases = changelogData.filter(release => release.isMajor).slice(0, 3);

  return (
    <section id="changelog" className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">Riwayat Pengembangan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {majorReleases.map((release, index) => (
            <div key={index} className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 md:p-6 hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
              <div className="mb-4 pb-4 border-b border-gray-200/60 relative z-10">
                <span className="block text-xs font-semibold text-gray-500 mb-2">{release.date}</span>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{release.title}</h3>
              </div>
              <ul className="space-y-2.5 mt-auto relative z-10">
                {release.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></div><span className="text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 md:mt-10 text-center">
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full font-bold text-sm transition-colors">
            Lihat Seluruh Catatan Rilis <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isModalOpen && <ChangelogModal releases={changelogData} onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}

function ChangelogModal({ releases, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'unset';
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 sm:p-6 sm:px-8 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Seluruh Catatan Versi</h3>
            <p className="text-sm text-gray-500 mt-1">Riwayat pembaruan sistem secara lengkap.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors focus:outline-none"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8">
          {releases.map((release, index) => (
            <div key={index} className="relative pl-6 sm:pl-8">
              {index !== releases.length - 1 && <div className="absolute left-[7px] sm:left-[11px] top-8 bottom-[-2rem] w-0.5 bg-gray-100"></div>}
              <div className={`absolute left-0 sm:left-1 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${release.isMajor ? 'bg-rose-500' : 'bg-gray-300'}`}></div>
              <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-lg font-bold text-gray-900">{release.version}</span>
                {!release.isMajor && <span className="p-1.5 bg-gray-100 text-gray-500 rounded-md flex items-center" title="Rilis Minor"><Wrench className="h-3.5 w-3.5" /></span>}
                {release.isMajor && <span className="p-1.5 bg-rose-50 text-rose-600 rounded-md flex items-center" title="Rilis Mayor"><Star className="h-3.5 w-3.5" /></span>}
                <span className="text-sm font-medium text-gray-500 ml-auto">{release.date}</span>
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-3">{release.title}</h4>
              <ul className="space-y-2">
                {release.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-600"><div className="w-1 h-1 rounded-full bg-gray-400 mt-2 shrink-0"></div><span className="text-sm leading-relaxed">{item}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-[2rem] text-center shrink-0">
          <p className="text-xs text-gray-500 font-medium">Anda sedang melihat riwayat hingga versi v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

function CtaSection({ onRegister }) {
  return (
    <section className="py-16 md:py-20 bg-rose-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <Zap className="h-10 w-10 mx-auto mb-6 text-rose-200" />
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Tinggalkan Cara Manual.</h2>
        <p className="text-lg md:text-xl text-rose-100 mb-8 md:mb-10 max-w-xl mx-auto">Mulai kendalikan penuh distribusi barang Anda sekarang. Pendaftaran gratis dan langsung bisa digunakan.</p>
        <button onClick={onRegister} className="h-14 px-10 bg-white hover:bg-gray-50 text-rose-600 rounded-full font-bold text-lg transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
          Buat Akun Gratis
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-rose-600" />
          <span className="font-bold text-base tracking-tight text-gray-900">JuraganTitip</span>
        </div>
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} JuraganTitip. Hak Cipta Dilindungi.
        </div>
        <div className="flex gap-6 text-sm font-semibold text-gray-500">
          <a href="#" className="hover:text-rose-600 transition-colors">Bantuan</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Privasi</a>
          <a href="#" className="hover:text-rose-600 transition-colors">Syarat Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}