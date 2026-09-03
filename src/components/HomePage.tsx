import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Flame,
  ChevronDown,
  ChevronRight,
  Lock,
  Tv,
  BarChart2,
  Plus,
  Trash2,
  Check,
  Send,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Shield,
  Activity,
  Zap,
  X,
  LayoutDashboard,
  Radio,
  Gamepad2,
} from 'lucide-react';
import { Match, League, BetSelection, SportType } from '../types';

interface HomePageProps {
  matches: Match[];
  leagues: League[];
  onSelectMatch: (matchId: string) => void;
  onSelectOdd: (match: Match, marketName: string, optionName: string, odds: number) => void;
  activeSelections: BetSelection[];
  onPlaceBet?: (selection: BetSelection, stake: number) => Promise<boolean>;
  onClearAll?: () => void;
  userDemoBalance?: number;
  mobileSidebarOpen?: boolean;
  setMobileSidebarOpen?: (val: boolean) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  matches,
  leagues,
  onSelectMatch,
  onSelectOdd,
  activeSelections,
  onPlaceBet,
  onClearAll: propOnClearAll,
  userDemoBalance = 1250.00,
  mobileSidebarOpen: propMobileSidebarOpen,
  setMobileSidebarOpen: propSetMobileSidebarOpen,
}) => {
  // State for search and active filters
  const [internalMobileSidebarOpen, setInternalMobileSidebarOpen] = useState(false);
  const mobileSidebarOpen = propMobileSidebarOpen !== undefined ? propMobileSidebarOpen : internalMobileSidebarOpen;
  const setMobileSidebarOpen = propSetMobileSidebarOpen || setInternalMobileSidebarOpen;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSportTab, setSelectedSportTab] = useState<'Soccer' | 'Tennis' | 'Basketball' | 'Baseball' | 'Volleyball'>('Soccer');
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'TODAY' | '3H' | '24H' | '72H' | 'ALL'>('ALL');
  const [expandedSport, setExpandedSport] = useState<string | null>('Soccer');

  // Helper to generate games for any sidebar league/sport page
  const getFixturesForCategory = (cat: string) => {
    const nameLower = cat.toLowerCase();

    if (nameLower.includes('premier league') || nameLower.includes('england')) {
      return [
        { id: 'epl-1', time: '15:00 Today', homeTeam: 'Arsenal', awayTeam: 'Chelsea', odds1: 1.85, oddsX: 3.60, odds2: 4.20, ouOver: 1.75, ouUnder: 2.05, dc1X: 1.22, dcX2: 1.95 },
        { id: 'epl-2', time: '17:30 Today', homeTeam: 'Manchester City', awayTeam: 'Liverpool', odds1: 2.10, oddsX: 3.40, odds2: 3.10, ouOver: 1.85, ouUnder: 1.95, dc1X: 1.30, dcX2: 1.65 },
        { id: 'epl-3', time: '20:00 Today', homeTeam: 'Tottenham', awayTeam: 'Manchester United', odds1: 2.45, oddsX: 3.50, odds2: 2.80, ouOver: 1.70, ouUnder: 2.15, dc1X: 1.42, dcX2: 1.55 },
        { id: 'epl-4', time: '14:00 Tomorrow', homeTeam: 'Newcastle United', awayTeam: 'Aston Villa', odds1: 2.20, oddsX: 3.30, odds2: 3.25, ouOver: 1.90, ouUnder: 1.90, dc1X: 1.33, dcX2: 1.67 },
        { id: 'epl-5', time: '16:30 Tomorrow', homeTeam: 'West Ham', awayTeam: 'Brighton', odds1: 2.60, oddsX: 3.40, odds2: 2.65, ouOver: 1.80, ouUnder: 2.00, dc1X: 1.45, dcX2: 1.48 },
      ];
    }

    if (nameLower.includes('champions league') || nameLower.includes('ucl')) {
      return [
        { id: 'ucl-1', time: '20:00 Today', homeTeam: 'Real Madrid', awayTeam: 'Bayern Munich', odds1: 2.25, oddsX: 3.60, odds2: 2.90, ouOver: 1.65, ouUnder: 2.20, dc1X: 1.38, dcX2: 1.60 },
        { id: 'ucl-2', time: '20:00 Today', homeTeam: 'Paris Saint-Germain', awayTeam: 'Inter Milan', odds1: 1.95, oddsX: 3.50, odds2: 3.80, ouOver: 1.80, ouUnder: 2.00, dc1X: 1.25, dcX2: 1.85 },
        { id: 'ucl-3', time: '20:00 Tomorrow', homeTeam: 'Barcelona', awayTeam: 'Borussia Dortmund', odds1: 1.75, oddsX: 3.90, odds2: 4.40, ouOver: 1.55, ouUnder: 2.45, dc1X: 1.20, dcX2: 2.05 },
        { id: 'ucl-4', time: '20:00 Tomorrow', homeTeam: 'Juventus', awayTeam: 'Atletico Madrid', odds1: 2.35, oddsX: 3.10, odds2: 3.20, ouOver: 2.10, ouUnder: 1.72, dc1X: 1.35, dcX2: 1.58 },
      ];
    }

    if (nameLower.includes('laliga') || nameLower.includes('spain')) {
      return [
        { id: 'liga-1', time: '16:00 Today', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', odds1: 2.15, oddsX: 3.50, odds2: 3.20, ouOver: 1.68, ouUnder: 2.15, dc1X: 1.33, dcX2: 1.68 },
        { id: 'liga-2', time: '18:30 Today', homeTeam: 'Atletico Madrid', awayTeam: 'Athletic Bilbao', odds1: 1.90, oddsX: 3.30, odds2: 4.20, ouOver: 1.95, ouUnder: 1.85, dc1X: 1.22, dcX2: 1.88 },
        { id: 'liga-3', time: '21:00 Today', homeTeam: 'Real Sociedad', awayTeam: 'Sevilla', odds1: 2.05, oddsX: 3.20, odds2: 3.80, ouOver: 2.05, ouUnder: 1.75, dc1X: 1.26, dcX2: 1.75 },
      ];
    }

    if (nameLower.includes('serie a') || nameLower.includes('italy')) {
      return [
        { id: 'ita-1', time: '17:00 Today', homeTeam: 'Inter Milan', awayTeam: 'Juventus', odds1: 2.00, oddsX: 3.25, odds2: 3.80, ouOver: 1.90, ouUnder: 1.90, dc1X: 1.25, dcX2: 1.78 },
        { id: 'ita-2', time: '19:45 Today', homeTeam: 'AC Milan', awayTeam: 'AS Roma', odds1: 2.15, oddsX: 3.30, odds2: 3.40, ouOver: 1.85, ouUnder: 1.95, dc1X: 1.30, dcX2: 1.68 },
        { id: 'ita-3', time: '14:00 Tomorrow', homeTeam: 'Napoli', awayTeam: 'Lazio', odds1: 1.95, oddsX: 3.40, odds2: 3.90, ouOver: 1.80, ouUnder: 2.00, dc1X: 1.24, dcX2: 1.82 },
      ];
    }

    if (nameLower.includes('bundesliga') || nameLower.includes('germany')) {
      return [
        { id: 'ger-1', time: '14:30 Today', homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', odds1: 1.60, oddsX: 4.20, odds2: 5.00, ouOver: 1.42, ouUnder: 2.80, dc1X: 1.15, dcX2: 2.30 },
        { id: 'ger-2', time: '17:30 Today', homeTeam: 'Bayer Leverkusen', awayTeam: 'RB Leipzig', odds1: 2.05, oddsX: 3.60, odds2: 3.30, ouOver: 1.62, ouUnder: 2.25, dc1X: 1.30, dcX2: 1.72 },
      ];
    }

    if (nameLower.includes('tennis') || nameLower.includes('atp') || nameLower.includes('wta')) {
      return [
        { id: 'ten-1', time: 'LIVE Set 2', homeTeam: 'Carlos Alcaraz', awayTeam: 'Jannik Sinner', odds1: 1.80, oddsX: 1.00, odds2: 2.00, ouOver: 1.85, ouUnder: 1.85, dc1X: 1.00, dcX2: 1.00 },
        { id: 'ten-2', time: '18:00 Today', homeTeam: 'Novak Djokovic', awayTeam: 'Alexander Zverev', odds1: 1.65, oddsX: 1.00, odds2: 2.25, ouOver: 1.90, ouUnder: 1.80, dc1X: 1.00, dcX2: 1.00 },
        { id: 'ten-3', time: '20:30 Today', homeTeam: 'Iga Swiatek', awayTeam: 'Aryna Sabalenka', odds1: 1.72, oddsX: 1.00, odds2: 2.10, ouOver: 1.82, ouUnder: 1.88, dc1X: 1.00, dcX2: 1.00 },
      ];
    }

    if (nameLower.includes('basketball') || nameLower.includes('nba')) {
      return [
        { id: 'bball-1', time: '01:00 Tonight', homeTeam: 'Boston Celtics', awayTeam: 'Dallas Mavericks', odds1: 1.55, oddsX: 1.00, odds2: 2.45, ouOver: 1.90, ouUnder: 1.90, dc1X: 1.00, dcX2: 1.00 },
        { id: 'bball-2', time: '03:30 Tonight', homeTeam: 'LA Lakers', awayTeam: 'Golden State Warriors', odds1: 1.90, oddsX: 1.00, odds2: 1.90, ouOver: 1.85, ouUnder: 1.95, dc1X: 1.00, dcX2: 1.00 },
      ];
    }

    if (nameLower.includes('nfl') || nameLower.includes('american football')) {
      return [
        { id: 'nfl-1', time: '21:15 Sunday', homeTeam: 'Kansas City Chiefs', awayTeam: 'San Francisco 49ers', odds1: 1.82, oddsX: 1.00, odds2: 2.00, ouOver: 1.90, ouUnder: 1.90, dc1X: 1.00, dcX2: 1.00 },
        { id: 'nfl-2', time: '18:00 Sunday', homeTeam: 'Philadelphia Eagles', awayTeam: 'Dallas Cowboys', odds1: 1.65, oddsX: 1.00, odds2: 2.25, ouOver: 1.88, ouUnder: 1.92, dc1X: 1.00, dcX2: 1.00 },
      ];
    }

    if (nameLower.includes('zoom') || nameLower.includes('virtual')) {
      return [
        { id: 'zoom-1', time: 'LIVE 12\'', homeTeam: 'Zoom Arsenal', awayTeam: 'Zoom Chelsea', odds1: 2.10, oddsX: 3.30, odds2: 3.20, ouOver: 1.70, ouUnder: 2.10, dc1X: 1.30, dcX2: 1.68 },
        { id: 'zoom-2', time: '14:02 Today', homeTeam: 'Zoom Real Madrid', awayTeam: 'Zoom Barcelona', odds1: 2.25, oddsX: 3.50, odds2: 2.90, ouOver: 1.65, ouUnder: 2.20, dc1X: 1.38, dcX2: 1.60 },
      ];
    }

    // Default fallback for any other league/tournament
    const cleanCat = cat.replace(/[^a-zA-Z0-9]/g, '');
    return [
      { id: `${cleanCat}-1`, time: '16:00 Today', homeTeam: `${cat} Home Stars`, awayTeam: `${cat} Away XI`, odds1: 2.10, oddsX: 3.25, odds2: 3.30, ouOver: 1.85, ouUnder: 1.95, dc1X: 1.28, dcX2: 1.68 },
      { id: `${cleanCat}-2`, time: '18:30 Today', homeTeam: `${cat} Champions`, awayTeam: `${cat} United`, odds1: 1.95, oddsX: 3.40, odds2: 3.75, ouOver: 1.80, ouUnder: 2.00, dc1X: 1.25, dcX2: 1.80 },
      { id: `${cleanCat}-3`, time: '21:00 Today', homeTeam: `${cat} FC`, awayTeam: `${cat} Athletic`, odds1: 2.40, oddsX: 3.30, odds2: 2.80, ouOver: 1.75, ouUnder: 2.05, dc1X: 1.40, dcX2: 1.52 },
    ];
  };

  // Slider State for Promo Banners
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      title: 'CATCH THE BOOM',
      subtitle: "CHECK OUT TODAY'S TOP BOOMED BETS",
      bgGradient: 'from-[#009040] via-[#00b050] to-[#0d1017]',
      tag: 'T&Cs APPLY | 18+ BET RESPONSIBLY',
      btnText: 'CLICK HERE',
    },
    {
      id: 2,
      title: "THIS WEEK'S BIGGEST WINNERS!",
      subtitle: 'OVER ₦100,000,000 PAID OUT TODAY',
      bgGradient: 'from-[#00b050] via-[#10b981] to-[#042f1a]',
      tag: 'INSTANT PAYOUTS | 24/7 SUPPORT',
      btnText: 'CLICK HERE',
    },
    {
      id: 3,
      title: 'UP TO 170% MULTIPLE BOOST',
      subtitle: 'BOOST YOUR ACCUMULATOR PAYOUTS ON ALL LEAGUES',
      bgGradient: 'from-[#e51c24] via-[#991118] to-[#12151a]',
      tag: 'MAXIMIZE YOUR WINNINGS TODAY',
      btnText: 'BET NOW',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Local stake state for betslip
  const [stakeInput, setStakeInput] = useState<number>(500);
  const [bookingCode, setBookingCode] = useState('');
  const [checkBetId, setCheckBetId] = useState('');
  const [placedBetSuccess, setPlacedBetSuccess] = useState(false);

  // Check if an odd is active
  const isOddSelected = (matchId: string, optionName: string) => {
    return activeSelections.some(
      (s) => s.matchId === matchId && s.optionName === optionName
    );
  };

  // Calculate total odds & potential win for accumulator or selections
  const totalOdds = activeSelections.reduce((acc, curr) => acc * curr.odds, 1);
  const potentialWin = activeSelections.length > 0 ? stakeInput * totalOdds : 0;

  // Additional mock live matches matching screenshot 2 (Soccer)
  const liveHighlightsMatches = [
    { id: 'live-1', leagueName: 'England - Premier League', markets: 172, time: "05'", homeTeam: 'Liverpool', awayTeam: 'Nottingham Forest', homeScore: 0, awayScore: 0, odds1: 1.50, oddsX: 4.50, odds2: 6.00, dc1X: null, dc12: null, dcX2: null, ouLine: 2.5, ouOver: null, ouUnder: null },
    { id: 'live-2', leagueName: 'England - Sky Bet Championship', markets: 143, time: "06'", homeTeam: 'Wolverhampton Wanderers', awayTeam: 'Stoke City', homeScore: 0, awayScore: 1, odds1: 2.55, oddsX: 3.75, odds2: 2.60, dc1X: 3.50, dc12: 1.10, dcX2: null, ouLine: 2.5, ouOver: null, ouUnder: null },
    { id: 'live-3', leagueName: 'England - Sky Bet Championship', markets: 132, time: "06'", homeTeam: 'Derby County', awayTeam: 'Swansea City', homeScore: 0, awayScore: 1, odds1: 4.75, oddsX: 4.00, odds2: 1.70, dc1X: 2.64, dc12: 1.17, dcX2: null, ouLine: 2.5, ouOver: 3.75, ouUnder: 1.20 },
    { id: 'live-4', leagueName: 'England - Sky Bet Championship', markets: 138, time: "05'", homeTeam: 'Middlesbrough', awayTeam: 'West Bromwich Albion', homeScore: 0, awayScore: 0, odds1: 1.72, oddsX: 4.00, odds2: 4.75, dc1X: null, dc12: null, dcX2: null, ouLine: 2.5, ouOver: null, ouUnder: null },
    { id: 'live-5', leagueName: 'England - Sky Bet League 1', markets: 24, time: "05'", homeTeam: 'Milton Keynes Dons', awayTeam: 'Leicester City', homeScore: 0, awayScore: 0, odds1: 2.50, oddsX: 3.50, odds2: 2.70, dc1X: 1.19, dc12: 1.77, dcX2: 1.22, ouLine: 2.5, ouOver: null, ouUnder: null },
    { id: 'live-6', leagueName: 'England - Sky Bet League 1', markets: 24, time: "06'", homeTeam: 'Blackpool', awayTeam: 'Peterborough United', homeScore: 0, awayScore: 0, odds1: 2.30, oddsX: 3.50, odds2: 2.95, dc1X: null, dc12: null, dcX2: null, ouLine: 2.5, ouOver: null, ouUnder: null },
    { id: 'live-7', leagueName: 'Germany - 2nd Bundesliga', markets: 112, time: "36'", homeTeam: 'Heidenheim', awayTeam: 'Dynamo Dresden', homeScore: 0, awayScore: 1, odds1: 4.90, oddsX: 3.60, odds2: 1.76, dc1X: null, dc12: null, dcX2: null, ouLine: 2.5, ouOver: null, ouUnder: null },
    { id: 'live-8', leagueName: 'Germany - 2nd Bundesliga', markets: 101, time: "36'", homeTeam: 'Karlsruher', awayTeam: 'Wolfsburg', homeScore: 2, awayScore: 2, odds1: 2.70, oddsX: 3.25, odds2: 2.68, dc1X: null, dc12: null, dcX2: null, ouLine: 2.5, ouOver: null, ouUnder: null },
    { id: 'live-9', leagueName: 'Germany - 2nd Bundesliga', markets: 120, time: "36'", homeTeam: 'Energie Cottbus', awayTeam: 'Greuther Furth', homeScore: 1, awayScore: 0, odds1: 1.52, oddsX: 4.10, odds2: 6.80, dc1X: null, dc12: null, dcX2: null, ouLine: 2.5, ouOver: null, ouUnder: null },
  ];

  // Sport-specific live match data
  const tennisLiveMatches = [
    { id: 'tennis-1', leagueName: 'ATP - Montreal', markets: 35, time: "2nd Set", homeTeam: 'Carlos Alcaraz', awayTeam: 'Novak Djokovic', homeScore: 1, awayScore: 0, odds1: 1.45, oddsX: null, odds2: 2.80 },
    { id: 'tennis-2', leagueName: 'ATP - Montreal', markets: 30, time: "3rd Set", homeTeam: 'Jannik Sinner', awayTeam: 'Daniil Medvedev', homeScore: 2, awayScore: 0, odds1: 1.22, oddsX: null, odds2: 4.10 },
    { id: 'tennis-3', leagueName: 'WTA - Cincinnati', markets: 28, time: "Live", homeTeam: 'Casper Ruud', awayTeam: 'Stefanos Tsitsipas', homeScore: 0, awayScore: 1, odds1: 2.95, oddsX: null, odds2: 1.40 },
  ];

  const basketballLiveMatches = [
    { id: 'bball-1', leagueName: 'NBA', markets: 80, time: "Q3", homeTeam: 'LA Lakers', awayTeam: 'Boston Celtics', homeScore: 78, awayScore: 85, odds1: 2.60, oddsX: null, odds2: 1.52 },
    { id: 'bball-2', leagueName: 'NBA', markets: 75, time: "Q2", homeTeam: 'Golden State Warriors', awayTeam: 'Miami Heat', homeScore: 55, awayScore: 48, odds1: 1.75, oddsX: null, odds2: 2.10 },
    { id: 'bball-3', leagueName: 'NBA', markets: 68, time: "Q4", homeTeam: 'Chicago Bulls', awayTeam: 'Brooklyn Nets', homeScore: 92, awayScore: 88, odds1: 1.90, oddsX: null, odds2: 1.95 },
  ];

  const baseballLiveMatches = [
    { id: 'baseball-1', leagueName: 'MLB', markets: 40, time: "7th", homeTeam: 'NY Yankees', awayTeam: 'Boston Red Sox', homeScore: 4, awayScore: 3, odds1: 1.65, oddsX: null, odds2: 2.35 },
    { id: 'baseball-2', leagueName: 'MLB', markets: 38, time: "5th", homeTeam: 'LA Dodgers', awayTeam: 'SF Giants', homeScore: 2, awayScore: 2, odds1: 1.80, oddsX: null, odds2: 2.10 },
    { id: 'baseball-3', leagueName: 'MLB', markets: 42, time: "9th", homeTeam: 'Chicago Cubs', awayTeam: 'St Louis Cardinals', homeScore: 5, awayScore: 4, odds1: 2.05, oddsX: null, odds2: 1.85 },
  ];

  const volleyballLiveMatches = [
    { id: 'vball-1', leagueName: 'FIVB World League', markets: 25, time: "Set 3", homeTeam: 'Brazil', awayTeam: 'Poland', homeScore: 2, awayScore: 0, odds1: 1.35, oddsX: null, odds2: 3.20 },
    { id: 'vball-2', leagueName: 'FIVB World League', markets: 22, time: "Set 2", homeTeam: 'Italy', awayTeam: 'France', homeScore: 0, awayScore: 1, odds1: 2.40, oddsX: null, odds2: 1.60 },
    { id: 'vball-3', leagueName: 'FIVB World League', markets: 20, time: "Set 4", homeTeam: 'USA', awayTeam: 'Russia', homeScore: 2, awayScore: 1, odds1: 1.55, oddsX: null, odds2: 2.50 },
  ];

  const liveMatchesBySport = selectedSportTab === 'Soccer' ? liveHighlightsMatches
    : selectedSportTab === 'Tennis' ? tennisLiveMatches
    : selectedSportTab === 'Basketball' ? basketballLiveMatches
    : selectedSportTab === 'Baseball' ? baseballLiveMatches
    : volleyballLiveMatches;

  // Extended highlights matching screenshot 3 & 4
  const extendedMatches = [
    {
      id: 'match-marinos-kashima',
      time: '11:25',
      homeTeam: 'Yokohama F Marinos',
      awayTeam: 'Kashima Antlers',
      odds1: 3.25,
      oddsX: 3.20,
      odds2: 2.32,
      odds1Up1: 2.07,
      odds1UpX: 3.20,
      odds1Up2: 1.68,
      odds2Up1: 3.10,
      odds2UpX: 3.20,
      odds2Up2: 2.25,
      bestPrice: false,
    },
    {
      id: 'match-gamba-urawa',
      time: '11:30',
      homeTeam: 'Gamba Osaka',
      awayTeam: 'Urawa Red Diamonds',
      odds1: 2.38,
      oddsX: 3.30,
      odds2: 3.05,
      odds1Up1: 1.66,
      odds1UpX: 3.30,
      odds1Up2: 1.93,
      odds2Up1: 2.30,
      odds2UpX: 3.30,
      odds2Up2: 2.94,
      bestPrice: false,
    },
    {
      id: 'match-wolves-portvale',
      time: '19:45',
      homeTeam: 'Wolves',
      awayTeam: 'Port Vale',
      odds1: 1.26,
      oddsX: 5.90,
      odds2: 10.00,
      odds1Up1: 1.12,
      odds1UpX: 5.90,
      odds1Up2: 3.75,
      odds2Up1: 1.23,
      odds2UpX: 5.90,
      odds2Up2: 9.30,
      bestPrice: true,
    },
    {
      id: 'match-westham-portsmouth',
      time: '15:00',
      homeTeam: 'West Ham',
      awayTeam: 'Portsmouth',
      odds1: 1.57,
      oddsX: 4.30,
      odds2: 5.30,
      odds1Up1: 1.25,
      odds1UpX: 4.30,
      odds1Up2: 2.44,
      odds2Up1: 1.52,
      odds2UpX: 4.30,
      odds2Up2: 5.00,
      bestPrice: true,
    },
    {
      id: 'match-psv-sittard',
      time: '19:00',
      homeTeam: 'PSV',
      awayTeam: 'Sittard',
      odds1: 1.22,
      oddsX: 7.40,
      odds2: 10.50,
      odds1Up1: 1.07,
      odds1UpX: 7.40,
      odds1Up2: 3.20,
      odds2Up1: 1.19,
      odds2UpX: 7.40,
      odds2Up2: 9.40,
      bestPrice: true,
    },
  ];

  // Mobile Sidebar Drawer State

  return (
    <div className="flex flex-col lg:flex-row gap-2.5 pb-16 font-sans text-xs select-none">
      {/* ================= MOBILE MAIN CONTENT (Bet9ja style) ================= */}
      <div className="lg:hidden w-full flex flex-col bg-[#1a1f27] min-h-screen pb-20">
        {selectedLeagueFilter ? (
          /* ---- League Detail View (Mobile) ---- */
          <div className="p-3 space-y-4">
            <div className="flex flex-col gap-3 border-b border-kb-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kb-green/20 border border-kb-green flex items-center justify-center shadow">
                  <Flame className="w-6 h-6 text-kb-green" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white uppercase tracking-tight">{selectedLeagueFilter}</h2>
                  <p className="text-[11px] text-kb-secondary">Live and upcoming fixtures</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeagueFilter(null)}
                className="py-2 rounded-xl bg-kb-elevated text-kb-primary font-bold text-xs flex items-center justify-center gap-1.5 border border-kb-border w-full"
              >
                <ArrowLeft className="w-4 h-4 text-kb-green" /> Back to All Sports
              </button>
            </div>
            <div className="space-y-2">
              {getFixturesForCategory(selectedLeagueFilter).map((fixture) => {
                const matchObj: Match = {
                  id: fixture.id, leagueId: 'custom', leagueName: selectedLeagueFilter, sport: 'Football',
                  homeTeam: { id: 'h', name: fixture.homeTeam, logo: '', score: 0 },
                  awayTeam: { id: 'a', name: fixture.awayTeam, logo: '', score: 0 },
                  status: 'UPCOMING', timeDisplay: fixture.time, dateDisplay: 'Today', markets: {}
                };
                return (
                  <div key={fixture.id} className="bg-[#2a313d] rounded-lg overflow-hidden border border-gray-700/50">
                    <div className="px-3 py-2">
                      <div className="text-amber-400 font-bold text-[10px] mb-1">{fixture.time}</div>
                      <div className="font-bold text-white text-xs cursor-pointer" onClick={() => onSelectMatch(fixture.id)}>
                        {fixture.homeTeam}
                      </div>
                      <div className="font-bold text-white text-xs mt-0.5 cursor-pointer" onClick={() => onSelectMatch(fixture.id)}>
                        {fixture.awayTeam}
                      </div>
                    </div>
                    <div className="flex">
                      <button onClick={() => onSelectOdd(matchObj, '1x2', `${fixture.homeTeam} (1)`, fixture.odds1)}
                        className={`flex-1 py-2.5 font-bold text-xs border-r border-gray-600 ${isOddSelected(fixture.id, `${fixture.homeTeam} (1)`) ? 'bg-[#009040] text-white ring-1 ring-kb-yellow' : 'bg-[#3a4454] text-white'}`}>
                        1 • {fixture.odds1.toFixed(2)}
                      </button>
                      <button onClick={() => onSelectOdd(matchObj, '1x2', 'Draw (X)', fixture.oddsX)}
                        className={`flex-1 py-2.5 font-bold text-xs border-r border-gray-600 ${isOddSelected(fixture.id, 'Draw (X)') ? 'bg-[#009040] text-white ring-1 ring-kb-yellow' : 'bg-[#3a4454] text-white'}`}>
                        X • {fixture.oddsX.toFixed(2)}
                      </button>
                      <button onClick={() => onSelectOdd(matchObj, '1x2', `${fixture.awayTeam} (2)`, fixture.odds2)}
                        className={`flex-1 py-2.5 font-bold text-xs ${isOddSelected(fixture.id, `${fixture.awayTeam} (2)`) ? 'bg-[#009040] text-white ring-1 ring-kb-yellow' : 'bg-[#3a4454] text-white'}`}>
                        2 • {fixture.odds2.toFixed(2)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ---- Main Live Feed View (Mobile) ---- */
          <>
            {/* Banner Slider */}
            <section className="relative overflow-hidden bg-kb-surface border-b border-kb-border shadow-xl" style={{height: '176px'}}>
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
                  className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgGradient} p-4 flex flex-col justify-between`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-kb-yellow text-slate-950 font-black px-2 py-0.5 rounded text-[9px] tracking-wider uppercase shrink-0">KINGSBET SPECIAL</span>
                    <span className="text-[9px] text-slate-200 font-medium text-right leading-tight">{slides[currentSlide].tag}</span>
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-lg font-black italic tracking-tight text-white uppercase drop-shadow-md leading-tight">{slides[currentSlide].title}</h2>
                    <p className="text-[11px] font-bold text-slate-100">{slides[currentSlide].subtitle}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="bg-kb-green text-white font-extrabold px-4 py-1.5 rounded text-[11px] tracking-wider">{slides[currentSlide].btnText}</button>
                    <div className="flex items-center gap-1.5">
                      {slides.map((_, idx) => (
                        <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'w-6 bg-kb-yellow' : 'w-2 bg-white/40'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </section>

            {/* Live Highlights Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
              <h2 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE HIGHLIGHTS
              </h2>
              <button onClick={() => setSelectedSportTab('Soccer')} className="text-[11px] font-bold text-kb-green">
                View Live Betting
              </button>
            </div>

            {/* Sports Tabs */}
            <div className="flex items-center gap-1.5 px-2 pt-2 pb-1 overflow-x-auto no-scrollbar">
              {(['Soccer', 'Tennis', 'Basketball', 'Baseball', 'Volleyball'] as const).map((sport) => (
                <button key={sport} onClick={() => setSelectedSportTab(sport)}
                  className={`py-1 px-2.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
                    selectedSportTab === sport ? 'bg-kb-green text-white' : 'bg-[#2a313d] text-gray-300'
                  }`}>
                  {sport}
                  {selectedSportTab === sport && <span className="w-1.5 h-1.5 rounded-full bg-kb-yellow"></span>}
                </button>
              ))}
            </div>

            {/* Match Cards - Clean Bet9ja style */}
            <div className="mt-1">
              {liveMatchesBySport.map((m) => {
                const liveMatchObj: Match = {
                  id: m.id, leagueId: 'live', leagueName: (m as any).leagueName || 'Live Highlights', sport: 'Football',
                  homeTeam: { id: `${m.id}-home`, name: m.homeTeam, logo: '', score: m.homeScore },
                  awayTeam: { id: `${m.id}-away`, name: m.awayTeam, logo: '', score: m.awayScore },
                  status: 'LIVE', timeDisplay: m.time, dateDisplay: 'Today', markets: {}
                };
                const hasDraw = selectedSportTab === 'Soccer';
                const oddsX = 'oddsX' in m ? (m as any).oddsX : null;
                const markets = (m as any).markets || 0;
                return (
                  <div key={m.id} className="flex border-b border-gray-700/60" style={{minHeight: '70px'}}>
                    {/* Left: info block */}
                    <div className="flex-1 min-w-0 px-2.5 py-2 cursor-pointer" onClick={() => onSelectMatch(m.id)}>
                      <div className="text-gray-400 text-[10px] mb-1 truncate">{(m as any).leagueName || 'Live'}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-[12px] truncate pr-2">{m.homeTeam}</span>
                        <span className="text-white font-bold text-[12px] shrink-0">{m.homeScore}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-white font-bold text-[12px] truncate pr-2">{m.awayTeam}</span>
                        <span className="text-white font-bold text-[12px] shrink-0">{m.awayScore}</span>
                      </div>
                      <div className="text-gray-400 text-[10px] mt-1">{m.time}{markets > 0 ? ` • ${markets} Markets` : ''}</div>
                    </div>
                    {/* Right: odds buttons - full height */}
                    <div className={`flex shrink-0 ${hasDraw ? 'w-[126px]' : 'w-[84px]'}`}>
                      {/* Odds 1 */}
                      {m.odds1 ? (
                        <button
                          onClick={() => onSelectOdd(liveMatchObj, '1x2', `${m.homeTeam} (1)`, m.odds1!)}
                          className={`flex-1 flex items-center justify-center font-bold text-[12px] border-l border-gray-700 transition-all ${
                            isOddSelected(m.id, `${m.homeTeam} (1)`) ? 'bg-[#007a33] text-white' : 'bg-[#009040] text-white'
                          }`}
                        >
                          {m.odds1.toFixed(2)}
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-center border-l border-gray-700 bg-[#1e2530]"><Lock className="w-3 h-3 text-gray-500" /></div>
                      )}
                      {/* Odds X (Soccer only) */}
                      {hasDraw && (
                        oddsX ? (
                          <button
                            onClick={() => onSelectOdd(liveMatchObj, '1x2', 'Draw (X)', oddsX)}
                            className={`flex-1 flex items-center justify-center font-bold text-[12px] border-l border-gray-700 transition-all ${
                              isOddSelected(m.id, 'Draw (X)') ? 'bg-[#007a33] text-white' : 'bg-[#009040] text-white'
                            }`}
                          >
                            {oddsX.toFixed(2)}
                          </button>
                        ) : (
                          <div className="flex-1 flex items-center justify-center border-l border-gray-700 bg-[#1e2530]"><Lock className="w-3 h-3 text-gray-500" /></div>
                        )
                      )}
                      {/* Odds 2 */}
                      {m.odds2 ? (
                        <button
                          onClick={() => onSelectOdd(liveMatchObj, '1x2', `${m.awayTeam} (2)`, m.odds2!)}
                          className={`flex-1 flex items-center justify-center font-bold text-[12px] border-l border-gray-700 transition-all ${
                            isOddSelected(m.id, `${m.awayTeam} (2)`) ? 'bg-[#007a33] text-white' : 'bg-[#009040] text-white'
                          }`}
                        >
                          {m.odds2.toFixed(2)}
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-center border-l border-gray-700 bg-[#1e2530]"><Lock className="w-3 h-3 text-gray-500" /></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>


      {/* ================= LEFT SIDEBAR (Desktop inline, Mobile Modal Drawer) ================= */}
      {/* Mobile Backdrop & Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] bg-kb-card border-r border-kb-border p-4 space-y-4 overflow-y-auto h-full z-10 text-xs shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-kb-border pb-2">
                  <span className="font-black text-white text-sm uppercase tracking-wider text-kb-yellow flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-kb-green" /> KingsBet Sports A-Z
                  </span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 text-kb-secondary hover:text-white rounded-lg bg-kb-elevated"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, teams, leagues..."
                    className="w-full bg-kb-elevated border border-kb-border rounded-lg py-2 pl-3 pr-8 text-xs text-white placeholder-kb-placeholder focus:outline-none focus:border-kb-green"
                  />
                  <Search className="w-4 h-4 text-kb-secondary absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>

                {/* Live Leagues */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-kb-primary py-1 border-b border-kb-border flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-kb-green" /> Live In-Play
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {['England Premier League', 'Spain LaLiga', 'UEFA Champions League', 'Italy Serie A', 'Germany Bundesliga', 'CECAFA Kagame Cup', 'ATP - Montreal', 'NFL', 'Zoom Soccer'].map((lg) => (
                      <button
                        key={lg}
                        onClick={() => {
                          setSelectedLeagueFilter(lg);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded hover:bg-kb-elevated text-xs font-medium truncate block ${
                          selectedLeagueFilter === lg ? 'bg-kb-green text-white font-bold' : 'text-kb-secondary hover:text-white'
                        }`}
                      >
                        {lg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sports List */}
                <div className="space-y-1 pt-2 border-t border-kb-border">
                  <div className="text-[10px] font-black text-kb-secondary uppercase tracking-wider mb-1">
                    All Sports
                  </div>
                  {['Soccer', 'Tennis', 'Basketball', 'Volleyball', 'American Football', 'Baseball', 'Ice Hockey', 'Zoom Soccer'].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => {
                        setSelectedLeagueFilter(sp);
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full text-left py-2 px-2.5 rounded-lg bg-kb-elevated hover:bg-kb-green text-kb-primary hover:text-white font-bold text-xs flex items-center justify-between"
                    >
                      <span>{sp}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-kb-secondary" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full py-3 bg-kb-green hover:bg-kb-green-d text-white font-black text-xs uppercase rounded-xl shadow-lg mt-4"
              >
                Close Menu
              </button>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Left Sidebar (Visible only on lg: screens) */}
      <aside className="hidden lg:block w-60 xl:w-64 shrink-0 bg-kb-card border border-kb-border rounded-lg p-2.5 space-y-3">
        {/* Search Bar matching Bet9ja screenshot 2 */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for events, teams, leag..."
            className="w-full bg-kb-elevated border border-kb-border rounded py-1.5 pl-2.5 pr-8 text-xs text-white placeholder-kb-placeholder focus:outline-none focus:border-kb-green"
          />
          <Search className="w-4 h-4 text-kb-secondary absolute right-2 top-1/2 -translate-y-1/2" />
        </div>

        {/* Live Betting List matching Bet9ja sidebar */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-kb-primary py-1 border-b border-kb-border">
            <Flame className="w-3.5 h-3.5 text-kb-green fill-[#00b050]" />
            <span>Live Betting</span>
          </div>

          <div className="space-y-0.5 text-[11px] max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {[
              'Africa Cup of Nations, Women',
              'UEFA Super Cup',
              'UEFA Champions League',
              'UEFA Europa League, Qualification',
              'CECAFA Kagame Cup',
              'UEFA Conference League, Qualification',
              'UEFA Champions League Women',
              'Copa Libertadores',
              'Copa Sudamericana',
              'Leagues Cup',
              'England Premier League',
              'England Community Shield',
              'England EFL Cup',
              'England Championship',
              'Spain LaLiga',
              'Italy Serie A',
              'Italy Coppa Italia',
              'Germany Bundesliga',
              'Germany Super Cup',
              'Germany DFB Pokal',
              'France Ligue 1',
              'Trophee des Champions',
              'Brasileiro Serie A',
              'Scotland Premiership',
              'Scotland League Cup',
              'ATP - Montreal',
              'WTA - Toronto',
              'NFL',
              'NHL',
              'MLB',
              'F1 - Dutch Grand Prix',
              'MotoGP - British Grand Prix',
            ].map((league, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedLeagueFilter(league)}
                className={`flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-kb-elevated transition-colors group cursor-pointer truncate w-full text-left ${
                  selectedLeagueFilter === league ? 'bg-kb-green text-white font-bold' : 'text-kb-secondary hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${selectedLeagueFilter === league ? 'bg-kb-yellow' : 'bg-slate-600 group-hover:bg-kb-green'}`}></span>
                <span className="truncate">{league}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Filters Bar: TODAY 3H 24H 72H ALL */}
        <div className="pt-1 border-t border-kb-border">
          <div className="flex items-center justify-between bg-kb-deep rounded p-0.5 text-[10px] font-bold text-kb-secondary">
            {(['TODAY', '3H', '24H', '72H', 'ALL'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`py-1 px-1.5 rounded transition-colors ${
                  timeFilter === filter
                    ? 'bg-kb-green text-white font-extrabold shadow'
                    : 'hover:text-white hover:bg-kb-elevated'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* SPORTS Accordion List matching Bet9ja screenshot 3 */}
        <div className="space-y-1 pt-1 border-t border-kb-border">
          <div className="text-[10px] font-bold text-kb-secondary uppercase tracking-wider mb-1">
            SPORTS
          </div>

          <div className="space-y-1 text-xs">
            {[
              { name: 'Soccer', count: 184 },
              { name: 'Players Soccer', count: 42 },
              { name: 'Specials Soccer', count: 12 },
              { name: 'Specials Combo', count: 8 },
              { name: 'Antepost Soccer', count: 15 },
              { name: 'Zoom Soccer', count: 24 },
              { name: 'Players Zoom Soccer', count: 9 },
              { name: 'Tennis', count: 36 },
              { name: 'Zoom Tennis', count: 14 },
              { name: 'Basketball', count: 22 },
              { name: 'Specials Basketball', count: 5 },
              { name: 'Volleyball', count: 11 },
              { name: 'American Football', count: 18 },
              { name: 'Baseball', count: 16 },
              { name: 'Handball', count: 7 },
              { name: 'Rugby', count: 9 },
              { name: 'Motor Sports', count: 4 },
              { name: 'Ice Hockey', count: 13 },
            ].map((sportItem) => (
              <div key={sportItem.name} className="border-b border-kb-border/60 pb-0.5">
                <button
                  onClick={() => {
                    setSelectedLeagueFilter(sportItem.name);
                    setExpandedSport(
                      expandedSport === sportItem.name ? null : sportItem.name
                    );
                  }}
                  className={`w-full flex items-center justify-between py-1 px-1 rounded hover:bg-kb-elevated transition-colors text-left ${
                    selectedLeagueFilter === sportItem.name ? 'text-kb-green font-black' : 'text-kb-secondary hover:text-white'
                  }`}
                >
                  <span className="font-semibold text-xs">{sportItem.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-kb-muted transition-transform ${
                      expandedSport === sportItem.name ? 'rotate-180 text-kb-green' : ''
                    }`}
                  />
                </button>

                {expandedSport === sportItem.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-3 pr-1 py-1 space-y-1 text-[11px] text-kb-secondary"
                  >
                    <div
                      onClick={() => setSelectedLeagueFilter(`${sportItem.name} Top Tournaments`)}
                      className="hover:text-white cursor-pointer py-0.5 flex justify-between"
                    >
                      <span>Top Tournaments</span>
                      <span className="text-kb-green">{sportItem.count}</span>
                    </div>
                    <div onClick={() => setSelectedLeagueFilter('England Premier League')} className="hover:text-white cursor-pointer py-0.5">England Premier League</div>
                    <div onClick={() => setSelectedLeagueFilter('Spain LaLiga')} className="hover:text-white cursor-pointer py-0.5">Spain LaLiga</div>
                    <div onClick={() => setSelectedLeagueFilter('Italy Serie A')} className="hover:text-white cursor-pointer py-0.5">Italy Serie A</div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ================= CENTER MAIN CONTENT (Desktop only now) ================= */}
      <main className="hidden lg:block flex-1 min-w-0 space-y-3">
        {selectedLeagueFilter ? (
          <section className="bg-kb-card border border-kb-green/50 rounded-lg p-3 sm:p-4 space-y-4 shadow-2xl">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-kb-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kb-green/20 border border-kb-green flex items-center justify-center text-kb-green font-black text-lg shadow">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-kb-yellow font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <span>KingsBet Sports & League Page</span>
                  </div>
                  <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-tight">
                    {selectedLeagueFilter}
                  </h2>
                  <p className="text-[11px] text-kb-secondary">
                    Live and upcoming fixtures with full odds & 1X2 markets
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLeagueFilter(null)}
                className="px-3.5 py-2 rounded-xl bg-kb-elevated hover:bg-[#2a313d] text-kb-primary hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-kb-border shadow"
              >
                <ArrowLeft className="w-4 h-4 text-kb-green" /> Back to All Sports
              </button>
            </div>

            {/* Table Market Headers */}
            <div className="hidden sm:grid grid-cols-12 gap-1 text-[10px] font-extrabold text-kb-secondary bg-kb-deep p-2 rounded text-center">
              <div className="col-span-3 text-left">Time & Match</div>
              <div className="col-span-3">1X2 (1 / X / 2)</div>
              <div className="col-span-3">Double Chance (1X / X2)</div>
              <div className="col-span-3">Over / Under 2.5</div>
            </div>

            {/* Fixtures List */}
            <div className="space-y-2">
              {getFixturesForCategory(selectedLeagueFilter).map((fixture) => {
                const matchObj: Match = {
                  id: fixture.id,
                  leagueId: 'custom',
                  leagueName: selectedLeagueFilter,
                  sport: 'Football',
                  homeTeam: { id: 'h', name: fixture.homeTeam, logo: '', score: 0 },
                  awayTeam: { id: 'a', name: fixture.awayTeam, logo: '', score: 0 },
                  status: 'UPCOMING',
                  timeDisplay: fixture.time,
                  dateDisplay: 'Today',
                  markets: {
                    oneXtwo: {
                      id: '1x2',
                      title: '1x2',
                      options: [
                        { id: '1', name: '1', odds: fixture.odds1 },
                        { id: 'x', name: 'X', odds: fixture.oddsX },
                        { id: '2', name: '2', odds: fixture.odds2 },
                      ],
                    },
                  },
                };

                return (
                  <div
                    key={fixture.id}
                    className="bg-kb-elevated border border-kb-border hover:border-kb-border rounded-xl p-3 flex flex-col sm:grid sm:grid-cols-12 gap-2 items-center transition-all shadow-md"
                  >
                    {/* Time & Teams */}
                    <div className="w-full sm:col-span-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-amber-400 shrink-0">
                        {fixture.time}
                      </span>
                      <div
                        onClick={() => onSelectMatch(fixture.id)}
                        className="space-y-0.5 cursor-pointer hover:text-kb-green transition-colors flex-1 min-w-0"
                      >
                        <div className="font-extrabold text-white text-xs truncate">{fixture.homeTeam}</div>
                        <div className="font-extrabold text-white text-xs truncate">{fixture.awayTeam}</div>
                      </div>
                    </div>

                    {/* 1X2 Odds */}
                    <div className="w-full sm:col-span-3 grid grid-cols-3 gap-1">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectOdd(matchObj, '1x2', `${fixture.homeTeam} (1)`, fixture.odds1)}
                        className={`py-2 rounded-lg text-xs font-black transition-all text-center ${
                          isOddSelected(fixture.id, `${fixture.homeTeam} (1)`)
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                        }`}
                      >
                        {fixture.odds1.toFixed(2)}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectOdd(matchObj, '1x2', 'Draw (X)', fixture.oddsX)}
                        className={`py-2 rounded-lg text-xs font-black transition-all text-center ${
                          isOddSelected(fixture.id, 'Draw (X)')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                        }`}
                      >
                        {fixture.oddsX.toFixed(2)}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectOdd(matchObj, '1x2', `${fixture.awayTeam} (2)`, fixture.odds2)}
                        className={`py-2 rounded-lg text-xs font-black transition-all text-center ${
                          isOddSelected(fixture.id, `${fixture.awayTeam} (2)`)
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                        }`}
                      >
                        {fixture.odds2.toFixed(2)}
                      </motion.button>
                    </div>

                    {/* Double Chance Odds */}
                    <div className="w-full sm:col-span-3 grid grid-cols-2 gap-1">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectOdd(matchObj, 'dc', '1X', fixture.dc1X)}
                        className={`py-2 rounded-lg text-xs font-black transition-all text-center ${
                          isOddSelected(fixture.id, '1X')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-elevated hover:bg-kb-hover text-amber-300 border border-kb-border'
                        }`}
                      >
                        1X {fixture.dc1X.toFixed(2)}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectOdd(matchObj, 'dc', 'X2', fixture.dcX2)}
                        className={`py-2 rounded-lg text-xs font-black transition-all text-center ${
                          isOddSelected(fixture.id, 'X2')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-elevated hover:bg-kb-hover text-amber-300 border border-kb-border'
                        }`}
                      >
                        X2 {fixture.dcX2.toFixed(2)}
                      </motion.button>
                    </div>

                    {/* Over / Under Odds */}
                    <div className="w-full sm:col-span-3 grid grid-cols-2 gap-1">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectOdd(matchObj, 'ou', 'Over 2.5', fixture.ouOver)}
                        className={`py-2 rounded-lg text-xs font-black transition-all text-center ${
                          isOddSelected(fixture.id, 'Over 2.5')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-elevated hover:bg-kb-hover text-kb-primary border border-kb-border'
                        }`}
                      >
                        O2.5 {fixture.ouOver.toFixed(2)}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectOdd(matchObj, 'ou', 'Under 2.5', fixture.ouUnder)}
                        className={`py-2 rounded-lg text-xs font-black transition-all text-center ${
                          isOddSelected(fixture.id, 'Under 2.5')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-elevated hover:bg-kb-hover text-kb-primary border border-kb-border'
                        }`}
                      >
                        U2.5 {fixture.ouUnder.toFixed(2)}
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <>
            {/* Top Interactive Banner Slider matching Bet9ja Promo Slider */}
            <section className="relative overflow-hidden rounded-lg bg-kb-surface border border-kb-border shadow-xl h-44 sm:h-52">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgGradient} p-5 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="bg-kb-yellow text-slate-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                  KINGSBET SPECIAL
                </span>
                <span className="text-[10px] text-kb-secondary font-medium">
                  {slides[currentSlide].tag}
                </span>
              </div>

              <div className="space-y-1 my-auto">
                <h2 className="text-xl sm:text-3xl font-black italic tracking-tight text-white uppercase drop-shadow-md">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-100 max-w-lg">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button className="bg-kb-green hover:bg-kb-green-d text-white font-extrabold px-5 py-2 rounded text-xs tracking-wider transition-all shadow-lg shadow-black/40 hover:scale-105 active:scale-95">
                  {slides[currentSlide].btnText}
                </button>

                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === idx ? 'w-6 bg-kb-yellow' : 'w-2 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Live Highlights Section matching Bet9ja Screenshot 2 */}
        <section className="bg-kb-card border border-kb-border rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between border-b border-kb-border pb-2">
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Highlights
            </h2>
            <button className="text-[11px] font-bold text-kb-green hover:underline">
              View Live Betting
            </button>
          </div>

          {/* Sports Category Tabs Icons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar border-b border-kb-border/80">
            {(['Soccer', 'Tennis', 'Basketball', 'Baseball', 'Volleyball'] as const).map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSportTab(sport)}
                className={`py-1 px-3 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  selectedSportTab === sport
                    ? 'bg-kb-green text-white shadow'
                    : 'bg-kb-elevated text-kb-secondary hover:bg-kb-hover'
                }`}
              >
                <span>{sport}</span>
                {selectedSportTab === sport && (
                  <span className="w-1.5 h-1.5 rounded-full bg-kb-yellow"></span>
                )}
              </button>
            ))}
          </div>

          {/* Odds Table Headers matching Bet9ja format */}
          <div className="hidden sm:grid grid-cols-12 gap-1 text-[10px] font-extrabold text-kb-secondary bg-kb-deep p-1.5 rounded">
            <div className="col-span-1">Time</div>
            <div className="col-span-4">Match</div>
            <div className="col-span-3 text-center">1X2 (1 / X / 2)</div>
            <div className="col-span-2 text-center">Double Chance</div>
            <div className="col-span-2 text-center">Over/Under 2.5</div>
          </div>

          {/* Live Matches List */}
          <div className="space-y-1.5">
            {liveHighlightsMatches.map((m) => {
              const liveMatchObj: Match = {
                id: m.id,
                leagueId: 'live',
                leagueName: 'Live Highlights',
                sport: 'Football',
                homeTeam: { id: `${m.id}-home`, name: m.homeTeam, logo: '', score: m.homeScore },
                awayTeam: { id: `${m.id}-away`, name: m.awayTeam, logo: '', score: m.awayScore },
                status: 'LIVE',
                timeDisplay: m.time,
                dateDisplay: 'Today',
                markets: {}
              };

              return (
                <div
                  key={m.id}
                  className="bg-kb-elevated border border-kb-border hover:border-kb-border rounded p-2 flex flex-col sm:grid sm:grid-cols-12 gap-2 items-center transition-all"
                >
                  {/* Time & Live badge */}
                  <div className="w-full sm:col-span-1 flex items-center justify-between sm:justify-start gap-1 text-[11px] font-bold text-red-400">
                    <span>{m.time}</span>
                    <span className="sm:hidden text-kb-secondary font-normal">Live</span>
                  </div>

                  {/* Match & Scores */}
                  <div
                    onClick={() => onSelectMatch(m.id)}
                    className="w-full sm:col-span-4 flex items-center justify-between cursor-pointer hover:text-kb-green transition-colors pr-2"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-xs truncate max-w-[170px]">
                        {m.homeTeam}
                      </div>
                      <div className="font-bold text-white text-xs truncate max-w-[170px]">
                        {m.awayTeam}
                      </div>
                    </div>

                    <div className="flex flex-col items-end font-black text-amber-400 text-xs pl-2 border-l border-kb-border">
                      <span>{m.homeScore}</span>
                      <span>{m.awayScore}</span>
                    </div>
                  </div>

                  {/* 1X2 Odds Buttons (3 columns) */}
                  <div className="w-full sm:col-span-3 grid grid-cols-3 gap-1">
                    {/* 1 */}
                    {m.odds1 ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          onSelectOdd(
                            liveMatchObj,
                            '1x2',
                            `${m.homeTeam} (1)`,
                            m.odds1!
                          )
                        }
                        className={`py-1.5 rounded text-xs font-extrabold transition-all flex items-center justify-center ${
                          isOddSelected(m.id, `${m.homeTeam} (1)`)
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                        }`}
                      >
                        {m.odds1.toFixed(2)}
                      </motion.button>
                    ) : (
                      <button className="py-1.5 rounded bg-kb-locked text-kb-muted flex items-center justify-center cursor-not-allowed">
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* X */}
                    {m.oddsX ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          onSelectOdd(liveMatchObj, '1x2', 'Draw (X)', m.oddsX!)
                        }
                        className={`py-1.5 rounded text-xs font-extrabold transition-all flex items-center justify-center ${
                          isOddSelected(m.id, 'Draw (X)')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                        }`}
                      >
                        {m.oddsX.toFixed(2)}
                      </motion.button>
                    ) : (
                      <button className="py-1.5 rounded bg-kb-locked text-kb-muted flex items-center justify-center cursor-not-allowed">
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* 2 */}
                    {m.odds2 ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          onSelectOdd(
                            liveMatchObj,
                            '1x2',
                            `${m.awayTeam} (2)`,
                            m.odds2!
                          )
                        }
                        className={`py-1.5 rounded text-xs font-extrabold transition-all flex items-center justify-center ${
                          isOddSelected(m.id, `${m.awayTeam} (2)`)
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                        }`}
                      >
                        {m.odds2.toFixed(2)}
                      </motion.button>
                    ) : (
                      <button className="py-1.5 rounded bg-kb-locked text-kb-muted flex items-center justify-center cursor-not-allowed">
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Double Chance Buttons (3 columns) */}
                  <div className="w-full sm:col-span-2 grid grid-cols-3 gap-1">
                    {m.dc1X ? (
                      <button
                        onClick={() => onSelectOdd(liveMatchObj, 'Double Chance', '1X', m.dc1X!)}
                        className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                          isOddSelected(m.id, '1X')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white'
                        }`}
                      >
                        {m.dc1X.toFixed(2)}
                      </button>
                    ) : (
                      <button className="py-1.5 rounded bg-kb-locked text-kb-muted flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </button>
                    )}

                    {m.dc12 ? (
                      <button
                        onClick={() => onSelectOdd(liveMatchObj, 'Double Chance', '12', m.dc12!)}
                        className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                          isOddSelected(m.id, '12')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white'
                        }`}
                      >
                        {m.dc12.toFixed(2)}
                      </button>
                    ) : (
                      <button className="py-1.5 rounded bg-kb-locked text-kb-muted flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </button>
                    )}

                    {m.dcX2 ? (
                      <button
                        onClick={() => onSelectOdd(liveMatchObj, 'Double Chance', 'X2', m.dcX2!)}
                        className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                          isOddSelected(m.id, 'X2')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white'
                        }`}
                      >
                        {m.dcX2.toFixed(2)}
                      </button>
                    ) : (
                      <button className="py-1.5 rounded bg-kb-locked text-kb-muted flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Over/Under Buttons */}
                  <div className="w-full sm:col-span-2 grid grid-cols-2 gap-1">
                    {m.ouOver ? (
                      <button
                        onClick={() => onSelectOdd(liveMatchObj, 'Over/Under 2.5', 'Over 2.5', m.ouOver!)}
                        className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                          isOddSelected(m.id, 'Over 2.5')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white'
                        }`}
                      >
                        {m.ouOver.toFixed(2)}
                      </button>
                    ) : (
                      <button className="py-1.5 rounded bg-kb-locked text-kb-muted flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </button>
                    )}

                    {m.ouUnder ? (
                      <button
                        onClick={() => onSelectOdd(liveMatchObj, 'Over/Under 2.5', 'Under 2.5', m.ouUnder!)}
                        className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                          isOddSelected(m.id, 'Under 2.5')
                            ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                            : 'bg-kb-green hover:bg-kb-green-d text-white'
                        }`}
                      >
                        {m.ouUnder.toFixed(2)}
                      </button>
                    ) : (
                      <button className="py-1.5 rounded bg-kb-locked text-kb-muted flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Highlights & Upcoming Section matching Bet9ja Screenshot 3 & 4 */}
        <section className="bg-kb-card border border-kb-border rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between border-b border-kb-border pb-2">
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Highlights
            </h2>
            <button className="text-[11px] font-bold text-kb-green hover:underline">
              View Highlights
            </button>
          </div>

          {/* Table Market Headers: 1X2 | 1X2 1UP | 1X2 2UP */}
          <div className="hidden sm:grid grid-cols-12 gap-1 text-[10px] font-extrabold text-kb-secondary bg-kb-deep p-1.5 rounded text-center">
            <div className="col-span-3 text-left">Match</div>
            <div className="col-span-3">1X2 (1 / X / 2)</div>
            <div className="col-span-3">1X2 1UP</div>
            <div className="col-span-3">1X2 2UP</div>
          </div>

          <div className="text-[11px] font-extrabold text-kb-secondary py-1 px-2 bg-[#1d222b] rounded border-l-2 border-kb-green">
            Fri 7 Aug
          </div>

          <div className="space-y-1.5">
            {extendedMatches.map((m) => {
              const extMatchObj: Match = {
                id: m.id,
                leagueId: 'highlights',
                leagueName: 'Highlights',
                sport: 'Football',
                homeTeam: { id: `${m.id}-home`, name: m.homeTeam, logo: '' },
                awayTeam: { id: `${m.id}-away`, name: m.awayTeam, logo: '' },
                status: 'UPCOMING',
                timeDisplay: m.time,
                dateDisplay: 'Today',
                markets: {}
              };

              return (
                <div
                  key={m.id}
                  className="bg-kb-elevated border border-kb-border hover:border-kb-border rounded p-2 flex flex-col sm:grid sm:grid-cols-12 gap-2 items-center transition-all relative"
                >
                  {/* Time & Teams */}
                  <div className="w-full sm:col-span-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-amber-400 w-10 shrink-0">
                      {m.time}
                    </span>
                    <div
                      onClick={() => onSelectMatch(m.id)}
                      className="space-y-0.5 cursor-pointer hover:text-kb-green transition-colors flex-1 min-w-0"
                    >
                      <div className="font-bold text-white text-xs truncate">{m.homeTeam}</div>
                      <div className="font-bold text-white text-xs truncate">{m.awayTeam}</div>
                    </div>
                    <div className="flex items-center gap-1 text-kb-muted">
                      <Tv className="w-3.5 h-3.5" />
                      <BarChart2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* 1X2 Standard Odds */}
                  <div className="w-full sm:col-span-3 grid grid-cols-3 gap-1 relative">
                    {m.bestPrice && (
                      <span className="absolute -top-3 left-0 bg-kb-green text-white text-[8px] font-black px-1 rounded-sm uppercase tracking-tighter flex items-center gap-0.5 shadow z-10">
                        <Sparkles className="w-2 h-2" /> Best Price
                      </span>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        onSelectOdd(extMatchObj, '1x2', `${m.homeTeam} (1)`, m.odds1)
                      }
                      className={`py-1.5 rounded text-xs font-extrabold transition-all text-center ${
                        isOddSelected(m.id, `${m.homeTeam} (1)`)
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                      }`}
                    >
                      {m.odds1.toFixed(2)}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        onSelectOdd(extMatchObj, '1x2', 'Draw (X)', m.oddsX)
                      }
                      className={`py-1.5 rounded text-xs font-extrabold transition-all text-center ${
                        isOddSelected(m.id, 'Draw (X)')
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                      }`}
                    >
                      {m.oddsX.toFixed(2)}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        onSelectOdd(extMatchObj, '1x2', `${m.awayTeam} (2)`, m.odds2)
                      }
                      className={`py-1.5 rounded text-xs font-extrabold transition-all text-center ${
                        isOddSelected(m.id, `${m.awayTeam} (2)`)
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white shadow'
                      }`}
                    >
                      {m.odds2.toFixed(2)}
                    </motion.button>
                  </div>

                  {/* 1X2 1UP Odds */}
                  <div className="w-full sm:col-span-3 grid grid-cols-3 gap-1">
                    <button
                      onClick={() => onSelectOdd(extMatchObj, '1X2 1UP', `${m.homeTeam} (1UP)`, m.odds1Up1)}
                      className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                        isOddSelected(m.id, `${m.homeTeam} (1UP)`)
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white'
                      }`}
                    >
                      {m.odds1Up1.toFixed(2)}
                    </button>
                    <button
                      onClick={() => onSelectOdd(extMatchObj, '1X2 1UP', 'Draw (1UP)', m.odds1UpX)}
                      className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                        isOddSelected(m.id, 'Draw (1UP)')
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white'
                      }`}
                    >
                      {m.odds1UpX.toFixed(2)}
                    </button>
                    <button
                      onClick={() => onSelectOdd(extMatchObj, '1X2 1UP', `${m.awayTeam} (1UP)`, m.odds1Up2)}
                      className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                        isOddSelected(m.id, `${m.awayTeam} (1UP)`)
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white'
                      }`}
                    >
                      {m.odds1Up2.toFixed(2)}
                    </button>
                  </div>

                  {/* 1X2 2UP Odds */}
                  <div className="w-full sm:col-span-3 grid grid-cols-3 gap-1">
                    <button
                      onClick={() => onSelectOdd(extMatchObj, '1X2 2UP', `${m.homeTeam} (2UP)`, m.odds2Up1)}
                      className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                        isOddSelected(m.id, `${m.homeTeam} (2UP)`)
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white'
                      }`}
                    >
                      {m.odds2Up1.toFixed(2)}
                    </button>
                    <button
                      onClick={() => onSelectOdd(extMatchObj, '1X2 2UP', 'Draw (2UP)', m.odds2UpX)}
                      className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                        isOddSelected(m.id, 'Draw (2UP)')
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white'
                      }`}
                    >
                      {m.odds2UpX.toFixed(2)}
                    </button>
                    <button
                      onClick={() => onSelectOdd(extMatchObj, '1X2 2UP', `${m.awayTeam} (2UP)`, m.odds2Up2)}
                      className={`py-1.5 rounded font-extrabold text-xs shadow text-center transition-all ${
                        isOddSelected(m.id, `${m.awayTeam} (2UP)`)
                          ? 'bg-[#009040] text-white ring-2 ring-[#ffcc00]'
                          : 'bg-kb-green hover:bg-kb-green-d text-white'
                      }`}
                    >
                      {m.odds2Up2.toFixed(2)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
          </>
        )}
      </main>

      {/* ================= RIGHT SIDEBAR (BETSLIP & FEATURED COUPON) ================= */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-3">
        {/* Betslip Container matching Bet9ja screenshot 2 */}
        <div className="bg-kb-card border border-kb-border rounded-lg overflow-hidden shadow-xl">
          <div className="bg-kb-surface px-3 py-2 border-b border-kb-border flex items-center justify-between">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span>Betslip</span>
              {activeSelections.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-kb-green text-white text-[10px] font-black flex items-center justify-center">
                  {activeSelections.length}
                </span>
              )}
            </h3>
          </div>

          <div className="p-3 space-y-3 text-xs">
            {activeSelections.length === 0 ? (
              <div className="text-center py-6 text-kb-secondary space-y-2">
                <p className="text-[11px]">
                  Your betslip is empty. Please make one or more selections in order to place a bet.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeSelections.map((sel) => (
                  <div
                    key={`${sel.matchId}-${sel.optionName}`}
                    className="p-2.5 rounded bg-kb-elevated border border-kb-border space-y-1 relative group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-white">
                      <span className="truncate max-w-[180px]">{sel.matchTitle}</span>
                      <span className="text-kb-green font-black">{sel.odds.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-kb-secondary">
                      <span>Selection: <strong className="text-amber-400">{sel.optionName}</strong></span>
                      <span>{sel.marketName}</span>
                    </div>
                  </div>
                ))}

                {/* Stake Input & Payout Calculation */}
                <div className="pt-2 border-t border-kb-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-kb-secondary">Total Odds:</span>
                    <span className="font-bold text-kb-green">{totalOdds.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-kb-secondary font-semibold text-xs">Stake (Points):</span>
                    <input
                      type="number"
                      value={stakeInput}
                      onChange={(e) => setStakeInput(Math.max(1, Number(e.target.value)))}
                      className="w-24 bg-kb-deep border border-kb-border rounded px-2 py-1 text-right text-xs font-bold text-white focus:outline-none focus:border-kb-green"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-kb-border">
                    <span className="text-kb-primary">Potential Payout:</span>
                    <span className="text-kb-green text-sm font-black">
                      {potentialWin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    onClick={async () => {
                      if (onPlaceBet && activeSelections.length > 0) {
                        let success = true;
                        for (const sel of activeSelections) {
                          const ok = await onPlaceBet(sel, Math.round(stakeInput / activeSelections.length));
                          if (!ok) {
                            success = false;
                            break;
                          }
                        }
                        if (success) {
                          setPlacedBetSuccess(true);
                          if (propOnClearAll) propOnClearAll();
                          setTimeout(() => setPlacedBetSuccess(false), 3000);
                        }
                      }
                    }}
                    className="w-full py-2.5 rounded bg-kb-green hover:bg-kb-green-d text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
                  >
                    PLACE BET NOW
                  </button>

                  {placedBetSuccess && (
                    <div className="text-center text-[11px] text-kb-green font-bold animate-pulse">
                      ✓ Bet placed successfully!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Book & Check Bet Fields matching Bet9ja screenshot 2 */}
            <div className="pt-3 border-t border-kb-border space-y-3 text-[11px]">
              <div>
                <div className="font-bold text-kb-secondary mb-1">Book:</div>
                <div className="text-[10px] text-kb-secondary mb-1">
                  Please insert a booking number below.
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                    placeholder="e.g. B9J-2025-998"
                    className="flex-1 bg-kb-deep border border-kb-border rounded px-2 py-1 text-xs text-white placeholder-kb-placeholder focus:outline-none focus:border-kb-green"
                  />
                  <button
                    onClick={() => alert(`Booking code ${bookingCode || 'B9J-2025-998'} loaded!`)}
                    className="bg-kb-green hover:bg-kb-green-d text-white font-extrabold px-3 py-1 rounded transition-colors"
                  >
                    Book:
                  </button>
                </div>
              </div>

              <div>
                <div className="font-bold text-kb-secondary mb-1">Check bet:</div>
                <div className="text-[10px] text-kb-secondary mb-1">
                  Insert a valid Bet ID to check status.
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={checkBetId}
                    onChange={(e) => setCheckBetId(e.target.value)}
                    placeholder="e.g. #ORD-2025-001"
                    className="flex-1 bg-kb-deep border border-kb-border rounded px-2 py-1 text-xs text-white placeholder-kb-placeholder focus:outline-none focus:border-kb-green"
                  />
                  <button
                    onClick={() => alert(`Bet #${checkBetId || 'ORD-2025-001'} is Pending / Active!`)}
                    className="bg-kb-green hover:bg-kb-green-d text-white font-extrabold px-3 py-1 rounded transition-colors"
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Bet Card matching Bet9ja screenshot 2 right panel */}
        <div className="bg-kb-card border border-kb-border rounded-lg p-3 space-y-2 shadow-xl">
          <div className="flex items-center justify-between border-b border-kb-border pb-1.5">
            <span className="font-extrabold text-kb-green text-xs">PSV - Sittard 8.00</span>
            <button
              onClick={() => matches[0] && onSelectOdd(matches[0], 'Featured Combo', 'PSV Special', 8.00)}
              className="text-[10px] font-extrabold text-white underline hover:text-kb-green"
            >
              Add to Bet
            </button>
          </div>

          <div className="space-y-1 text-[11px] text-kb-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-kb-green"></span>
              <span>PSV To Win</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-kb-green"></span>
              <span>Dennis Man to Assist</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-kb-green"></span>
              <span>Isaac Babadi to Score</span>
            </div>
          </div>

          <div className="pt-2 border-t border-kb-border flex items-center justify-between text-xs font-bold">
            <span className="text-kb-secondary">Pot. Win:</span>
            <span className="text-kb-green font-black text-sm">4,000.00</span>
          </div>

          <div className="flex gap-1.5 pt-1">
            <div className="bg-kb-deep border border-kb-border rounded px-2 py-1 text-xs font-bold text-kb-primary flex items-center gap-1">
              <span>₦</span> <span>500</span>
            </div>
            <button
              onClick={() => matches[0] && onSelectOdd(matches[0], 'Featured Combo', 'PSV Special', 8.00)}
              className="flex-1 py-1.5 rounded bg-kb-green hover:bg-kb-green-d text-white font-extrabold text-xs uppercase tracking-wider transition-all text-center shadow"
            >
              BOOK A BET
            </button>
          </div>
        </div>

        {/* Telegram/WhatsApp Contact Banner matching Bet9ja screenshot 2 right */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-[#00b050] to-[#04331d] text-white border border-kb-green/50 shadow-xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-black tracking-wider uppercase">CONTACT US!</div>
            <div className="text-[10px] text-slate-100">24/7 Official KingsBet Support</div>
          </div>
          <Send className="w-6 h-6 stroke-[2.5] text-white" />
        </div>
      </aside>
    </div>
  );
};
