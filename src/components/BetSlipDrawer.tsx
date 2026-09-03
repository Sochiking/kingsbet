import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Flame,
  Coins,
  CheckCircle2,
  Trash2,
  Receipt,
  ChevronUp,
} from 'lucide-react';
import { BetSelection, UserProfile } from '../types';

interface BetSlipDrawerProps {
  selections: BetSelection[];
  onRemoveSelection: (matchId: string, optionName: string) => void;
  onClearAll: () => void;
  onPlaceBet: (selection: BetSelection, stake: number) => Promise<boolean>;
  user: UserProfile | null;
  onOpenFullBetslip?: () => void;
}

export const BetSlipDrawer: React.FC<BetSlipDrawerProps> = ({
  selections,
  onRemoveSelection,
  onClearAll,
  onPlaceBet,
  user,
  onOpenFullBetslip,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stakeMap, setStakeMap] = useState<Record<string, number>>({});
  const [isPlacing, setIsPlacing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (selections.length === 0) return null;

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const defaultStake = stakeMap['default'] || 500;

  const handleStakeChange = (value: number) => {
    setStakeMap((prev) => ({ ...prev, default: Math.max(1, value) }));
  };

  const handlePlaceAllBets = async () => {
    if (selections.length === 0) return;
    setIsPlacing(true);

    const firstSel = selections[0];
    const success = await onPlaceBet(firstSel, defaultStake);

    setIsPlacing(false);
    if (success) {
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        onClearAll();
        setIsOpen(false);
      }, 2000);
    }
  };

  const potentialWin = (defaultStake * totalOdds).toFixed(2);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full px-4 sm:px-0 font-sans text-xs select-none lg:hidden">
      {/* Floating Trigger */}
      {!isOpen ? (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-full bg-[#00b050] hover:bg-[#009443] text-white p-3.5 rounded-lg font-black shadow-2xl flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            <span>Betslip ({selections.length})</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-black/20 px-2 py-0.5 rounded text-[11px]">
              Odds: {totalOdds.toFixed(2)}
            </span>
            <ChevronUp className="w-4 h-4 stroke-[3]" />
          </div>
        </motion.button>
      ) : (
        /* Expanded Bet Slip Panel */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-kb-card border border-kb-green/50 rounded-lg shadow-2xl p-4 space-y-3 max-h-[85vh] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-kb-border pb-2">
            <div className="flex items-center gap-2 font-black text-kb-primary text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 text-kb-green" />
              <span>Betslip ({selections.length})</span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenFullBetslip && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullBetslip();
                  }}
                  className="px-2 py-1 rounded bg-kb-green hover:bg-kb-green-d text-white font-extrabold text-[10px] uppercase"
                >
                  Full Page
                </button>
              )}
              <button
                onClick={onClearAll}
                className="text-[11px] text-kb-secondary hover:text-red-400 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-kb-secondary hover:text-kb-primary rounded hover:bg-kb-elevated"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Picks List */}
          <div className="overflow-y-auto space-y-2 flex-1 pr-1">
            {selections.map((sel) => (
              <div
                key={`${sel.matchId}-${sel.optionName}`}
                className="p-2.5 rounded bg-kb-elevated border border-kb-border flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-kb-yellow">{sel.optionName}</div>
                  <div className="text-[11px] text-kb-secondary truncate max-w-[180px]">
                    {sel.matchTitle}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-kb-primary px-2 py-0.5 bg-kb-deep rounded">
                    {sel.odds.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onRemoveSelection(sel.matchId, sel.optionName)}
                    className="p-1 text-kb-secondary hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Stake & Calculation */}
          <div className="space-y-2.5 pt-2 border-t border-kb-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-kb-secondary">Stake (Demo Points):</span>
              <input
                type="number"
                value={defaultStake}
                onChange={(e) => handleStakeChange(Number(e.target.value))}
                className="w-28 bg-kb-deep border border-kb-border rounded px-2 py-1 text-right text-xs font-bold text-kb-primary focus:outline-none focus:border-kb-green"
              />
            </div>

            <div className="p-2 bg-kb-deep rounded flex items-center justify-between text-xs font-bold">
              <span className="text-kb-secondary">Potential Return:</span>
              <span className="text-sm font-black text-kb-green">
                {potentialWin} Points
              </span>
            </div>

            <button
              onClick={handlePlaceAllBets}
              disabled={isPlacing || defaultStake > (user?.demoBalance || 0)}
              className={`w-full py-3 rounded text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                defaultStake > (user?.demoBalance || 0)
                  ? 'bg-kb-elevated text-kb-muted cursor-not-allowed'
                  : 'bg-kb-green hover:bg-kb-green-d text-white shadow-lg active:scale-95'
              }`}
            >
              {isPlacing ? (
                'Placing Bet...'
              ) : successMsg ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" /> Bet Placed!
                </>
              ) : (
                'Place Bet Order'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
