import { useState } from 'react';

export function useNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return {
    isOpen,
    toggleOpen
  };
}
