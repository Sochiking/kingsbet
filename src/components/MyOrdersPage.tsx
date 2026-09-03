import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Coins,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { BetOrder } from '../types';

interface MyOrdersPageProps {
  orders: BetOrder[];
  onBack: () => void;
  onOpenTracker?: (matchId: string) => void;
  onCashoutOrder?: (orderId: string, cashoutAmount: number) => void;
}

export const MyOrdersPage: React.FC<MyOrdersPageProps> = ({
  orders,
  onBack,
  onOpenTracker,
  onCashoutOrder,
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Won' | 'Lost' | 'Cancelled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.matchTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.selection.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin" /> Pending / In-Play
          </span>
        );
      case 'Won':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-kb-green/20 text-kb-green border border-kb-green/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-kb-green" /> Won
          </span>
        );
      case 'Lost':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Lost
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-500/20 text-kb-secondary border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20 text-xs font-sans select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-kb-card border border-kb-border text-kb-secondary hover:text-white transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Betting
        </button>

        <h1 className="text-lg font-black text-white uppercase tracking-wider">
          My Bets History & Coupon Check
        </h1>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-kb-card border border-kb-border rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['All', 'Pending', 'Won', 'Lost', 'Cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap uppercase tracking-wider ${
                  statusFilter === st
                    ? 'bg-kb-green text-white shadow-lg'
                    : 'bg-kb-elevated text-kb-secondary hover:bg-kb-hover'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Coupon ID / Match..."
              className="w-full bg-kb-deep border border-kb-border rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-kb-green"
            />
            <Search className="w-3.5 h-3.5 text-kb-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3 pt-1">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-kb-secondary text-xs">
              No bets found matching criteria.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const matchId = order.matchId || 'match-mci-liv';
              const cashoutValue = Math.round(order.stake * (order.odds * 0.85));

              return (
                <div
                  key={order.id}
                  className="bg-kb-elevated border border-kb-border/90 rounded-xl p-4 space-y-3 hover:border-kb-green/40 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between border-b border-kb-border pb-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-white flex items-center gap-2">
                        <span>{order.id}</span>
                        {getBadge(order.status)}
                      </div>
                      <div className="text-[10px] text-kb-secondary">{order.timestamp}</div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-kb-secondary">Total Odds: </span>
                      <span className="text-sm font-black text-kb-yellow">{order.odds.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-kb-secondary text-[11px]">Match: </span>
                      <strong className="text-white font-bold">{order.matchTitle}</strong>
                    </div>

                    <div>
                      <span className="text-kb-secondary text-[11px]">Selection: </span>
                      <strong className="text-amber-400 font-bold">{order.selection}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-kb-border/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="space-x-1">
                      <span className="text-kb-secondary">Stake:</span>
                      <strong className="text-white font-black">₦{order.stake.toLocaleString()}</strong>
                    </div>

                    <div>
                      <span className="text-kb-secondary mr-1">
                        {order.status === 'Won' ? 'Won Amount:' : 'Potential Win:'}
                      </span>
                      <strong className="text-kb-green font-black text-sm">
                        ₦
                        {order.status === 'Won'
                          ? (order.wonAmount || order.potentialWin).toLocaleString()
                          : order.potentialWin.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Actions Bar for Active / Pending Bets */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-kb-border">
                    {onOpenTracker && (
                      <button
                        onClick={() => onOpenTracker(matchId)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/40 text-[11px] font-black uppercase transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Watch Live Match
                      </button>
                    )}

                    {order.status === 'Pending' && onCashoutOrder && (
                      <button
                        onClick={() => onCashoutOrder(order.id, cashoutValue)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1 shadow"
                      >
                        <Coins className="w-3.5 h-3.5" /> Cash Out ₦{cashoutValue.toLocaleString()}
                      </button>
                    )}

                    <button
                      onClick={() =>
                        setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                      }
                      className="text-[10px] font-bold text-kb-secondary hover:text-white flex items-center gap-1 ml-auto"
                    >
                      <span>Details</span>
                      {expandedOrderId === order.id ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {expandedOrderId === order.id && (
                    <div className="p-3 bg-kb-deep rounded-lg text-[11px] text-kb-secondary space-y-1 font-mono">
                      <div>User ID: <strong>{order.userId || 'usr_john'}</strong></div>
                      <div>User Email: <strong>{order.userEmail || 'john.doe@example.com'}</strong></div>
                      <div>Booking Coupon Code: <strong className="text-kb-green">{order.bookingCode || 'KB-89421'}</strong></div>
                      <div>Validation: <strong className="text-amber-400">KINGSBET-SECURE-STAMP-OK</strong></div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

