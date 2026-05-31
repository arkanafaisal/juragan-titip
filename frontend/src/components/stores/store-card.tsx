import { useNavigate } from "react-router";
import { MapPin, Store as StoreIcon, Package, CircleDollarSign, History } from "lucide-react";
import type { Store } from "@/types";

interface StoreCardProps {
  store: Store;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export function StoreCard({ store }: StoreCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <div className="p-md flex-1 flex flex-col cursor-pointer" onClick={() => navigate(`/stores/${store.id}`)}>
        <div className="flex items-start justify-between mb-sm">
          <div className="flex items-center gap-sm flex-1 min-w-0 pr-2">
            <div className="min-w-0">
              <h3 className="font-h3 text-h3 text-text-primary line-clamp-1">{store.name}</h3>
              <p className="font-body-sm text-body-sm text-text-secondary line-clamp-1">{store.ownerName} • {store.phone}</p>
            </div>
          </div>
          <div className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-md font-caption text-[10px] ${store.lastVisitAt ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-text-secondary'}`}>
            <History className="w-3 h-3" />
            <span>{store.lastVisitAt ? new Date(store.lastVisitAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "Belum dikunjungi"}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-xs text-text-secondary mb-md">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="font-body-sm text-body-sm line-clamp-2">{store.address}</span>
        </div>

        <hr className="border-outline-variant mb-md" />

        <div className="grid grid-cols-2 gap-sm mb-xs">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-xs text-text-secondary">
              <Package className="w-4 h-4 shrink-0" />
              <span className="font-caption text-caption">Stok Aktif</span>
            </div>
            <span className="font-data-md text-data-md text-text-primary">0 item</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-xs text-text-secondary">
              <CircleDollarSign className="w-4 h-4 shrink-0" />
              <span className="font-caption text-caption">Piutang</span>
            </div>
            <span className={`font-data-md text-data-md ${
              store.debt === 0 
                ? 'text-success' 
                : store.debt > 1000000 ? 'text-error' : 'text-warning'
            }`}>
              {store.debt === 0 ? "Rp 0" : formatCurrency(store.debt)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-sm bg-surface-bright border-t border-outline-variant flex gap-sm">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            window.open(`https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`, '_blank'); 
          }}
          className="flex-1 border border-outline-variant text-text-secondary hover:text-primary hover:bg-surface-container-low font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
        >
          <MapPin className="w-4 h-4" />
          Maps
        </button>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            navigate(`/stores/${store.id}/visit`); 
          }}
          className="flex-1 bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container font-body-sm text-body-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-xs"
        >
          <StoreIcon className="w-4 h-4" />
          Kunjungi
        </button>
      </div>
    </div>
  );
}
