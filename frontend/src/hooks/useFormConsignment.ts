// src/hooks/useFormConsignment.ts (Perubahan Bagian Atas)
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Consignment, Product } from '@/types/dashboard';
import api from '@/utils/api';

interface UseFormConsignmentProps {
  productData: Product[];
  onAddConsignment: (newData: Consignment) => void;
  onChangeMenu: () => void;
}

export function useFormConsignment({ productData, onAddConsignment, onChangeMenu }: UseFormConsignmentProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [addressType, setAddressType] = useState<'map' | 'link'>('map'); 
  const [address, setAddress] = useState('');
  const [linkMap, setLinkMap] = useState('');
  
  const todayDate = new Date().toISOString().split('T')[0];
  const [lastRestock, setLastRestock] = useState(todayDate);
  const [nextRestockDays, setNextRestockDays] = useState('7');

  const [coords, setCoords] = useState<[number, number]>([-7.5666, 110.8166]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCoords([position.coords.latitude, position.coords.longitude]),
        () => {}
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !amount || !lastRestock) {
      alert(t('dashboard.form.errRequired'));
      return;
    }

    setIsSubmitting(true);

    const selectedProductObj = productData.find(p => p.id === parseInt(selectedProductId));
    if(!selectedProductObj){
      alert(t('dashboard.form.errProductNotFound'));
      setIsSubmitting(false);
      return;
    }

    let finalLat = 0;
    let finalLng = 0;

    if (addressType === 'map') {
      finalLat = coords[0];
      finalLng = coords[1];
    } else {
      const match = linkMap.match(/@?(-?\d+\.\d+)[,](-?\d+\.\d+)/);
      if (!match) {
        alert(t('dashboard.form.unknownLocation'));
        setIsSubmitting(false);
        return;
      }
      finalLat = parseFloat(match[1]);
      finalLng = parseFloat(match[2]);
    }

    let finalAddress = address.trim();
    
    if (!finalAddress) {
      if (addressType === 'map') {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${finalLat}&lon=${finalLng}`);
          const data = await response.json();
          finalAddress = data.display_name || `Titik Koordinat: ${finalLat}, ${finalLng}`;
        } catch (error) {
          finalAddress = `Titik Koordinat: ${finalLat}, ${finalLng}`;
        }
      } else {
        finalAddress = `Titik Koordinat: ${finalLat}, ${finalLng}`;
      }
    }

    const restockDateObj = new Date(lastRestock);
      restockDateObj.setDate(restockDateObj.getDate() + parseInt(nextRestockDays || '0'));
      const finalNextRestock = restockDateObj.toISOString().split('T')[0];

      const payload = {
        productId: parseInt(selectedProductId),
        amount: parseInt(amount),
        address: finalAddress,
        lastRestock: lastRestock,
        nextRestock: finalNextRestock,
        lat: finalLat,
        lng: finalLng,
      };

      console.log(payload)

      const response = await api.consignment.create(payload);

      if (response.success && response.data) {
        onAddConsignment(response.data);
        setIsSubmitting(false);
        onChangeMenu();
      } else {
        alert(response.message);
        setIsSubmitting(false);
      }
    };

    return {
    isSubmitting,
    selectedProductId,
    setSelectedProductId,
    amount,
    setAmount,
    addressType,
    setAddressType,
    address,
    setAddress,
    linkMap,
    setLinkMap,
    lastRestock,
    setLastRestock,
    nextRestockDays,
    setNextRestockDays,
    coords,
    setCoords,
    handleSubmit
  };
}