import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ChevronDown,
  Search,
  User,
  Menu,
  X,
  Plus,
  Home,
  Flame,
  LayoutDashboard,
  Receipt,
  Shield,
  HelpCircle,
  BarChart3,
  Radio,
  Gamepad2,
  Zap,
  Gift,
  Eye,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { UserProfile, AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: UserProfile | null;
  onOpenTopUp: () => void;
  selectedMatchId?: string;
  onToggleMobileSidebar?: () => void;
  selectionsCount?: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  onOpenTopUp,
  onToggleMobileSidebar,
  selectionsCount = 0,
  theme = 'dark',
  onToggleTheme,
  onLoginClick,
  onRegisterClick,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMatchId, setShowMatchId] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(`${timeStr} Africa/Lagos`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-kb-surface lg:bg-kb-surface text-kb-primary shadow-xl select-none font-sans border-b border-kb-border">
      {/* Mobile-only Header (Bet9ja style) */}
      <div className="lg:hidden bg-[#009040] text-white px-3 h-14 flex items-center justify-between">
        <button
          onClick={onRegisterClick}
          className="flex items-center gap-1.5 font-bold text-kb-yellow text-sm"
        >
          <User className="w-4 h-4 fill-current" />
          <span>Register</span>
        </button>

        <button
          onClick={() => setCurrentView('home')}
          className="text-2xl font-black italic tracking-tighter uppercase font-serif flex items-center"
        >
          <span className="text-red-500">KINGS</span>
          <span className="text-black">BET</span>
        </button>

        <button
          onClick={onLoginClick}
          className="flex items-center gap-1.5 font-bold text-white text-sm"
        >
          <span>Login</span>
          <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
            <ChevronDown className="w-3 h-3 -rotate-90" />
          </div>
        </button>
      </div>

      {/* Desktop KingsBet Header */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* KingsBet Logo & Mobile Sidebar Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
            >
              <span className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase font-serif flex items-center">
                <span className="text-kb-yellow drop-shadow-[0_2px_4px_rgba(255,204,0,0.3)]">KINGS</span>
                <span className="text-kb-green drop-shadow-[0_2px_4px_rgba(0,176,80,0.3)]">BET</span>
              </span>
            </button>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-black uppercase tracking-wider">
              <button
                onClick={() => setCurrentView('home')}
                className={`py-4 px-3 border-b-2 transition-all ${
                  currentView === 'home'
                    ? 'border-kb-yellow text-kb-yellow'
                    : 'border-transparent text-kb-secondary hover:text-kb-primary'
                }`}
              >
                Sports
              </button>

              <button
                onClick={() => setCurrentView('live')}
                className={`py-4 px-3 border-b-2 transition-all flex items-center gap-1 ${
                  currentView === 'live'
                    ? 'border-red-500 text-red-400 font-extrabold'
                    : 'border-transparent text-kb-secondary hover:text-kb-primary'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live
              </button>

              <button
                onClick={() => setCurrentView('casino')}
                className={`py-4 px-3 border-b-2 transition-all flex items-center gap-1 ${
                  currentView === 'casino'
                    ? 'border-amber-400 text-amber-400 font-extrabold'
                    : 'border-transparent text-kb-secondary hover:text-kb-primary'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                Casino
              </button>

              <button
                onClick={() => setCurrentView('virtual')}
                className={`py-4 px-3 border-b-2 transition-all flex items-center gap-1 ${
                  currentView === 'virtual'
                    ? 'border-kb-green text-kb-green font-extrabold'
                    : 'border-transparent text-kb-secondary hover:text-kb-primary'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-kb-green" />
                Virtual
              </button>

              <button
                onClick={() => setCurrentView('promotions')}
                className={`py-4 px-3 border-b-2 transition-all flex items-center gap-1 ${
                  currentView === 'promotions'
                    ? 'border-purple-400 text-purple-400 font-extrabold'
                    : 'border-transparent text-purple-400 hover:text-purple-300'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-purple-400" />
                Promotions
              </button>

              <button
                onClick={() => setCurrentView('betslip')}
                className={`py-4 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  currentView === 'betslip'
                    ? 'border-kb-yellow text-kb-yellow font-extrabold'
                    : 'border-transparent text-amber-400 hover:text-amber-300'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 text-kb-yellow" />
                <span>Betslip</span>
                {selectionsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-kb-green text-white font-extrabold text-[10px] rounded-full animate-bounce">
                    {selectionsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('orders')}
                className={`py-4 px-3 border-b-2 transition-all ${
                  currentView === 'orders'
                    ? 'border-kb-green text-kb-green'
                    : 'border-transparent text-kb-secondary hover:text-kb-primary'
                }`}
              >
                My Bets
              </button>
            </nav>
          </div>

          {/* Right Header Action Items */}
          <div className="flex items-center gap-2.5">
            {/* View Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-kb-elevated hover:bg-kb-hover border border-kb-border text-[11px] font-bold text-kb-primary transition-colors"
                title="Switch Page View"
              >
                <span className="w-2 h-2 rounded-full bg-kb-green animate-pulse"></span>
                <span className="hidden sm:inline text-kb-secondary">View:</span>
                <span className="capitalize text-kb-green">
                  {currentView === 'home'
                    ? 'Sportsbook'
                    : currentView === 'live'
                    ? 'Live In-Play'
                    : currentView === 'casino'
                    ? 'Casino'
                    : currentView === 'virtual'
                    ? 'Virtual'
                    : currentView === 'promotions'
                    ? 'Promotions'
                    : currentView === 'betslip'
                    ? 'Betslip Page'
                    : currentView === 'orders'
                    ? 'My Bets'
                    : currentView === 'tracker'
                    ? 'Match Tracker'
                    : currentView === 'dashboard'
                    ? 'Account'
                    : 'Admin'}
                </span>
                <ChevronDown className="w-3 h-3 text-kb-secondary" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-kb-card border border-kb-border shadow-2xl py-2 z-50 text-xs font-medium">
                  <div className="px-3 py-1 text-[10px] font-extrabold text-kb-muted uppercase tracking-wider">
                    KingsBet Views
                  </div>
                  <button
                    onClick={() => { setCurrentView('home'); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-kb-hover ${
                      currentView === 'home' ? 'text-kb-green font-bold' : 'text-kb-primary'
                    }`}
                  >
                    <Home className="w-4 h-4 text-kb-green" /> Sportsbook (Home)
                  </button>
                  <button
                    onClick={() => { setCurrentView('live'); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-kb-hover ${
                      currentView === 'live' ? 'text-red-400 font-bold' : 'text-kb-primary'
                    }`}
                  >
                    <Radio className="w-4 h-4 text-red-500" /> Live In-Play Betting
                  </button>
                  <button
                    onClick={() => { setCurrentView('casino'); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-kb-hover ${
                      currentView === 'casino' ? 'text-amber-400 font-bold' : 'text-kb-primary'
                    }`}
                  >
                    <Gamepad2 className="w-4 h-4 text-amber-400" /> KingsBet Casino
                  </button>
                  <button
                    onClick={() => { setCurrentView('virtual'); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-kb-hover ${
                      currentView === 'virtual' ? 'text-kb-green font-bold' : 'text-kb-primary'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-kb-green" /> Virtual League (60s)
                  </button>
                  <button
                    onClick={() => { setCurrentView('betslip'); setDropdownOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-kb-hover ${
                      currentView === 'betslip' ? 'text-kb-yellow font-bold' : 'text-kb-primary'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-kb-yellow" /> Betslip Page
                    </span>
                    {selectionsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-kb-green text-white font-extrabold text-[10px]">
                        {selectionsCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { setCurrentView('orders'); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-kb-hover ${
                      currentView === 'orders' ? 'text-kb-green font-bold' : 'text-kb-primary'
                    }`}
                  >
                    <Receipt className="w-4 h-4 text-kb-green" /> My Bets & Coupon Check
                  </button>
                  <button
                    onClick={() => { setCurrentView('dashboard'); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-kb-hover ${
                      currentView === 'dashboard' ? 'text-blue-400 font-bold' : 'text-kb-primary'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" /> Account Dashboard
                  </button>
                  <div className="border-t border-kb-border my-1"></div>
                  <button
                    onClick={() => { setCurrentView('admin'); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-kb-hover ${
                      currentView === 'admin' ? 'text-amber-400 font-bold' : 'text-kb-primary'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-400" /> Admin Risk Center
                  </button>
                </div>
              )}
            </div>

            {/* Real Naira Wallet Display & Deposit Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-kb-elevated border border-kb-green/40 rounded-lg px-2.5 py-1">
                <Wallet className="w-3.5 h-3.5 text-kb-green" />
                <div className="text-[11px]">
                  <span className="hidden sm:inline text-kb-secondary mr-1">Wallet:</span>
                  <span className="font-black text-kb-green tracking-wide">
                    ₦{user.demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  onClick={onOpenTopUp}
                  className="ml-1 bg-kb-green hover:bg-kb-green-d text-white px-2 py-0.5 rounded text-[10px] font-black transition-all flex items-center gap-0.5 shadow uppercase tracking-wider"
                >
                  <Plus className="w-3 h-3 stroke-[3]" /> Deposit
                </button>
              </div>
            ) : null}

            {/* Light / Dark Mode Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-1.5 rounded-lg bg-kb-elevated hover:bg-kb-hover border border-kb-border transition-all flex items-center justify-center text-xs font-bold gap-1"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline text-kb-secondary">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="hidden sm:inline text-kb-secondary">Dark</span>
                  </>
                )}
              </button>
            )}

            {/* Login / Profile */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              {user ? (
                <>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="bg-kb-elevated hover:bg-kb-hover text-kb-primary font-bold px-3 py-1.5 rounded-lg border border-kb-border transition-all flex items-center gap-1"
                  >
                    <User className="w-3.5 h-3.5 text-kb-green" /> {user.name}
                  </button>
                  <button
                    onClick={onLogout}
                    title="Logout"
                    className="p-1.5 rounded-lg text-kb-secondary hover:text-red-400 hover:bg-red-500/10 border border-kb-border transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="text-kb-secondary hover:text-kb-primary font-bold px-3 py-1.5 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="bg-kb-yellow hover:bg-kb-yellow/90 text-black font-black px-4 py-1.5 rounded-lg shadow-md transition-all tracking-wide"
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded text-kb-secondary hover:text-kb-primary hover:bg-kb-elevated"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header Bar (Desktop Only) */}
      <div className="hidden lg:block bg-kb-base border-t border-b border-kb-border text-[11px] text-kb-secondary py-1 px-3 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-medium text-kb-primary">{currentTime || '11:59 Africa/Lagos'}</span>
            <span className="text-kb-muted">|</span>
            <button onClick={() => setCurrentView('live')} className="hover:text-kb-primary transition-colors">
              Live Scores
            </button>
            <button onClick={() => setCurrentView('promotions')} className="hover:text-kb-primary transition-colors">
              Promotions
            </button>
            <button onClick={() => setCurrentView('orders')} className="hover:text-kb-primary transition-colors">
              Coupon Check
            </button>
          </div>

          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowMatchId(!showMatchId)}>
            <input
              type="checkbox"
              checked={showMatchId}
              onChange={() => {}}
              className="rounded bg-kb-elevated border-kb-border text-kb-green focus:ring-0 w-3 h-3 cursor-pointer"
            />
            <span className="text-[11px] text-kb-secondary">Show Match ID</span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Bet9ja style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-black text-white border-t border-gray-800 z-50 flex items-center justify-between px-2 pb-1">
        <button onClick={onToggleMobileSidebar} className="flex flex-col items-center justify-center flex-1 py-1 gap-1">
          <Search className="w-5 h-5 text-gray-300" />
          <span className="text-[10px] font-medium text-gray-300">A-Z Menu</span>
        </button>
        
        <button onClick={() => setCurrentView('casino')} className="flex flex-col items-center justify-center flex-1 py-1 gap-1">
          <Gamepad2 className="w-5 h-5 text-gray-300" />
          <span className="text-[10px] font-medium text-gray-300">Casino</span>
        </button>

        <button onClick={() => setCurrentView('betslip')} className="flex flex-col items-center justify-center flex-1 py-1 gap-1 relative">
          <div className="relative">
            <span className="text-xl font-bold leading-none">{selectionsCount}</span>
          </div>
          <span className="text-[10px] font-medium text-white">Betslip</span>
        </button>

        <button onClick={() => setCurrentView('orders')} className="flex flex-col items-center justify-center flex-1 py-1 gap-1">
          <Receipt className="w-5 h-5 text-gray-300" />
          <span className="text-[10px] font-medium text-gray-300">Check Bets</span>
        </button>

        <button onClick={user ? () => setCurrentView('dashboard') : onLoginClick} className="flex flex-col items-center justify-center flex-1 py-1 gap-1">
          <div className="w-5 h-5 border-[1.5px] border-gray-300 rounded-full flex items-center justify-center">
            {user ? <User className="w-3 h-3 text-gray-300" /> : <ChevronDown className="w-3 h-3 -rotate-90 text-gray-300" />}
          </div>
          <span className="text-[10px] font-medium text-gray-300">{user ? 'Account' : 'Login'}</span>
        </button>
      </div>

    </header>
  );
};
