"use client";

import { useAppContext } from "@/context/AppContext";
import { BetSlipPage } from "@/components/BetSlipPage";
import { useRouter } from "next/navigation";

export default function BetsPage() {
  const router = useRouter();
  const {
    activeSelections,
    handleRemoveSelection,
    handleClearSelections,
    handlePlaceBet,
    user
  } = useAppContext();

  return (
    <BetSlipPage
      selections={activeSelections}
      onRemoveSelection={handleRemoveSelection}
      onClearAll={handleClearSelections}
      onPlaceBet={handlePlaceBet}
      onBack={() => router.push("/")}
      userBalance={user?.demoBalance || 0}
    />
  );
}
