import React from 'react';
import {
  Coins,
  Plus,
  Receipt,
  BookmarkCheck,
  Wallet,
  User,
  ChevronRight,
  Share2,
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, BetOrder, League } from '../types';

interface UserDashboardPageProps {
  user: UserProfile | null;
  orders: BetOrder[];
  leagues: League[];
  onOpenTopUp: () => void;
  onNavigate: (view: 'home' | 'match' | 'dashboard' | 'orders' | 'admin') => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  user,
  orders,
  leagues,
  onOpenTopUp,
  onNavigate,
}) => {
  if (!user) return null;

  const recentOrders = orders.slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'Won':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-kb-green/20 text-kb-green border border-kb-green/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Won
          </span>
        );
      case 'Lost':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Lost
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-kb-secondary border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto text-xs font-sans select-none">
      {/* Top Welcome Title Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-wide">My KingsBet Dashboard</h1>
          <p className="text-[11px] text-kb-secondary">Welcome back, {user.name}!</p>
        </div>

        <button className="p-2.5 rounded-lg bg-kb-card border border-kb-border text-kb-secondary hover:text-white transition-colors relative">
          <Bell className="w-4 h-4 text-kb-green" />
          <span className="w-2 h-2 rounded-full bg-kb-yellow absolute top-2 right-2 animate-ping"></span>
        </button>
      </div>

      {/* Demo Points Balance Card matching Bet9ja dashboard style */}
      <div className="bg-kb-card border border-kb-border rounded-lg p-5 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-kb-secondary uppercase tracking-wider">Demo Points Balance</div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-white tracking-tight">
              {user.demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <Coins className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <button
          onClick={onOpenTopUp}
          className="w-full sm:w-auto px-5 py-2.5 rounded bg-kb-green hover:bg-kb-green-d text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Top Up (Demo Points)
        </button>
      </div>

      {/* Quick Navigation 4-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigate('orders')}
          className="p-3.5 rounded-lg bg-kb-card border border-kb-border hover:border-kb-green/50 transition-all flex flex-col items-center gap-2 group text-center"
        >
          <div className="p-2 rounded bg-kb-elevated text-kb-green group-hover:scale-110 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-kb-primary group-hover:text-white">My Orders</span>
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="p-3.5 rounded-lg bg-kb-card border border-kb-border hover:border-kb-green/50 transition-all flex flex-col items-center gap-2 group text-center"
        >
          <div className="p-2 rounded bg-kb-elevated text-kb-yellow group-hover:scale-110 transition-transform">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-kb-primary group-hover:text-white">My Selections</span>
        </button>

        <button
          onClick={onOpenTopUp}
          className="p-3.5 rounded-lg bg-kb-card border border-kb-border hover:border-kb-green/50 transition-all flex flex-col items-center gap-2 group text-center"
        >
          <div className="p-2 rounded bg-kb-elevated text-amber-400 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-kb-primary group-hover:text-white">Wallet</span>
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="p-3.5 rounded-lg bg-kb-card border border-kb-border hover:border-kb-green/50 transition-all flex flex-col items-center gap-2 group text-center"
        >
          <div className="p-2 rounded bg-kb-elevated text-cyan-400 group-hover:scale-110 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-kb-primary group-hover:text-white">Profile</span>
        </button>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-white uppercase tracking-wider">Recent Bets & Orders</h2>
          <button
            onClick={() => onNavigate('orders')}
            className="text-[11px] font-bold text-kb-green hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onNavigate('orders')}
              className="p-3.5 rounded-lg bg-kb-card border border-kb-border hover:border-kb-border transition-all flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span>{order.id}</span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-[11px] text-kb-secondary">{order.timestamp}</div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-white">
                  {order.stake.toFixed(2)} Points
                </div>
                <div className="text-[11px] text-kb-secondary">
                  {order.status === 'Won' ? `Won: ${order.wonAmount?.toFixed(2)}` : `Est: ${order.potentialWin.toFixed(2)}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Friends Banner */}
      <div className="p-4 rounded-lg bg-kb-card border border-kb-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="text-xs font-bold text-kb-green uppercase tracking-wider">Invite Friends to KingsBet</div>
          <div className="text-[11px] text-kb-secondary">
            Earn demo points bonus by sharing your link with friends!
          </div>
        </div>

        <button
          onClick={() => alert('Invite link copied to clipboard!')}
          className="px-4 py-2 rounded bg-kb-green hover:bg-kb-green-d text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap shadow"
        >
          <Share2 className="w-3.5 h-3.5" /> Invite Now
        </button>
      </div>
    </div>
  );
};
