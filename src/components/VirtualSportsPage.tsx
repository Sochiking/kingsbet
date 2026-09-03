import React, { useState, useEffect } from 'react';
import { Play, Trophy, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface VirtualSportsPageProps {
  user: UserProfile;
  onPlaceVirtualBet: (matchTitle: string, selection: string, odds: number, stake: number) => Promise<boolean>;
}

export const VirtualSportsPage: React.FC<VirtualSportsPageProps> = ({
  user,
  onPlaceVirtualBet,
}) => {
  const [timer, setTimer] = useState<number>(42);
  const [placedSelection, setPlacedSelection] = useState<{ option: string; odds: number; stake: number } | null>(null);
  const [matchResult, setMatchResult] = useState<{ score: string; winner: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Generate virtual result
          const h = Math.floor(Math.random() * 3);
          const a = Math.floor(Math.random() * 3);
          setMatchResult({ score: `${h} - ${a}`, winner: h > a ? 'Home' : a > h ? 'Away' : 'Draw' });
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVirtualBet = async (option: string, odds: number) => {
    const stake = 1000;
    const ok = await onPlaceVirtualBet('Virtual EPL: Kings FC vs Eagle Stars', option, odds, stake);
    if (ok) {
      setPlacedSelection({ option, odds, stake });
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs pb-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#121a15] to-[#12151a] border border-kb-green/40 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-kb-green/20 text-kb-green border border-kb-green/30 text-[10px] font-black uppercase">
            <Zap className="w-3.5 h-3.5" /> Fast 60s Virtual Football
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Virtual League 24/7</h1>
          <p className="text-kb-secondary text-xs">Simulated fast matches with instant payouts directly to your wallet.</p>
        </div>

        <div className="bg-kb-deep border border-kb-border p-3 rounded-xl flex items-center gap-3">
          <Clock className="w-6 h-6 text-kb-yellow animate-pulse" />
          <div>
            <span className="text-[10px] text-kb-secondary uppercase font-bold">Next Match Kicks Off In</span>
            <div className="text-xl font-black text-kb-yellow">{timer}s</div>
          </div>
        </div>
      </div>

      {/* Virtual Pitch Simulation Screen */}
      <div className="bg-kb-card border border-kb-border rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-kb-border pb-2">
          <span className="font-black text-white uppercase text-xs">Kings League • Round 14</span>
          <span className="text-xs text-kb-green font-extrabold">Virtual Simulation HD</span>
        </div>

        {/* Pitch Graphic */}
        <div className="h-48 bg-gradient-to-b from-emerald-900/40 to-green-950/60 border border-emerald-600/30 rounded-xl relative flex flex-col items-center justify-center p-4 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(#00b050_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          
          <div className="z-10 space-y-2">
            <div className="text-lg font-black text-white">Kings FC vs Eagle Stars</div>
            
            {matchResult ? (
              <div className="p-3 bg-black/60 rounded-xl border border-amber-500/40">
                <div className="text-xs text-amber-400 font-bold uppercase">Match Finished</div>
                <div className="text-3xl font-black text-white">{matchResult.score}</div>
              </div>
            ) : (
              <div className="text-2xl font-black text-kb-yellow animate-pulse">0 - 0 (In Progress)</div>
            )}
          </div>
        </div>

        {/* Odds Grid */}
        <div className="space-y-2">
          <span className="font-extrabold text-kb-secondary text-xs">Place Quick Virtual Bet (Stake: ₦1,000)</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { option: 'Kings FC (1)', odds: 2.15 },
              { option: 'Draw (X)', odds: 3.30 },
              { option: 'Eagle Stars (2)', odds: 2.90 },
            ].map((o) => (
              <button
                key={o.option}
                onClick={() => handleVirtualBet(o.option, o.odds)}
                className="p-3 bg-kb-elevated hover:bg-kb-green hover:text-white border border-kb-border rounded-xl transition-all font-black flex flex-col items-center justify-center gap-0.5 group"
              >
                <span className="text-kb-secondary group-hover:text-white text-[11px]">{o.option}</span>
                <span className="text-sm text-kb-yellow group-hover:text-white">{o.odds.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        {placedSelection && (
          <div className="p-3 bg-kb-green/20 border border-kb-green rounded-xl flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-kb-green" /> Bet Placed on {placedSelection.option}
            </span>
            <span>Potential Return: ₦{Math.round(placedSelection.stake * placedSelection.odds).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
