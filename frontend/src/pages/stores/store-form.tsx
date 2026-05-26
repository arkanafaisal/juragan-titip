import React, { useState } from "react";
import { useNavigate } from "react-router";
import { 
  Info, 
  StickyNote, 
  MapPin, 
  Locate, 
  Save,
  Loader2
} from "lucide-react";
import { storeApi } from "@/services/api/stores";
import { MapPicker } from "@/components/features/map-picker";

export default function StoreFormPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Default coordinate (Gedung Sate, Bandung as default fallback)
  const [location, setLocation] = useState({
    lat: -6.902481,
    lng: 107.61881,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("GPS Error:", err);
          alert("Gagal mendapatkan lokasi. Pastikan izin GPS diaktifkan.");
        }
      );
    } else {
      alert("Browser Anda tidak mendukung deteksi lokasi (GPS).");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Pemanggilan LocalStorage Mock API
      const result = await storeApi.create({
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
      });

      if (result.success) {
        // Otomatis pindah ke daftar toko setelah berhasil save
        navigate("/stores"); 
      } else {
        setError(result.message || "Gagal menyimpan data toko.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem saat memproses permintaan.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      {/* Header Halaman - Sekarang muncul di semua breakpoint (PC & Mobile) */}
      <div className="flex items-center justify-between mb-md">
        <h2 className="font-h1 text-h1 font-bold text-on-surface">Tambah Toko Baru</h2>
      </div>

      {error && (
        <div className="w-full bg-error-container text-on-error-container p-sm rounded-lg mb-md font-body-sm text-body-sm flex items-center justify-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* KOLOM KIRI: Form Teks */}
        <div className="lg:col-span-7 flex flex-col gap-lg">
          
          {/* Card: Informasi Dasar */}
          <div className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="px-md py-sm border-b border-outline-variant bg-surface-container-low">
              <h3 className="font-h3 text-h3 font-semibold flex items-center gap-sm text-text-primary">
                <Info className="w-5 h-5 text-primary" />
                Informasi Dasar
              </h3>
            </div>
            
            <div className="p-md flex flex-col gap-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-caption text-caption text-text-secondary" htmlFor="name">
                    Nama Toko <span className="text-error">*</span>
                  </label>
                  <input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all" 
                    placeholder="Contoh: Toko Berkah Jaya" 
                    type="text" 
                    required 
                  />
                </div>
                
                <div className="flex flex-col gap-xs">
                  <label className="font-caption text-caption text-text-secondary" htmlFor="ownerName">
                    Nama Pemilik / PIC <span className="text-error">*</span>
                  </label>
                  <input 
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all" 
                    placeholder="Nama lengkap pemilik" 
                    type="text" 
                    required 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-caption text-caption text-text-secondary" htmlFor="phone">
                  Nomor Telepon <span className="text-error">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-md rounded-l-lg border border-r-0 border-outline-variant bg-surface-container-low text-text-secondary font-body-sm text-body-sm font-medium">
                    +62
                  </span>
                  <input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 w-full bg-surface-container-lowest border border-outline-variant rounded-r-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all" 
                    placeholder="81234567890" 
                    type="tel"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-caption text-caption text-text-secondary" htmlFor="address">
                  Alamat Lengkap <span className="text-error">*</span>
                </label>
                <textarea 
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all resize-none" 
                  placeholder="Masukkan alamat lengkap toko beserta patokan jika ada..." 
                  rows={3} 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Card: Catatan Tambahan */}
          <div className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="px-md py-sm border-b border-outline-variant bg-surface-container-low">
              <h3 className="font-h3 text-h3 font-semibold flex items-center gap-sm text-text-primary">
                <StickyNote className="w-5 h-5 text-primary" />
                Catatan Tambahan
              </h3>
            </div>
            <div className="p-md flex flex-col gap-xs">
              <label className="font-caption text-caption text-text-secondary" htmlFor="notes">
                Catatan Operasional (Opsional)
              </label>
              <textarea 
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all resize-none" 
                placeholder="Jam buka, hari libur, atau instruksi khusus untuk kurir..." 
                rows={2} 
              />
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Peta & Koordinat */}
        <div className="lg:col-span-5 flex flex-col gap-lg">
          <div className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col h-full">
            
            {/* Map Header */}
            <div className="px-md py-sm border-b border-outline-variant bg-surface-container-low flex justify-between items-center shrink-0">
              <h3 className="font-h3 text-h3 font-semibold flex items-center gap-sm text-text-primary">
                <MapPin className="w-5 h-5 text-primary" />
                Lokasi Peta
              </h3>
              <button 
                type="button" 
                onClick={handleDetectGPS}
                className="flex items-center gap-xs px-sm py-1 bg-primary-container text-on-primary-container hover:bg-primary/20 border border-primary/20 rounded-md font-body-sm text-body-sm transition-colors active:scale-95"
              >
                <Locate className="w-4 h-4" />
                Deteksi GPS
              </button>
            </div>

            {/* Map Component */}
            <div className="relative w-full h-[240px] lg:h-[300px] shrink-0">
              <MapPicker 
                position={location}
                onChange={handleLocationChange}
                readonly={false} // Mode PICK
              />
            </div>

            {/* Coordinates Fields (Readonly from Map) */}
            <div className="p-md bg-surface mt-auto shrink-0 border-t border-outline-variant">
              <div className="grid grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-caption text-caption text-text-secondary" htmlFor="lat">
                    Latitude
                  </label>
                  <input 
                    id="lat"
                    value={location.lat.toFixed(6)}
                    readOnly
                    type="text" 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-data-sm text-data-sm text-text-secondary focus:outline-none cursor-not-allowed" 
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-caption text-caption text-text-secondary" htmlFor="lng">
                    Longitude
                  </label>
                  <input 
                    id="lng"
                    value={location.lng.toFixed(6)}
                    readOnly
                    type="text" 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-data-sm text-data-sm text-text-secondary focus:outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="col-span-1 lg:col-span-12 flex justify-end gap-md pt-lg border-t border-outline-variant mt-sm">
          <button 
            type="button" 
            onClick={() => navigate("/stores")}
            className="px-lg py-2 rounded-lg font-body text-body font-medium text-on-surface-variant bg-surface border border-outline-variant hover:bg-surface-container-low transition-colors active:scale-95 duration-100"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-lg py-2 rounded-lg font-body text-body font-medium text-on-primary bg-primary hover:bg-primary/90 shadow-sm transition-all active:scale-95 duration-100 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? "Memproses..." : "Simpan Toko"}
          </button>
        </div>

      </form>
    </div>
  );
}