import React, { useState, useEffect } from 'react';
import { X, Save, Archive } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { productApi } from '@/services/api/products';
import { validateProductEditFields } from '@/lib/product-validation';
import { settingsApi } from '@/services/api/settings';
import { toast } from 'sonner';
import type { ProductFormData } from '@/types';

export default function ProductEditPage() {
  const navigate = useNavigate();
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
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
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [id]);

  const handleBack = () => {
    navigate(`/products/${id}`);
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
    if (!id) return;
    
    const validationErrors = validateProductEditFields(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Mohon periksa kembali form Anda");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await productApi.update(id, formData);
      if (res.success) {
        navigate(`/products/${id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-dvh flex items-center justify-center bg-slate-50">Memuat...</div>;
  }

  return (
    <div className="min-h-dvh bg-slate-50 max-w-[448px] mx-auto font-sans">
      <main className="space-y-4 pb-6 animate-in fade-in slide-in-from-right-4 duration-200">
        
        <button onClick={handleBack} className="flex items-center gap-1.5 text-slate-600 font-semibold px-1 py-1 -ml-1 rounded-lg active:bg-slate-100 transition-colors">
          <X className="w-5 h-5" /> Batal
        </button>

        {/* INFORMASI DASAR */}
        <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informasi Dasar</h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Produk</label>
            <input 
              type="text" 
              name="name"
              value={formData.name || ''} 
              onChange={handleChange}
              className={`w-full p-2.5 text-sm bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none`} 
            />
            {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
            <select 
              name="category"
              value={formData.category || ''} 
              onChange={handleChange}
              className={`w-full p-2.5 text-sm bg-slate-50 border ${errors.category ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none`} 
            >
              <option value="" disabled>Pilih Kategori...</option>
              <option value="1">{categoryLabels["1"]}</option>
              <option value="2">{categoryLabels["2"]}</option>
              <option value="3">{categoryLabels["3"]}</option>
              <option value="4">{categoryLabels["4"]}</option>
              <option value="5">{categoryLabels["5"]}</option>
            </select>
            {errors.category && <p className="text-[10px] text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi (Opsional)</label>
            <textarea 
              rows={2} 
              name="description"
              value={formData.description || ''} 
              onChange={handleChange}
              className={`w-full p-2.5 text-sm bg-slate-50 border ${errors.description ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none`} 
            />
            {errors.description && <p className="text-[10px] text-red-500 mt-1">{errors.description}</p>}
          </div>
        </section>

        {/* PENGATURAN HARGA */}
        <section className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengaturan Harga</h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Harga Modal (Kulakan)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">Rp</span>
              <input 
                type="number" 
                name="costPrice"
                value={formData.costPrice || ''} 
                onChange={handleChange}
                className={`w-full p-2.5 pl-10 text-sm bg-slate-50 border ${errors.costPrice ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none`} 
              />
            </div>
            {errors.costPrice && <p className="text-[10px] text-red-500 mt-1">{errors.costPrice}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Harga Jual (Grosir/Toko)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">Rp</span>
              <input 
                type="number" 
                name="wholesalePrice"
                value={formData.wholesalePrice || ''} 
                onChange={handleChange}
                className={`w-full p-2.5 pl-10 text-sm bg-slate-50 border ${errors.wholesalePrice ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none`} 
              />
            </div>
            {errors.wholesalePrice && <p className="text-[10px] text-red-500 mt-1">{errors.wholesalePrice}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Harga Eceran (Ke Konsumen)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">Rp</span>
              <input 
                type="number" 
                name="retailPrice"
                value={formData.retailPrice || ''} 
                onChange={handleChange}
                className={`w-full p-2.5 pl-10 text-sm bg-slate-50 border ${errors.retailPrice ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none`} 
              />
            </div>
            {errors.retailPrice && <p className="text-[10px] text-red-500 mt-1">{errors.retailPrice}</p>}
          </div>
        </section>

        {/* BUTTONS ACTION */}
        <div className="space-y-2 mt-4">
          <button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 active:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
          </button>
          <button className="w-full py-3 bg-red-50 text-red-600 active:bg-red-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Archive className="w-4 h-4" /> ARSIPKAN PRODUK
          </button>
        </div>
      </main>
    </div>
  );
}
