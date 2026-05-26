import { Menu, Calendar, Bell, User } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSidebar } from "@/hooks/use-sidebar.tsx";

interface PageHeaderProps {
  title?: string;
  description?: string;
}

export function PageHeader({ 
  title = "Dashboard", 
  description = "Dashboard Overview" 
}: PageHeaderProps) {
  
  const todayDate = format(new Date(), "dd MMM yyyy", { locale: id });
  // Panggil fungsi toggle dari hook kamu
  const { toggle } = useSidebar();

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-md h-16 shrink-0 z-30 sticky top-0">
      
      {/* Kiri: Tombol Toggle, Judul Mobile & Breadcrumb Desktop */}
      <div className="flex items-center gap-sm">
        {/* Tombol menu sekarang muncul di semua ukuran layar */}
        <button 
          onClick={toggle}
          className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Judul khusus Mobile */}
        <div className="md:hidden font-h2 text-h2 font-bold text-primary-container tracking-tight">
          {title}
        </div>

        {/* Deskripsi khusus Desktop */}
        <div className="hidden md:flex font-body-sm text-body-sm text-on-surface-variant ml-2">
          {description}
        </div>
      </div>

      {/* Kanan: Tanggal, Notifikasi, Mobile User */}
      <div className="flex items-center gap-sm">
        <div className="hidden md:flex items-center gap-xs text-on-surface-variant bg-surface-bright px-sm py-xs rounded-md border border-outline-variant mr-sm">
          <Calendar className="w-4 h-4" />
          <span className="font-data-md text-data-md">{todayDate}</span>
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
  );
}