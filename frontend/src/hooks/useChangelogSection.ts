import { useState } from 'react';

export function useChangelogSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return {
    isModalOpen,
    setIsModalOpen
  };
}
