import { Link } from "react-router";
import {
  Wallet,
  Navigation,
  Clock,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { useState, useEffect } from "react";
import { dashboardApi, type DashboardData } from "@/services/api/dashboard";
import { Loader2, Inbox } from "lucide-react";
import { InvoiceDetail } from "@/components/features/invoice-detail";
import { SectionCard } from "@/components/shared/section-card";

export default function Dashboard() {
  const todayDate = format(new Date(), "EEEE, dd MMM yyyy", { locale: idLocale });

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dashboardApi.getDashboardData();
      setData(result);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Fungsi Helper untuk format Rupiah
  const formatRp = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50 mb-4" />
        <p className="text-text-secondary font-body text-body">Memuat ringkasan...</p>
      </div>
    );
  }

  if (selectedVisitId) {
    return <InvoiceDetail id={selectedVisitId} onBack={() => setSelectedVisitId(null)} />;
  }

  return (
    <div className="max-w-container-max mx-auto space-y-md animate-in fade-in duration-300">

      {/* 1. HEADER & GREETING */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="font-h1 text-h1 font-bold text-text-primary">
          Halo, Juragan! 👋
        </h1>
        <p className="font-body-sm text-body-sm text-text-secondary">
          {todayDate}
        </p>
      </div>

      {/* BANNER APLIKASI MOBILE */}
      <SectionCard className="w-full bg-primary/10 border border-primary/20 flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-h3 text-h3 font-bold text-text-primary">Aplikasi Mobile Tersedia</h3>
            <p className="font-body-sm text-body-sm text-text-secondary mt-0.5">
              Unduh sekarang untuk pengalaman yang lebih baik.
            </p>
          </div>
        </div>
        <button
          onClick={() => window.open('https://drive.google.com/drive/folders/1V5Id5c5mO0FkjOY88hmPFGVMYc3EX0PT?usp=drive_link', '_blank')}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-sm font-semibold transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          Unduh
        </button>
      </SectionCard>

      {/* 2. PENDAPATAN MINGGU INI (Full Width) */}
      <SectionCard className="w-full flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="font-body-sm text-body-sm font-semibold text-text-secondary">
            Margin 7 Hari Terakhir
          </span>
        </div>
        <div className="mt-1">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary truncate" title={formatRp(data.weeklyRevenue)}>
            {formatRp(data.weeklyRevenue)}
          </h2>
        </div>
      </SectionCard>

      {/* 3. JOURNEY HOOK (The Big Red Button) */}
      <Link
        to="/journey"
        className="block w-full transition-all active:scale-[0.98] group"
      >
        <SectionCard className="!bg-primary hover:!bg-primary/90 !text-on-primary !border-none relative overflow-hidden !p-5">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="font-h2 text-h2 font-bold flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Mulai Rute Keliling
              </h2>
              <p className="font-body-sm text-body-sm text-on-primary/80 mt-1 max-w-[240px]">
                Temukan dan kunjungi toko terdekat dari lokasimu sekarang.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Ornamen Background Button */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </SectionCard>
      </Link>

      {/* 4. GRAFIK KUNJUNGAN MINGGU INI */}
      <SectionCard>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-h3 text-h3 font-bold text-text-primary">Kunjungan</h3>
            <p className="font-caption text-caption text-text-secondary">7 Hari Terakhir (Total: {data.totalVisitsThisWeek})</p>
          </div>
          <div className="p-2 bg-surface-container-low rounded-lg text-primary">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        {/* Recharts Area */}
        <div className="h-[180px] w-full">
          {data.totalVisitsThisWeek === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full text-text-secondary opacity-70">
              <Inbox className="w-8 h-8 mb-2" />
              <p className="font-caption text-caption">Belum ada kunjungan dalam 7 hari terakhir</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-surface-container-low)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="visits" radius={[6, 6, 6, 6]} maxBarSize={40}>
                  {data.chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.visits > 0 ? 'var(--color-primary)' : 'var(--color-surface-container-high)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </SectionCard>

      {/* 5. RIWAYAT HARI INI */}
      <SectionCard>
        <h3 className="font-h3 text-h3 font-bold text-text-primary flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          Riwayat Hari Ini
        </h3>

        <div className="flex flex-col divide-y divide-outline-variant/50">
          {data.todayHistory.length > 0 ? (
            data.todayHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedVisitId(item.id)}
                className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-xl border border-outline-variant transition-colors text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="font-data-sm text-data-sm text-text-secondary mt-0.5 w-10 shrink-0">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="font-body-sm text-body-sm font-semibold text-text-primary line-clamp-1">
                      {item.store}
                    </h4>
                    <p className="font-caption text-caption text-text-secondary mt-0.5 flex items-center gap-1">
                      ↳ Masuk:
                      <span className={`font-semibold ${item.isDebt ? 'text-warning' : 'text-success'}`}>
                        {item.isDebt ? `Rp ${item.amount.toLocaleString('id-ID')} (Piutang)` : formatRp(item.amount)}
                      </span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-text-secondary opacity-70">
              <Inbox className="w-8 h-8 mb-2" />
              <span className="font-body-sm text-body-sm">
                Belum ada kunjungan hari ini.
              </span>
            </div>
          )}
        </div>
      </SectionCard>

    </div>
  );
}