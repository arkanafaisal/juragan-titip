// @ts-nocheck
import React from "react";
import {
  Box,
  LayoutDashboard,
  Package,
  Store,
  Banknote,
  BarChart3,
  Settings,
  User,
  Menu,
  Calendar,
  Bell,
  TrendingUp,
  TrendingDown,
  ReceiptText,
  ChevronRight,
  CheckCircle,
  Truck,
  CornerDownLeft,
  Home
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="bg-surface-bright text-on-surface font-body text-body antialiased h-screen overflow-hidden flex selection:bg-primary-container selection:text-on-primary-container">

        <nav className="hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 h-full z-40 transition-all duration-300 w-[80px] lg:w-[240px] py-md">
            
            <div className="flex items-center gap-sm px-md mb-lg justify-center lg:justify-start">
                <div className="w-8 h-8 rounded-md bg-primary-container flex-shrink-0 flex items-center justify-center text-on-primary-container font-bold">
                    <Box className="w-5 h-5" />
                </div>
                <div className="hidden lg:block overflow-hidden">
                    <div className="font-h2 text-h2 font-bold text-primary-container tracking-tight leading-none whitespace-nowrap">JuraganTitip</div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-xs px-sm">
                <a href="#" className="flex items-center gap-md px-md py-sm bg-primary-fixed text-primary-container font-bold rounded-lg relative group">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-container rounded-r-md"></div>
                    <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:block">Dashboard</span>
                </a>
                <a href="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all rounded-lg">
                    <Package className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:block">Produk</span>
                </a>
                <a href="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all rounded-lg">
                    <Store className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:block">Toko</span>
                </a>
                <a href="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all rounded-lg">
                    <Banknote className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:block">Keuangan</span>
                </a>
                <a href="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all rounded-lg">
                    <BarChart3 className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:block">Laporan</span>
                </a>
            </div>

            <div className="border-t border-outline-variant pt-sm px-sm flex flex-col gap-xs">
                <a href="#" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all rounded-lg">
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:block">Pengaturan</span>
                </a>
                
                <div className="mt-sm bg-surface-container-low rounded-lg p-sm flex items-center justify-center lg:justify-start gap-sm cursor-pointer mx-xs border border-outline-variant">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="hidden lg:block overflow-hidden">
                        <div className="font-body-sm text-body-sm font-medium text-on-surface truncate">Ahmad</div>
                        <div className="font-caption text-caption text-on-surface-variant truncate">Reseller</div>
                    </div>
                </div>
            </div>
        </nav>

        <div className="flex-1 flex flex-col min-w-0 h-full relative md:ml-[80px] lg:ml-[240px]">
            
            <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-md h-16 shrink-0 z-30 sticky top-0">
                <div className="flex items-center gap-sm md:hidden">
                    <button className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="font-h2 text-h2 font-bold text-primary-container tracking-tight">JuraganTitip</div>
                </div>

                <div className="hidden md:flex flex-1 items-center">
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Dashboard Overview</div>
                </div>

                <div className="flex items-center gap-sm">
                    <div className="hidden md:flex items-center gap-xs text-on-surface-variant bg-surface-bright px-sm py-xs rounded-md border border-outline-variant mr-sm">
                        <Calendar className="w-4 h-4" />
                        <span className="font-data-md text-data-md">24 Mei 2026</span>
                    </div>

                    <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
                    </button>
                    
                    <div className="md:hidden w-8 h-8 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center ml-1">
                        <User className="w-4 h-4" />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-md md:p-lg pb-24 md:pb-lg bg-surface-bright">
                <div className="max-w-container-max mx-auto space-y-lg">
                    
                    <div className="flex flex-col gap-xs">
                        <h1 className="font-h1 text-h1 text-on-surface">Selamat Siang, Ahmad 👋</h1>
                        <p className="font-body text-body text-on-surface-variant md:hidden">📅 24 Mei 2026</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
                        <div className="bg-surface-container-lowest rounded-xl p-[16px] md:p-[20px] shadow-sm border border-outline-variant flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-sm">
                                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Pendapatan</span>
                                <div className="w-7 h-7 rounded-md bg-on-tertiary-container flex items-center justify-center text-tertiary-container">
                                    <Banknote className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-[24px]">Rp 12.5jt</div>
                                <div className="flex items-center gap-1 mt-xs">
                                    <TrendingUp className="w-3 h-3 text-tertiary-container" />
                                    <span className="font-caption text-caption text-tertiary-container font-medium">↑ 12%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest rounded-xl p-[16px] md:p-[20px] shadow-sm border border-outline-variant flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-sm">
                                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Stok Gudang</span>
                                <div className="w-7 h-7 rounded-md bg-primary-fixed flex items-center justify-center text-primary-container">
                                    <Box className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-[24px]">342 item</div>
                                <div className="flex items-center gap-1 mt-xs">
                                    <TrendingDown className="w-3 h-3 text-error" />
                                    <span className="font-caption text-caption text-error font-medium">↓ 8%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest rounded-xl p-[16px] md:p-[20px] shadow-sm border border-outline-variant flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-sm">
                                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Toko Aktif</span>
                                <div className="w-7 h-7 rounded-md bg-secondary-fixed text-secondary-container flex items-center justify-center">
                                    <Store className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-[24px]">15 toko</div>
                                <div className="flex items-center gap-1 mt-xs">
                                    <TrendingUp className="w-3 h-3 text-tertiary-container" />
                                    <span className="font-caption text-caption text-tertiary-container font-medium">↑ 2</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest rounded-xl p-[16px] md:p-[20px] shadow-sm border border-outline-variant flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-sm">
                                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Piutang</span>
                                <div className="w-7 h-7 rounded-md bg-error-container flex items-center justify-center text-error">
                                    <ReceiptText className="w-4 h-4" />
                                </div>
                            </div>
                            <div>
                                <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-[24px]">Rp 3.2jt</div>
                                <div className="flex items-center gap-1 mt-xs">
                                    <span className="font-caption text-caption text-error" style={{ fontWeight: 500 }}>4 toko</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
                        
                        <div className="lg:col-span-8 space-y-md flex flex-col">
                            
                            <div className="hidden md:flex bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-[20px] flex-col">
                                <div className="flex justify-between items-center mb-md">
                                    <div>
                                        <h2 className="font-h3 text-h3 text-on-surface">Grafik Penjualan</h2>
                                        <p className="font-caption text-caption text-on-surface-variant">Performa 7 hari terakhir</p>
                                    </div>
                                </div>
                                <div className="h-[200px] w-full chart-bg relative rounded-md border border-outline-variant/50 overflow-hidden flex items-end px-4 pb-0 pt-4">
                                    <div className="flex-1 flex items-end justify-around h-full gap-2 relative z-10 pb-6">
                                        <div className="w-full max-w-[40px] bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "40%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "80%" }}></div></div>
                                        <div className="w-full max-w-[40px] bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "60%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "70%" }}></div></div>
                                        <div className="w-full max-w-[40px] bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "30%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "90%" }}></div></div>
                                        <div className="w-full max-w-[40px] bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "80%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "85%" }}></div></div>
                                        <div className="w-full max-w-[40px] bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "50%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "60%" }}></div></div>
                                        <div className="w-full max-w-[40px] bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "90%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "95%" }}></div></div>
                                        <div className="w-full max-w-[40px] bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "70%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "75%" }}></div></div>
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

                            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
                                <div className="px-[20px] py-md border-b border-outline-variant flex justify-between items-center bg-surface-container/50">
                                    <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                                        <Store className="w-5 h-5 text-error" />
                                        Toko Perlu Dikunjungi
                                    </h2>
                                    <button className="text-primary-container font-body-sm text-body-sm font-medium hover:underline">Lihat Semua</button>
                                </div>

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

                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-surface-bright border-b border-outline-variant">
                                                <th className="px-[20px] py-sm font-caption text-caption text-on-surface-variant font-medium uppercase">Nama Toko</th>
                                                <th className="px-[20px] py-sm font-caption text-caption text-on-surface-variant font-medium uppercase">Item Aktif</th>
                                                <th className="px-[20px] py-sm font-caption text-caption text-on-surface-variant font-medium uppercase">Kunjungan Terakhir</th>
                                                <th className="px-[20px] py-sm font-caption text-caption text-on-surface-variant font-medium uppercase text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant/50">
                                            <tr className="hover:bg-surface-container-low transition-colors">
                                                <td className="px-[20px] py-sm">
                                                    <div className="font-body-sm text-body-sm font-medium text-on-surface">Toko Berkah</div>
                                                </td>
                                                <td className="px-[20px] py-sm font-data-sm text-data-sm text-on-surface-variant">25 pcs</td>
                                                <td className="px-[20px] py-sm font-data-sm text-data-sm text-on-surface-variant">14 hari lalu</td>
                                                <td className="px-[20px] py-sm text-right">
                                                    <button className="bg-primary-fixed text-primary-container px-3 py-1.5 rounded text-caption font-medium hover:bg-primary-container hover:text-surface-container-lowest transition-colors">Kunjungi</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-surface-container-low transition-colors">
                                                <td className="px-[20px] py-sm">
                                                    <div className="font-body-sm text-body-sm font-medium text-on-surface">Toko Makmur</div>
                                                </td>
                                                <td className="px-[20px] py-sm font-data-sm text-data-sm text-on-surface-variant">30 pcs</td>
                                                <td className="px-[20px] py-sm font-data-sm text-data-sm text-on-surface-variant">10 hari lalu</td>
                                                <td className="px-[20px] py-sm text-right">
                                                    <button className="bg-primary-fixed text-primary-container px-3 py-1.5 rounded text-caption font-medium hover:bg-primary-container hover:text-surface-container-lowest transition-colors">Kunjungi</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant flex flex-col h-full md:min-h-[400px]">
                            <div className="px-[20px] py-md border-b border-outline-variant flex justify-between items-center">
                                <h2 className="font-h3 text-h3 text-on-surface">Aktivitas Terkini</h2>
                            </div>
                            <div className="flex-1 p-[20px]">
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

                </div>
            </main>
        </div>

        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center px-2 py-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button className="flex flex-col items-center justify-center text-primary-container px-3 py-1">
                <div className="w-12 h-8 rounded-full bg-primary-fixed flex items-center justify-center mb-1">
                    <Home className="w-5 h-5" />
                </div>
                <span className="font-caption text-[10px] font-medium">Beranda</span>
            </button>
            <button className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:text-primary-container transition-colors">
                <div className="w-12 h-8 flex items-center justify-center mb-1">
                    <Package className="w-5 h-5" />
                </div>
                <span className="font-caption text-[10px]">Produk</span>
            </button>
            <button className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:text-primary-container transition-colors">
                <div className="w-12 h-8 flex items-center justify-center mb-1">
                    <Store className="w-5 h-5" />
                </div>
                <span className="font-caption text-[10px]">Toko</span>
            </button>
            <button className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:text-primary-container transition-colors">
                <div className="w-12 h-8 flex items-center justify-center mb-1">
                    <Banknote className="w-5 h-5" />
                </div>
                <span className="font-caption text-[10px]">Uang</span>
            </button>
            <button className="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:text-primary-container transition-colors">
                <div className="w-12 h-8 flex items-center justify-center mb-1">
                    <Menu className="w-5 h-5" />
                </div>
                <span className="font-caption text-[10px]">Lainnya</span>
            </button>
        </nav>

        <style>{`
            /* Hide scrollbar for cleaner look */
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            
            /* Grid pattern for the dummy chart */
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