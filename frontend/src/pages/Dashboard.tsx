// src/pages/Dashboard.tsx
import { 
  Store, PackageSearch, X, Zap, User as UserIcon, 
  LayoutDashboard, PackagePlus, Tags, LogOut, Loader2 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '@/components/landing/AuthModal';
import { useDashboard } from '@/hooks/useDashboard';

import ConsignmentView from '@/components/dashboard/ConsignmentView';
import FormConsignmentView from '@/components/dashboard/FormConsignmentView';
import ProductView from '@/components/dashboard/ProductView';
import Navbar from '@/components/dashboard/Navbar';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { t } = useTranslation();
  const {
    isProfileOpen,
    setIsProfileOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    currentMenu,
    consignmentData,
    productData,
    isLoading,
    handleAddConsignment,
    handleLogoutClick,
    handleMenuChange
  } = useDashboard({ onLogout });

  const menuTitle = currentMenu === 'list' 
    ? t('dashboard.menu.list') 
    : (currentMenu === 'add' ? t('dashboard.menu.add') : t('dashboard.menu.catalog'));

  return (
    <div className="min-h-screen jt-bg-surface flex flex-col">
      <Navbar 
        menuTitle={menuTitle} 
        username={user.username} 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        onOpenProfile={() => setIsProfileOpen(true)} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center jt-text-muted gap-3">
            <Loader2 className="h-10 w-10 animate-spin jt-text-primary" />
            <p className="text-sm font-bold">{t('dashboard.status.loading') || 'Loading data...'}</p>
          </div>
        ) : (
          <>
            {currentMenu === 'list' && <ConsignmentView consignmentData={consignmentData} productData={productData} onChangeMenu={() => handleMenuChange('add')} />}
            {currentMenu === 'add' && <FormConsignmentView productData={productData} onAddConsignment={handleAddConsignment} onChangeMenu={() => handleMenuChange('list')} />}
            {currentMenu === 'catalog' && <ProductView productData={productData} />}
          </>
        )}
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 jt-bg-overlay backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b jt-border-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="h-7 w-7 jt-text-primary" />
                <span className="font-extrabold text-xl jt-text-heading tracking-tight">{t('dashboard.sidebar.title')}</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 jt-bg-surface hover:jt-bg-primary-soft jt-text-light hover:jt-text-primary rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button onClick={() => handleMenuChange('list')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'list' ? 'jt-bg-primary-soft jt-text-primary' : 'text-gray-600 hover:jt-bg-surface hover:text-gray-900'}`}>
                <PackageSearch className="h-5 w-5" /> {t('dashboard.menu.list')}
              </button>
              <button onClick={() => handleMenuChange('add')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'add' ? 'jt-bg-primary-soft jt-text-primary' : 'text-gray-600 hover:jt-bg-surface hover:text-gray-900'}`}>
                <PackagePlus className="h-5 w-5" /> {t('dashboard.menu.add')}
              </button>
              <button onClick={() => handleMenuChange('catalog')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'catalog' ? 'jt-bg-primary-soft jt-text-primary' : 'text-gray-600 hover:jt-bg-surface hover:text-gray-900'}`}>
                <Tags className="h-5 w-5" /> {t('dashboard.menu.catalog')}
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 jt-text-light hover:jt-bg-surface rounded-2xl font-bold transition-colors cursor-not-allowed" title={t('dashboard.sidebar.comingSoon')}>
                <LayoutDashboard className="h-5 w-5" /> {t('dashboard.menu.analytics')}
              </button>
            </div>
            
            <div className="p-4 border-t jt-border-light">
              <div className="jt-bg-surface rounded-2xl p-4 flex items-center gap-3 text-left">
                <div className="bg-white p-2 rounded-full shadow-sm jt-text-light"><Zap className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-bold jt-text-heading">{t('dashboard.sidebar.version')} 1.0.0</p>
                  <p className="text-[10px] font-medium jt-text-muted">{t('dashboard.sidebar.upToDate')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 jt-bg-overlay backdrop-blur-sm transition-opacity" onClick={() => setIsProfileOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 text-center">
            <button onClick={() => setIsProfileOpen(false)} className="absolute top-5 right-5 p-2 jt-bg-surface hover:jt-bg-primary-soft jt-text-light hover:jt-text-primary rounded-full transition-colors focus:outline-none">
              <X className="h-5 w-5" />
            </button>
            <div className="w-20 h-20 bg-rose-100 jt-text-primary rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner"><UserIcon className="h-10 w-10" /></div>
            <h3 className="text-xl font-extrabold jt-text-heading leading-none mb-2">{user.username}</h3>
            <p className="text-sm jt-text-muted font-medium mb-8">{user.email || t('dashboard.profile.noEmail')}</p>
            <div className="border-t jt-border-light pt-6">
              <button onClick={handleLogoutClick} className="w-full flex items-center justify-center gap-2 py-3.5 jt-bg-surface hover:jt-bg-primary-soft border jt-border-base hover:border-rose-200 jt-text-body hover:jt-text-primary font-bold rounded-xl transition-all shadow-sm">
                <LogOut className="h-4 w-4" /> {t('dashboard.profile.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}