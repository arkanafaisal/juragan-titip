import { useNavigate } from "react-router";
import { MapPin, Store as StoreIcon, History } from "lucide-react";
import type { Store, Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { SectionCard } from "@/components/shared/section-card";

const getCategoryStyles = (category?: string) => {
  if (category === "1") return { bg: "bg-primary", text: "text-on-primary", border: "border-info/40" };
  if (category === "2") return { bg: "bg-success", text: "text-on-success", border: "border-success/40" };
  if (category === "3") return { bg: "bg-warning", text: "text-on-warning", border: "border-warning/40" };
  if (category === "4") return { bg: "bg-secondary", text: "text-on-secondary", border: "border-secondary/40" };
  if (category === "5") return { bg: "bg-on-background", text: "text-on-primary", border: "border-on-background/40" };
  return { bg: "bg-surface-variant", text: "text-on-surface-variant", border: "border-outline-variant" };
};

interface ItemCardProps {
  store?: Store;
  product?: Product;
  storeCategoryLabels?: Record<string, string>;
  categoryLabels?: Record<string, string>;
  lowStockThreshold?: number;
}

export function ItemCard({ store, product, storeCategoryLabels, categoryLabels, lowStockThreshold = 0 }: ItemCardProps) {
  const navigate = useNavigate();
  
  const data = store || product;
  if (!data) return null;

  const isStore = !!store;
  const labels = storeCategoryLabels || categoryLabels || {};
  
  const catStyle = getCategoryStyles(data.category);
  const displayCategory = data.category ? labels[data.category as keyof typeof labels] || data.category : null;

  const title = data.name;
  const storeOwnerAndPhone = isStore 
    ? [((data as Store).ownerName || ""), ((data as Store).phone || "")].filter(Boolean).join(" • ") || "Belum ada info kontak"
    : "";
  const desc = isStore ? storeOwnerAndPhone : ((data as Product).description || "Belum ada deskripsi");

  return (
    <SectionCard className={`!p-0 hover:shadow-md transition-shadow flex flex-col overflow-hidden ${data.category ? `!border-[1.5px] !${catStyle.border}` : ''}`}>
      <div className="p-md pb-xs flex-1 flex flex-col cursor-pointer" onClick={() => navigate(`/${isStore ? 'stores' : 'products'}/${data.id}`)}>
        <div className="flex items-start justify-between mb-sm">
          <div className="flex items-center gap-sm flex-1 min-w-0 pr-2">
            <div className="min-w-0">
              <h3 className="font-h3 text-h3 text-text-primary line-clamp-1">{title}</h3>
              <p className="font-body-sm text-body-sm text-text-secondary line-clamp-1">{desc}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {displayCategory && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${catStyle.bg} ${catStyle.text}`}>
                {displayCategory}
              </span>
            )}
            {isStore && (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-caption text-[10px] ${(data as Store).lastVisitAt ? 'bg-success text-on-success' : 'bg-error text-on-error'}`}>
                <History className="w-3 h-3" />
                <span>{(data as Store).lastVisitAt ? new Date((data as Store).lastVisitAt!).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "Belum dikunjungi"}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-sm mb-xs mt-auto">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-xs text-text-secondary">
              <span className="font-caption text-caption">{isStore ? "Nilai Aset" : "Jumlah Stok"}</span>
            </div>
            <span className={`font-data-md text-data-md ${
              isStore
                ? ((data as Store).assetValue > 0 ? 'text-success' : 'text-warning')
                : (data as Product).warehouseStock === 0 ? 'text-error' : (data as Product).warehouseStock > lowStockThreshold ? "text-success" : "text-warning"}
              }`}>
                {isStore ? formatRupiah((data as Store).assetValue || 0) : (data as Product).warehouseStock}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-xs text-text-secondary">
              <span className="font-caption text-caption">{isStore ? "Piutang" : "Jumlah Retur"}</span>
            </div>
            <span className={`font-data-md text-data-md ${
              isStore 
                ? ((data as Store).debt === 0 ? 'text-success' : (data as Store).debt > 1000000 ? 'text-error' : 'text-warning')
                : (((data as Product).returnedStock || 0) > 0 ? 'text-error' : 'text-success')
            }`}>
              {isStore 
                ? ((data as Store).debt === 0 ? "Rp 0" : formatRupiah((data as Store).debt)) 
                : ((data as Product).returnedStock || 0)}
            </span>
          </div>
        </div>
      </div>

      {isStore && (
        <div className="p-sm bg-surface-bright flex gap-sm">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              window.open(`https://www.google.com/maps/search/?api=1&query=${(data as Store).latitude},${(data as Store).longitude}`, '_blank'); 
            }}
            className="flex-1 border border-outline-variant bg-on-background/85 hover:bg-on-background/65 text-on-primary font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
          >
            <MapPin className="w-4 h-4" />
            Maps
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              navigate(`/stores/${data.id}/visit`); 
            }}
            className="flex-1 bg-primary hover:bg-primary/90 text-on-primary hover:text-on-primary-container font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
          >
            <StoreIcon className="w-4 h-4" />
            Kunjungi
          </button>
        </div>
      )}
    </SectionCard>
  );
}
