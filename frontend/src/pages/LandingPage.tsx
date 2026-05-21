import { useState } from 'react';

import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import CurrentFeaturesSection from '../components/landing/CurrentFeaturesSection';
import GuidebookSection from '../components/landing/GuidebookSection';
import UpcomingFeaturesSection from '../components/landing/UpcomingFeaturesSection';
import ChangelogSection from '../components/landing/ChangelogSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';
import AuthModal from '../components/landing/AuthModal';
import type  { AuthMode, User } from '../components/landing/AuthModal';

interface LandingPageProps {
  onAuthSuccess: (userData: User) => void;
}

export default function LandingPage({ onAuthSuccess }: LandingPageProps) {
  const [authModal, setAuthModal] = useState<AuthMode>(null);

  return (
    <div className="min-h-screen bg-white jt-text-heading font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      <Navbar onLogin={() => setAuthModal('login')} onRegister={() => setAuthModal('register')} />
      <main>
        <HeroSection onRegister={() => setAuthModal('register')} />
        <CurrentFeaturesSection />
        <GuidebookSection />
        <UpcomingFeaturesSection />
        <ChangelogSection />
        <CtaSection onRegister={() => setAuthModal('register')} />
      </main>
      <Footer />

      {authModal && (
        <AuthModal 
          initialMode={authModal} 
          onClose={() => setAuthModal(null)} 
          onSuccess={onAuthSuccess} 
        />
      )}
    </div>
  );
}
