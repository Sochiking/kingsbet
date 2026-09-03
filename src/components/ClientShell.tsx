"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BetSlipDrawer } from "@/components/BetSlipDrawer";
import { TopUpModal } from "@/components/TopUpModal";
import { AuthModal } from "@/components/AuthModal";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const {
    user,
    theme,
    toggleTheme,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    activeSelections,
    isTopUpOpen,
    setIsTopUpOpen,
    handleTopUpConfirm,
    handleRemoveSelection,
    handleClearSelections,
    handlePlaceBet,
    setIsAuthModalOpen,
    setAuthView,
    logout,
  } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();

  // Determine current view from pathname
  let currentView = "home";
  if (pathname.includes("/live")) currentView = "live";
  else if (pathname.includes("/casino")) currentView = "casino";
  else if (pathname.includes("/virtual")) currentView = "virtual";
  else if (pathname.includes("/promotions")) currentView = "promotions";
  else if (pathname.includes("/bets")) currentView = "betslip";
  else if (pathname.includes("/account") || pathname.includes("/orders") || pathname.includes("/dashboard")) currentView = "orders";
  else if (pathname.includes("/sports") || pathname === "/") currentView = "home";

  const handleSetCurrentView = (view: string) => {
    if (view === "home") router.push("/");
    else if (view === "live") router.push("/live");
    else if (view === "casino") router.push("/games");
    else if (view === "virtual") router.push("/games");
    else if (view === "promotions") router.push("/promotions");
    else if (view === "betslip") router.push("/bets");
    else if (view === "orders" || view === "dashboard") router.push("/account");
    else router.push("/");
  };

  // Sync theme with HTML tag for Tailwind
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <Navbar
        currentView={currentView as any}
        setCurrentView={handleSetCurrentView}
        user={user}
        onOpenTopUp={() => setIsTopUpOpen(true)}
        selectedMatchId=""
        selectionsCount={activeSelections.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onLoginClick={() => {
          setAuthView('login');
          setIsAuthModalOpen(true);
        }}
        onRegisterClick={() => {
          setAuthView('register');
          setIsAuthModalOpen(true);
        }}
        onLogout={logout}
      />
      
      {/* Overflow hidden on mobile fixes the layout issue */}
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 pt-3 overflow-hidden sm:overflow-visible min-h-screen">
        {children}
      </div>

      <Footer />
      <BetSlipDrawer
        selections={activeSelections}
        onRemoveSelection={handleRemoveSelection}
        onClearAll={handleClearSelections}
        onPlaceBet={handlePlaceBet}
        user={user}
        onOpenFullBetslip={() => handleSetCurrentView('betslip')}
      />
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onTopUp={handleTopUpConfirm}
      />
      <AuthModal />
    </>
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShellInner>
        {children}
      </AppShellInner>
    </AppProvider>
  );
}
