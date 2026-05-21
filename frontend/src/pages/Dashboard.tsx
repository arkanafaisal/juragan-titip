import { useState, useEffect } from 'react';
import { 
  Store, PackageSearch, Menu, X, Zap, User as UserIcon, 
  LayoutDashboard, PackagePlus, Tags, LogOut, Loader2 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '../components/landing/AuthModal';
import type { Consignment, Product } from '../types/dashboard';
import api from '../utils/api';

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

  // STATE TRANSAKSIONAL
  const [titipanData, setConsignmentData] = useState<Consignment[]>([]);
  const [productData, setProductData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* DUMMY DATA COMMENTED OUT
  const [titipanData, setConsignmentData] = useState<Consignment[]>([
    { id: 1, product: "Keripik Singkong Pedas", sum: 15, address: "Warung Bu Siti - Jl. Mawar No. 2", lastRestock: "2026-05-15", nextRestock: "2026-05-22", lat: -7.5666, lng: 110.8166, mapLink: null },
    { id: 2, product: "Roti Coklat Mini Lumer", sum: 20, address: "Toko Berkah - Jl. Melati No. 10", lastRestock: "2026-05-18", nextRestock: "2026-05-25", lat: -7.5566, lng: 110.8266, mapLink: null },
    { id: 3, product: "Kacang Telur Garuda Premium", sum: 12, address: "Warkop Cak Min - Gg. Kencana", lastRestock: "2026-05-10", nextRestock: "2026-05-17", lat: -7.5766, lng: 110.8066, mapLink: null },
    { id: 4, product: "Kue Sus Kering Rasa Keju", sum: 8, address: "Kantin Sekolah SD 01", lastRestock: "2026-05-19", nextRestock: "2026-05-26", lat: -7.5866, lng: 110.8366, mapLink: null },
  ]);

  const [productData] = useState<Product[]>([
    { id: 1, name: "Keripik Singkong Pedas", capital: 8000, sell: 10000 },
    { id: 2, name: "Roti Coklat Mini Lumer", capital: 2000, sell: 3000 },
    { id: 3, name: "Kacang Telur Garuda Premium", capital: 5000, sell: 6500 },
    { id: 4, name: "Kue Sus Kering Rasa Keju", capital: 12000, sell: 15000 },
    { id: 5, name: "Makaroni Pedas Daun Jeruk", capital: 3500, sell: 5000 },
  ]);
  */

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [titipanRes, productRes] = await Promise.all([
          api.consignment.getAll(),
          api.products.getAll()
        ]);

        if (titipanRes.success && titipanRes.data) {
          setConsignmentData(titipanRes.data);
        }
        if (productRes.success && productRes.data) {
          setProductData(productRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler Update Data Consignment
  const handleAddConsignment = async (newData: Consignment) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...payload } = newData;
      const response = await api.consignment.create(payload);
      if (response.success && response.data) {
        setConsignmentData(prevData => [response.data!, ...prevData]);
      } else {
        alert(response.message || "Gagal menambahkan data titipan");
      }
    } catch (error) {
      console.error("Error creating consignment:", error);
      alert("Terjadi kesalahan sistem");
    }
  };

  const handleLogoutClick = async () => {
    try {
      await api.auth.logout();
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      onLogout(); // Force logout on client even if API fails
    }
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
    <div className="min-h-screen jt-bg-surface flex flex-col">
      <nav className="bg-white border-b jt-border-base px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
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
            {user.username}
          </span>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="bg-rose-100 jt-text-primary p-2 sm:p-2.5 rounded-full shadow-sm hover:bg-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
            title={t('dashboard.navbar.profileTitle')}
          >
            <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center jt-text-muted gap-3">
            <Loader2 className="h-10 w-10 animate-spin jt-text-primary" />
            <p className="text-sm font-bold">{t('dashboard.status.loading') || 'Loading data...'}</p>
          </div>
        ) : (
          <>
            {currentMenu === 'list' && <ConsignmentView titipanData={titipanData} onChangeMenu={() => handleMenuChange('add')} />}
            {currentMenu === 'add' && <FormConsignmentView productData={productData} onAddConsignment={handleAddConsignment} onChangeMenu={() => handleMenuChange('list')} />}
            {currentMenu === 'catalog' && <ProductView productData={productData} />}
          </>
        )}
      </main>

      {/* Sidebar Overlay */}
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

      {/* Modal Profile */}
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
