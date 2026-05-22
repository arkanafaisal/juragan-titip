// src/hooks/useLocationModal.ts
import { useEffect } from 'react';
import type { Consignment } from '@/types/dashboard';

interface UseLocationModalProps {
  data: Consignment;
  onClose: () => void;
}

export function useLocationModal({ data, onClose }: UseLocationModalProps) {
  const coords: [number, number] = [data.lat!, data.lng!];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const gmapsLink = `https://www.google.com/maps/search/?api=1&query=$${data.lat},${data.lng}` 

  return {
    coords,
    gmapsLink
  };
}