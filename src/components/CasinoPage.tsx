import React, { useState } from 'react';
import { Gamepad2, Rocket, RotateCcw, Sparkles, Coins, Play, Trophy, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface CasinoPageProps {
  user: UserProfile | null;
  onUpdateBalance: (newBalance: number) => void;
  onOpenDeposit: () => void;
}

export const CasinoPage: React.FC<CasinoPageProps> = ({ user, onUpdateBalance, onOpenDeposit }) => {
  const [activeTab, setActiveTab] = useState<'crash' | 'roulette' | 'spin'>('crash');

  // Crash / Aviator game state
  const [betStake, setBetStake] = useState<number>(500);
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number>(1.00);
  const [crashed, setCrashed] = useState<boolean>(false);
  const [cashedOut, setCashedOut] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);

  // Spin & Win state
  const [spinning, setSpinning] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Handle Aviator Start
  const handleStartAviator = () => {
    if (!user || user.demoBalance < betStake) {
      onOpenDeposit();
      return;
    }

    // Deduct stake
    onUpdateBalance(user.demoBalance - betStake);
    setIsFlying(true);
    setMultiplier(1.00);
    setCrashed(false);
    setCashedOut(false);

    const crashAt = +(1.2 + Math.random() * 4.5).toFixed(2);
    let current = 1.00;

    const interval = setInterval(() => {
      current = +(current + 0.08).toFixed(2);
      setMultiplier(current);

      if (current >= crashAt) {
        clearInterval(interval);
        setIsFlying(false);
        setCrashed(true);
      }
    }, 120);
  };

  const handleCashoutAviator = () => {
    if (!isFlying || cashedOut || crashed) return;
    setIsFlying(false);
    setCashedOut(true);
    const win = Math.round(betStake * multiplier);
    setWinAmount(win);
    onUpdateBalance((user?.demoBalance || 0) + win);
  };

  // Spin & Win Handler
  const handleSpinWheel = () => {
    if (!user || user.demoBalance < betStake) {
      onOpenDeposit();
      return;
    }

    onUpdateBalance(user.demoBalance - betStake);
    setSpinning(true);
    setSpinResult(null);

    setTimeout(() => {
      setSpinning(false);
      const outcomes = [0, 1.5, 2.0, 0, 3.0, 0.5, 5.0];
      const mult = outcomes[Math.floor(Math.random() * outcomes.length)];
      const win = Math.round(betStake * mult);

      if (mult > 0) {
        setSpinResult(`🎉 You Won ₦${win.toLocaleString()}! (${mult}x)`);
        onUpdateBalance((user?.demoBalance || 0) + win);
      } else {
        setSpinResult(`❌ No luck this time! Try again.`);
      }
    }, 1800);
  };

  return (
    <div className="space-y-4 font-sans text-xs pb-10">
      {/* Casino Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-[#1c1822] to-[#12151a] border border-amber-600/40 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" /> KingsBet Vegas Games
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Play & Win Instant Cash (₦)
          </h1>
          <p className="text-kb-secondary text-xs">
            High RTP crash multipliers, instant roulette spins, and lucky wheels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-kb-deep border border-kb-border rounded-xl p-3 text-right">
            <span className="text-[10px] text-kb-secondary uppercase font-bold">Wallet Balance</span>
            <div className="text-lg font-black text-kb-green">
              {user ? `₦${user.demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '₦0.00'}
            </div>
          </div>
          <button
            onClick={onOpenDeposit}
            className="px-4 py-3 bg-kb-green hover:bg-kb-green-d text-white font-black text-xs uppercase rounded-xl shadow-lg transition-all"
          >
            Deposit
          </button>
        </div>
      </div>

      {/* Casino Category Tabs */}
      <div className="flex items-center gap-2 border-b border-kb-border pb-2">
        <button
          onClick={() => setActiveTab('crash')}
          className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'crash'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'bg-kb-card text-kb-secondary hover:text-white'
          }`}
        >
          <Rocket className="w-4 h-4" /> Aviator Rocket
        </button>

        <button
          onClick={() => setActiveTab('spin')}
          className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'spin'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'bg-kb-card text-kb-secondary hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" /> Spin & Win
        </button>
      </div>

      {/* Aviator / Rocket Crash Game */}
      {activeTab === 'crash' && (
        <div className="bg-kb-card border border-amber-500/30 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-white text-base">
              <Rocket className="w-5 h-5 text-amber-400" />
              <span>KingsBet Aviator Multiplier</span>
            </div>
            <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              RTP: 97% • Win up to 100x
            </span>
          </div>

          {/* Canvas Animation Screen */}
          <div className="h-56 bg-slate-950 border border-kb-border rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center p-4">
            {isFlying && (
              <div className="space-y-2 z-10">
                <Rocket className="w-12 h-12 text-amber-400 animate-bounce mx-auto" />
                <div className="text-5xl font-black text-amber-400 tracking-wider">
                  {multiplier.toFixed(2)}x
                </div>
                <p className="text-xs text-kb-secondary font-extrabold animate-pulse">
                  Flying high! Cash out before crash!
                </p>
              </div>
            )}

            {crashed && (
              <div className="space-y-1 z-10">
                <div className="text-4xl font-black text-red-500">FLEW AWAY @ {multiplier.toFixed(2)}x</div>
                <p className="text-xs text-kb-secondary">Better luck on the next flight!</p>
              </div>
            )}

            {cashedOut && (
              <div className="space-y-1 z-10">
                <Trophy className="w-10 h-10 text-kb-green mx-auto animate-bounce" />
                <div className="text-3xl font-black text-kb-green">CASHED OUT @ {multiplier.toFixed(2)}x</div>
                <p className="text-sm font-bold text-white">Won ₦{winAmount.toLocaleString()}!</p>
              </div>
            )}

            {!isFlying && !crashed && !cashedOut && (
              <div className="space-y-2 z-10">
                <Rocket className="w-10 h-10 text-kb-muted mx-auto" />
                <div className="text-xl font-black text-kb-secondary">Ready to Take Off</div>
                <p className="text-xs text-kb-muted">Place your bet stake and click "Start Flight"</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-kb-secondary">Bet Stake (₦)</label>
              <div className="flex items-center gap-2">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBetStake(amt)}
                    className={`px-3 py-1.5 rounded font-black text-xs transition-all ${
                      betStake === amt ? 'bg-kb-green text-white' : 'bg-kb-elevated text-kb-secondary'
                    }`}
                  >
                    ₦{amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {isFlying ? (
                <button
                  onClick={handleCashoutAviator}
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-2xl transition-all animate-pulse"
                >
                  CASH OUT NOW (₦{Math.round(betStake * multiplier).toLocaleString()})
                </button>
              ) : (
                <button
                  onClick={handleStartAviator}
                  className="w-full py-4 rounded-xl bg-kb-green hover:bg-kb-green-d text-white font-black text-base uppercase tracking-wider shadow-xl transition-all"
                >
                  START FLIGHT (Stake ₦{betStake.toLocaleString()})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spin & Win */}
      {activeTab === 'spin' && (
        <div className="bg-kb-card border border-kb-border rounded-2xl p-6 space-y-6 shadow-2xl text-center">
          <h2 className="text-xl font-black text-white uppercase">Wheel of Fortune</h2>
          <div className="w-48 h-48 rounded-full border-8 border-amber-500/50 bg-gradient-to-tr from-purple-900 to-indigo-900 mx-auto flex items-center justify-center relative shadow-2xl">
            <RotateCcw className={`w-16 h-16 text-amber-400 ${spinning ? 'animate-spin' : ''}`} />
          </div>

          {spinResult && (
            <div className="p-3 bg-kb-deep rounded-xl font-black text-base text-kb-yellow border border-amber-500/30">
              {spinResult}
            </div>
          )}

          <button
            onClick={handleSpinWheel}
            disabled={spinning}
            className="w-full max-w-sm py-3.5 bg-kb-green hover:bg-kb-green-d text-white font-black text-sm uppercase rounded-xl shadow-xl transition-all mx-auto"
          >
            {spinning ? 'Spinning...' : `SPIN WHEEL (Stake ₦${betStake.toLocaleString()})`}
          </button>
        </div>
      )}
    </div>
  );
};
