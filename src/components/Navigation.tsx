import { Home, MessageSquare, Video, TrendingUp, Trophy, Settings, LogOut, User, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  currentPage: 'home' | 'chat' | 'roleplay' | 'progress' | 'challenge' | 'settings' | 'profile';
  onNavigate: (page: 'home' | 'chat' | 'roleplay' | 'progress' | 'challenge' | 'settings' | 'profile') => void;
  onLogout: () => void;
  userName?: string;
}

export function Navigation({ currentPage, onNavigate, onLogout, userName = 'Student' }: NavigationProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {/* Top Navigation Bar - Desktop */}
      <div className="hidden md:block bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Clickable to Home */}
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Speaken.AI</span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{userName}</span>
              </button>
              
              <button
                onClick={() => onNavigate('settings')}
                className={`p-2 rounded-xl transition-all ${
                  currentPage === 'settings'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile & Main Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:relative md:border-0 z-50 shadow-lg md:shadow-none">
        <div className="max-w-7xl mx-auto px-2 md:px-6 py-2 md:py-4">
          <div className="flex items-center justify-center gap-1 md:gap-2 md:justify-start overflow-x-auto">
            <button
              onClick={() => onNavigate('home')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-6 py-2 md:py-3 rounded-xl transition-all flex-shrink-0 ${
                currentPage === 'home'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs md:text-base">Home</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-6 py-2 md:py-3 rounded-xl transition-all flex-shrink-0 ${
                currentPage === 'chat'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs md:text-base">Chat</span>
            </button>
            <button
              onClick={() => onNavigate('roleplay')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-6 py-2 md:py-3 rounded-xl transition-all flex-shrink-0 ${
                currentPage === 'roleplay'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Video className="w-5 h-5" />
              <span className="text-xs md:text-base">Roleplay</span>
            </button>
            <button
              onClick={() => onNavigate('progress')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-6 py-2 md:py-3 rounded-xl transition-all flex-shrink-0 ${
                currentPage === 'progress'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs md:text-base">Progress</span>
            </button>
            <button
              onClick={() => onNavigate('challenge')}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 md:px-6 py-2 md:py-3 rounded-xl transition-all flex-shrink-0 ${
                currentPage === 'challenge'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-xs md:text-base">Challenge</span>
            </button>
            
            {/* Mobile-only Profile, Settings & Logout */}
            <button
              onClick={() => onNavigate('profile')}
              className={`flex md:hidden flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all flex-shrink-0 ${
                currentPage === 'profile'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`flex md:hidden flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all flex-shrink-0 ${
                currentPage === 'settings'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </button>
            <button
              onClick={onLogout}
              className="flex md:hidden flex-col items-center gap-1 px-2 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all flex-shrink-0"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
