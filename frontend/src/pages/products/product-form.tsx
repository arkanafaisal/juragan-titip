import React, { useState, useEffect } from 'react';
import { Save, Archive } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useSmartBack } from '@/hooks/use-smart-back';
import { productApi } from '@/services/api/products';
import { validateProductEditFields } from '@/lib/product-validation';
import { settingsApi } from '@/services/api/settings';
import { toast } from 'sonner';
import type { ProductFormData } from '@/types';
import { SectionCard } from "@/components/shared/section-card";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { goBack } = useSmartBack();
  const { id } = useParams();
  const categoryLabels = settingsApi.getCategoryLabels();

  const [formData, setFormData] = useState<Partial<ProductFormData>>({
    name: '',
    description: '',
    costPrice: 0,
    wholesalePrice: 0,
    retailPrice: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const res = await productApi.getById(id);
      if (res.success && res.data) {
        setFormData({
          name: res.data.name,
          category: res.data.category,
          description: res.data.description || '',
          costPrice: res.data.costPrice,
          wholesalePrice: res.data.wholesalePrice,
          retailPrice: res.data.retailPrice || 0,
        });
      } else {
        setIsNotFound(true);
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [id]);

  const handleBack = () => {
    goBack(id ? `/products/${id}` : '/products');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ["costPrice", "wholesalePrice", "retailPrice"];
    
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value === "" ? 0 : Number(value)) : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    const validationErrors = validateProductEditFields(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Mohon periksa kembali form Anda");
      return;
    }

    setIsSubmitting(true);
    
    if (id) {
      const res = await productApi.update(id, formData);
      if (res.success) {
        navigate(`/products/${id}`);
      }
    } else {
      const res = await productApi.create(formData as ProductFormData);
      if (res.success && res.data) {
        navigate(`/products/${res.data.id}`, { replace: true });
      }
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteConfirm = async (typedName?: string) => {
    if (!id || !typedName) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await productApi.delete(id, typedName);
      if (response.success) {
        toast.success("Produk berhasil diarsipkan");
        navigate("/products", { replace: true });
      } else {
        setDeleteError(response.message || "Gagal mengarsipkan produk");
      }
    } catch (error) {
      setDeleteError("Terjadi kesalahan sistem saat mengarsipkan produk.");
      console.error("Gagal mengarsipkan produk:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-dvh flex items-center justify-center bg-surface-container-lowest text-text-primary font-medium">Memuat...</div>;
  }

  if (isNotFound) {
    return <div className="min-h-dvh flex items-center justify-center bg-surface-container-lowest text-text-primary font-medium">Produk tidak ditemukan</div>;
  }

  return (
    <div className="min-h-dvh bg-surface-container-lowest max-w-[448px] mx-auto">
      <main className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
        
        <div className="mb-2 flex items-center">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center px-4 py-2 bg-error text-on-error rounded-xl shadow-sm hover:bg-error/90 active:scale-[0.98] transition-all"
          >
            <span className="text-body-sm">Batal</span>
          </button>
        </div>

        {/* INFORMASI DASAR */}
        <SectionCard className="space-y-3">
          <h3 className="text-h3 font-black mb-2 uppercase">Informasi Dasar</h3>
          <div>
            <label className="block text-body-sm font-black text-text-secondary mb-1">Nama Produk</label>
            <input 
              type="text" 
              name="name"
              value={formData.name || ''} 
              onChange={handleChange}
              className={`w-full p-3 text-body font-bold text-text-primary bg-surface-container-low border ${errors.name ? 'border-error' : ''} rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all placeholder:text-text-muted`} 
            />
            {errors.name && <p className="text-[10px] font-bold text-error mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-body-sm font-black text-text-secondary mb-1">Kategori</label>
            <select 
              name="category"
              value={formData.category || ''} 
              onChange={handleChange}
              className={`w-full p-3 text-body font-bold text-text-primary bg-surface-container-low border ${errors.category ? 'border-error' : ''} rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all capitalize`} 
            >
              <option value="" disabled className="text-text-muted">Pilih Kategori...</option>
              <option value="1">{categoryLabels["1"]}</option>
              <option value="2">{categoryLabels["2"]}</option>
              <option value="3">{categoryLabels["3"]}</option>
              <option value="4">{categoryLabels["4"]}</option>
              <option value="5">{categoryLabels["5"]}</option>
            </select>
            {errors.category && <p className="text-[10px] font-bold text-error mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-body-sm font-black text-text-secondary mb-1">Deskripsi (Opsional)</label>
            <textarea 
              rows={3} 
              name="description"
              value={formData.description || ''} 
              onChange={handleChange}
              className={`w-full p-3 text-body-sm font-medium text-text-primary bg-surface-container-low border ${errors.description ? 'border-error' : ''} rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all resize-none placeholder:text-text-muted`} 
            />
            {errors.description && <p className="text-[10px] font-bold text-error mt-1">{errors.description}</p>}
          </div>
        </SectionCard>

        {/* PENGATURAN HARGA */}
        <SectionCard className="space-y-3">
          <h3 className="text-h3 font-black mb-2 uppercase">Pengaturan Harga</h3>
          <div>
            <label className="block text-body-sm font-black text-text-secondary mb-1">Harga Modal (Kulakan)</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-text-muted font-black text-data-md">Rp</span>
              <input 
                type="number" 
                name="costPrice"
                value={formData.costPrice || ''} 
                onChange={handleChange}
                className={`w-full p-3 pl-10 text-data-md font-black text-text-primary bg-surface-container-low border ${errors.costPrice ? 'border-error' : ''} rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all`} 
              />
            </div>
            {errors.costPrice && <p className="text-[10px] font-bold text-error mt-1">{errors.costPrice}</p>}
          </div>
          <div>
            <label className="block text-body-sm font-black text-text-secondary mb-1">Harga Jual (Grosir/Toko)</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-text-muted font-black text-data-md">Rp</span>
              <input 
                type="number" 
                name="wholesalePrice"
                value={formData.wholesalePrice || ''} 
                onChange={handleChange}
                className={`w-full p-3 pl-10 text-data-md font-black text-primary bg-surface-container-low border ${errors.wholesalePrice ? 'border-error' : ''} rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all`} 
              />
            </div>
            {errors.wholesalePrice && <p className="text-[10px] font-bold text-error mt-1">{errors.wholesalePrice}</p>}
          </div>
          <div>
            <label className="block text-body-sm font-black text-text-secondary mb-1">Harga Eceran (Ke Konsumen)</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-text-muted font-black text-data-md">Rp</span>
              <input 
                type="number" 
                name="retailPrice"
                value={formData.retailPrice || ''} 
                onChange={handleChange}
                className={`w-full p-3 pl-10 text-data-md font-black text-text-primary bg-surface-container-low border ${errors.retailPrice ? 'border-error' : ''} rounded-xl focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all`} 
              />
            </div>
            {errors.retailPrice && <p className="text-[10px] font-bold text-error mt-1">{errors.retailPrice}</p>}
          </div>
        </SectionCard>

        {/* BUTTONS ACTION */}
        <div className="space-y-3 mt-6">
          <button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
          >
            <Save className="w-5 h-5" /> {isSubmitting ? "MENYIMPAN..." : (id ? "SIMPAN PERUBAHAN" : "TAMBAH PRODUK")}
          </button>
          {id && (
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full py-3.5 bg-error hover:bg-error/90 text-on-error active:bg-error/80 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Archive className="w-5 h-5" /> ARSIPKAN PRODUK
            </button>
          )}
        </div>
      </main>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Arsipkan Produk"
        description="Tindakan ini permanen. Histori barang ini di invoice sebelumnya tetap aman, namun Anda tidak bisa lagi menambahkannya ke kunjungan baru."
        isDanger={true}
        confirmText="Arsipkan Produk"
        isLoading={isDeleting}
        verificationText={formData.name}
        verificationLabel={
          <>Ketik persis <span className="font-bold text-text-primary select-none">{formData.name}</span> untuk konfirmasi:</>
        }
        errorMessage={deleteError}
        onClearError={() => setDeleteError(null)}
      />
    </div>
  );
}
