export type SportType = 'Football' | 'Basketball' | 'Tennis' | 'Esports' | 'Virtual' | 'Casino';

export type AppView = 
  | 'home' 
  | 'live' 
  | 'casino' 
  | 'virtual' 
  | 'promotions' 
  | 'betslip'
  | 'match' 
  | 'dashboard' 
  | 'orders' 
  | 'tracker' 
  | 'admin';

export interface League {
  id: string;
  name: string;
  country: string;
  icon: string;
  badgeBg?: string;
}

export interface MarketOption {
  id: string;
  name: string; // e.g. "1", "X", "2", "Over 2.5", "Yes"
  odds: number;
}

export interface MarketCategory {
  id: string;
  title: string;
  options: MarketOption[];
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'corner' | 'sub';
  team: 'home' | 'away';
  description: string;
}

export interface Match {
  id: string;
  leagueId: string;
  leagueName: string;
  leagueRound?: string;
  sport: SportType;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
    score?: number;
    possession?: number;
    shotsOnTarget?: number;
    corners?: number;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
    score?: number;
    possession?: number;
    shotsOnTarget?: number;
    corners?: number;
  };
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  currentMinute?: number;
  attackZone?: 'home_defense' | 'midfield' | 'away_attack' | 'home_attack' | 'penalty';
  timeDisplay: string; // e.g. "15:00 Today" or "64'"
  dateDisplay: string; // e.g. "May 25, 2025"
  stadium?: string;
  referee?: string;
  events?: MatchEvent[];
  markets: {
    oneXtwo?: MarketCategory;
    doubleChance?: MarketCategory;
    overUnder?: MarketCategory;
    bothTeamsToScore?: MarketCategory;
  };
}

export type OrderStatus = 'Pending' | 'Won' | 'Lost' | 'Cancelled';

export interface BetSelection {
  matchId: string;
  matchTitle: string; // e.g. "Manchester City vs Liverpool"
  leagueName: string;
  marketName: string; // e.g. "1x2"
  optionName: string; // e.g. "Manchester City (1)"
  odds: number;
}

export interface BetOrder {
  id: string; // e.g. "#KB-2025-001"
  timestamp: string; // e.g. "May 25, 2025 • 14:45"
  matchTitle: string;
  selection: string;
  odds: number;
  stake: number;
  potentialWin: number;
  wonAmount?: number;
  status: OrderStatus;
  userId?: string;
  userEmail?: string;
  matchId?: string;
  isAccumulator?: boolean;
  selectionsCount?: number;
  bookingCode?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  demoBalance: number; // Wallet Balance in Naira (₦)
  joinedDate: string;
  accountNumber?: string;
  bankName?: string;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalUsersChange: number;
  totalMatches: number;
  totalMatchesChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  totalDemoPoints: number; // Total Wagering Volume in ₦
  totalDemoPointsChange: number;
  ordersChartData: Array<{ day: string; orders: number }>;
  ordersByStatus: Array<{ name: string; value: number; color: string }>;
  topLeagues: Array<{ name: string; orderCount: number }>;
}

