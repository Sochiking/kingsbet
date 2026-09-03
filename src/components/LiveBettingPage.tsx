import React, { useState, useEffect } from 'react';
import { Radio, Flame, Shield, ChevronRight, Play, Eye, BarChart2 } from 'lucide-react';
import { Match } from '../types';

interface LiveBettingPageProps {
  matches: Match[];
  onSelectMatch: (matchId: string) => void;
  onSelectOdd: (match: Match, marketName: string, optionName: string, odds: number) => void;
  activeSelections: any[];
  onOpenTracker: (matchId: string) => void;
}

export const LiveBettingPage: React.FC<LiveBettingPageProps> = ({
  matches,
  onSelectMatch,
  onSelectOdd,
  activeSelections,
  onOpenTracker,
}) => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);

  useEffect(() => {
    // Filter live matches or simulate live status for top matches
    const lives = matches.filter((m) => m.status === 'LIVE');
    if (lives.length === 0 && matches.length > 0) {
      setLiveMatches(matches.slice(0, 3).map((m, i) => ({
        ...m,
        status: 'LIVE',
        currentMinute: 32 + i * 15,
        homeTeam: { ...m.homeTeam, score: m.homeTeam.score ?? i },
        awayTeam: { ...m.awayTeam, score: m.awayTeam.score ?? 1 },
      })));
    } else {
      setLiveMatches(lives);
    }
  }, [matches]);

  const isOddSelected = (matchId: string, optionName: string) => {
    return activeSelections.some(
      (s: any) => s.matchId === matchId && s.optionName === optionName
    );
  };

  return (
    <div className="space-y-4 font-sans text-xs pb-10">
      {/* Live Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-[#181d26] to-[#12151a] border border-red-800/40 rounded-xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Live In-Play In Progress
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            Live Matches & Instant Odds
          </h1>
          <p className="text-kb-secondary text-xs max-w-xl">
            Watch real-time pitch animations, track goals & cards, and bet on changing live odds instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <div className="bg-slate-900/80 border border-kb-border rounded-lg px-3 py-2 text-center">
            <span className="text-[10px] uppercase font-bold text-kb-secondary">Active Live Matches</span>
            <div className="text-lg font-black text-kb-yellow">{liveMatches.length}</div>
          </div>
        </div>
      </div>

      {/* Live Match Cards List */}
      <div className="space-y-3">
        {liveMatches.map((match) => (
          <div
            key={match.id}
            className="bg-kb-card border border-kb-border hover:border-kb-green/50 rounded-xl p-3.5 sm:p-4 space-y-3 transition-all shadow-xl"
          >
            {/* Top Bar: League & Live Time */}
            <div className="flex items-center justify-between border-b border-kb-border/80 pb-2 text-[11px]">
              <div className="flex items-center gap-2 text-kb-secondary font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>{match.leagueName}</span>
                <span className="text-kb-muted">•</span>
                <span className="text-amber-400 font-extrabold">{match.currentMinute || 45}' Live</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenTracker(match.id)}
                  className="px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/40 text-[10px] font-black uppercase transition-all flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Watch Live Pitch
                </button>
                <button
                  onClick={() => onSelectMatch(match.id)}
                  className="text-kb-secondary hover:text-white font-bold text-[10px] flex items-center gap-0.5"
                >
                  All Markets <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Score & Teams */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div
                onClick={() => onSelectMatch(match.id)}
                className="md:col-span-5 flex items-center justify-between bg-kb-deep p-3 rounded-lg cursor-pointer hover:bg-[#1b202a] transition-all border border-kb-border/60"
              >
                {/* Home */}
                <div className="flex items-center gap-2 min-w-0">
                  <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-6 h-6 object-contain" />
                  <span className="font-extrabold text-white text-xs truncate">{match.homeTeam.name}</span>
                </div>

                {/* Score */}
                <div className="px-3 py-1 bg-kb-elevated border border-kb-border rounded text-sm font-black text-kb-yellow tracking-widest mx-2">
                  {match.homeTeam.score ?? 0} - {match.awayTeam.score ?? 0}
                </div>

                {/* Away */}
                <div className="flex items-center gap-2 min-w-0 justify-end">
                  <span className="font-extrabold text-white text-xs truncate">{match.awayTeam.name}</span>
                  <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-6 h-6 object-contain" />
                </div>
              </div>

              {/* 1X2 Quick Live Odds */}
              <div className="md:col-span-7 grid grid-cols-3 gap-1.5">
                {match.markets?.oneXtwo?.options.map((opt) => {
                  const isSel = isOddSelected(match.id, opt.name);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectOdd(match, '1X2 Live', opt.name, opt.odds)}
                      className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center ${
                        isSel
                          ? 'bg-[#009040] border-kb-green text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-elevated hover:bg-kb-hover border-kb-border text-white'
                      }`}
                    >
                      <span className="text-[10px] text-kb-secondary font-bold">{opt.name}</span>
                      <span className="text-xs font-black text-kb-yellow">{opt.odds.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
