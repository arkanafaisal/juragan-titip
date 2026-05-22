import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Consignment } from '@/types/dashboard';

interface UseConsignmentViewProps {
  titipanData: Consignment[];
}

export function useConsignmentView({ titipanData }: UseConsignmentViewProps) {
  const { t } = useTranslation();
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedLocationMap, setSelectedLocationMap] = useState<Consignment | null>(null);

  const sortedData = useMemo(() => {
    return [...titipanData].sort((a, b) => {
      const dateA = new Date(a.nextRestock).getTime();
      const dateB = new Date(b.nextRestock).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [titipanData, sortOrder]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(t('i18n.locale') === 'en' ? 'en-US' : 'id-ID', options);
  };

  return {
    sortOrder,
    setSortOrder,
    selectedLocationMap,
    setSelectedLocationMap,
    sortedData,
    formatDate
  };
}
