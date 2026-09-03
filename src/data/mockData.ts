import { League, Match, BetOrder, UserProfile, AdminAnalytics } from '../types';

export const INITIAL_LEAGUES: League[] = [
  {
    id: 'epl',
    name: 'Premier League',
    country: 'England',
    icon: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    badgeBg: 'bg-purple-900/60 text-purple-300 border-purple-700/50',
  },
  {
    id: 'laliga',
    name: 'La Liga',
    country: 'Spain',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_EA_Sports_2023_Logo.svg',
    badgeBg: 'bg-red-900/60 text-red-300 border-red-700/50',
  },
  {
    id: 'seriea',
    name: 'Serie A',
    country: 'Italy',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2019.svg',
    badgeBg: 'bg-blue-900/60 text-blue-300 border-blue-700/50',
  },
  {
    id: 'ucl',
    name: 'Champions League',
    country: 'Europe',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/UEFA_Champions_League_logo_2024.svg',
    badgeBg: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany',
    icon: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg',
    badgeBg: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
  },
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-mci-liv',
    leagueId: 'epl',
    leagueName: 'Premier League',
    leagueRound: 'Round 38',
    sport: 'Football',
    homeTeam: {
      id: 'mci',
      name: 'Manchester City',
      logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
      score: 1,
    },
    awayTeam: {
      id: 'liv',
      name: 'Liverpool',
      logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
      score: 1,
    },
    status: 'LIVE',
    timeDisplay: '15:00 Today',
    dateDisplay: 'May 25, 2025',
    stadium: 'Etihad Stadium Manchester',
    referee: 'A. Taylor',
    markets: {
      oneXtwo: {
        id: '1x2',
        title: '1x2',
        options: [
          { id: '1', name: '1', odds: 2.10 },
          { id: 'x', name: 'X', odds: 3.40 },
          { id: '2', name: '2', odds: 3.10 },
        ],
      },
      doubleChance: {
        id: 'dc',
        title: 'Double Chance',
        options: [
          { id: '1x', name: '1X', odds: 1.30 },
          { id: '12', name: '12', odds: 1.28 },
          { id: 'x2', name: 'X2', odds: 1.65 },
        ],
      },
      overUnder: {
        id: 'ou25',
        title: 'Over/Under',
        options: [
          { id: 'o25', name: 'Over 2.5', odds: 1.85 },
          { id: 'u25', name: 'Under 2.5', odds: 1.95 },
        ],
      },
      bothTeamsToScore: {
        id: 'btts',
        title: 'Both Teams to Score',
        options: [
          { id: 'btts_yes', name: 'Yes', odds: 1.70 },
          { id: 'btts_no', name: 'No', odds: 2.05 },
        ],
      },
    },
  },
  {
    id: 'match-rma-bar',
    leagueId: 'laliga',
    leagueName: 'La Liga',
    leagueRound: 'Round 32',
    sport: 'Football',
    homeTeam: {
      id: 'rma',
      name: 'Real Madrid',
      logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
      score: 2,
    },
    awayTeam: {
      id: 'bar',
      name: 'Barcelona',
      logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crc%29.svg',
      score: 2,
    },
    status: 'FINISHED',
    timeDisplay: '17:30 Today',
    dateDisplay: 'May 24, 2025',
    stadium: 'Santiago Bernabéu Madrid',
    referee: 'C. Del Cerro',
    markets: {
      oneXtwo: {
        id: '1x2',
        title: '1x2',
        options: [
          { id: '1', name: '1', odds: 2.45 },
          { id: 'x', name: 'X', odds: 3.60 },
          { id: '2', name: '2', odds: 2.80 },
        ],
      },
      doubleChance: {
        id: 'dc',
        title: 'Double Chance',
        options: [
          { id: '1x', name: '1X', odds: 1.40 },
          { id: '12', name: '12', odds: 1.25 },
          { id: 'x2', name: 'X2', odds: 1.55 },
        ],
      },
    },
  },
  {
    id: 'match-ars-che',
    leagueId: 'epl',
    leagueName: 'Premier League',
    leagueRound: 'Round 38',
    sport: 'Football',
    homeTeam: {
      id: 'ars',
      name: 'Arsenal',
      logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
      score: 3,
    },
    awayTeam: {
      id: 'che',
      name: 'Chelsea',
      logo: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
      score: 1,
    },
    status: 'FINISHED',
    timeDisplay: '20:00 Today',
    dateDisplay: 'May 23, 2025',
    stadium: 'Emirates Stadium London',
    referee: 'M. Oliver',
    markets: {
      oneXtwo: {
        id: '1x2',
        title: '1x2',
        options: [
          { id: '1', name: '1', odds: 2.30 },
          { id: 'x', name: 'X', odds: 3.30 },
          { id: '2', name: '2', odds: 3.20 },
        ],
      },
    },
  },
  {
    id: 'match-bay-dor',
    leagueId: 'bundesliga',
    leagueName: 'Bundesliga',
    leagueRound: 'Round 34',
    sport: 'Football',
    homeTeam: {
      id: 'bay',
      name: 'Bayern Munich',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
    },
    awayTeam: {
      id: 'dor',
      name: 'Borussia Dortmund',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
    },
    status: 'UPCOMING',
    timeDisplay: '18:30 Tomorrow',
    dateDisplay: 'May 26, 2025',
    stadium: 'Allianz Arena Munich',
    referee: 'F. Brych',
    markets: {
      oneXtwo: {
        id: '1x2',
        title: '1x2',
        options: [
          { id: '1', name: '1', odds: 1.70 },
          { id: 'x', name: 'X', odds: 4.10 },
          { id: '2', name: '2', odds: 4.50 },
        ],
      },
    },
  },
  {
    id: 'match-int-juv',
    leagueId: 'seriea',
    leagueName: 'Serie A',
    leagueRound: 'Round 36',
    sport: 'Football',
    homeTeam: {
      id: 'int',
      name: 'Inter Milan',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
    },
    awayTeam: {
      id: 'juv',
      name: 'Juventus',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/bc/Juventus_FC_2017_icon_%28black%29.svg',
    },
    status: 'UPCOMING',
    timeDisplay: '20:45 Tomorrow',
    dateDisplay: 'May 26, 2025',
    stadium: 'San Siro Milan',
    referee: 'D. Orsato',
    markets: {
      oneXtwo: {
        id: '1x2',
        title: '1x2',
        options: [
          { id: '1', name: '1', odds: 1.95 },
          { id: 'x', name: 'X', odds: 3.25 },
          { id: '2', name: '2', odds: 3.80 },
        ],
      },
    },
  },
];

