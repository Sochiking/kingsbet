"use client";

import { useAppContext } from "@/context/AppContext";
import { UserDashboardPage } from "@/components/UserDashboardPage";
import { MyOrdersPage } from "@/components/MyOrdersPage";
import { INITIAL_LEAGUES } from "@/data/mockData";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { user, orders, setIsTopUpOpen } = useAppContext();
  const [view, setView] = useState<'dashboard' | 'orders'>('dashboard');

  if (view === 'orders') {
    return (
      <MyOrdersPage
        orders={orders}
        onBack={() => setView('dashboard')}
        onOpenTracker={() => {}}
        onCashoutOrder={() => {}}
      />
    );
  }

  return (
    <UserDashboardPage
      user={user}
      orders={orders}
      leagues={INITIAL_LEAGUES}
      onOpenTopUp={() => setIsTopUpOpen(true)}
      onNavigate={(v) => {
        if (v === 'orders') setView('orders');
        else router.push("/");
      }}
    />
  );
}
