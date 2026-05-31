import { Menu, Calendar, Bell } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useLocation } from "react-router";
import { useSidebar } from "@/hooks/use-sidebar";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { NotificationPanel } from "./notification-panel";
import { useState } from "react";

export function PageHeader() {
  const location = useLocation();
  const todayDate = format(new Date(), "dd MMM yyyy", { locale: idLocale });
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false)
  const { toggle } = useSidebar();
  

  
  const getDynamicTitle = (pathname: string) => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return "Dashboard";

    const section = parts[0];
    const actionOrId = parts[1];
    const subAction = parts[2];

    const sectionMap: Record<string, string> = {
      products: "Produk",
      stores: "Toko",
      finance: "Keuangan",
      reports: "Laporan",
      settings: "Pengaturan"
    };

    const subject = sectionMap[section] || section;

    
    if (section === "dashboard") return "Dashboard";
    if (section === "finance") return "Keuangan"
    if (section === "reports") {
      if (actionOrId === "stores") return "Performa Toko";
      if (actionOrId === "tracking") return "Lacak Barang";
      if (actionOrId === "financial") return "Laporan Keuangan";
      return "Laporan";
    }
    if (section === "settings") {
      if (actionOrId === "profile") return "Profil";
      if (actionOrId === "preferences") return "Preferensi";
      return "Pengaturan";
    }

    
    if (!actionOrId) return `Daftar ${subject}`;
    if (actionOrId === "new") return `Tambah ${subject}`;
    if (!subAction) return `Detail ${subject}`;
    if (subAction === "edit") return `Edit Data ${subject}`;
    if (subAction === "visit" && section === "stores") return "Kunjungan Toko";

    return "JuraganTitip";
  };

  const dynamicTitle = getDynamicTitle(location.pathname);
  

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-md h-16 shrink-0 z-30 sticky top-0">
      
      
      <div className="flex items-center gap-sm min-w-0 pr-2">
        <button 
          onClick={toggle}
          className="hidden md:block p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors shrink-0"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="text-h1 font-bold text-primary-container tracking-tight truncate">
          {dynamicTitle}
        </div>
      </div>

      <div className="flex items-center gap-sm shrink-0">
        <div className="hidden md:flex items-center gap-xs text-on-surface-variant bg-surface-bright px-sm py-xs rounded-md border border-outline-variant mr-sm">
          <Calendar className="w-4 h-4" />
          <span className="font-data-md text-data-md">{todayDate}</span>
        </div>

        <button onClick={()=>{setIsAlertPanelOpen((prev)=>{return !prev})}} className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"></span>
        </button>

        <NotificationPanel 
          isOpen={isAlertPanelOpen} 
          onClose={() => setIsAlertPanelOpen(false)} 
        />
        
        
        <div onClick={()=>{setIsAlertPanelOpen(false)}} className="md:hidden relative ml-1 flex items-center">
          <ProfileMenu />
        </div>

      </div>
    </header>
  );
}