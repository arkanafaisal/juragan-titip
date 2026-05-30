import { Pencil, Trash2, Package } from "lucide-react";
import type { Product } from "@/types";
import { settingsApi } from "@/services/api/settings";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: { id: number; name: string }) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const getStockBlockStyles = (stock: number) => {
  const threshold = settingsApi.getLowStockThreshold();
  if (stock === 0) return "bg-error/10 text-error border-error/20";
  if (stock <= threshold) return "bg-warning/10 text-warning-dark border-warning/20"; 
  return "bg-success/10 text-success border-success/20";
};

const getCategoryStyles = (category: string) => {
  if (category === "1") return { bg: "bg-info/10", text: "text-info", border: "border-info/40" };
  if (category === "2") return { bg: "bg-success/10", text: "text-success", border: "border-success/40" };
  if (category === "3") return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/40" };
  if (category === "4") return { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/40" };
  if (category === "5") return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/40" };
  
  const cat = category?.toLowerCase() || "";
  if (cat === "minuman") return { bg: "bg-info/10", text: "text-info", border: "border-info/40" };
  if (cat === "basah") return { bg: "bg-success/10", text: "text-success", border: "border-success/40" };
  if (cat === "kering") return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/40" };
  if (cat === "non-makanan") return { bg: "bg-secondary/10", text: "text-secondary", border: "border-secondary/40" };
  return { bg: "bg-surface-variant", text: "text-on-surface-variant", border: "border-outline-variant" };
};

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const catStyle = getCategoryStyles(product.category);
  const stockStyle = getStockBlockStyles(product.warehouseStock);
  const categoryLabels = settingsApi.getCategoryLabels();
  const displayCategory = categoryLabels[product.category as keyof typeof categoryLabels] || product.category;

  return (
    <div className={`bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden border-[1.5px] ${catStyle.border}`}>
      <div className="p-md flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-md gap-3">
          <div className="flex items-start gap-sm">
            <div>
              <h3 className="font-h3 text-h3 text-text-primary line-clamp-1">{product.name}</h3>
              <p className="font-caption text-caption text-text-secondary mt-0.5 line-clamp-2">
                {product.description || "Tidak ada deskripsi."}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase shrink-0 ${catStyle.bg} ${catStyle.text}`}>
            {displayCategory}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-sm mb-md mt-auto">
          <div className="flex flex-col gap-0.5">
            <span className="font-caption text-caption text-text-secondary">HPP</span>
            <span className="font-data-md text-data-md text-text-primary">{formatCurrency(product.costPrice)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-caption text-caption text-text-secondary">Harga Grosir</span>
            <span className="font-data-md text-data-md text-text-primary">{formatCurrency(product.wholesalePrice)}</span>
          </div>
        </div>

        <div className={`rounded-lg p-sm flex items-center justify-between border ${stockStyle}`}>
          <div className="flex items-center gap-xs font-body-sm text-body-sm font-medium">
            <Package className="w-4 h-4 shrink-0" />
            Stok di Gudang
          </div>
          <span className="font-data-md text-data-md font-bold">{product.warehouseStock}</span>
        </div>
      </div>

      <div className="p-sm bg-surface-bright border-t border-outline-variant flex gap-sm">
        <button 
          onClick={() => onEdit(product)} 
          className="flex-1 border border-outline-variant text-text-secondary hover:text-warning hover:bg-warning/10 hover:border-warning/50 font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
        >
          <Pencil className="w-4 h-4" /> Edit
        </button>
        <button 
          onClick={() => onDelete({ id: product.id, name: product.name })} 
          className="flex-1 border border-outline-variant text-text-secondary hover:text-error hover:bg-error/10 hover:border-error/50 font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
        >
          <Trash2 className="w-4 h-4" /> Hapus
        </button>
      </div>
    </div>
  );
}
