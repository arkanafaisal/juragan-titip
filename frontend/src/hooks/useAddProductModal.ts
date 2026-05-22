// src/hooks/useAddProductModal.ts
import { useState } from 'react';
import api from '@/utils/api';
import type { Product } from '@/types/dashboard';

interface UseAddProductModalProps {
  onClose: () => void;
  onAddProduct?: (product: Product) => void;
}

export function useAddProductModal({ onClose, onAddProduct }: UseAddProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [capital, setCapital] = useState('');
  const [sell, setSell] = useState('');

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
      onClose();
      setName('');
      setCapital('');
      setSell('');
    } else {
      alert(response.message);
    }
    setIsSubmitting(false);
  };

  return {
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