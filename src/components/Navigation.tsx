import { Home, MessageSquare, Video, Trophy, Settings, LogOut, User, Sparkles, Menu, X, BarChart2, Clock, Award, Globe, ChevronUp, BookOpen, Book } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  onLogout: () => void;
  userName?: string;
  avatarUrl?: string; // Optional avatar URL
}

export function Navigation({ onLogout, userName = 'Student', avatarUrl }: NavigationProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenuMobile, setShowUserMenuMobile] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowUserMenuMobile(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenuMobile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const mainNavItems = [
    { id: 'home', path: '/home', label: 'Home', icon: Home },
    { id: 'chat', path: '/chat', label: 'Chat', icon: MessageSquare },
    { id: 'roleplay', path: '/roleplay', label: 'Roleplay', icon: Video },
    { id: 'challenge', path: '/challenge', label: 'Challenge', icon: Trophy },
    { id: 'leaderboard', path: '/leaderboard', label: 'Leaderboard', icon: Award },
    { id: 'progress', path: '/progress', label: 'Stats', icon: BarChart2 },
  ];

  // Mobile bottom nav - only core 4 items (5th is Profile)
  const mobileNavItems = mainNavItems.slice(0, 4);

  const userMenuItems = [
    { id: 'history', path: '/history', label: 'Session History', icon: Clock },
    { id: 'profile', path: '/profile', label: 'Public Profile', icon: User },
    { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
    { id: 'leaderboard', path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'progress', path: '/progress', label: 'Statistics', icon: BarChart2 },
    { id: 'vocab-lib', path: '/library/vocabulary', label: 'Vocabulary Dictionary', icon: BookOpen },
    { id: 'grammar-lib', path: '/library/grammar', label: 'Grammar Reference', icon: Book },
  ];

  return (
    <>
      {/* ===== DESKTOP NAVIGATION (>= md: 768px) ===== */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNavigate('/home')}
              className="flex items-center gap-3 group flex-shrink-0"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-xl group-hover:shadow-indigo-500/30 transition-shadow duration-300"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent leading-none tracking-tight">Speaken.AI</span>
                <span className="text-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold tracking-wide">Learn Speaking</span>
              </div>
            </button>

            {/* Center Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-1 bg-slate-100/60 backdrop-blur-sm rounded-2xl p-1.5 border border-slate-200/50">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigate(item.path)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                        ${isActive
                          ? 'text-white'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon className={`w-4 h-4 relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                      <span className="relative z-10">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Tablet Navigation - Icon only */}
            <div className="flex lg:hidden items-center gap-1 flex-1 justify-center mx-4">
              <div className="flex items-center gap-0.5 bg-slate-100/60 backdrop-blur-sm rounded-xl p-1 border border-slate-200/50">
                {mainNavItems.slice(0, 4).map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigate(item.path)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                        ${isActive
                          ? 'text-white'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                      title={item.label}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPillTablet"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md shadow-indigo-500/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <Icon className="w-5 h-5 relative z-10" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Right: Language & User Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Language Toggle */}
              <motion.button
                onClick={toggleLanguage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl bg-slate-100/60 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-all duration-200 border border-slate-200/50"
                title={i18n.language === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
              >
                <Globe className="w-5 h-5" />
              </motion.button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenuMobile(!showUserMenuMobile)}
                  className="flex items-center gap-3 pl-1 pr-2 py-1.5 rounded-full hover:bg-slate-100 transition-all duration-200"
                >
                  <div className="relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={userName} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center shadow-sm text-white font-bold text-sm tracking-wide">
                        {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block text-left mr-1">
                    <p className="text-sm font-bold text-slate-900 leading-none">{userName}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenuMobile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden z-[100]"
                    >
                      {/* User Info Header in Dropdown */}
                      <div className="px-5 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={userName} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                              {userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-base leading-tight">{userName}</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 text-left">Premium Member ✨</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2 px-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleNavigate(item.path)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors group"
                            >
                              <Icon className="w-5 h-5 flex-shrink-0 text-slate-500 group-hover:text-slate-800" />
                              <span>{item.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Divider */}
                      <div className="mx-4 my-1 border-t border-slate-100" />

                      {/* Logout */}
                      <div className="p-2">
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-5 h-5 flex-shrink-0" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE/TABLET NAVIGATION (< md: 768px) ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-[0_-8px_40px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-around py-2">
            {/* Main nav items - only 4 core items on mobile */}
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300
                    ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveNavPill"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="relative z-10"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span className={`text-[10px] font-bold tracking-tight relative z-10 ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}

            {/* Mobile User Menu Button */}
            <motion.button
              onClick={() => setShowUserMenuMobile(!showUserMenuMobile)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300
                ${showUserMenuMobile ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {showUserMenuMobile && (
                <motion.div
                  layoutId="mobileActiveNavPill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <motion.div
                animate={{ scale: showUserMenuMobile ? 1.1 : 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="relative z-10"
              >
                <User className="w-5 h-5" />
              </motion.div>
              <span className={`text-[10px] font-bold tracking-tight relative z-10 ${showUserMenuMobile ? 'text-white' : ''}`}>
                Profile
              </span>
            </motion.button>
          </div>
        </div>

        {/* Mobile User Menu Dropdown */}
        <AnimatePresence>
          {showUserMenuMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              className="absolute bottom-full left-3 right-3 mb-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
              {/* User Info */}
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{userName}</p>
                <p className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold mt-0.5">Premium Member ✨</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {userMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleNavigate(item.path)}
                      whileTap={{ scale: 0.98, backgroundColor: 'rgba(241, 245, 249, 0.8)' }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 text-slate-500" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}

                {/* Language */}
                <motion.button
                  onClick={toggleLanguage}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <Globe className="w-4 h-4 flex-shrink-0 text-slate-500" />
                  <span>{i18n.language === 'en' ? 'Bahasa Indonesia' : 'English'}</span>
                </motion.button>

                {/* Divider */}
                <div className="mx-4 my-1 border-t border-slate-100" />

                {/* Logout */}
                <motion.button
                  onClick={onLogout}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content Spacer */}
      <div className="h-16" />
      <div className="md:hidden h-24" />
    </>
  );
}
