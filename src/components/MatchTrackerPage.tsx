import React, { useState, useEffect } from 'react';
import { Eye, Shield, Activity, RefreshCw, X, Radio, ArrowLeft, Trophy } from 'lucide-react';
import { Match, MatchEvent } from '../types';

interface MatchTrackerPageProps {
  match: Match;
  onBack: () => void;
}

export const MatchTrackerPage: React.FC<MatchTrackerPageProps> = ({ match, onBack }) => {
  const [currentMinute, setCurrentMinute] = useState<number>(match.currentMinute || 58);
  const [homeScore, setHomeScore] = useState<number>(match.homeTeam.score || 1);
  const [awayScore, setAwayScore] = useState<number>(match.awayTeam.score || 1);
  const [ballZone, setBallZone] = useState<'home_defense' | 'midfield' | 'away_attack' | 'home_attack'>('midfield');
  const [events, setEvents] = useState<MatchEvent[]>(match.events || [
    { id: 'ev1', minute: 18, type: 'goal', team: 'home', description: 'GOAL! Man City scores via Erling Haaland strike!' },
    { id: 'ev2', minute: 34, type: 'yellow_card', team: 'away', description: 'Yellow Card for Virgil van Dijk' },
    { id: 'ev3', minute: 45, type: 'goal', team: 'away', description: 'GOAL! Liverpool equalizes via Mohamed Salah penalty!' },
  ]);

  // Live Simulation ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinute((prev) => (prev < 90 ? prev + 1 : 90));

      const zones: Array<'home_defense' | 'midfield' | 'away_attack' | 'home_attack'> = [
        'home_defense',
        'midfield',
        'away_attack',
        'home_attack',
      ];
      setBallZone(zones[Math.floor(Math.random() * zones.length)]);

      // Chance of random event every few seconds
      if (Math.random() < 0.15) {
        const isHome = Math.random() > 0.5;
        const teamName = isHome ? match.homeTeam.name : match.awayTeam.name;
        const randType = Math.random();

        if (randType < 0.25) {
          if (isHome) setHomeScore((s) => s + 1);
          else setAwayScore((s) => s + 1);

          setEvents((prev) => [
            {
              id: `ev-${Date.now()}`,
              minute: currentMinute,
              type: 'goal',
              team: isHome ? 'home' : 'away',
              description: `GOAL! ${teamName} scores with a brilliant curling shot!`,
            },
            ...prev,
          ]);
        } else if (randType < 0.6) {
          setEvents((prev) => [
            {
              id: `ev-${Date.now()}`,
              minute: currentMinute,
              type: 'corner',
              team: isHome ? 'home' : 'away',
              description: `Corner kick awarded to ${teamName}`,
            },
            ...prev,
          ]);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentMinute, match]);

  return (
    <div className="space-y-4 font-sans text-xs pb-10">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-kb-elevated hover:bg-kb-hover text-white font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Matches
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 font-black uppercase text-[11px]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Live Pitch Radar • {currentMinute}'</span>
        </div>
      </div>

      {/* Main Scoreboard Header */}
      <div className="bg-kb-card border border-kb-border rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="text-center text-[11px] font-extrabold text-kb-secondary uppercase tracking-widest border-b border-kb-border pb-2">
          {match.leagueName} • {match.stadium || 'Stadium'}
        </div>

        <div className="flex items-center justify-around">
          {/* Home */}
          <div className="flex flex-col items-center space-y-2 text-center w-1/3">
            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-14 h-14 object-contain" />
            <span className="font-extrabold text-white text-sm sm:text-base">{match.homeTeam.name}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center space-y-1">
            <div className="px-5 py-2 bg-kb-deep border border-kb-border rounded-2xl text-3xl sm:text-4xl font-black text-kb-yellow tracking-widest shadow-inner">
              {homeScore} : {awayScore}
            </div>
            <span className="text-xs font-black text-red-500 animate-pulse">{currentMinute}' LIVE</span>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center space-y-2 text-center w-1/3">
            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-14 h-14 object-contain" />
            <span className="font-extrabold text-white text-sm sm:text-base">{match.awayTeam.name}</span>
          </div>
        </div>
      </div>

      {/* 2D Interactive Pitch Radar Visualizer */}
      <div className="bg-kb-card border border-kb-green/40 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="font-black text-white text-xs uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500" /> 2D Match Pitch Radar & Ball Position
          </span>
          <span className="text-[11px] text-kb-green font-bold">Real-time Telemetry</span>
        </div>

        {/* Pitch Container */}
        <div className="h-64 sm:h-72 bg-emerald-950/80 border-2 border-emerald-600/40 rounded-xl relative overflow-hidden flex flex-col justify-between p-3">
          {/* Pitch Markings */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-emerald-500/30"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-emerald-500/30"></div>
          
          {/* Attack Zone Indicators */}
          <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
            <div className={`border-r border-emerald-500/20 transition-all ${ballZone === 'home_defense' ? 'bg-red-500/20' : ''}`}></div>
            <div className={`border-r border-emerald-500/20 transition-all ${ballZone === 'midfield' ? 'bg-amber-500/20' : ''}`}></div>
            <div className={`border-r border-emerald-500/20 transition-all ${ballZone === 'away_attack' ? 'bg-amber-500/20' : ''}`}></div>
            <div className={`transition-all ${ballZone === 'home_attack' ? 'bg-kb-green/20' : ''}`}></div>
          </div>

          {/* Animated Ball */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 w-8 h-8 rounded-full bg-kb-yellow border-2 border-white shadow-2xl flex items-center justify-center font-black text-black text-[10px] ${
              ballZone === 'home_defense'
                ? 'left-1/8'
                : ballZone === 'midfield'
                ? 'left-1/2 -translate-x-1/2'
                : ballZone === 'away_attack'
                ? 'left-3/4'
                : 'right-1/8'
            }`}
          >
            ⚽
          </div>

          <div className="z-10 flex justify-between text-[11px] font-black text-emerald-200 uppercase bg-black/40 px-3 py-1 rounded">
            <span>{match.homeTeam.name} Defense</span>
            <span>Midfield</span>
            <span>{match.awayTeam.name} Defense</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-kb-deep p-3 rounded-xl border border-kb-border">
          <div className="text-center">
            <span className="text-[10px] text-kb-secondary font-bold uppercase">Possession</span>
            <div className="text-sm font-black text-white">54% - 46%</div>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-kb-secondary font-bold uppercase">Shots On Target</span>
            <div className="text-sm font-black text-kb-yellow">6 - 4</div>
          </div>
          <div className="text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-kb-secondary font-bold uppercase">Corners</span>
            <div className="text-sm font-black text-kb-green">5 - 3</div>
          </div>
        </div>
      </div>

      {/* Live Match Commentary Feed */}
      <div className="bg-kb-card border border-kb-border rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
        <span className="font-black text-white text-xs uppercase">Live Match Event Feed</span>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-2.5 rounded-lg bg-kb-elevated border border-kb-border flex items-center gap-3 text-xs"
            >
              <span className="font-black text-kb-yellow bg-kb-deep px-2 py-1 rounded text-[11px]">
                {ev.minute}'
              </span>
              <span className="font-bold text-kb-primary flex-1">{ev.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
