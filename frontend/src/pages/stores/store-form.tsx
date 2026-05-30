

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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
import { validateStoreForm } from "@/lib/validations";
import { VALIDATION_RULES } from "@/lib/validation-rules";
import { toast } from "sonner";

export default function StoreFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    phone: "",
    address: "",
    notes: "",
  });

  
  const [location, setLocation] = useState({
    lat: -6.902481,
    lng: 107.61881,
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchStore = async () => {
        try {
          const response = await storeApi.getById(id);
          if (response.success && response.data) {
            setFormData({
              name: response.data.store.name,
              ownerName: response.data.store.ownerName,
              phone: response.data.store.phone,
              address: response.data.store.address,
              notes: response.data.store.notes || "",
            });
            setLocation({
              lat: response.data.store.latitude,
              lng: response.data.store.longitude,
            });
          } else {
            setError(response.message || "Gagal memuat data toko.");
          }
        } catch (err) {
          setError("Terjadi kesalahan saat memuat data.");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchStore();
    }
  }, [id, isEditMode]);

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
          toast.success("Lokasi berhasil diperbarui.");
        },
        (err) => {
          console.error("GPS Error:", err);
          toast.error("Gagal mendapatkan lokasi. Pastikan izin GPS diaktifkan.");
        }
      );
    } else {
      toast.error("Browser Anda tidak mendukung deteksi lokasi (GPS).");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    
    const errorMsg = validateStoreForm(formData);
    if (errorMsg) {
      setError(errorMsg);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    

    try {
      const payload = {
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
        activeItemCount: 0
      };

      let result;
      if (isEditMode && id) {
        result = await storeApi.update(id, payload);
      } else {
        result = await storeApi.create(payload);
      }

      if (result.success) {
        if (isEditMode) {
          navigate(`/stores/${id}`);
        } else {
          navigate("/stores"); 
        }
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

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/stores/${id}`);
    } else {
      navigate("/stores");
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto space-y-lg pb-xl">

      {error && (
        <div className="w-full bg-error-container text-on-error-container p-sm rounded-lg mb-md font-body-sm text-body-sm flex items-center justify-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        
        <div className="lg:col-span-7 flex flex-col gap-lg">
          
          
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
                    placeholder="Toko Berkah Jaya" 
                    type="text" 
                    required 
                    autoFocus
                    minLength={VALIDATION_RULES.STORE.NAME_MIN}
                    maxLength={VALIDATION_RULES.STORE.NAME_MAX}
                    autoComplete="off"
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
                    placeholder="Budi Santoso" 
                    type="text" 
                    required 
                    minLength={VALIDATION_RULES.STORE.OWNER_MIN}
                    maxLength={VALIDATION_RULES.STORE.OWNER_MAX}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-caption text-caption text-text-secondary" htmlFor="phone">
                  Nomor Telepon <span className="text-error">*</span>
                </label>
                <div className="flex">
                  <input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length > 0 && !val.startsWith("0")) return;
                      handleChange({ target: { name: "phone", value: val } } as any);
                    }}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all" 
                    placeholder="081234567890" 
                    type="tel"
                    required
                    minLength={VALIDATION_RULES.PHONE.MIN_LENGTH}
                    maxLength={VALIDATION_RULES.PHONE.MAX_LENGTH}
                    autoComplete="off"
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
                  placeholder="Jl. Merdeka No. 123, patokan seberang pom bensin" 
                  rows={3} 
                  required 
                  minLength={VALIDATION_RULES.STORE.ADDRESS_MIN}
                  maxLength={VALIDATION_RULES.STORE.ADDRESS_MAX}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          
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
                placeholder="Buka Senin-Sabtu, jam 08:00 - 17:00" 
                rows={2} 
                maxLength={VALIDATION_RULES.STORE.NOTES_MAX}
              />
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-5 flex flex-col gap-lg">
          <div className="bg-surface rounded-xl shadow-sm border border-outline-variant overflow-hidden flex flex-col h-full">
            
            
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

            <div className="relative w-full h-[240px] lg:h-[300px] shrink-0">
              <MapPicker
                position={location}
                onChange={handleLocationChange}
                readonly={false}
              />
            </div>

            
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

        
        <div className="col-span-1 lg:col-span-12 flex justify-end gap-md pt-lg border-t border-outline-variant mt-sm">
          <button 
            type="button" 
            onClick={handleCancel}
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
            {isSubmitting ? "Memproses..." : isEditMode ? "Simpan Perubahan" : "Simpan Toko"}
          </button>
        </div>

      </form>
    </div>
  );
}