// src/components/dashboard/Navbar.tsx
import { Menu, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  menuTitle: string;
  username: string;
  onOpenSidebar: () => void;
  onOpenProfile: () => void;
}

export default function Navbar({ menuTitle, username, onOpenSidebar, onOpenProfile }: NavbarProps) {
  const { t } = useTranslation();

  return (
    <nav className="bg-white border-b jt-border-base px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-gray-600 hover:jt-text-primary hover:jt-bg-primary-soft rounded-full transition-colors focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest jt-text-primary leading-tight">{t('dashboard.navbar.title')}</span>
          <span className="font-extrabold jt-text-heading text-base sm:text-lg leading-tight">{menuTitle}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-sm font-bold jt-text-body truncate max-w-[120px] sm:max-w-[200px]">
          {username}
        </span>
        <button 
          onClick={onOpenProfile}
          className="bg-rose-100 jt-text-primary p-2 sm:p-2.5 rounded-full shadow-sm hover:bg-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
          title={t('dashboard.navbar.profileTitle')}
        >
          <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </nav>
  );
}