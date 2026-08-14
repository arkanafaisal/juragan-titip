import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { BackButton } from "@/components/shared/back-button";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import {
  SquarePen,
  MapPin,
  User,
  Phone,
  Navigation,
  Package,
  Wallet,
  TrendingUp,
  History,
  StickyNote,
  Loader2
} from "lucide-react";
import { MapPicker } from "@/components/features/map-picker";
import { InvoiceDetail } from "@/components/features/invoice-detail";
import { storeApi } from "@/services/api/stores";
import type { Store, Visit } from "@/types";
import { ConfirmationModal } from '@/components/shared/confirmation-modal';
import { toast } from "sonner";

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("titipan");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

  const [store, setStore] = useState<Store | null>(null);
  const [analysis, setAnalysis] = useState<{
    activeItems: { productName: string; remained: number }[];
    visitHistory: Visit[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchStoreData = async () => {
    if (!id) return;
    setIsLoading(true);
    
    const storeRes = await storeApi.getById(id);

    if (storeRes.success) {
      setStore(storeRes.data.store);
      setAnalysis({
        activeItems: storeRes.data.activeItems,
        visitHistory: storeRes.data.visitHistory
      });
    } else {
      setError(storeRes.message);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStoreData();
  }, [id]);

  const handleRestore = async () => {
    if (!id) return;
    setIsRestoring(true);
    
    const response = await storeApi.restore(id);
    if (response.success) {
      setIsRestoreModalOpen(false);
      fetchStoreData();
    } else {
      toast.error(response.message);
    }
    
    setIsRestoring(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-text-secondary">
        <Package className="w-12 h-12 mb-sm text-outline-variant" />
        <p className="font-body text-body">{error || "Toko tidak ditemukan."}</p>
        <button onClick={() => navigate("/stores")} className="mt-md text-primary font-medium hover:underline">
          Kembali ke Daftar Toko
        </button>
      </div>
    );
  }

  if (selectedInvoiceId !== null) {
    return <InvoiceDetail id={selectedInvoiceId} onBack={() => setSelectedInvoiceId(null)} />;
  }

  return (
    <div className="max-w-container-max mx-auto space-y-md  pb-xl">
      {/* KEMBALI BUTTON */}
      <BackButton fallbackPath="/stores" />

      {store.isArchived && (
        <div className="bg-error/10 border border-error/30 rounded-xl p-4 flex flex-col items-start gap-2">
          <p className="text-body-sm font-bold text-error">
            Perhatian: Toko ini sedang diarsipkan dan tidak muncul di daftar aktif.
          </p>
          <button 
            onClick={() => setIsRestoreModalOpen(true)}
            className="py-1.5 px-4 bg-error text-on-error rounded-lg text-body-sm font-bold hover:bg-error/90 transition-colors active:scale-95"
          >
            Pulihkan Toko
          </button>
        </div>
      )}

      <SectionCard className="!p-0 overflow-hidden">
        <div className="flex flex-col ">
          <div className="flex-1 p-md  flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-sm">
                <div>
                  <div className={`inline-flex items-center gap-xs px-2 py-0.5  mr-2 rounded-full font-caption text-caption mb-sm font-small ${store.lastVisitAt ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-text-secondary'}`}>
                    <History className="w-3 h-3  " /> {store.lastVisitAt ? `Terakhir: ${new Date(store.lastVisitAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}` : "Belum pernah dikunjungi"}
                  </div>
                  <h1 className="font-h2 text-h2   text-text-primary tracking-tight">{store.name}</h1>
                </div>
                
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/stores/${store.id}/edit`)}
                    className="p-1.5 text-warning hover:text-warning/80 hover:bg-warning/30 rounded-xl shrink-0 transition-colors active:scale-95"
                  >
                    <SquarePen className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-sm mt-md">
                {store.ownerName && (
                  <div className="flex items-center gap-xs  text-text-secondary  ">
                    <User className="w-4 h-4   shrink-0" />
                    <p>{store.ownerName}</p>
                  </div>
                )}
                <div className="flex items-center gap-xs  text-text-secondary  ">
                  <Phone className="w-4 h-4   shrink-0" />
                  <p>{store.phone}</p>
                </div>
                <div className="flex items-start gap-xs  text-text-secondary  ">
                  <StickyNote className="w-4 h-4   mt-0.5 shrink-0" />
                  <p className={!store.notes ? "italic text-text-muted" : ""}>{store.notes || "Tidak ada catatan."}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-md  flex flex-col  gap-3">
              <button onClick={() => navigate(`/stores/${store.id}/visit`)} className="w-full  bg-primary text-on-primary rounded-lg py-sm  px-md  flex items-center justify-center gap-sm font-body text-body   font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] whitespace-nowrap">
                <Navigation className="w-4 h-4   shrink-0" /> MULAI KUNJUNGAN
              </button>
              <button onClick={() => window.open(`https://maps.google.com/?q=${store.latitude},${store.longitude}`, '_blank')} className="w-full  bg-surface text-text-secondary border border-outline-variant rounded-lg py-sm  px-md  flex items-center justify-center gap-sm font-body text-body   font-semibold hover:text-primary hover:bg-surface-container-low transition-all active:scale-[0.98] whitespace-nowrap">
                <MapPin className="w-4 h-4   shrink-0" /> MAPS
              </button>
            </div>
          </div>

          <div className="w-full   h-48  bg-surface-container relative border-t   border-border shrink-0 z-0">
            <MapPicker position={{ lat: store.latitude, lng: store.longitude }} readonly={true} />
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1  gap-sm ">
        <StatCard icon={Wallet} title="Piutang" value={store.debt > 0 ? `Rp ${store.debt.toLocaleString("id-ID")}` : "Rp 0"} bgClass="bg-error/10" textClass="text-error" valSizePC="font-h2 text-h2" valSizeMobile="font-body text-body font-bold" />
        <StatCard icon={TrendingUp} title="Nilai Aset" value={store.assetValue > 0 ? `Rp ${store.assetValue.toLocaleString("id-ID")}` : "Rp 0"} bgClass="bg-success/10" textClass="text-success" valSizePC="font-h2 text-h2" valSizeMobile="font-body text-body font-bold" />
      </div>

      <SectionCard className="overflow-hidden flex flex-col">
        <div className="mb-3 bg-surface-container-lowest border-b border-border">
          <div className="flex bg-surface-container-low p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("titipan")} 
              className={`flex-1 py-2 text-body-sm font-semibold rounded-lg transition-all ${activeTab === "titipan" ? "bg-primary text-on-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
            >
              Titipan
            </button>
            <button 
              onClick={() => setActiveTab("riwayat")} 
              className={`flex-1 py-2 text-body-sm font-semibold rounded-lg transition-all ${activeTab === "riwayat" ? "bg-primary text-on-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
            >
              Riwayat
            </button>
          </div>
        </div>
        {activeTab === "titipan" && (
          <div className="">
            {analysis?.activeItems && analysis.activeItems.length > 0 ? (
              <div className="space-y-sm">
                {analysis.activeItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-sm  border border-outline-variant rounded-lg bg-surface-container-lowest">
                    <span className="font-body text-body text-text-primary font-medium">{item.productName}</span>
                    <span className="font-body-sm text-body-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Sisa: {item.remained}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12  flex flex-col items-center justify-center text-text-secondary h-full">
                <Package className="w-12 h-12 mb-sm text-outline-variant" />
                <p className="font-body text-body text-center max-w-[300px]">Belum ada data barang titipan aktif pada toko ini.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "riwayat" && (
          <div className="">
            {analysis?.visitHistory && analysis.visitHistory.length > 0 ? (
              <div className="space-y-sm">
                <p className="text-caption text-text-muted mb-sm italic px-1">Menampilkan maksimal 10 riwayat kunjungan terakhir.</p>
                {analysis.visitHistory.map((visit) => (
                  <button 
                    key={visit.id} 
                    onClick={() => setSelectedInvoiceId(visit.id)}
                    className="w-full flex justify-between items-center p-md border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-body text-body text-text-primary font-medium">
                        {new Date(visit.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="font-caption text-caption text-text-secondary">Dokumen: VST-{visit.id.toString().padStart(5, '0')}</span>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                      <span className="font-body text-body text-text-primary font-bold">
                        Rp {visit.amountPaid.toLocaleString("id-ID")}
                      </span>
                      <span className="font-caption text-caption text-text-secondary">Pembayaran</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12  flex flex-col items-center justify-center text-text-secondary h-full">
                <History className="w-12 h-12 mb-sm text-outline-variant" />
                <p className="font-body text-body text-center max-w-[300px]">Belum ada riwayat kunjungan pada toko ini.</p>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      <ConfirmationModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={handleRestore}
        title="Pulihkan Toko"
        description="Toko ini akan dikembalikan ke daftar aktif. Anda yakin ingin memulihkan toko ini?"
        confirmText="Pulihkan"
        isDanger={false}
        isLoading={isRestoring}
      />
    </div>
  );
}