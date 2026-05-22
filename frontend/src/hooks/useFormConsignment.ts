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
  
  // State Form
  const [selectedProductId, setSelectedProductId] = useState('');
  const [sum, setSum] = useState('');
  const [addressType, setAddressType] = useState<'map' | 'link'>('map'); 
  const [address, setAddress] = useState('');
  const [linkMap, setLinkMap] = useState('');
  
  // Tanggal Hari Ini & Next Restock
  const todayDate = new Date().toISOString().split('T')[0];
  const [lastRestock, setLastRestock] = useState(todayDate);
  const [nextRestockType, setNextRestockType] = useState<'tanggal' | 'hari'>('hari'); 
  const [nextRestockDate, setNextRestockDate] = useState('');
  const [nextRestockDays, setNextRestockDays] = useState('7'); // Default 1 minggu

  // State Map
  const [coords, setCoords] = useState<[number, number]>([-7.5666, 110.8166]); // Default Surakarta
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setCoords([position.coords.latitude, position.coords.longitude]),
        (error) => console.log("GPS Ditolak/Gagal, menggunakan default kota.", error)
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
    const nameProductStr = selectedProductObj ? selectedProductObj.name : t('dashboard.form.unknownProduct');

    let finalAddress = address.trim();
    
    if (!finalAddress) {
      if (addressType === 'map') {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`);
          const data = await response.json();
          finalAddress = data.display_name || `Titik Koordinat: ${coords[0]}, ${coords[1]}`;
        } catch (error) {
          finalAddress = `Titik Koordinat: ${coords[0]}, ${coords[1]}`;
        }
      } else {
        finalAddress = linkMap.trim() || t('dashboard.form.unknownLocation');
      }
    }

    let finalNextRestock = nextRestockDate;
    if (nextRestockType === 'hari') {
      const restockDateObj = new Date(lastRestock);
      restockDateObj.setDate(restockDateObj.getDate() + parseInt(nextRestockDays || '0'));
      finalNextRestock = restockDateObj.toISOString().split('T')[0];
    }

    // Include data koordinat & link ke payload state
    const newConsignment: Consignment = {
      id: Date.now(),
      product: nameProductStr,
      sum: parseInt(sum),
      address: finalAddress,
      lastRestock: lastRestock,
      nextRestock: finalNextRestock,
      lat: addressType === 'map' ? coords[0] : null,
      lng: addressType === 'map' ? coords[1] : null,
      mapLink: addressType === 'link' ? linkMap : null
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
    nextRestockType,
    setNextRestockType,
    nextRestockDate,
    setNextRestockDate,
    nextRestockDays,
    setNextRestockDays,
    mapRef,
    handleSubmit
  };
}
