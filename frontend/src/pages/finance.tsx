import { useEffect, useState } from "react";
import { 
  Banknote, 
  Wallet, 
  Package, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { Link } from "react-router";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from "recharts";
import { cn, formatRupiah } from "@/lib/utils";
import { financeApi, type FinanceDashboardData } from "@/services/api/finance";
import { InvoiceDetail } from "@/components/features/invoice-detail";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"income" | "receivables" | "assets">("income");
  const [data, setData] = useState<FinanceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await financeApi.getDashboardData();
        setData(result);
      } catch (error) {
        console.error("Failed to load finance data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-text-secondary font-body">Memuat data keuangan...</p>
      </div>
    );
  }

  if (selectedInvoiceId !== null) {
    return <InvoiceDetail id={selectedInvoiceId} onBack={() => setSelectedInvoiceId(null)} />;
  }

  return (
    <div className="flex flex-col w-full min-h-dvh bg-background animate-fade-in">
      
      {/* --- DASHBOARD SECTION --- */}
      <div className="pb-[24px] space-y-[24px]">
        
        {/* 1. Card Pemasukan (Besar + Chart) */}
        <div className={cn(
          "bg-primary text-on-primary rounded-[20px] p-[24px] shadow-lg relative overflow-hidden flex flex-col justify-between transition-all duration-300",
          data.summary.income.chartData.length > 1 ? "min-h-[180px]" : ""
        )}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <Banknote className="w-5 h-5" />
              <h3 className="font-body text-body-sm font-medium uppercase tracking-wider">
                Margin (Bulan Ini)
              </h3>
            </div>
            <div className="text-display font-bold tracking-tight">
              {formatRupiah(data.summary.income.totalThisMonth)}
            </div>
          </div>
          
          {/* Recharts Area - Absolute di background */}
          {data.summary.income.chartData.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-[100px] opacity-40 pointer-events-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.summary.income.chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#ffffff" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 2. Dua Baris terpisah untuk Piutang & Aset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
          
          {/* Card Total Piutang */}
          <div className="bg-surface p-[16px] sm:p-[20px] rounded-[16px] border border-outline-variant shadow-sm flex items-start gap-[12px] sm:gap-[16px]">
            <div className="my-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-body-sm text-text-secondary font-medium truncate">
                  Total Piutang
                </p>
                <span className="text-[10px] sm:text-caption font-medium bg-error/10 text-error px-2 py-1 rounded-md shrink-0">
                  {data.summary.receivables.storeCount} Toko
                </span>
              </div>
              <h4 className="text-h3 sm:text-h2 font-bold text-text-primary truncate">
                {formatRupiah(data.summary.receivables.totalDebt)}
              </h4>
            </div>
          </div>

          {/* Card Nilai Item Aktif */}
          <div className="bg-surface p-[16px] sm:p-[20px] rounded-[16px] border border-outline-variant shadow-sm flex items-start gap-[12px] sm:gap-[16px]">
            <div className="my-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-body-sm text-text-secondary font-medium truncate">
                  Nilai Item Aktif
                </p>
                <span className="text-[10px] sm:text-caption font-medium bg-primary/10 text-primary px-2 py-1 rounded-md shrink-0">
                  {data.summary.assets.storeCount} Toko
                </span>
              </div>
              <h4 className="text-h3 sm:text-h2 font-bold text-text-primary truncate">
                {formatRupiah(data.summary.assets.totalAssetValue)}
              </h4>
            </div>
          </div>

        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="mb-[16px]">
        <div className="flex bg-surface-container-low p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("income")}
            className={cn(
              "flex-1 py-2 text-body-sm font-semibold rounded-lg transition-all",
              activeTab === "income" ? "bg-primary text-on-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Masuk
          </button>
          <button 
            onClick={() => setActiveTab("receivables")}
            className={cn(
              "flex-1 py-2 text-body-sm font-semibold rounded-lg transition-all",
              activeTab === "receivables" ? "bg-primary text-on-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Piutang
          </button>
          <button 
            onClick={() => setActiveTab("assets")}
            className={cn(
              "flex-1 py-2 text-body-sm font-semibold rounded-lg transition-all",
              activeTab === "assets" ? "bg-primary text-on-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Aset
          </button>
        </div>
      </div>

      {/* --- TAB CONTENT AREA --- */}
      <div className="px-[12px] pb-[10px] flex-1">
        
        {/* KONTEN: UANG MASUK */}
        {activeTab === "income" && (
          <div className="space-y-[16px] animate-fade-in">
            <p className="text-body-sm text-text-secondary leading-snug">
              Riwayat pembayaran uang tunai dari kunjungan toko.
            </p>
            
            {data.lists.incomes.length === 0 && (
              <div className="text-center py-8 text-text-secondary">Belum ada data pembayaran bulan ini.</div>
            )}
            
            {data.lists.incomes.map((item, idx) => (
              <div key={idx} className="bg-surface p-[16px] rounded-[16px] border border-outline-variant shadow-sm border-l-4 border-l-primary">
                <div className="mb-3">
                  <h4 className="font-semibold text-body text-text-primary">
                    {item.storeName}
                  </h4>
                  <span className="text-caption text-text-secondary">
                    📅 {item.date}
                  </span>
                </div>
                
                <div className="border-t border-outline-variant border-dashed my-3"></div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-caption text-text-secondary block mb-0.5">Uang Masuk:</span>
                    <span className="font-bold text-body text-success">
                      + {formatRupiah(item.amount)}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedInvoiceId(item.visitId)}
                    className="flex items-center gap-1 text-body-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    Lihat Nota <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KONTEN: PIUTANG */}
        {activeTab === "receivables" && (
          <div className="space-y-[16px] animate-fade-in">
            <p className="text-body-sm text-text-secondary leading-snug">
              Daftar tagihan aktif. Sisa hutang selalu berpindah dan diakumulasikan ke riwayat kunjungan paling akhir.
            </p>
            
            {data.lists.receivables.length === 0 && (
              <div className="text-center py-8 text-text-secondary">Tidak ada tagihan aktif. Mantap! 🎉</div>
            )}
            
            {data.lists.receivables.map((item, idx) => (
              <div key={idx} className="bg-surface p-[16px] rounded-[16px] border border-outline-variant shadow-sm border-l-4 border-l-error">
                <div className="mb-3">
                  <h4 className="font-semibold text-body text-text-primary">
                    {item.storeName}
                  </h4>
                </div>
                
                <div className="border-t border-outline-variant border-dashed my-3"></div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-caption text-text-secondary block mb-0.5">Sisa Hutang:</span>
                    <span className={cn(
                      "font-bold text-body",
                      item.status === "merah" ? "text-error" : "text-warning"
                    )}>
                      {formatRupiah(item.debt)}
                    </span>
                  </div>
                  <Link 
                    to={`/stores/${item.storeId}`} 
                    className="flex items-center gap-1 text-body-sm font-semibold text-primary hover:text-primary-hover transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
                  >
                    Detail Toko <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KONTEN: ASET */}
        {activeTab === "assets" && (
          <div className="space-y-[16px] animate-fade-in">
            <p className="text-body-sm text-text-secondary leading-snug">
              Sebaran data nilai dan barang titipan terakhir di masing-masing toko.
            </p>
            
            {data.lists.assets.length === 0 && (
              <div className="text-center py-8 text-text-secondary">Belum ada aset titipan yang tercatat.</div>
            )}
            
            {data.lists.assets.map((item, idx) => (
              <div key={idx} className="bg-surface p-[16px] rounded-[16px] border border-outline-variant shadow-sm border-l-4 border-l-primary">
                <div className="mb-3">
                  <h4 className="font-semibold text-body text-text-primary">
                    {item.storeName}
                  </h4>
                </div>
                
                <div className="border-t border-outline-variant border-dashed my-3"></div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-caption text-text-secondary block mb-0.5">Estimasi Aset:</span>
                    <span className="font-bold text-body text-primary">
                      {formatRupiah(item.assetValue)}
                    </span>
                  </div>
                  <div className="text-right">
                    <Link 
                      to={`/stores/${item.storeId}`} 
                      className="flex items-center gap-1 text-body-sm font-semibold text-primary hover:text-primary-hover transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
                    >
                      Cek Stok <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}