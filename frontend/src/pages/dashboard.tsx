import React from "react";
import {
  Box,
  Store,
  Banknote,
  TrendingUp,
  TrendingDown,
  ReceiptText,
  ChevronRight,
  CheckCircle,
  Truck,
  CornerDownLeft
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      {/* --- Greeting Section --- */}
      <div className="flex flex-col gap-xs">
        <h1 className="font-h1 text-h1 text-on-surface">Selamat Siang, Ahmad 👋</h1>
        {/* Tanggal di mobile (di desktop pindah ke header) */}
        <p className="font-body text-body text-on-surface-variant md:hidden">📅 26 Mei 2026</p>
      </div>

      {/* --- 4 Stat Cards Grid --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-surface-container-lowest rounded-xl p-md md:p-5 shadow-sm border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Pendapatan</span>
            <div className="w-7 h-7 rounded-md bg-on-tertiary-container flex items-center justify-center text-tertiary-container">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-h1">Rp 12.5jt</div>
            <div className="flex items-center gap-1 mt-xs">
              <TrendingUp className="w-3 h-3 text-tertiary-container" />
              <span className="font-caption text-caption text-tertiary-container font-medium">↑ 12%</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md md:p-5 shadow-sm border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Stok Gudang</span>
            <div className="w-7 h-7 rounded-md bg-primary-fixed flex items-center justify-center text-primary-container">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-h1">342 item</div>
            <div className="flex items-center gap-1 mt-xs">
              <TrendingDown className="w-3 h-3 text-error" />
              <span className="font-caption text-caption text-error font-medium">↓ 8%</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md md:p-5 shadow-sm border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Toko Aktif</span>
            <div className="w-7 h-7 rounded-md bg-secondary-fixed text-secondary-container flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-h1">15 toko</div>
            <div className="flex items-center gap-1 mt-xs">
              <TrendingUp className="w-3 h-3 text-tertiary-container" />
              <span className="font-caption text-caption text-tertiary-container font-medium">↑ 2</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-md md:p-5 shadow-sm border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Piutang</span>
            <div className="w-7 h-7 rounded-md bg-error-container flex items-center justify-center text-error">
              <ReceiptText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-h1">Rp 3.2jt</div>
            <div className="flex items-center gap-1 mt-xs">
              <span className="font-caption text-caption text-error font-medium">4 toko</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Grid (Chart, Table, Activity) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
        
        {/* Left Column (Span 8) */}
        <div className="lg:col-span-8 space-y-md flex flex-col">
          
          {/* Dummy Chart */}
          <div className="hidden md:flex bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 flex-col">
            <div className="flex justify-between items-center mb-md">
              <div>
                <h2 className="font-h3 text-h3 text-on-surface">Grafik Penjualan</h2>
                <p className="font-caption text-caption text-on-surface-variant">Performa 7 hari terakhir</p>
              </div>
            </div>
            <div className="h-[200px] w-full chart-bg relative rounded-md border border-outline-variant/50 overflow-hidden flex items-end px-4 pb-0 pt-4">
              <div className="flex-1 flex items-end justify-around h-full gap-2 relative z-10 pb-6">
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "40%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "80%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "60%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "70%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "30%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "90%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "80%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "85%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "50%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "60%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "90%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "95%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "70%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "75%" }}></div></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full flex justify-around px-4 py-1 border-t border-outline-variant/30 bg-surface-container-lowest/80">
                <span className="font-data-sm text-data-sm text-outline">Sen</span>
                <span className="font-data-sm text-data-sm text-outline">Sel</span>
                <span className="font-data-sm text-data-sm text-outline">Rab</span>
                <span className="font-data-sm text-data-sm text-outline">Kam</span>
                <span className="font-data-sm text-data-sm text-outline">Jum</span>
                <span className="font-data-sm text-data-sm text-outline">Sab</span>
                <span className="font-data-sm text-data-sm text-outline">Min</span>
              </div>
            </div>
          </div>

          {/* Toko Perlu Dikunjungi Table/List */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="px-5 py-md border-b border-outline-variant flex justify-between items-center bg-surface-container/50">
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <Store className="w-5 h-5 text-error" />
                Toko Perlu Dikunjungi
              </h2>
              <button className="text-primary-container font-body-sm text-body-sm font-medium hover:underline">Lihat Semua</button>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col p-md gap-sm bg-surface-container/50">
              <div className="bg-surface-container-lowest rounded-lg p-sm border border-outline-variant flex items-center gap-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex-shrink-0 flex items-center justify-center text-primary-container">
                  <Store className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-body-sm text-body-sm font-medium text-on-surface truncate">Toko Berkah</h4>
                  <p className="font-caption text-caption text-on-surface-variant truncate mt-0.5">25 pcs • 14 hari</p>
                </div>
                <button className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-surface-container-lowest rounded-lg p-sm border border-outline-variant flex items-center gap-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex-shrink-0 flex items-center justify-center text-primary-container">
                  <Store className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-body-sm text-body-sm font-medium text-on-surface truncate">Toko Makmur</h4>
                  <p className="font-caption text-caption text-on-surface-variant truncate mt-0.5">30 pcs • 10 hari</p>
                </div>
                <button className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-bright border-b border-outline-variant">
                    <th className="px-5 py-sm font-caption text-caption text-on-surface-variant font-medium uppercase">Nama Toko</th>
                    <th className="px-5 py-sm font-caption text-caption text-on-surface-variant font-medium uppercase">Item Aktif</th>
                    <th className="px-5 py-sm font-caption text-caption text-on-surface-variant font-medium uppercase">Kunjungan Terakhir</th>
                    <th className="px-5 py-sm font-caption text-caption text-on-surface-variant font-medium uppercase text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-sm">
                      <div className="font-body-sm text-body-sm font-medium text-on-surface">Toko Berkah</div>
                    </td>
                    <td className="px-5 py-sm font-data-sm text-data-sm text-on-surface-variant">25 pcs</td>
                    <td className="px-5 py-sm font-data-sm text-data-sm text-on-surface-variant">14 hari lalu</td>
                    <td className="px-5 py-sm text-right">
                      <button className="bg-primary-fixed text-primary-container px-3 py-1.5 rounded text-caption font-medium hover:bg-primary-container hover:text-surface-container-lowest transition-colors">Kunjungi</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-sm">
                      <div className="font-body-sm text-body-sm font-medium text-on-surface">Toko Makmur</div>
                    </td>
                    <td className="px-5 py-sm font-data-sm text-data-sm text-on-surface-variant">30 pcs</td>
                    <td className="px-5 py-sm font-data-sm text-data-sm text-on-surface-variant">10 hari lalu</td>
                    <td className="px-5 py-sm text-right">
                      <button className="bg-primary-fixed text-primary-container px-3 py-1.5 rounded text-caption font-medium hover:bg-primary-container hover:text-surface-container-lowest transition-colors">Kunjungi</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Span 4) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant flex flex-col h-full md:min-h-[400px]">
          <div className="px-5 py-md border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-h3 text-h3 text-on-surface">Aktivitas Terkini</h2>
          </div>
          <div className="flex-1 p-5">
            <div className="space-y-md">
              
              <div className="flex gap-md items-start">
                <div className="w-8 h-8 rounded-full bg-on-tertiary-container text-tertiary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="flex-grow pb-md border-b border-outline-variant/50">
                  <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Lunas Rp 450.000</span></p>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">Toko Berkah</p>
                </div>
                <span className="font-caption text-caption text-outline whitespace-nowrap">2 jam</span>
              </div>

              <div className="flex gap-md items-start">
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex-grow pb-md border-b border-outline-variant/50">
                  <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Kunjungan selesai</span></p>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">15 item di Toko Makmur</p>
                </div>
                <span className="font-caption text-caption text-outline whitespace-nowrap">5 jam</span>
              </div>

              <div className="flex gap-md items-start">
                <div className="w-8 h-8 rounded-full bg-error-container text-error flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CornerDownLeft className="w-4 h-4" />
                </div>
                <div className="flex-grow">
                  <p className="font-body-sm text-body-sm text-on-surface"><span className="font-semibold">Retur 3 item</span></p>
                  <p className="font-caption text-caption text-on-surface-variant mt-0.5">dari Toko Jaya</p>
                </div>
                <span className="font-caption text-caption text-outline whitespace-nowrap">1 hari</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Pattern untuk grafik dummy - Tetap disimpan di sini agar file rapi */
        .chart-bg {
          background-image: linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: bottom left;
        }
      `}</style>
    </div>
  );
}