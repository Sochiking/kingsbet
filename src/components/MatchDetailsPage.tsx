import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Tv,
  BarChart2,
  Lock,
  ChevronDown,
  ChevronUp,
  Shield,
  Coins,
  CheckCircle,
} from 'lucide-react';
import { Match, BetSelection, UserProfile } from '../types';

interface MatchDetailsPageProps {
  match: Match;
  onBack: () => void;
  user: UserProfile;
  onPlaceBet: (selection: BetSelection, stake: number) => Promise<boolean>;
  activeSelections: BetSelection[];
  onSelectOdd: (match: Match, marketName: string, optionName: string, odds: number) => void;
}

export const MatchDetailsPage: React.FC<MatchDetailsPageProps> = ({
  match,
  onBack,
  user,
  onPlaceBet,
  activeSelections,
  onSelectOdd,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Markets' | 'Stats' | 'H2H' | 'Standings'>('Overview');
  const [openAccordion, setOpenAccordion] = useState<string | null>('1x2');

  const isSelected = (optionName: string) => {
    return activeSelections.some((s) => s.matchId === match.id && s.optionName === optionName);
  };

  const marketCategories = [
    {
      id: '1x2',
      title: 'Main Markets - 1X2',
      options: [
        { name: `${match.homeTeam.name} (1)`, odds: match.markets.oneXtwo?.options[0]?.odds || 2.10 },
        { name: 'Draw (X)', odds: match.markets.oneXtwo?.options[1]?.odds || 3.40 },
        { name: `${match.awayTeam.name} (2)`, odds: match.markets.oneXtwo?.options[2]?.odds || 3.10 },
      ],
    },
    {
      id: 'dc',
      title: 'Double Chance',
      options: [
        { name: '1X (Home or Draw)', odds: 1.30 },
        { name: '12 (Home or Away)', odds: 1.28 },
        { name: 'X2 (Draw or Away)', odds: 1.65 },
      ],
    },
    {
      id: 'ou',
      title: 'Over / Under 2.5 Goals',
      options: [
        { name: 'Over 2.5 Goals', odds: 1.85 },
        { name: 'Under 2.5 Goals', odds: 1.95 },
      ],
    },
    {
      id: 'btts',
      title: 'Both Teams to Score (GG/NG)',
      options: [
        { name: 'Goal / Goal (GG - Yes)', odds: 1.70 },
        { name: 'No Goal (NG - No)', odds: 2.05 },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-20 text-xs font-sans select-none">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-kb-card border border-kb-border text-kb-secondary hover:text-white transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Matches
        </button>

        <div className="text-kb-secondary font-semibold text-[11px]">
          {match.leagueName} • {match.leagueRound || 'Round 38'}
        </div>
      </div>

      {/* Stadium Pitch Score Board Header matching Bet9ja Match View */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#171d26] via-[#12161f] to-[#0c0e14] border border-kb-border p-6 shadow-2xl">
        <div className="grid grid-cols-12 gap-4 items-center relative z-10 text-center">
          {/* Home Team */}
          <div className="col-span-5 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#202632] p-2 border border-kb-border shadow-lg flex items-center justify-center">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-extrabold text-white text-sm sm:text-base tracking-wide">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Time / Live Score */}
          <div className="col-span-2 flex flex-col items-center gap-1">
            {match.status === 'LIVE' ? (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] animate-pulse">
                LIVE 15:00
              </span>
            ) : (
              <span className="text-kb-yellow font-black text-xs uppercase tracking-wider">
                15:00
              </span>
            )}
            <div className="text-2xl sm:text-3xl font-black text-white tracking-wider my-1">
              {match.homeTeam.score ?? 0} : {match.awayTeam.score ?? 0}
            </div>
            <span className="text-[10px] text-kb-secondary">Today</span>
          </div>

          {/* Away Team */}
          <div className="col-span-5 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#202632] p-2 border border-kb-border shadow-lg flex items-center justify-center">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-extrabold text-white text-sm sm:text-base tracking-wide">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Stadium details bar */}
        <div className="mt-6 pt-3 border-t border-kb-border/80 flex flex-wrap items-center justify-between text-[11px] text-kb-secondary px-2">
          <div>📍 Stadium: <strong className="text-kb-primary">{match.stadium || 'Etihad Stadium'}</strong></div>
          <div>📅 Date: <strong className="text-kb-primary">{match.dateDisplay || 'May 25, 2025'}</strong></div>
          <div>👨‍⚖️ Referee: <strong className="text-kb-primary">{match.referee || 'A. Taylor'}</strong></div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 bg-kb-card p-1 rounded-lg border border-kb-border text-xs font-bold text-kb-secondary">
        {(['Overview', 'Markets', 'Stats', 'H2H', 'Standings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded text-center transition-all ${
              activeTab === tab
                ? 'bg-kb-green text-white font-extrabold shadow'
                : 'hover:text-white hover:bg-kb-elevated'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Accordion Odds Markets */}
      <div className="space-y-2">
        {marketCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-kb-card border border-kb-border rounded-lg overflow-hidden shadow-md"
          >
            <button
              onClick={() =>
                setOpenAccordion(openAccordion === cat.id ? null : cat.id)
              }
              className="w-full px-4 py-3 bg-kb-surface flex items-center justify-between text-xs font-extrabold text-white uppercase tracking-wider hover:bg-kb-card transition-colors"
            >
              <span>{cat.title}</span>
              {openAccordion === cat.id ? (
                <ChevronUp className="w-4 h-4 text-kb-green" />
              ) : (
                <ChevronDown className="w-4 h-4 text-kb-secondary" />
              )}
            </button>

            {openAccordion === cat.id && (
              <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 bg-kb-card">
                {cat.options.map((opt) => (
                  <motion.button
                    key={opt.name}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectOdd(match, cat.title, opt.name, opt.odds)}
                    className={`p-3 rounded-lg flex items-center justify-between font-bold transition-all border ${
                      isSelected(opt.name)
                        ? 'bg-[#009040] border-kb-yellow text-white shadow-lg'
                        : 'bg-kb-elevated hover:bg-kb-green hover:text-white border-kb-border text-kb-primary'
                    }`}
                  >
                    <span className="text-xs truncate max-w-[140px]">{opt.name}</span>
                    <span className="text-sm font-black text-kb-yellow">{opt.odds.toFixed(2)}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
