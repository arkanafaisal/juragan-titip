import { useState, useEffect } from 'react';
import api from '@/utils/api';
import type { Consignment, Product } from '@/types/dashboard';

interface UseDashboardProps {
  onLogout: () => void;
}

export function useDashboard({ onLogout }: UseDashboardProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('list');

  // STATE TRANSAKSIONAL
  const [titipanData, setConsignmentData] = useState<Consignment[]>([]);
  const [productData, setProductData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    isProfileOpen,
    setIsProfileOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    currentMenu,
    titipanData,
    productData,
    isLoading,
    handleAddConsignment,
    handleLogoutClick,
    handleMenuChange
  };
}
