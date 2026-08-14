

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useSmartBack } from "@/hooks/use-smart-back";
import {
  MapPin, 
  Locate, 
  Save,
  Loader2,
  Archive
} from "lucide-react";
import { storeApi } from "@/services/api/stores";
import { settingsApi } from "@/services/api/settings";
import { MapPicker } from "@/components/features/map-picker";
import { validateStoreForm } from "@/lib/validations";
import { VALIDATION_RULES } from "@/lib/validation-rules";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { SectionCard } from "@/components/shared/section-card";

export default function StoreFormPage() {
  const navigate = useNavigate();
  const { goBack } = useSmartBack();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState<React.ReactNode | null>(null);

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  
  const storeCategoryLabels = settingsApi.getStoreCategoryLabels();

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    phone: "",
    address: "",
    notes: "",
    category: "",
  });

  
  const [location, setLocation] = useState({
    lat: -6.902481,
    lng: 107.61881,
  });
  const [coordinateInput, setCoordinateInput] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      const fetchStore = async () => {
        const response = await storeApi.getById(id);
        if (response.success) {
          setFormData({
            name: response.data.store.name,
            ownerName: response.data.store.ownerName,
            phone: response.data.store.phone || "",
            address: response.data.store.address,
            notes: response.data.store.notes || "",
            category: response.data.store.category || "",
          });
          setLocation({
            lat: response.data.store.latitude,
            lng: response.data.store.longitude,
          });
        } else {
          setError(response.message);
        }
        setIsLoadingData(false);
      };
      fetchStore();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    setCoordinateInput(""); // Clear input if map is manually dragged
  };

  const extractCoordinates = (text: string) => {
    const regexes = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
      /[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/,
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
      /(?:^|\s)(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)(?:\s|$)/ // pure coordinates paste
    ];

    for (const regex of regexes) {
      const match = text.match(regex);
      if (match && match[1] && match[2]) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2])
        };
      }
    }
    return null;
  };

  const handleCoordinateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCoordinateInput(val);
    
    const coords = extractCoordinates(val);
    if (coords) {
      setLocation(coords);
      toast.success("Koordinat berhasil diperbarui.");
    }
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
    const isDuplicateName = await storeApi.checkDuplicateName(formData.name, isEditMode ? Number(id) : undefined);
    const isDuplicatePhone = formData.phone ? await storeApi.checkDuplicatePhone(formData.phone, isEditMode ? Number(id) : undefined) : false;

    if (isDuplicateName || isDuplicatePhone) {
      if (isDuplicateName && isDuplicatePhone) {
        setDuplicateMessage(<>Terdapat toko dengan nama (<strong>{formData.name}</strong>) dan nomor telepon (<strong>{formData.phone}</strong>) yang sama. Apakah Anda yakin ingin menyimpan toko ini sebagai entri baru?</>);
      } else if (isDuplicateName) {
        setDuplicateMessage(<>Terdapat toko dengan nama yang sama (<strong>{formData.name}</strong>). Apakah Anda yakin ingin menyimpan toko ini sebagai entri baru?</>);
      } else {
        setDuplicateMessage(<>Terdapat toko dengan nomor telepon yang sama (<strong>{formData.phone}</strong>). Apakah Anda yakin ingin menyimpan toko ini sebagai entri baru?</>);
      }
      setShowDuplicateModal(true);
      setIsSubmitting(false);
      return;
    }

    await performSave();
  };

  const performSave = async () => {
    setIsSubmitting(true);
    setShowDuplicateModal(false);
    
    const payload = {
      ...formData,
      ...(formData.phone? { phone: formData.phone } : {}),
      category: formData.category as "1" | "2" | "3" | "4" | "5",
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
        navigate(`/stores/${result.data.id}`, { replace: true }); 
      }
    } else {
      setError(result.message);
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    goBack(isEditMode ? `/stores/${id}` : "/stores");
  };

  const handleArchiveConfirm = async (typedName?: string) => {
    if (!id || !typedName) return;
    
    setIsArchiving(true);
    setArchiveError(null);
    
    const response = await storeApi.delete(id, typedName);
    if (response.success) {
      navigate("/stores");
    } else {
      setArchiveError(response.message);
    }
    
    setIsArchiving(false);
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
      <div className="mb-2 flex items-center">
        <button 
          onClick={handleCancel}
          className="flex items-center justify-center px-4 py-2 bg-error text-on-error rounded-xl shadow-sm hover:bg-error/90 active:scale-[0.98] transition-all"
        >
          <span className="text-body-sm">Batal</span>
        </button>
      </div>

      {error && (
        <div className="w-full bg-error-container text-on-error-container p-sm rounded-lg mb-md font-body-sm text-body-sm flex items-center justify-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1  gap-lg items-start">
        
        
        <div className=" flex flex-col gap-lg">
          
          
          <SectionCard className="overflow-hidden bg-surface">
            {/* <div className="px-md py-sm border-b border-outline-variant bg-surface-container-low"> */}
              <h3 className="mb-3 font-h3 text-h3 flex items-center text-text-primary">
                Informasi Dasar
              </h3>
            {/* </div> */}
            
            <div className="flex flex-col gap-md">
              <div className="grid grid-cols-1  gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-caption text-caption text-text-secondary" htmlFor="name">
                    Nama Toko <span className="text-error">*</span>
                  </label>
                  <input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all" 
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
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all" 
                    placeholder="Budi Santoso" 
                    type="text" 
                    required 
                    minLength={VALIDATION_RULES.STORE.OWNER_MIN}
                    maxLength={VALIDATION_RULES.STORE.OWNER_MAX}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1  gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-caption text-caption text-text-secondary" htmlFor="phone">
                    Nomor Telepon (Opsional)
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
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all" 
                      placeholder="081234567890" 
                      type="tel"
                      minLength={VALIDATION_RULES.PHONE.MIN_LENGTH}
                      maxLength={VALIDATION_RULES.PHONE.MAX_LENGTH}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-caption text-caption text-text-secondary" htmlFor="category">
                    Kategori Toko <span className="text-error">*</span>
                  </label>
                  <select 
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Pilih Kategori...</option>
                    <option value="1">{storeCategoryLabels["1"]}</option>
                    <option value="2">{storeCategoryLabels["2"]}</option>
                    <option value="3">{storeCategoryLabels["3"]}</option>
                    <option value="4">{storeCategoryLabels["4"]}</option>
                    <option value="5">{storeCategoryLabels["5"]}</option>
                  </select>
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
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all resize-none" 
                  placeholder="Jl. Merdeka No. 123, patokan seberang pom bensin" 
                  rows={3} 
                  required 
                  minLength={VALIDATION_RULES.STORE.ADDRESS_MIN}
                  maxLength={VALIDATION_RULES.STORE.ADDRESS_MAX}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-xs">
              <h3 className="font-caption text-caption text-text-secondary">
                  Catatan Tambahan (opsional)
                </h3>
                <textarea 
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-text-muted transition-all resize-none" 
                  placeholder="Buka Senin-Sabtu, jam 08:00 - 17:00" 
                  rows={2} 
                  maxLength={VALIDATION_RULES.STORE.NOTES_MAX}
                />
              </div>
            </div>
          </SectionCard>

          
          {/* <SectionCard className="overflow-hidden bg-surface">
            
          </SectionCard> */}
        </div>

        
        <div className=" flex flex-col gap-lg">
          <SectionCard className="!p-0 overflow-hidden bg-surface flex flex-col h-full">
            
            
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

            <div className="p-md bg-surface border-b border-outline-variant flex flex-col gap-xs shrink-0">
              <label className="font-caption text-caption text-text-secondary" htmlFor="coordinateInput">
                Paste Koordinat Latitude, Longitude
              </label>
              <input 
                id="coordinateInput"
                type="text"
                placeholder="Contoh: -7.559194, 110.780329"
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-body text-body text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                value={coordinateInput}
                onChange={handleCoordinateInputChange}
                autoComplete="off"
              />
            </div>

            <div className="relative w-full h-[240px]  shrink-0">
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
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-data-sm text-data-sm text-text-secondary focus:outline-none cursor-not-allowed" 
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
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-data-sm text-data-sm text-text-secondary focus:outline-none cursor-not-allowed" 
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* BUTTONS ACTION */}
        <div className="col-span-1 space-y-3 mt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <Save className="w-5 h-5" /> {isSubmitting ? "MENYIMPAN..." : isEditMode ? "SIMPAN PERUBAHAN" : "TAMBAH TOKO"}
          </button>
          
          {isEditMode && (
            <button 
              type="button"
              onClick={() => setIsArchiveModalOpen(true)}
              className="w-full py-3.5 bg-error hover:bg-error/90 text-on-primary active:bg-error/30 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Archive className="w-5 h-5" /> ARSIPKAN TOKO
            </button>
          )}
        </div>

      </form>

      <ConfirmationModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onConfirm={performSave}
        title="Toko Duplikat Ditemukan"
        description={duplicateMessage || <>Terdapat toko dengan nama yang sama (<strong>{formData.name}</strong>). Apakah Anda yakin ingin menyimpan toko ini sebagai entri baru?</>}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        isDanger={true}
        isLoading={isSubmitting}
      />

      <ConfirmationModal
        isOpen={isArchiveModalOpen}
        onClose={() => {
          setIsArchiveModalOpen(false);
          setArchiveError(null);
        }}
        onConfirm={handleArchiveConfirm}
        title="Arsipkan Toko"
        description="Apakah Anda yakin ingin mengarsipkan toko ini? Toko tidak akan muncul di daftar utama dan perjalanan, namun riwayat kunjungan dan tagihannya masih tersimpan di database."
        isDanger={true}
        confirmText="Arsipkan"
        isLoading={isArchiving}
        verificationText={formData.name}
        verificationLabel={
          <>Ketik persis <span className="font-bold text-text-primary select-none">{formData.name}</span> untuk konfirmasi:</>
        }
        errorMessage={archiveError}
        onClearError={() => setArchiveError(null)}
      />
    </div>
  );
}