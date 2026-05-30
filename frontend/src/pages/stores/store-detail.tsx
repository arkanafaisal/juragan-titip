import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  CheckCircle2,
  Pencil,
  Trash2,
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
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { storeApi } from "@/services/api/stores";
import type { Store, Visit } from "@/types";

export default function StoreDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("titipan");

  const [store, setStore] = useState<Store | null>(null);
  const [analysis, setAnalysis] = useState<{
    activeItems: { productName: string; remained: number }[];
    visitHistory: Visit[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const storeRes = await storeApi.getById(id);

        if (storeRes.success && storeRes.data) {
          setStore(storeRes.data.store);
          setAnalysis({
            activeItems: storeRes.data.activeItems,
            visitHistory: storeRes.data.visitHistory
          });
        } else {
          setError(storeRes.message || "Toko tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal memuat data toko.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  const handleDeleteConfirm = async (typedName?: string) => {
    if (!store || !id || !typedName) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await storeApi.delete(id, typedName);
      if (response.success) {
        navigate("/stores");
      } else {
        setDeleteError(response.message || "Gagal menghapus toko");
      }
    } catch (err) {
      setDeleteError("Terjadi kesalahan sistem saat menghapus toko.");
    } finally {
      setIsDeleting(false);
    }
  };

  const StatCard = ({ 
    icon: Icon, title, value, unit, bgClass, textClass, 
    valSizePC = "font-h1 text-h1", valSizeMobile = "font-h3 text-h3 font-bold" 
  }: any) => (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-md flex flex-row md:flex-col justify-between items-center md:items-stretch gap-3 md:gap-md">
      <div className="flex items-center gap-3 md:gap-sm">
        <div className={`p-2 md:p-sm ${bgClass} rounded-lg ${textClass} shrink-0`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="flex flex-col md:hidden">
          <span className="font-caption text-caption text-text-secondary">{title}</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-text-primary tracking-tight ${valSizeMobile}`}>{value}</span>
            {unit && <span className="font-caption text-caption text-text-secondary">{unit}</span>}
          </div>
        </div>
        <span className="hidden md:block font-h3 text-h3 text-text-secondary">{title}</span>
      </div>
      <div className="flex flex-col items-end md:items-start md:flex-row md:justify-between md:items-end shrink-0">
        <div className="hidden md:flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className={`text-text-primary tracking-tight font-bold ${valSizePC}`}>{value}</span>
            {unit && <span className="font-body-sm text-body-sm text-text-secondary">{unit}</span>}
          </div>
        </div>
      </div>
    </div>
  );

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

  return (
    <div className="max-w-container-max mx-auto space-y-md md:space-y-lg pb-xl">

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-md md:p-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-sm">
                <div>
                  <div className="inline-flex items-center gap-xs px-2 py-0.5 md:py-1 rounded-full bg-success/10 text-success font-caption text-caption mb-sm font-medium">
                    <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" /> Aktif
                  </div>
                  <h1 className="font-h2 text-h2 md:font-h1 md:text-h1 text-text-primary tracking-tight">{store.name}</h1>
                </div>
                
                
                <div className="flex items-center gap-xs md:gap-sm">
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-error hover:bg-error/10 p-sm md:px-md md:py-sm rounded-lg transition-colors flex items-center gap-xs font-body-sm text-body-sm md:font-h3 md:text-h3 border border-error/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden md:inline">Hapus</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/stores/${store.id}/edit`)}
                    className="text-primary hover:bg-surface-container-low p-sm md:px-md md:py-sm rounded-lg transition-colors flex items-center gap-xs font-body-sm text-body-sm md:font-h3 md:text-h3 border border-outline-variant"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="hidden md:inline">Edit</span>
                  </button>
                </div>
              </div>

              <div className="space-y-sm mt-md">
                <div className="flex items-start gap-xs md:gap-sm text-text-secondary font-body-sm text-body-sm md:font-body md:text-body">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mt-0.5 shrink-0" />
                  <p>{store.address}</p>
                </div>
                <div className="flex items-center gap-xs md:gap-sm text-text-secondary font-body-sm text-body-sm md:font-body md:text-body">
                  <User className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <p>{store.ownerName}</p>
                </div>
                <div className="flex items-center gap-xs md:gap-sm text-text-secondary font-body-sm text-body-sm md:font-body md:text-body">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <p>{store.phone}</p>
                </div>
                <div className="flex items-start gap-xs md:gap-sm text-text-secondary font-body-sm text-body-sm md:font-body md:text-body">
                  <StickyNote className="w-4 h-4 md:w-5 md:h-5 mt-0.5 shrink-0" />
                  <p className={!store.notes ? "italic text-text-muted" : ""}>{store.notes || "Tidak ada catatan."}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-md md:mt-lg flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate(`/stores/${store.id}/visit`)} className="w-full sm:w-auto bg-primary text-on-primary rounded-lg py-sm md:py-md px-md lg:px-xl flex items-center justify-center gap-sm font-body text-body md:font-h3 md:text-h3 font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-[0.98] whitespace-nowrap">
                <Navigation className="w-4 h-4 md:w-5 md:h-5 shrink-0" /> MULAI KUNJUNGAN
              </button>
              <button onClick={() => window.open(`https://maps.google.com/?q=$${store.latitude},${store.longitude}`, '_blank')} className="w-full sm:w-auto bg-surface text-text-secondary border border-outline-variant rounded-lg py-sm md:py-md px-md lg:px-xl flex items-center justify-center gap-sm font-body text-body md:font-h3 md:text-h3 font-semibold hover:text-primary hover:bg-surface-container-low transition-all active:scale-[0.98] whitespace-nowrap">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" /> MAPS
              </button>
            </div>
          </div>

          <div className="w-full md:w-[320px] lg:w-[400px] h-48 md:h-auto bg-surface-container relative border-t md:border-t-0 md:border-l border-border shrink-0 z-0">
            <MapPicker position={{ lat: store.latitude, lng: store.longitude }} readonly={true} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-sm md:gap-md">
        <StatCard icon={Wallet} title="Piutang" value={store.debt > 0 ? `Rp ${store.debt.toLocaleString("id-ID")}` : "Rp 0"} bgClass="bg-error/10" textClass="text-error" valSizePC="font-h2 text-h2" valSizeMobile="font-body text-body font-bold" />
        <StatCard icon={TrendingUp} title="Nilai Aset" value={store.assetValue > 0 ? `Rp ${store.assetValue.toLocaleString("id-ID")}` : "Rp 0"} bgClass="bg-success/10" textClass="text-success" valSizePC="font-h2 text-h2" valSizeMobile="font-body text-body font-bold" />
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
        <div className="flex border-b border-border px-md bg-surface-container-lowest overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => setActiveTab("titipan")} className={`px-md py-3 font-body text-body md:font-h3 md:text-h3 whitespace-nowrap transition-colors border-b-2 relative top-[1px] ${activeTab === "titipan" ? "font-bold text-primary border-primary" : "text-text-secondary hover:text-text-primary border-transparent"}`}>Titipan</button>
          <button onClick={() => setActiveTab("riwayat")} className={`px-md py-3 font-body text-body md:font-h3 md:text-h3 whitespace-nowrap transition-colors border-b-2 relative top-[1px] ${activeTab === "riwayat" ? "font-bold text-primary border-primary" : "text-text-secondary hover:text-text-primary border-transparent"}`}>Riwayat</button>
        </div>
        {activeTab === "titipan" && (
          <div className="p-md md:p-lg">
            {analysis?.activeItems && analysis.activeItems.length > 0 ? (
              <div className="space-y-sm">
                {analysis.activeItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-sm md:p-md border border-outline-variant rounded-lg bg-surface-container-lowest">
                    <span className="font-body text-body text-text-primary font-medium">{item.productName}</span>
                    <span className="font-body-sm text-body-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Sisa: {item.remained}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 md:py-16 flex flex-col items-center justify-center text-text-secondary h-full">
                <Package className="w-12 h-12 mb-sm text-outline-variant" />
                <p className="font-body text-body text-center max-w-[300px]">Belum ada data barang titipan aktif pada toko ini.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === "riwayat" && (
          <div className="p-md md:p-lg min-h-[200px]">
            {analysis?.visitHistory && analysis.visitHistory.length > 0 ? (
              <div className="space-y-sm">
                {analysis.visitHistory.map((visit) => (
                  <div key={visit.id} className="flex justify-between items-center p-md border border-outline-variant rounded-lg bg-surface-container-lowest">
                    <div className="flex flex-col gap-1">
                      <span className="font-body text-body text-text-primary font-medium">
                        {new Date(visit.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="font-caption text-caption text-text-secondary">Dokumen: {visit.documentNumber}</span>
                    </div>
                    <div className="text-right flex flex-col gap-1">
                      <span className="font-body text-body text-text-primary font-bold">
                        Rp {visit.amountPaid.toLocaleString("id-ID")}
                      </span>
                      <span className="font-caption text-caption text-text-secondary">Pembayaran</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 md:py-16 flex flex-col items-center justify-center text-text-secondary h-full">
                <History className="w-12 h-12 mb-sm text-outline-variant" />
                <p className="font-body text-body text-center max-w-[300px]">Belum ada riwayat kunjungan pada toko ini.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Hapus Toko"
        description="Tindakan ini permanen dan tidak dapat dibatalkan. Semua data kunjungan, catatan piutang, dan riwayat titipan yang terkait dengan toko ini akan ikut terhapus."
        isDanger={true}
        confirmText="Hapus Permanen"
        isLoading={isDeleting}
        verificationText={store.name}
        verificationLabel={
          <>Ketik persis <span className="font-bold text-text-primary select-none">{store.name}</span> untuk konfirmasi:</>
        }
        errorMessage={deleteError}
        onClearError={() => setDeleteError(null)}
      />
    </div>
  );
}