import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { productApi } from "@/services/api/products";
import { settingsApi } from "@/services/api/settings";
import { cn } from "@/lib/utils";
import { validateProductForm, PRODUCT_VALIDATION_RULES } from "@/lib/product-validation";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormData = {
  name: "",
  category: "",
  warehouseStock: 0,
  costPrice: 0,
  wholesalePrice: 0,
  retailPrice: 0,
  description: ""
};

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const categoryLabels = settingsApi.getCategoryLabels();

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const errorMsg = validateProductForm(formData);
    if (errorMsg) {
      setError(errorMsg);
      setIsSaving(false);
      const container = document.getElementById("add-product-scroll-container");
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      const result = await productApi.create(formData as any);
      if(!result.success){return}
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm animate-in fade-in duration-200 p-md transition-all font-body text-body text-on-surface antialiased"
    )}>
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-[400px] overflow-hidden flex flex-col max-h-full">
        <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright shrink-0">
          <h3 className="font-h3 text-h3 text-on-surface">Tambah Produk Baru</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-low p-sm rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div id="add-product-scroll-container" className="p-lg overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-md p-sm bg-error/10 text-error rounded-lg font-body-sm text-body-sm text-center border border-error/20">
              {error}
            </div>
          )}
          <form id="product-form" onSubmit={handleSubmit} className="space-y-md">
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Nama Produk</label>
              <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Kripik Singkong Rasa Balado" 
                className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
                autoFocus
                minLength={PRODUCT_VALIDATION_RULES.NAME_MIN}
                maxLength={PRODUCT_VALIDATION_RULES.NAME_MAX}
                autoComplete="off"
              />
            </div>
            
            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Kategori</label>
              <select 
                required 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all cursor-pointer capitalize"
              >
                <option value="" disabled>Pilih Kategori</option>
                <option value="1">{categoryLabels["1"]}</option>
                <option value="2">{categoryLabels["2"]}</option>
                <option value="3">{categoryLabels["3"]}</option>
                <option value="4">{categoryLabels["4"]}</option>
                <option value="5">{categoryLabels["5"]}</option>
              </select>
            </div>

            <div className="grid grid-cols-1   gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Harga Modal (Kulakan)</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  name="costPrice" 
                  value={formData.costPrice === 0 ? '' : formData.costPrice} 
                  onChange={handleChange} 
                  placeholder="15000" 
                  className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
                  max={PRODUCT_VALIDATION_RULES.PRICE_MAX}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Harga Jual (Ke Warung)</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  name="wholesalePrice" 
                  value={formData.wholesalePrice === 0 ? '' : formData.wholesalePrice} 
                  onChange={handleChange} 
                  placeholder="18000" 
                  className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
                  max={PRODUCT_VALIDATION_RULES.PRICE_MAX}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Harga Eceran (Ke Konsumen)</label>
                <input 
                  type="number" 
                  min="0" 
                  name="retailPrice" 
                  value={formData.retailPrice === 0 ? '' : formData.retailPrice} 
                  onChange={handleChange} 
                  placeholder="20000" 
                  className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
                  max={PRODUCT_VALIDATION_RULES.PRICE_MAX}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Deskripsi Produk (Opsional)</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3} 
                placeholder="Rasa balado pedas manis, kemasan 200g" 
                className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all resize-none"
                maxLength={PRODUCT_VALIDATION_RULES.DESC_MAX}
              ></textarea>
            </div>
          </form>
        </div>
        
        <div className="px-lg py-md border-t border-outline-variant bg-surface-bright flex justify-end gap-md shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-md py-sm rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            form="product-form" 
            disabled={isSaving}
            className="px-md py-sm rounded-lg font-body-sm text-body-sm font-medium bg-primary-fixed text-primary-container hover:bg-primary-container hover:text-surface-container-lowest transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {isSaving ? "Memproses..." : "Tambah Produk"}
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--color-outline-variant);
          border-radius: 10px;
        }
      `}</style>
    </div>,
    document.body
  );
}
