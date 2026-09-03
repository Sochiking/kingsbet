"use client";

import { useAppContext } from "@/context/AppContext";
import { AdminDashboardPage } from "@/components/AdminDashboardPage";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const { 
    matches, 
    orders, 
    analytics, 
    handleUpdateOrderStatus 
  } = useAppContext();

  return (
    <AdminDashboardPage 
      matches={matches} 
      orders={orders} 
      analytics={analytics!}
      onUpdateOrderStatus={handleUpdateOrderStatus}
      onExitAdmin={() => router.back()}
    />
  );
}
