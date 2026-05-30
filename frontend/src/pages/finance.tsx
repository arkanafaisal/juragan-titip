import { useState } from "react";
import { 
  Banknote, 
  Wallet, 
  Package, 
  ArrowRight
} from "lucide-react";
import { Link } from "react-router";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer 
} from "recharts";
import { cn, formatRupiah } from "@/lib/utils";

// --- DUMMY DATA ---
const dummyChartData = [
  { date: "1", amount: 150000 },
  { date: "5", amount: 450000 },
  { date: "10", amount: 300000 },
  { date: "15", amount: 1200000 },
  { date: "20", amount: 800000 },
  { date: "24", amount: 1350000 },
];

const dummyIncome = [
  { id: "VIS-001", storeName: "Toko Makmur", date: "24 Mei 2026 (Hari ini)", amount: 450000 },
  { id: "VIS-002", storeName: "Warung Barokah", date: "23 Mei 2026 (1 hari lalu)", amount: 300000 },
  { id: "VIS-003", storeName: "Toko Sinar Jaya", date: "23 Mei 2026 (1 hari lalu)", amount: 210000 },
];

const dummyReceivables = [
  { id: "VIS-004", storeName: "Toko Makmur", date: "20 Mei 2026 (4 hari lalu)", debt: 800000, status: "merah" },
  { id: "VIS-005", storeName: "Toko Berkah", date: "22 Mei 2026 (2 hari lalu)", debt: 135000, status: "kuning" },
];

const dummyAssets = [
  { storeId: "S-01", storeName: "Warung Barokah", date: "23 Mei 2026", itemCount: 60, assetValue: 950000 },
  { storeId: "S-02", storeName: "Toko Makmur", date: "20 Mei 2026", itemCount: 30, assetValue: 420000 },
  { storeId: "S-03", storeName: "Toko Sinar Jaya", date: "18 Mei 2026", itemCount: 25, assetValue: 320000 },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"income" | "receivables" | "assets">("income");

  return (
    <div className="flex flex-col w-full min-h-screen bg-background animate-fade-in">
      
      {/* --- DASHBOARD SECTION --- */}
      <div className="px-[24px] py-[24px] space-y-[24px]">
        
        {/* 1. Card Pemasukan (Besar + Chart) */}
        <div className="bg-primary text-on-primary rounded-[20px] p-[24px] shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-90">
              <Banknote className="w-5 h-5" />
              <h3 className="font-body text-body-sm font-medium uppercase tracking-wider">
                Pemasukan (Bulan Ini)
              </h3>
            </div>
            <div className="text-display font-bold tracking-tight">
              {formatRupiah(4250000)}
            </div>
          </div>
          
          {/* Recharts Area - Absolute di background */}
          <div className="absolute bottom-0 left-0 right-0 h-[100px] opacity-40 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyChartData}>
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
                  4 Toko
                </span>
              </div>
              <h4 className="text-h3 sm:text-h2 font-bold text-text-primary truncate">
                {formatRupiah(1350000)}
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
                  15 Toko
                </span>
              </div>
              <h4 className="text-h3 sm:text-h2 font-bold text-text-primary truncate">
                {formatRupiah(8500000)}
              </h4>
            </div>
          </div>

        </div>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="px-[24px] mb-[16px]">
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
      <div className="px-[24px] pb-[10px] flex-1">
        
        {/* KONTEN: UANG MASUK */}
        {activeTab === "income" && (
          <div className="space-y-[16px] animate-fade-in">
            <p className="text-body-sm text-text-secondary leading-snug">
              Riwayat pemasukan uang tunai dari kunjungan toko.
            </p>
            
            {dummyIncome.map((item, idx) => (
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
                  <Link 
                    to={`/finance/invoices/${item.id}`} 
                    className="flex items-center gap-1 text-body-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    Lihat Nota <ArrowRight className="w-4 h-4" />
                  </Link>
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
            
            {dummyReceivables.map((item, idx) => (
              <div key={idx} className="bg-surface p-[16px] rounded-[16px] border border-outline-variant shadow-sm border-l-4 border-l-error">
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
                    <span className="text-caption text-text-secondary block mb-0.5">Sisa Hutang:</span>
                    <span className={cn(
                      "font-bold text-body",
                      item.status === "merah" ? "text-error" : "text-warning"
                    )}>
                      {formatRupiah(item.debt)}
                    </span>
                  </div>
                  <Link 
                    to={`/finance/invoices/${item.id}`} 
                    className="flex items-center gap-1 text-body-sm font-semibold text-primary hover:text-primary-hover transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
                  >
                    Tagih <ArrowRight className="w-4 h-4" />
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
            
            {dummyAssets.map((item, idx) => (
              <div key={idx} className="bg-surface p-[16px] rounded-[16px] border border-outline-variant shadow-sm border-l-4 border-l-primary">
                <div className="mb-3">
                  <h4 className="font-semibold text-body text-text-primary">
                    {item.storeName}
                  </h4>
                  <span className="text-caption text-text-secondary">
                    📅 Kunjungan Terakhir: {item.date}
                  </span>
                </div>
                
                <div className="border-t border-outline-variant border-dashed my-3"></div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-caption text-text-secondary block mb-0.5">Jumlah Barang:</span>
                    <span className="font-bold text-body text-text-primary">
                      {item.itemCount} Pcs
                    </span>
                  </div>
                  <div className="text-right">
                     <span className="text-caption text-text-secondary block mb-0.5">Estimasi Aset:</span>
                    <span className="font-bold text-body text-primary">
                      {formatRupiah(item.assetValue)}
                    </span>
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