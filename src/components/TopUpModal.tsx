import React, { useState } from 'react';
import { Wallet, X, CheckCircle2, CreditCard, Building2, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: (amount: number) => Promise<boolean>;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  onTopUp,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'opay' | 'ussd'>('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const actualAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handleDepositConfirm = async () => {
    if (actualAmount <= 0) return;
    setLoading(true);
    const ok = await onTopUp(actualAmount);
    setLoading(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }
  };

  const presetAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

  return (
    <div className="fixed inset-0 z-50 bg-kb-base/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-kb-card border border-kb-green/40 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative text-kb-primary font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-kb-secondary hover:text-kb-primary hover:bg-kb-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-center">
          <div className="w-12 h-12 rounded-xl bg-kb-green/10 text-kb-green border border-kb-green/30 mx-auto flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-kb-primary uppercase tracking-wider">Deposit Funds (₦)</h2>
          <p className="text-xs text-kb-secondary">
            Add real money to your KingsBet wallet to place bets and win instantly.
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold uppercase text-kb-secondary tracking-wider">
            Select Deposit Method
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${
                paymentMethod === 'card'
                  ? 'bg-[#00b050]/20 border-[#00b050] text-[#00b050]'
                  : 'bg-[#20252e] border-slate-700/80 text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bank')}
              className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${
                paymentMethod === 'bank'
                  ? 'bg-[#00b050]/20 border-[#00b050] text-[#00b050]'
                  : 'bg-[#20252e] border-slate-700/80 text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Transfer</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('opay')}
              className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${
                paymentMethod === 'opay'
                  ? 'bg-[#00b050]/20 border-[#00b050] text-[#00b050]'
                  : 'bg-[#20252e] border-slate-700/80 text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>OPay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('ussd')}
              className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${
                paymentMethod === 'ussd'
                  ? 'bg-[#00b050]/20 border-[#00b050] text-[#00b050]'
                  : 'bg-[#20252e] border-slate-700/80 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>USSD</span>
            </button>
          </div>
        </div>

        {/* Quick Amount Grid */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-kb-secondary tracking-wider">
              Quick Amount (₦)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount('');
                }}
                className={`p-2.5 rounded-lg border text-center transition-all flex items-center justify-center font-black text-xs ${
                  selectedAmount === amt && !customAmount
                    ? 'bg-kb-green border-kb-green text-white shadow-lg'
                    : 'bg-kb-elevated border-kb-border text-kb-secondary hover:text-kb-primary'
                }`}
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-kb-secondary">Custom Amount (₦)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₦</span>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-kb-deep border border-kb-border rounded-lg pl-8 pr-3 py-2 text-sm font-bold text-kb-primary focus:outline-none focus:border-kb-green"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDepositConfirm}
          disabled={loading || actualAmount <= 0}
          className="w-full py-3.5 rounded-xl bg-kb-green hover:bg-kb-green-d text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            'Processing Instant Deposit...'
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" /> Deposited ₦{actualAmount.toLocaleString()} Successfully!
            </>
          ) : (
            <>
              <span>Deposit ₦{actualAmount.toLocaleString()} Now</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-kb-muted flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-kb-green" /> 256-Bit Bank Grade SSL Encrypted Payment Gateway
        </p>
      </div>
    </div>
  );
};

