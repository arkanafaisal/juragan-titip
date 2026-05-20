import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import type { User } from './components/landing/AuthModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

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
