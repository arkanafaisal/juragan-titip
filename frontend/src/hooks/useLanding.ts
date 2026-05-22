import { useState } from 'react';
import type { AuthMode } from '@/components/landing/AuthModal';

export function useLanding() {
  const [authModal, setAuthModal] = useState<AuthMode>(null);

  return {
    authModal,
    setAuthModal
  };
}
