"use client";

import { useAppContext } from "@/context/AppContext";
import { HomePage } from "@/components/HomePage";
import { INITIAL_LEAGUES } from "@/data/mockData";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const {
    matches,
    activeSelections,
    user,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    handleSelectOdd,
    handlePlaceBet,
    handleClearSelections,
  } = useAppContext();

  // Next.js routing wrapper for select match
  const handleSelectMatch = (matchId: string) => {
    // If they had a match route we'd navigate to `/match/${matchId}`
    // But since it's an SPA port, maybe just navigate for now
    // Actually, we can just log or push for now.
    router.push(`/sports`); // Or `/match/${matchId}` if dynamic route exists
  };

  return (
    <HomePage
      matches={matches}
      leagues={INITIAL_LEAGUES}
      onSelectMatch={handleSelectMatch}
      onSelectOdd={handleSelectOdd}
      activeSelections={activeSelections}
      onPlaceBet={handlePlaceBet}
      onClearAll={handleClearSelections}
      userDemoBalance={user?.demoBalance || 0}
      mobileSidebarOpen={mobileSidebarOpen}
      setMobileSidebarOpen={setMobileSidebarOpen}
    />
  );
}
