import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import { Store } from 'lucide-react';
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
      return <DashboardPlaceholder user={currentUser || { username: 'Guest' }} onLogout={handleLogout} />;
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

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function DashboardPlaceholder({ user, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-sm w-full">
        <Store className="h-12 w-12 text-rose-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Area Dashboard</h2>
        <p className="text-gray-500 mb-6">Halo, {user.username}! Dashboard tidak disertakan di file ini sesuai instruksi.</p>
        <button 
          onClick={onLogout}
          className="w-full py-3 bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 font-bold rounded-xl transition-colors"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
