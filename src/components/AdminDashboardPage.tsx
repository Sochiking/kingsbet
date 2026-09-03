import React, { useState } from 'react';
import {
  Shield,
  Users,
  Trophy,
  Receipt,
  Coins,
  ArrowUpRight,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import { AdminAnalytics, BetOrder, Match } from '../types';

interface AdminDashboardPageProps {
  analytics: AdminAnalytics;
  orders: BetOrder[];
  matches: Match[];
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onExitAdmin: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  analytics,
  orders,
  matches,
  onUpdateOrderStatus,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Orders' | 'Matches' | 'Users'>('Overview');
  const [orderSearch, setOrderSearch] = useState('');

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.matchTitle.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-100 font-sans p-4 sm:p-6 space-y-6 text-xs select-none">
      {/* Top Admin Header */}
      <div className="bg-kb-card border border-kb-border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-kb-green text-white flex items-center justify-center font-black">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white uppercase tracking-wider">
              KingsBet Admin Control Panel
            </h1>
            <p className="text-[11px] text-kb-secondary">
              System Administration, Odds Engine & Order Settlement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-kb-surface px-3 py-1.5 rounded border border-kb-border text-xs font-bold text-kb-green">
            <span className="w-2 h-2 rounded-full bg-kb-green animate-pulse"></span>
            System Live
          </div>
          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit Admin
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-kb-card p-1 rounded-lg border border-kb-border font-bold text-kb-secondary">
        {(['Overview', 'Orders', 'Matches', 'Users'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded transition-all ${
              activeTab === tab
                ? 'bg-kb-green text-white font-black shadow'
                : 'hover:text-white hover:bg-kb-elevated'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Analytics Cards */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-kb-card border border-kb-border space-y-2">
              <div className="flex items-center justify-between text-kb-secondary text-[11px]">
                <span>Total Users</span>
                <Users className="w-4 h-4 text-kb-green" />
              </div>
              <div className="text-2xl font-black text-white">{analytics.totalUsers.toLocaleString()}</div>
              <div className="text-[10px] text-kb-green font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +{analytics.totalUsersChange}% this month
              </div>
            </div>

            <div className="p-4 rounded-lg bg-kb-card border border-kb-border space-y-2">
              <div className="flex items-center justify-between text-kb-secondary text-[11px]">
                <span>Total Matches</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{analytics.totalMatches}</div>
              <div className="text-[10px] text-kb-green font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +{analytics.totalMatchesChange}% active
              </div>
            </div>

            <div className="p-4 rounded-lg bg-kb-card border border-kb-border space-y-2">
              <div className="flex items-center justify-between text-kb-secondary text-[11px]">
                <span>Total Bet Orders</span>
                <Receipt className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-white">{analytics.totalOrders.toLocaleString()}</div>
              <div className="text-[10px] text-kb-green font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +{analytics.totalOrdersChange}% settled
              </div>
            </div>

            <div className="p-4 rounded-lg bg-kb-card border border-kb-border space-y-2">
              <div className="flex items-center justify-between text-kb-secondary text-[11px]">
                <span>Total Demo Points</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">{analytics.totalDemoPoints.toLocaleString()}</div>
              <div className="text-[10px] text-kb-green font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +{analytics.totalDemoPointsChange}% volume
              </div>
            </div>
          </div>

          {/* Quick Orders Table in Overview */}
          <div className="bg-kb-card border border-kb-border rounded-lg p-4 space-y-3">
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              Recent System Orders
            </h2>

            <div className="space-y-2">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded bg-kb-elevated border border-kb-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{o.id} • {o.matchTitle}</div>
                    <div className="text-[10px] text-kb-secondary">User: {o.userEmail || 'john.doe@example.com'}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-amber-400">{o.stake} Points</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        o.status === 'Won'
                          ? 'bg-kb-green/20 text-kb-green'
                          : o.status === 'Lost'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Settlement Tab */}
      {activeTab === 'Orders' && (
        <div className="bg-kb-card border border-kb-border rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              Settle Orders (Mark Won / Lost)
            </h2>
            <div className="relative w-64">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order ID or match..."
                className="w-full bg-kb-deep border border-kb-border rounded py-1 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-kb-green"
              />
              <Search className="w-3.5 h-3.5 text-kb-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded bg-kb-elevated border border-kb-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white text-xs">{ord.id} - {ord.matchTitle}</div>
                  <div className="text-[11px] text-kb-secondary">
                    Selection: <span className="text-amber-400 font-bold">{ord.selection}</span> @ {ord.odds.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-kb-muted">
                    Stake: {ord.stake} Points | Potential Payout: {ord.potentialWin.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Won')}
                    className="px-3 py-1.5 rounded bg-kb-green hover:bg-kb-green-d text-white font-extrabold text-[11px] flex items-center gap-1 transition-all shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Mark Won
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Lost')}
                    className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] flex items-center gap-1 transition-all shadow"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Mark Lost
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Pending')}
                    className="px-2.5 py-1.5 rounded bg-[#2a303c] text-kb-secondary hover:text-white font-bold text-[11px]"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matches Management Tab */}
      {activeTab === 'Matches' && (
        <div className="bg-kb-card border border-kb-border rounded-lg p-4 space-y-4">
          <h2 className="text-xs font-black text-white uppercase tracking-wider">
            Active Fixtures & Odds Settings
          </h2>

          <div className="space-y-2">
            {matches.map((m) => (
              <div key={m.id} className="p-3 rounded bg-kb-elevated border border-kb-border space-y-2">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{m.homeTeam.name} vs {m.awayTeam.name}</span>
                  <span className="text-amber-400 text-[11px]">{m.leagueName}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded bg-kb-deep">
                    <div className="text-kb-secondary">1 (Home)</div>
                    <div className="font-bold text-kb-green">{m.markets.oneXtwo?.options[0]?.odds || 2.10}</div>
                  </div>
                  <div className="p-2 rounded bg-kb-deep">
                    <div className="text-kb-secondary">X (Draw)</div>
                    <div className="font-bold text-kb-green">{m.markets.oneXtwo?.options[1]?.odds || 3.40}</div>
                  </div>
                  <div className="p-2 rounded bg-kb-deep">
                    <div className="text-kb-secondary">2 (Away)</div>
                    <div className="font-bold text-kb-green">{m.markets.oneXtwo?.options[2]?.odds || 3.10}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'Users' && (
        <div className="bg-kb-card border border-kb-border rounded-lg p-4 space-y-4">
          <h2 className="text-xs font-black text-white uppercase tracking-wider">
            User Accounts & Balance Overrides
          </h2>

          <div className="p-4 rounded bg-kb-elevated border border-kb-border flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">John Doe (Demo User)</div>
              <div className="text-kb-secondary text-[11px]">john.doe@example.com</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-kb-secondary">Demo Balance:</div>
              <div className="text-base font-black text-kb-green">1,250.00 Points</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
