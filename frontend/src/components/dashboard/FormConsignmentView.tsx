import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Link2, Info, Calendar, CalendarDays, Clock, Loader2, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Consignment, Product } from '../../types/dashboard';

interface FormConsignmentViewProps {
  productData: Product[];
  onAddConsignment: (newData: Consignment) => void;
  onChangeMenu: () => void;
}

export default function FormConsignmentView({ productData, onAddConsignment, onChangeMenu }: FormConsignmentViewProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form
  const [selectedProductId, setSelectedProductId] = useState('');
  const [sum, setSum] = useState('');
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
    if (!selectedProductId || !sum || !lastRestock) {
      alert(t('dashboard.form.errRequired'));
      return;
    }

    setIsSubmitting(true);

    const selectedProductObj = productData.find(p => p.id === parseInt(selectedProductId));
    const nameProductStr = selectedProductObj ? selectedProductObj.name : t('dashboard.form.unknownProduct');

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
        finalLokasi = linkMap.trim() || t('dashboard.form.unknownLocation');
      }
    }

    let finalNextRestock = nextRestockDate;
    if (nextRestockType === 'hari') {
      const restockDateObj = new Date(lastRestock);
      restockDateObj.setDate(restockDateObj.getDate() + parseInt(nextRestockDays || '0'));
      finalNextRestock = restockDateObj.toISOString().split('T')[0];
    }

    // Include data koordinat & link ke payload state
    const newConsignment: Consignment = {
      id: Date.now(),
      product: nameProductStr,
      sum: parseInt(sum),
      lokasi: finalLokasi,
      lastRestock: lastRestock,
      nextRestock: finalNextRestock,
      lat: lokasiType === 'map' ? coords[0] : null,
      lng: lokasiType === 'map' ? coords[1] : null,
      mapLink: lokasiType === 'link' ? linkMap : null
    };

    onAddConsignment(newConsignment);
    setIsSubmitting(false);
    onChangeMenu();
  };

  return (
    <div className="max-w-3xl mx-auto w-full text-gray-900">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-xl font-extrabold text-gray-900">{t('dashboard.form.title')}</h2>
          <p className="text-sm text-gray-500">{t('dashboard.form.desc')}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('dashboard.form.labelProduct')}</label>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium"
              >
                <option value="">{t('dashboard.form.placeholderProduct')}</option>
                {productData.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('dashboard.form.labelQty')}</label>
              <input 
                type="number" min="1" placeholder={t('dashboard.form.placeholderQty')} 
                value={sum} onChange={(e) => setSum(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" 
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <label className="block text-sm font-bold text-gray-700">{t('dashboard.form.labelLocation')}</label>
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button 
                  type="button"
                  onClick={() => setLokasiType('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lokasiType === 'map' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <MapPin className="h-3.5 w-3.5" /> {t('dashboard.form.typeMap')}
                </button>
                <button 
                  type="button"
                  onClick={() => setLokasiType('link')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lokasiType === 'link' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Link2 className="h-3.5 w-3.5" /> {t('dashboard.form.typeLink')}
                </button>
              </div>
            </div>

            <div className="mb-4 text-left">
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{t('dashboard.form.labelAddress')}</label>
              <input 
                type="text" 
                placeholder={t('dashboard.form.placeholderAddress')} 
                value={alamatLokasi}
                onChange={(e) => setAlamatLokasi(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium" 
              />
            </div>

            {lokasiType === 'link' ? (
              <input 
                type="url" placeholder={t('dashboard.form.placeholderLink')} 
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
                  {t('dashboard.form.mapInstruction')}
                </p>
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2">{t('dashboard.form.labelStart')}</label>
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
                <label className="block text-sm font-bold text-gray-700">{t('dashboard.form.labelNext')}</label>
                <button 
                  type="button" 
                  onClick={() => setNextRestockType(prev => prev === 'tanggal' ? 'hari' : 'tanggal')}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline uppercase tracking-wider"
                >
                  {nextRestockType === 'tanggal' ? t('dashboard.form.toggleToDays') : t('dashboard.form.toggleToDate')}
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
                      type="number" min="1" placeholder={t('dashboard.form.placeholderDays')} 
                      value={nextRestockDays}
                      onChange={(e) => setNextRestockDays(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm font-medium text-gray-700" 
                    />
                    <span className="absolute right-4 top-3.5 text-sm font-bold text-gray-400">{t('dashboard.form.suffixDays')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="text-left">
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('dashboard.form.labelStatus')}</label>
            <select disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed appearance-none">
              <option>{t('dashboard.form.statusDraft')}</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full h-14 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> {t('dashboard.form.btnSubmitting')}</>
              ) : (
                <><CheckSquare className="h-5 w-5" /> {t('dashboard.form.btnSubmit')}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
