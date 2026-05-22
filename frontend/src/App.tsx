import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';

import type { User } from '@/components/landing/AuthModal'
import api from '@/utils/api';

export default function App() {
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

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center jt-bg-surface jt-text-primary gap-4">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-sm font-bold jt-text-muted">Authenticating...</p>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPath === '/dashboard' || currentUser) {
      return <Dashboard user={currentUser || { username: 'Guest' }} onLogout={handleLogout} />;
    }

    // Default route
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  };

  return (
    <>
      {renderPage()}
    </>
  );
}
