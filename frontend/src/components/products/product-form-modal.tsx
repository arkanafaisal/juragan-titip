import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { productApi } from "@/services/api/products";
import type { Product } from "@/types";
import { useSidebar } from "@/hooks/use-sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { validateProductForm } from "@/lib/validations";
import { VALIDATION_RULES } from "@/lib/validation-rules";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
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

export function ProductFormModal({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isCollapsed } = useSidebar();
  const isMobile = useMobile()

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          name: product.name,
          category: product.category,
          warehouseStock: product.warehouseStock,
          costPrice: product.costPrice,
          wholesalePrice: product.wholesalePrice,
          retailPrice: product.retailPrice || 0,
          description: product.description || ""
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, product]);

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
      const container = document.getElementById("product-form-scroll-container");
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    

    try {
      let result
      if (product) {
        result = await productApi.update(product.id, formData as any);
      } else {
        result = await productApi.create(formData as any);
      }
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
      
      "fixed right-0 z-50 flex items-center justify-center bg-on-surface/50 backdrop-blur-sm animate-in fade-in duration-200 p-md transition-all font-body text-body text-on-surface antialiased",
      
      
      "top-16",
      
      
      isMobile ? "bottom-[72px]" : "bottom-0",
      
      
      isMobile 
        ? "left-0" 
        : isCollapsed 
          ? "left-20" 
          : "left-60"
    )}>
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-[512px] overflow-hidden flex flex-col max-h-full">
        <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright shrink-0">
          <h3 className="font-h3 text-h3 text-on-surface">
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:bg-surface-container-low p-sm rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div id="product-form-scroll-container" className="p-lg overflow-y-auto custom-scrollbar">
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
                minLength={VALIDATION_RULES.PRODUCT.NAME_MIN}
                maxLength={VALIDATION_RULES.PRODUCT.NAME_MAX}
                autoComplete="off"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
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
                  <option value="kering">Kering</option>
                  <option value="basah">Basah</option>
                  <option value="minuman">Minuman</option>
                  <option value="non-makanan">Non-Makanan</option>
                </select>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Stok Gudang</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  name="warehouseStock" 
                  value={formData.warehouseStock === 0 && !product && !formData.warehouseStock.toString() ? '' : formData.warehouseStock} 
                  onChange={handleChange} 
                  placeholder="100" 
                  className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
                  max={VALIDATION_RULES.PRODUCT.STOCK_MAX}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Harga Pokok (HPP)</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  name="costPrice" 
                  value={formData.costPrice === 0 && !product ? '' : formData.costPrice} 
                  onChange={handleChange} 
                  placeholder="15000" 
                  className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
                  max={VALIDATION_RULES.PRODUCT.PRICE_MAX}
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-body-sm text-body-sm text-on-surface-variant font-medium">Harga Grosir</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  name="wholesalePrice" 
                  value={formData.wholesalePrice === 0 && !product ? '' : formData.wholesalePrice} 
                  onChange={handleChange} 
                  placeholder="18000" 
                  className="w-full px-gutter py-sm rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary bg-surface-container-lowest outline-none transition-all" 
                  max={VALIDATION_RULES.PRODUCT.PRICE_MAX}
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
                maxLength={VALIDATION_RULES.PRODUCT.DESC_MAX}
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
            {isSaving ? "Memproses..." : "Simpan"}
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