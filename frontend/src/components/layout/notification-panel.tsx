import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { 
  AlertTriangle, 
  Database, 
  Package, 
  Store, 
  CheckCircle2, 
  ShieldAlert
} from "lucide-react";
import { db } from "@/lib/db";

interface AlertItem {
  id: string;
  type: "danger" | "warning";
  icon: React.ElementType;
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Efek untuk menutup panel jika user klik di luar area panel
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
//         onClose();
//       }
//     };
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, onClose]);

  // Logika Pengecekan Kesehatan Sistem Lokal (Real-time)
  useEffect(() => {
    if (!isOpen) return;

    const checkSystemHealth = async () => {
      setIsLoading(true);
      const newAlerts: AlertItem[] = [];

      try {
        // 1. CEK BACKUP DATA (Menggunakan localStorage sebagai mock)
        const lastBackupStr = localStorage.getItem('last_backup_date');
        const daysSinceBackup = lastBackupStr 
          ? Math.floor((Date.now() - new Date(lastBackupStr).getTime()) / (1000 * 3600 * 24)) 
          : 999;

        if (daysSinceBackup > 7) {
          newAlerts.push({
            id: 'backup',
            type: 'danger',
            icon: Database,
            title: 'Data Rentan',
            description: `Belum melakukan backup ${daysSinceBackup === 999 ? 'sama sekali' : `selama ${daysSinceBackup} hari`}.`,
            actionText: 'Buka Pengaturan',
            actionLink: '/settings'
          });
        }

        // 2. CEK STOK KRITIS
        const lowStockProducts = await db.products.filter(p => p.warehouseStock <= 10).toArray();
        if (lowStockProducts.length > 0) {
          newAlerts.push({
            id: 'stock',
            type: 'warning',
            icon: Package,
            title: 'Stok Gudang Kritis',
            description: `${lowStockProducts.length} produk memiliki stok di bawah batas aman.`,
            actionText: 'Lihat Gudang',
            actionLink: '/products'
          });
        }

        // 3. CEK TOKO PASIF (> 30 Hari tidak dikunjungi)
        const allStores = await db.stores.toArray();
        const passiveStores = allStores.filter(s => {
          // Asumsi Anda telah menambahkan lastVisitAt (opsional). Jika tidak ada, dihitung sebagai pasif/baru.
          if (!s.lastVisitAt) return false; 
          const days = Math.floor((Date.now() - new Date(s.lastVisitAt).getTime()) / (1000 * 3600 * 24));
          return days > 30;
        });

        if (passiveStores.length > 0) {
          newAlerts.push({
            id: 'passive_store',
            type: 'warning',
            icon: Store,
            title: 'Toko Pasif',
            description: `${passiveStores.length} toko tidak dikunjungi lebih dari 30 hari.`,
            actionText: 'Cek Toko',
            actionLink: '/stores'
          });
        }

        // 4. CEK ANOMALI PIUTANG (Minus)
        const minusDebtStores = allStores.filter(s => s.debt < 0);
        if (minusDebtStores.length > 0) {
          newAlerts.push({
            id: 'minus_debt',
            type: 'danger',
            icon: ShieldAlert,
            title: 'Anomali Tagihan',
            description: `${minusDebtStores.length} toko memiliki piutang minus (lebih bayar).`,
            actionText: 'Koreksi Kunjungan',
            actionLink: '/finance'
          });
        }

        setAlerts(newAlerts);
      } catch (error) {
        console.error("Gagal memuat alert:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSystemHealth();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute top-full right-0 w-[85vw] sm:w-[380px] bg-surface/95 backdrop-blur-xl border-b border-l border-outline-variant shadow-2xl rounded-none rounded-bl-3xl z-50 overflow-hidden flex flex-col max-h-[75vh] animate-in slide-in-from-top-2 fade-in duration-200"
      style={{
        // Memastikan menempel sempurna tanpa border atas dan kanan
        marginTop: '-1px', 
        marginRight: '-1px'
      }}
    >
      {/* Header Panel */}
      <div className="px-5 py-4 bg-surface-container-low/80 border-b border-outline-variant flex justify-between items-center shrink-0">
        <h3 className="font-h3 text-h3 font-bold text-text-primary flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Status Sistem
        </h3>
        <span className="font-caption text-caption font-bold bg-error/10 text-error px-2 py-0.5 rounded-full">
          {alerts.length}
        </span>
      </div>

      {/* Konten Notifikasi */}
      <div className="overflow-y-auto flex-1 p-2 space-y-2 no-scrollbar">
        {isLoading ? (
          <div className="py-8 text-center text-text-secondary font-body-sm text-body-sm animate-pulse">
            Memeriksa kesehatan sistem...
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-10 px-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <p className="font-h3 text-h3 font-bold text-text-primary mb-1">Sistem Aman</p>
            <p className="font-body-sm text-body-sm text-text-secondary">Tidak ada peringatan kritis atau tugas mendesak saat ini.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-4 rounded-2xl border ${
                alert.type === 'danger' 
                  ? 'bg-error/5 border-error/20' 
                  : 'bg-warning/5 border-warning/20'
              }`}
            >
              <div className="flex gap-3">
                <div className={`shrink-0 mt-0.5 ${alert.type === 'danger' ? 'text-error' : 'text-warning'}`}>
                  <alert.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-body-sm text-body-sm font-bold text-text-primary uppercase tracking-wider mb-1">
                    {alert.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-text-secondary leading-snug mb-3">
                    {alert.description}
                  </p>
                  <Link 
                    to={alert.actionLink} 
                    onClick={onClose}
                    className="inline-flex items-center gap-1 font-body-sm text-body-sm font-bold text-primary hover:text-primary-hover transition-colors"
                  >
                    ↳ {alert.actionText}
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}