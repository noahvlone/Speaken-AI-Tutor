import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { RoleplayPage } from './components/RoleplayPage';
import { ProgressPage } from './components/ProgressPage';
import { DailyChallengePage } from './components/DailyChallengePage';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { LogoutModal } from './components/LogoutModal';
import { OnboardingPage } from './components/OnboardingPage';
import { ResultSummaryPage } from './components/ResultSummaryPage';
import { LoadingScreen } from './components/LoadingScreen';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { getCurrentUser, signOut, onAuthStateChange, UserProfile } from './utils/supabase/client';

type Page = 'login' | 'register' | 'home' | 'chat' | 'roleplay' | 'progress' | 'challenge' | 'settings' | 'profile' | 'result-summary';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state and listen for changes
  useEffect(() => {
    let subscription: any;

    const initAuth = async () => {
      try {
        // Check for existing session
        const user = await getCurrentUser();
        
        if (user) {
          setUserProfile(user);
          setIsAuthenticated(true);
          setCurrentPage('home');
          
          // Check onboarding
          const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
          if (!hasSeenOnboarding) {
            setShowOnboarding(true);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentPage('login');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
        setCurrentPage('login');
      } finally {
        setIsInitializing(false);
      }

      // Listen for auth state changes
      subscription = onAuthStateChange((user) => {
        setUserProfile(user);
        if (user && !isAuthenticated) {
          setIsAuthenticated(true);
          setCurrentPage('home');
        }
      });
    };

    initAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleNavigate = (page: 'home' | 'chat' | 'roleplay' | 'progress' | 'challenge' | 'settings' | 'profile') => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('home');
    toast.success('Welcome to Speaken.AI! 🎉');
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
    setCurrentPage('home');
    toast.success('Account created successfully! Welcome aboard! 🚀');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
      setIsAuthenticated(false);
      setUserProfile(null);
      setCurrentPage('login');
      // Clear onboarding flag on logout
      localStorage.removeItem('hasSeenOnboarding');
      toast.success('You have successfully logged out. See you soon! 👋');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  // Show loading screen while initializing
  if (isInitializing) {
    return <LoadingScreen />;
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <>
          <RegisterPage
            onRegister={handleRegister}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
          <Toaster position="top-right" richColors />
        </>
      );
    }
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Show onboarding for first-time users
  if (isAuthenticated && showOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  // Show Result Summary page (without navigation)
  if (currentPage === 'result-summary') {
    return (
      <ResultSummaryPage
        onTryAgain={() => setCurrentPage('roleplay')}
        onBackToDashboard={() => setCurrentPage('home')}
      />
    );
  }

  // Show main app if authenticated
  return (
    <div className="size-full">
      {/* Navigation */}
      <Navigation 
        currentPage={currentPage as any} 
        onNavigate={handleNavigate}
        onLogout={handleLogoutClick}
        userName={userProfile?.full_name || 'User'}
      />

      {/* Page Content */}
      <div className="h-full">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} userName={userProfile?.full_name || 'User'} />}
        {currentPage === 'chat' && <ChatPage />}
        {currentPage === 'roleplay' && <RoleplayPage onViewResult={() => setCurrentPage('result-summary')} />}
        {currentPage === 'progress' && <ProgressPage />}
        {currentPage === 'challenge' && <DailyChallengePage />}
        {currentPage === 'settings' && <SettingsPage userProfile={userProfile} />}
        {currentPage === 'profile' && <ProfilePage userProfile={userProfile} />}
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
