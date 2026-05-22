// src/App.tsx
import { Loader2 } from 'lucide-react';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import { useApp } from '@/hooks/useApp';

export default function App() {
  const { 
    currentUser, 
    currentPath, 
    isInitializing, 
    handleAuthSuccess, 
    handleLogout 
  } = useApp();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center jt-bg-surface jt-text-primary gap-4">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-sm font-bold jt-text-muted">Authenticating...</p>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPath.startsWith('/dashboard')) {
      return <Dashboard user={currentUser || { username: 'Guest' }} currentPath={currentPath} onLogout={handleLogout} />;
    }

    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  };

  return (
    <>
      {renderPage()}
    </>
  );
}