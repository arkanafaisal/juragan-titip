// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import api from '@/utils/api';
import type { Consignment, Product } from '@/types/dashboard';
import { navigate } from '@/utils/navigation';

interface UseDashboardProps {
  onLogout: () => void;
}

export function useDashboard({ onLogout }: UseDashboardProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [consignmentData, setConsignmentData] = useState<Consignment[]>([]);
  const [productData, setProductData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [consignmentRes, productRes] = await Promise.all([
          api.consignment.getAll(),
          api.products.getAll()
        ]);

        if (consignmentRes.success && consignmentRes.data) {
          setConsignmentData(consignmentRes.data);
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

  const handleAddConsignment = async (newData: Consignment) => {
    try {
      const { id, ...payload } = newData;
      const response = await api.consignment.create(payload);
      if (response.success && response.data) {
        setConsignmentData(prevData => [response.data!, ...prevData]);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error creating consignment:", error);
      alert("Terjadi kesalahan sistem");
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProductData(prevData => [newProduct, ...prevData]);
  };

  const handleLogoutClick = async () => {
    try {
      await api.auth.logout();
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
      onLogout(); 
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
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

  return {
    isProfileOpen,
    setIsProfileOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    consignmentData,
    productData,
    isLoading,
    handleAddConsignment,
    handleAddProduct,
    handleLogoutClick,
    handleNavigate
  };
}