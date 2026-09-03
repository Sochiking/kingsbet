"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { Match, BetOrder, UserProfile, AdminAnalytics, BetSelection } from '@/types';
import { INITIAL_MATCHES, INITIAL_ANALYTICS } from '@/data/mockData';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  matches: Match[];
  orders: BetOrder[];
  user: UserProfile | null;
  analytics: AdminAnalytics | null;
  activeSelections: BetSelection[];
  isTopUpOpen: boolean;
  setIsTopUpOpen: (val: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (val: boolean) => void;
  
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  authView: 'login' | 'register';
  setAuthView: (val: 'login' | 'register') => void;
  logout: () => void;
  
  handleSelectOdd: (match: Match, marketName: string, optionName: string, odds: number) => void;
  handleRemoveSelection: (matchId: string, optionName: string) => void;
  handleClearSelections: () => void;
  handlePlaceBet: (selection: BetSelection, stake: number) => Promise<boolean>;
  handlePlaceVirtualBet: (matchTitle: string, selection: string, odds: number, stake: number) => Promise<boolean>;
  handleCashoutOrder: (orderId: string, cashoutAmount: number) => void;
  handleTopUpConfirm: (amount: number) => Promise<boolean>;
  handleUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('kingsbet_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('kingsbet_theme', next);
      return next;
    });
  };

  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [orders, setOrders] = useState<BetOrder[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(INITIAL_ANALYTICS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const [activeSelections, setActiveSelections] = useState<BetSelection[]>([]);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load matches on mount (public data, no auth required)
  // Also attempt to restore session if a token exists in localStorage
  useEffect(() => {
    async function loadOnMount() {
      try {
        const mList = await ApiService.getMatches();
        if (mList && mList.length > 0) setMatches(mList);
      } catch (err) {
        console.error('Failed to load matches:', err);
      }
      // Restore session: if token is in localStorage, fetch the current user
      if (typeof window !== 'undefined' && localStorage.getItem('kb_token')) {
        try {
          const userData = await ApiService.getUser();
          if (userData && userData.id) {
            setUser({
              id: String((userData as any).id),
              name: (userData as any).full_name || (userData as any).name,
              email: (userData as any).email,
              demoBalance: Number((userData as any).demo_balance ?? (userData as any).demoBalance ?? 1250),
              joinedDate: (userData as any).created_at
                ? new Date((userData as any).created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'Recently',
            });
          }
        } catch {
          // Token may be expired — remove it
          localStorage.removeItem('kb_token');
        }
      }
    }
    loadOnMount();
  }, []);

  // When user is set (after login), load their orders
  useEffect(() => {
    async function loadUserData() {
      if (!user) {
        setOrders([]); // clear orders when logged out
        return;
      }
      try {
        const oList = await ApiService.getOrders();
        if (oList) setOrders(oList);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    }
    loadUserData();
  }, [user?.id]);

  const handleSelectOdd = (match: Match, marketName: string, optionName: string, odds: number) => {
    if (!match || !match.id) return;
    setActiveSelections((prev) => {
      const exists = prev.some(
        (s) => s.matchId === match.id && s.optionName === optionName
      );

      if (exists) {
        return prev.filter((s) => !(s.matchId === match.id && s.optionName === optionName));
      } else {
        const homeName = match.homeTeam?.name || 'Home';
        const awayName = match.awayTeam?.name || 'Away';
        const newSel: BetSelection = {
          matchId: match.id,
          matchTitle: `${homeName} vs ${awayName}`,
          leagueName: match.leagueName || 'League',
          marketName: marketName || '1x2',
          optionName,
          odds: odds || 1.0,
        };
        return [...prev, newSel];
      }
    });
  };

  const handleRemoveSelection = (matchId: string, optionName: string) => {
    setActiveSelections((prev) =>
      prev.filter((s) => !(s.matchId === matchId && s.optionName === optionName))
    );
  };

  const handleClearSelections = () => setActiveSelections([]);

  const handlePlaceBet = async (selection: BetSelection, stake: number): Promise<boolean> => {
    const res = await ApiService.placeOrder({
      matchTitle: selection.matchTitle,
      selection: selection.optionName,
      odds: selection.odds,
      stake,
      matchId: selection.matchId,
    });

    if (res.success && res.order) {
      setUser((prev) => prev ? {
        ...prev,
        demoBalance: res.newBalance ?? prev.demoBalance - stake,
      } : null);
      setOrders((prev) => [res.order!, ...prev]);
      setActiveSelections((prev) => prev.filter((s) => s.matchId !== selection.matchId));
      return true;
    }
    return false;
  };

  const handlePlaceVirtualBet = async (matchTitle: string, selection: string, odds: number, stake: number): Promise<boolean> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }
    if (user.demoBalance < stake) {
      setIsTopUpOpen(true);
      return false;
    }

    const newOrder: BetOrder = {
      id: `KB-VIRT-${Math.floor(10000 + Math.random() * 90000)}`,
      matchId: 'virtual-1',
      matchTitle,
      selection,
      odds,
      stake,
      potentialWin: Math.round(stake * odds),
      status: 'Pending',
      timestamp: 'Just Now',
      userId: user.id,
      userEmail: user.email,
      bookingCode: `KB-V-${Math.floor(100 + Math.random() * 900)}`,
    };

    setUser((prev) => prev ? { ...prev, demoBalance: prev.demoBalance - stake } : null);
    setOrders((prev) => [newOrder, ...prev]);
    return true;
  };

  const handleCashoutOrder = (orderId: string, cashoutAmount: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Won', wonAmount: cashoutAmount } : o))
    );
    setUser((prev) => prev ? { ...prev, demoBalance: prev.demoBalance + cashoutAmount } : null);
  };

  const handleTopUpConfirm = async (amount: number): Promise<boolean> => {
    const res = await ApiService.topUpDemoPoints(amount);
    if (res.success) {
      setUser((prev) => prev ? { ...prev, demoBalance: res.balance } : null);
      return true;
    }
    return false;
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const res = await ApiService.updateOrderStatus(orderId, status);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
      );
      if (res.userBalance !== undefined) {
        setUser((prev) => prev ? { ...prev, demoBalance: res.userBalance! } : null);
      }
    }
  };

  const logout = () => {
    import('@/services/api').then(({ setAuthToken }) => {
      setAuthToken(null);
    });
    setUser(null);
    setOrders([]);
    setActiveSelections([]);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        matches,
        orders,
        user,
        analytics,
        activeSelections,
        isTopUpOpen,
        setIsTopUpOpen,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authView,
        setAuthView,
        logout,
        handleSelectOdd,
        handleRemoveSelection,
        handleClearSelections,
        handlePlaceBet,
        handlePlaceVirtualBet,
        handleCashoutOrder,
        handleTopUpConfirm,
        handleUpdateOrderStatus,
        setUser
      }}
    >
      <div className={`min-h-screen font-sans antialiased selection:bg-[#00b050] selection:text-white flex flex-col justify-between transition-colors duration-200 ${theme === 'light' ? 'bg-slate-100 text-slate-900 light' : 'bg-[#12151a] text-slate-100 dark'}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
