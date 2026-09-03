"use client";

import { useAppContext } from "@/context/AppContext";
import { AdminDashboardPage } from "@/components/AdminDashboardPage";

export default function AdminPage() {
  const { 
    matches, 
    orders, 
    analytics, 
    handleUpdateOrderStatus, 
    handleCashoutOrder 
  } = useAppContext();

  return (
    <AdminDashboardPage 
      matches={matches} 
      orders={orders} 
      analytics={analytics || undefined}
      onUpdateOrderStatus={handleUpdateOrderStatus}
      onProcessCashout={handleCashoutOrder}
    />
  );
}
