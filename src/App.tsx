import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { RoleplayPage } from './components/RoleplayPage';
import { RoleplayHistoryPage } from './components/RoleplayHistoryPage';
import { SessionDetailPage } from './components/SessionDetailPage';
import { ProgressPage } from './components/ProgressPage';
import { DailyChallengePage } from './components/DailyChallengePage';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { LogoutModal } from './components/LogoutModal';
import { OnboardingPage } from './components/OnboardingPage';
import { ResultSummaryPage } from './components/ResultSummaryPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Leaderboard } from './components/Leaderboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { useAuth } from './hooks/useAuth';
import { signOut } from './utils/supabase/client';
import { LevelProvider } from './contexts/LevelContext';
import './styles/premium.css';

export default function App() {
  const { user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('hasSeenOnboarding');
  });

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
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

  // Show onboarding for first-time authenticated users
  if (user && showOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <LevelProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <div className="size-full">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/*"
                  element={
                    <>
                      <Navigation
                        onLogout={handleLogoutClick}
                        userName={user?.full_name || 'User'}
                        avatarUrl={user?.avatar_url}
                      />
                      <div className="h-full">
                        <Routes>
                          <Route path="/home" element={<HomePage userName={user?.full_name || 'User'} />} />
                          <Route path="/chat" element={<ChatPage userId={user?.id || null} />} />
                          <Route path="/roleplay" element={<RoleplayPage />} />
                          <Route path="/progress" element={<ProgressPage />} />
                          <Route path="/history" element={<RoleplayHistoryPage />} />
                          <Route path="/history/:sessionId" element={<SessionDetailPage />} />
                          <Route path="/challenge" element={<DailyChallengePage />} />
                          <Route path="/leaderboard" element={<Leaderboard />} />
                          <Route path="/settings" element={<SettingsPage userProfile={user} />} />
                          <Route path="/profile" element={<ProfilePage userProfile={user} />} />
                          <Route path="/result-summary" element={<ResultSummaryPage />} />
                          <Route path="/" element={<Navigate to="/home" replace />} />
                        </Routes>
                      </div>
                    </>
                  }
                />
              </Route>
            </Routes>

            {/* Logout Modal */}
            <LogoutModal
              isOpen={showLogoutModal}
              onClose={handleLogoutCancel}
              onConfirm={handleLogoutConfirm}
            />

            {/* Toast Notifications */}
            <Toaster position="top-right" richColors />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </LevelProvider>
  );
}