export const INITIAL_ORDERS: BetOrder[] = [
  {
    id: '#ORD-2025-001',
    timestamp: 'May 25, 2025 • 14:45',
    matchTitle: 'Manchester City vs Liverpool',
    selection: 'Manchester City (1)',
    odds: 2.10,
    stake: 250.00,
    potentialWin: 525.00,
    status: 'Pending',
    userId: 'usr_john',
    userEmail: 'john.doe@example.com',
  },
  {
    id: '#ORD-2025-002',
    timestamp: 'May 24, 2025 • 18:30',
    matchTitle: 'Real Madrid vs Barcelona',
    selection: 'Draw (X)',
    odds: 3.40,
    stake: 200.00,
    potentialWin: 680.00,
    wonAmount: 680.00,
    status: 'Won',
    userId: 'usr_john',
    userEmail: 'john.doe@example.com',
  },
  {
    id: '#ORD-2025-000',
    timestamp: 'May 23, 2025 • 16:10',
    matchTitle: 'Arsenal vs Chelsea',
    selection: 'Chelsea (2)',
    odds: 3.20,
    stake: 300.00,
    potentialWin: 960.00,
    wonAmount: 0.00,
    status: 'Lost',
    userId: 'usr_john',
    userEmail: 'john.doe@example.com',
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_john',
  name: 'John',
  email: 'john.doe@example.com',
  demoBalance: 1250.00,
  joinedDate: 'Jan 2025',
};

export const INITIAL_ANALYTICS: AdminAnalytics = {
  totalUsers: 12458,
  totalUsersChange: 12.5,
  totalMatches: 324,
  totalMatchesChange: 8.3,
  totalOrders: 5186,
  totalOrdersChange: 15.2,
  totalDemoPoints: 1245800,
  totalDemoPointsChange: 9.5,
  ordersChartData: [
    { day: 'May 19', orders: 480 },
    { day: 'May 20', orders: 620 },
    { day: 'May 21', orders: 580 },
    { day: 'May 22', orders: 810 },
    { day: 'May 23', orders: 950 },
    { day: 'May 24', orders: 1210 },
    { day: 'May 25', orders: 1536 },
  ],
  ordersByStatus: [
    { name: 'Pending', value: 1520, color: '#f59e0b' },
    { name: 'Won', value: 2748, color: '#10b981' },
    { name: 'Lost', value: 918, color: '#ef4444' },
    { name: 'Cancelled', value: 0, color: '#6b7280' },
  ],
  topLeagues: [
    { name: 'Premier League', orderCount: 2245 },
    { name: 'La Liga', orderCount: 1538 },
    { name: 'Champions League', orderCount: 890 },
    { name: 'Serie A', orderCount: 513 },
  ],
};
