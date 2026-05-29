
import {
  Box,
  Store,
  Banknote,
  TrendingUp,
  TrendingDown,
  ReceiptText
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { id as idLocale } from "date-fns/locale";
import { format } from "date-fns";


export default function Dashboard() {
  const { user } = useAuth()
  const todayDate = format(new Date(), "dd MMM yyyy", { locale: idLocale });
  

  return (
    <div className="max-w-container-max mx-auto space-y-lg">
      
      
      <div className="flex flex-col gap-xs">
        <h1 className="font-h1 text-h1 text-on-surface">Selamat Siang, {user?.name} 👋</h1>
        
        <p className="font-body text-body text-on-surface-variant md:hidden">📅 {todayDate}</p>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-surface-container-lowest rounded-xl p-md md:p-5 shadow-sm border border-outline-variant flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Pendapatan</span>
            <div className="w-7 h-7 rounded-md bg-on-tertiary-container flex items-center justify-center text-tertiary-container">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div>
            
            <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-h1">Rp 0</div>
            <div className="flex items-center gap-1 mt-xs">
              <TrendingUp className="w-3 h-3 text-on-surface-variant" />
              <span className="font-caption text-caption text-on-surface-variant font-medium">- 0%</span>
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
            
            <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-h1">0 item</div>
            <div className="flex items-center gap-1 mt-xs">
              <TrendingDown className="w-3 h-3 text-on-surface-variant" />
              <span className="font-caption text-caption text-on-surface-variant font-medium">- 0%</span>
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
            
            <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-h1">0 toko</div>
            <div className="flex items-center gap-1 mt-xs">
              <TrendingUp className="w-3 h-3 text-on-surface-variant" />
              <span className="font-caption text-caption text-on-surface-variant font-medium">- 0</span>
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
            
            <div className="font-data-lg text-data-lg text-on-surface text-lg md:text-h1">Rp 0</div>
            <div className="flex items-center gap-1 mt-xs">
              <span className="font-caption text-caption text-on-surface-variant font-medium">0 toko</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
        
        
        <div className="lg:col-span-8 space-y-md flex flex-col">
          
          
          <div className="hidden md:flex bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-5 flex-col">
            <div className="flex justify-between items-center mb-md">
              <div>
                <h2 className="font-h3 text-h3 text-on-surface">Grafik Penjualan</h2>
                <p className="font-caption text-caption text-on-surface-variant">Performa 7 hari terakhir</p>
              </div>
            </div>
            <div className="h-[200px] w-full chart-bg relative rounded-md border border-outline-variant/50 overflow-hidden flex items-end px-4 pb-0 pt-4">
              <div className="flex-1 flex items-end justify-around h-full gap-2 relative z-10 pb-6">
                
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "0%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "0%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "0%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "0%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "0%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "0%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "0%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "0%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "0%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "0%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "0%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "0%" }}></div></div>
                <div className="w-full max-w-xl bg-primary-fixed rounded-t-sm relative group cursor-pointer" style={{ height: "0%" }}><div className="absolute bottom-0 w-full bg-primary-container rounded-t-sm" style={{ height: "0%" }}></div></div>
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
            <div className="px-5 py-md border-b border-outline-variant flex justify-between items-center bg-surface-container/50">
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <Store className="w-5 h-5 text-error" />
                Toko Perlu Dikunjungi
              </h2>
              <button className="text-primary-container font-body-sm text-body-sm font-medium hover:underline">Lihat Semua</button>
            </div>

            
            <div className="md:hidden flex flex-col p-md gap-sm bg-surface-container/50">
              
              <div className="p-md text-center text-on-surface-variant font-body-sm text-body-sm">
                Belum ada toko yang perlu dikunjungi
              </div>
            </div>

            
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
                  
                  <tr>
                    <td colSpan={4} className="px-5 py-md text-center text-on-surface-variant font-body-sm text-body-sm">
                      Belum ada toko yang perlu dikunjungi
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant flex flex-col h-full md:min-h-[400px]">
          <div className="px-5 py-md border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-h3 text-h3 text-on-surface">Aktivitas Terkini</h2>
          </div>
          <div className="flex-1 p-5">
            <div className="space-y-md">
              
              

              <div className="flex justify-center items-center h-32">
                <p className="font-body-sm text-body-sm text-on-surface-variant">Belum ada aktivitas terkini</p>
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