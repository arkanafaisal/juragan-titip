// src/hooks/useProductView.ts
import { useState } from 'react';
import type { Product } from '@/types/dashboard';

interface UseProductViewProps {
  productData: Product[];
}

export function useProductView({ productData }: UseProductViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredProduct = productData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredProduct,
    formatRupiah,
    isAddModalOpen,
    setIsAddModalOpen
  };
}