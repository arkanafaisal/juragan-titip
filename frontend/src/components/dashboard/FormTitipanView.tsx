import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Link2, Info, Calendar, CalendarDays, Clock, Loader2, CheckSquare } from 'lucide-react';
import type { Titipan, Produk } from '../../types/dashboard';

interface FormTitipanViewProps {
  produkData: Produk[];
  onAddTitipan: (newData: Titipan) => void;
  onChangeMenu: (menu: string) => void;
}

export default function FormTitipanView({ produkData, onAddTitipan, onChangeMenu }: FormTitipanViewProps) {
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
