import { useState, useEffect } from 'react';
import { 
  Store, PackageSearch, Menu, X, Zap, User as UserIcon, 
  LayoutDashboard, PackagePlus, Tags, LogOut 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '../components/landing/AuthModal';
import type { Consignment, Product } from '../types/dashboard';

import ConsignmentView from '../components/dashboard/ConsignmentView';
import FormConsignmentView from '../components/dashboard/FormConsignmentView';
import ProductView from '../components/dashboard/ProductView';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const { t } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('list');

  // STATE TRANSAKSIONAL DENGAN LAT/LNG
  const [titipanData, setConsignmentData] = useState<Consignment[]>([
    { id: 1, product: "Keripik Singkong Pedas", sum: 15, address: "Warung Bu Siti - Jl. Mawar No. 2", lastRestock: "2026-05-15", nextRestock: "2026-05-22", lat: -7.5666, lng: 110.8166, mapLink: null },
    { id: 2, product: "Roti Coklat Mini Lumer", sum: 20, address: "Toko Berkah - Jl. Melati No. 10", lastRestock: "2026-05-18", nextRestock: "2026-05-25", lat: -7.5566, lng: 110.8266, mapLink: null },
    { id: 3, product: "Kacang Telur Garuda Premium", sum: 12, address: "Warkop Cak Min - Gg. Kencana", lastRestock: "2026-05-10", nextRestock: "2026-05-17", lat: -7.5766, lng: 110.8066, mapLink: null },
    { id: 4, product: "Kue Sus Kering Rasa Keju", sum: 8, address: "Kantin Sekolah SD 01", lastRestock: "2026-05-19", nextRestock: "2026-05-26", lat: -7.5866, lng: 110.8366, mapLink: null },
  ]);

  // STATE MASTER DATA
  const [productData] = useState<Product[]>([
    { id: 1, name: "Keripik Singkong Pedas", capital: 8000, sell: 10000 },
    { id: 2, name: "Roti Coklat Mini Lumer", capital: 2000, sell: 3000 },
    { id: 3, name: "Kacang Telur Garuda Premium", capital: 5000, sell: 6500 },
    { id: 4, name: "Kue Sus Kering Rasa Keju", capital: 12000, sell: 15000 },
    { id: 5, name: "Makaroni Pedas Daun Jeruk", capital: 3500, sell: 5000 },
  ]);

  // Handler Update Data Consignment
  const handleAddConsignment = (newData: Consignment) => {
    setConsignmentData(prevData => [newData, ...prevData]);
  };

  useEffect(() => {
    if (isProfileOpen || isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isProfileOpen, isSidebarOpen]);

  const handleMenuChange = (menuName: string) => {
    setCurrentMenu(menuName);
    setIsSidebarOpen(false); 
  };

  const menuTitle = currentMenu === 'list' 
    ? t('dashboard.menu.list') 
    : (currentMenu === 'add' ? t('dashboard.menu.add') : t('dashboard.menu.catalog'));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 leading-tight">{t('dashboard.navbar.title')}</span>
            <span className="font-extrabold text-gray-900 text-base sm:text-lg leading-tight">{menuTitle}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-sm font-bold text-gray-700 truncate max-w-[120px] sm:max-w-[200px]">
            {user.username}
          </span>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="bg-rose-100 text-rose-600 p-2 sm:p-2.5 rounded-full shadow-sm hover:bg-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
            title={t('dashboard.navbar.profileTitle')}
          >
            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {currentMenu === 'list' && <ConsignmentView titipanData={titipanData} onChangeMenu={() => handleMenuChange('add')} />}
        {currentMenu === 'add' && <FormConsignmentView productData={productData} onAddConsignment={handleAddConsignment} onChangeMenu={() => handleMenuChange('list')} />}
        {currentMenu === 'catalog' && <ProductView productData={productData} />}
      </main>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative flex flex-col w-72 max-w-[80vw] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="h-7 w-7 text-rose-600" />
                <span className="font-extrabold text-xl text-gray-900 tracking-tight">{t('dashboard.sidebar.title')}</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button onClick={() => handleMenuChange('list')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'list' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <PackageSearch className="h-5 w-5" /> {t('dashboard.menu.list')}
              </button>
              <button onClick={() => handleMenuChange('add')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'add' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <PackagePlus className="h-5 w-5" /> {t('dashboard.menu.add')}
              </button>
              <button onClick={() => handleMenuChange('catalog')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-colors ${currentMenu === 'catalog' ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Tags className="h-5 w-5" /> {t('dashboard.menu.catalog')}
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-400 hover:bg-gray-50 rounded-2xl font-bold transition-colors cursor-not-allowed" title={t('dashboard.sidebar.comingSoon')}>
                <LayoutDashboard className="h-5 w-5" /> {t('dashboard.menu.analytics')}
              </button>
            </div>
            
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 text-left">
                <div className="bg-white p-2 rounded-full shadow-sm text-gray-400"><Zap className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{t('dashboard.sidebar.version')} 1.0.0</p>
                  <p className="text-[10px] font-medium text-gray-500">{t('dashboard.sidebar.upToDate')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Profile */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsProfileOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 text-center">
            <button onClick={() => setIsProfileOpen(false)} className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-full transition-colors focus:outline-none">
              <X className="h-5 w-5" />
            </button>
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner"><UserIcon className="h-10 w-10" /></div>
            <h3 className="text-xl font-extrabold text-gray-900 leading-none mb-2">{user.username}</h3>
            <p className="text-sm text-gray-500 font-medium mb-8">{user.email || t('dashboard.profile.noEmail')}</p>
            <div className="border-t border-gray-100 pt-6">
              <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-50 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 text-gray-700 hover:text-rose-600 font-bold rounded-xl transition-all shadow-sm">
                <LogOut className="h-4 w-4" /> {t('dashboard.profile.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
