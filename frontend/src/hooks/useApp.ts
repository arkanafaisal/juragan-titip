import { useState, useEffect } from 'react';
import type { User } from '@/components/landing/AuthModal';
import api from '@/utils/api';

export function useApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.users.getMe();
        if (response.success && response.data) {
          setCurrentUser(response.data as User);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setCurrentUser(userData);
    window.history.pushState({}, '', '/dashboard');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.history.pushState({}, '', '/');
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  return {
    currentUser,
    currentPath,
    isInitializing,
    handleAuthSuccess,
    handleLogout
  };
}
