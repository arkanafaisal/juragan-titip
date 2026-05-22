// src/hooks/useFormConsignment.ts
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Consignment, Product } from '@/types/dashboard';

interface UseFormConsignmentProps {
  productData: Product[];
  onAddConsignment: (newData: Consignment) => void;
  onChangeMenu: () => void;
}

export function useFormConsignment({ productData, onAddConsignment, onChangeMenu }: UseFormConsignmentProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [sum, setSum] = useState('');
  const [addressType, setAddressType] = useState<'map' | 'link'>('map'); 
  const [address, setAddress] = useState('');
  const [linkMap, setLinkMap] = useState('');
  
  const todayDate = new Date().toISOString().split('T')[0];
  const [lastRestock, setLastRestock] = useState(todayDate);
  const [nextRestockDays, setNextRestockDays] = useState('7');

  const [coords, setCoords] = useState<[number, number]>([-7.5666, 110.8166]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCoords([position.coords.latitude, position.coords.longitude]),
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    if (addressType !== 'map') return;

    let isMounted = true;

    const loadLeaflet = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      if (window.L) {
        delete window.L.Icon.Default.prototype._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      }

      if (isMounted && window.L && mapRef.current && !mapInstance.current) {
        const map = window.L.map(mapRef.current).setView(coords, 15);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const marker = window.L.marker(coords, { draggable: true }).addTo(map);
        
        marker.on('dragend', function () {
          const position = marker.getLatLng();
          setCoords([position.lat, position.lng]);
        });

        mapInstance.current = map;
        markerInstance.current = marker;
      }
    };

    loadLeaflet();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [addressType]);

  useEffect(() => {
    if (mapInstance.current && markerInstance.current) {
      mapInstance.current.setView(coords, 15);
      markerInstance.current.setLatLng(coords);
    }
  }, [coords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !sum || !lastRestock) {
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

    const newConsignment: Consignment = {
      id: Date.now(),
      productId: parseInt(selectedProductId),
      sum: parseInt(sum),
      address: finalAddress,
      lastRestock: lastRestock,
      nextRestock: finalNextRestock,
      lat: finalLat,
      lng: finalLng,
    };

    onAddConsignment(newConsignment);
    setIsSubmitting(false);
    onChangeMenu();
  };

  return {
    isSubmitting,
    selectedProductId,
    setSelectedProductId,
    sum,
    setSum,
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
    mapRef,
    handleSubmit
  };
}