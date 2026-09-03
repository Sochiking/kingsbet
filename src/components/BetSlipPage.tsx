import React, { useState } from 'react';
import {
  Receipt,
  Trash2,
  Coins,
  Flame,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Copy,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { BetSelection } from '../types';

interface BetSlipPageProps {
  selections: BetSelection[];
  onRemoveSelection: (matchId: string, optionName: string) => void;
  onClearAll: () => void;
  onPlaceBet: (selection: BetSelection, stake: number) => Promise<boolean>;
  onBack: () => void;
  userBalance: number;
}

export const BetSlipPage: React.FC<BetSlipPageProps> = ({
  selections,
  onRemoveSelection,
  onClearAll,
  onPlaceBet,
  onBack,
  userBalance,
}) => {
  const [stake, setStake] = useState<number>(1000);
  const [bookingCode, setBookingCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [placedSuccess, setPlacedSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculate Odds
  const totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1);
  const totalOddsDisplay = selections.length > 0 ? totalOdds.toFixed(2) : '0.00';

  // Bonus Boost (5% per extra leg after 1st)
  const bonusMultiplier = selections.length >= 2 ? Math.min(2.25, 1 + (selections.length - 1) * 0.05) : 1;
  const rawWin = Math.round(stake * totalOdds);
  const totalWin = Math.round(rawWin * bonusMultiplier);
  const bonusAmount = totalWin - rawWin;

  // Handle Place Bet
  const handlePlaceBetslip = async () => {
    if (selections.length === 0 || stake <= 0) return;
    setIsSubmitting(true);

    let success = true;
    for (const sel of selections) {
      const ok = await onPlaceBet(sel, Math.round(stake / selections.length));
      if (!ok) {
        success = false;
        break;
      }
    }

    setIsSubmitting(false);
    if (success) {
      setPlacedSuccess(true);
      onClearAll();
      setTimeout(() => {
        setPlacedSuccess(false);
      }, 4000);
    }
  };

  // Generate Booking Code
  const handleGenerateBookingCode = () => {
    if (selections.length === 0) return;
    const code = `KB-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingCode(code);
  };

  const handleCopyCode = () => {
    if (!bookingCode) return;
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans text-xs pb-16 max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-kb-card border border-kb-border text-kb-secondary hover:text-white transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Betting
        </button>

        <h1 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Receipt className="w-5 h-5 text-kb-green" />
          <span>KingsBet Full Betslip ({selections.length})</span>
        </h1>
      </div>

      {placedSuccess && (
        <div className="p-4 bg-kb-green/20 border border-kb-green rounded-2xl flex items-center justify-between gap-3 text-white text-xs font-bold animate-pulse shadow-2xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-kb-green" />
            <div>
              <div className="text-sm font-black">Bet Placed Successfully!</div>
              <p className="text-[11px] text-kb-primary">Your coupon has been confirmed. Good luck!</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Selections List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-kb-card border border-kb-border rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-kb-border pb-2">
              <span className="font-black text-white uppercase text-xs flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-kb-yellow" /> Selected Games & Odds
              </span>
              {selections.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {selections.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Receipt className="w-12 h-12 text-kb-muted mx-auto" />
                <div className="text-sm font-black text-kb-secondary">Your Betslip is Empty</div>
                <p className="text-kb-muted text-xs max-w-xs mx-auto">
                  Click on odds in any match (1X2, Over/Under, Double Chance) to add games to your betslip.
                </p>
                <button
                  onClick={onBack}
                  className="mt-2 px-4 py-2 bg-kb-green hover:bg-kb-green-d text-white font-black text-xs uppercase rounded-xl transition-all shadow"
                >
                  Browse Matches
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {selections.map((sel) => (
                  <div
                    key={`${sel.matchId}-${sel.optionName}`}
                    className="p-3 bg-kb-elevated border border-kb-border rounded-xl space-y-1.5 relative group hover:border-kb-border transition-all shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2 pr-6">
                      <div>
                        <span className="text-[10px] text-kb-secondary font-bold uppercase block">
                          {sel.leagueName}
                        </span>
                        <span className="font-extrabold text-white text-xs">{sel.matchTitle}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-kb-base text-kb-yellow font-black text-xs rounded border border-kb-border">
                        {sel.odds.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-kb-border/80">
                      <span className="text-kb-secondary">
                        Market: <strong className="text-kb-primary">{sel.marketName}</strong>
                      </span>
                      <span className="font-black text-amber-400">{sel.optionName}</span>
                    </div>

                    <button
                      onClick={() => onRemoveSelection(sel.matchId, sel.optionName)}
                      className="absolute top-2.5 right-2 text-kb-muted hover:text-red-400 p-1"
                      title="Remove selection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Book Code Search/Load Box */}
          <div className="bg-kb-card border border-kb-border rounded-2xl p-4 space-y-2 shadow-xl">
            <span className="font-black text-white uppercase text-xs">Load Booking Code</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Enter Code (e.g. KB-89421)"
                className="flex-1 bg-kb-deep border border-kb-border rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:border-kb-green"
              />
              <button
                onClick={() => {
                  if (inputCode) {
                    alert(`Loaded Coupon Code ${inputCode} successfully!`);
                    setInputCode('');
                  }
                }}
                className="px-4 py-2 bg-kb-elevated hover:bg-kb-hover text-white font-bold text-xs rounded-xl border border-kb-border transition-all uppercase"
              >
                Load
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Stake & Payout Summary Panel */}
        <div className="space-y-3">
          <div className="bg-kb-card border border-kb-green/40 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-kb-border pb-2">
              <span className="font-black text-white uppercase text-xs">Coupon Summary</span>
              <span className="text-xs font-black text-kb-green">
                {selections.length > 1 ? 'Accumulator' : 'Single'}
              </span>
            </div>

            {/* Stake Inputs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-kb-secondary">Stake Amount (₦)</span>
                <span className="text-[11px] text-kb-secondary">
                  Wallet: <strong className="text-kb-green">₦{userBalance.toLocaleString()}</strong>
                </span>
              </div>

              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
                className="w-full bg-kb-deep border border-kb-border rounded-xl py-2.5 px-3 text-sm font-black text-kb-green focus:outline-none focus:border-kb-green"
              />

              {/* Quick Stake Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setStake(amt)}
                    className={`py-1.5 rounded-lg font-black text-[11px] transition-all ${
                      stake === amt ? 'bg-kb-green text-white' : 'bg-kb-elevated text-kb-secondary hover:text-white'
                    }`}
                  >
                    ₦{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Odds & Calculations */}
            <div className="space-y-2 pt-2 border-t border-kb-border text-xs">
              <div className="flex items-center justify-between">
                <span className="text-kb-secondary font-bold">Total Odds:</span>
                <span className="font-black text-lg text-kb-yellow">{totalOddsDisplay}</span>
              </div>

              {selections.length >= 2 && (
                <div className="flex items-center justify-between text-kb-green">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Multiple Boost (
                    {Math.round((bonusMultiplier - 1) * 100)}%):
                  </span>
                  <span className="font-black">+₦{bonusAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-kb-border">
                <span className="font-black text-white text-xs uppercase">Potential Win:</span>
                <span className="font-black text-xl text-kb-green">
                  ₦{totalWin.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* Place Bet Action Button */}
            <button
              onClick={handlePlaceBetslip}
              disabled={selections.length === 0 || isSubmitting || stake > userBalance}
              className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-2 ${
                selections.length > 0 && stake <= userBalance
                  ? 'bg-kb-green hover:bg-kb-green-d text-white cursor-pointer active:scale-98'
                  : 'bg-slate-800 text-kb-muted cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Placing Bet...
                </>
              ) : stake > userBalance ? (
                'Insufficient Wallet Balance'
              ) : (
                `PLACE BET (₦${stake.toLocaleString()})`
              )}
            </button>

            {/* Book Bet Generator */}
            <div className="pt-2 border-t border-kb-border text-center space-y-2">
              <button
                onClick={handleGenerateBookingCode}
                disabled={selections.length === 0}
                className="w-full py-2 bg-kb-elevated hover:bg-kb-hover text-kb-primary font-bold text-xs rounded-xl border border-kb-border transition-all flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" /> BOOK BET (Get Share Code)
              </button>

              {bookingCode && (
                <div className="p-3 bg-kb-deep rounded-xl border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-kb-secondary block font-bold">Booking Code</span>
                    <span className="text-sm font-black text-kb-yellow font-mono">{bookingCode}</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded bg-kb-green text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
