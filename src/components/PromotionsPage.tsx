import React from 'react';
import { Gift, Flame, ShieldAlert, Zap, Award, ArrowRight } from 'lucide-react';

interface PromotionsPageProps {
  onOpenDeposit: () => void;
}

export const PromotionsPage: React.FC<PromotionsPageProps> = ({ onOpenDeposit }) => {
  const promos = [
    {
      id: 'welcome',
      title: '100% Welcome Bonus up to ₦100,000',
      description: 'Double your first deposit instantly. Get up to ₦100,000 extra bonus funds to place bets across all sports.',
      icon: Gift,
      color: 'from-amber-600/30 to-amber-900/40 border-amber-500/50 text-amber-400',
      tag: 'New Players',
    },
    {
      id: 'combo',
      title: '225% Multiple Boost',
      description: 'Add 5 or more selections to your betslip and boost your accumulator winnings up to 225% extra cash payout!',
      icon: Flame,
      color: 'from-emerald-600/30 to-emerald-900/40 border-emerald-500/50 text-kb-green',
      tag: 'Accumulator',
    },
    {
      id: 'cut1',
      title: 'Cut 1 Insurance - Money Back!',
      description: 'If 1 match cuts your accumulator bet slip, KingsBet refunds your stake up to ₦50,000.',
      icon: ShieldAlert,
      color: 'from-blue-600/30 to-blue-900/40 border-blue-500/50 text-blue-400',
      tag: 'Protection',
    },
    {
      id: 'early_payout',
      title: '2 Goals Ahead - Early Payout',
      description: 'If the team you back goes 2 goals ahead at any point in the match, your bet is settled as a WIN instantly!',
      icon: Zap,
      color: 'from-purple-600/30 to-purple-900/40 border-purple-500/50 text-purple-400',
      tag: 'Instant Settled',
    },
  ];

  return (
    <div className="space-y-4 font-sans text-xs pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#171a21] to-[#12151a] border border-kb-green/40 rounded-2xl p-6 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-kb-green/20 text-kb-green border border-kb-green/30 text-[10px] font-black uppercase">
          <Award className="w-3.5 h-3.5" /> KingsBet Special Offers
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Promotions & Bonuses (₦)
        </h1>
        <p className="text-kb-secondary text-xs">
          Take advantage of Nigeria's highest sports betting bonuses and accumulator boosts.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map((p) => {
          const IconComp = p.icon;
          return (
            <div
              key={p.id}
              className={`bg-gradient-to-br ${p.color} border rounded-2xl p-5 space-y-3 shadow-xl relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-black/40 border border-white/10 text-white">
                    {p.tag}
                  </span>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">{p.title}</h3>
                <p className="text-kb-secondary text-xs leading-relaxed">{p.description}</p>
              </div>

              <button
                onClick={onOpenDeposit}
                className="w-full py-2.5 mt-2 rounded-xl bg-kb-green hover:bg-kb-green-d text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Claim Bonus Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
