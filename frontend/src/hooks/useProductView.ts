// src/hooks/useProductView.ts
import { useState } from 'react';
import type { Product } from '@/types/dashboard';
import api from '@/utils/api';

interface UseProductViewProps {
  productData: Product[];
  onAddProduct?: (product: Product) => void;
}

export function useProductView({ productData, onAddProduct }: UseProductViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [capital, setCapital] = useState('');
  const [sell, setSell] = useState('');

  const filteredProduct = productData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !capital || !sell) {
      alert('Semua field wajib diisi');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name,
      capital: parseInt(capital),
      sell: parseInt(sell)
    };

    const response = await api.products.create(payload);
    
    if (response.success && response.data) {
      if (onAddProduct) onAddProduct(response.data);
      setIsAddModalOpen(false);
      setName('');
      setCapital('');
      setSell('');
    } else {
      alert(response.message);
    }
    setIsSubmitting(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredProduct,
    formatRupiah,
    isAddModalOpen,
    setIsAddModalOpen,
    isSubmitting,
    name,
    setName,
    capital,
    setCapital,
    sell,
    setSell,
    handleAddSubmit
  };
}