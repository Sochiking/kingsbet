import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-kb-card text-kb-secondary border-t-2 border-kb-green relative overflow-hidden text-xs">
      {/* Nigeria Map Watermark SVG positioned on the far right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-end pr-8">
        <svg viewBox="0 0 500 450" className="w-96 h-96 fill-current">
          <path d="M120,40 L180,30 L260,20 L350,30 L420,70 L480,120 L450,200 L420,260 L380,330 L320,380 L250,420 L180,440 L120,400 L80,340 L50,280 L30,220 L20,160 L50,100 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Left Navigation Links */}
          <div className="md:col-span-5 space-y-4">
            <div className="text-lg font-black tracking-tighter text-kb-primary">
              KINGS<span className="text-kb-green">BET</span>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-kb-secondary">
              <a href="#home" className="hover:text-kb-green transition-colors">Home</a>
              <a href="#terms" className="hover:text-kb-green transition-colors">Terms &amp; Conditions</a>
              <a href="#about" className="hover:text-kb-green transition-colors">About us</a>
              <a href="#responsible" className="hover:text-kb-green transition-colors">Responsible Gambling</a>
              <a href="#agent" className="hover:text-kb-green transition-colors">Become an Agent</a>
              <a href="#privacy" className="hover:text-kb-green transition-colors">Privacy</a>
              <a href="#contact" className="hover:text-kb-green transition-colors">Contact us</a>
              <span></span>
              <a href="#results" className="hover:text-kb-green transition-colors">Results</a>
              <span></span>
              <a href="#affiliates" className="hover:text-kb-green transition-colors">Web Affiliates</a>
            </div>
          </div>

          {/* Center NDPR Compliance Badge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-kb-elevated border border-kb-border text-center space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-kb-primary font-bold">
              <ShieldCheck className="w-7 h-7 text-kb-green" />
              <div className="text-left leading-tight">
                <div className="text-sm font-black tracking-wide uppercase">NDPR Audit</div>
                <div className="text-[10px] text-kb-muted">COMPLIANT 2025</div>
              </div>
            </div>
            <p className="text-[11px] text-kb-secondary max-w-xs">
              Licensed &amp; regulated by National Lotteries Regulatory Commission &amp; Lagos State Lotteries Board.
            </p>
          </div>

          {/* Right Social Links */}
          <div className="md:col-span-3 flex flex-col items-start md:items-end space-y-4">
            <div className="text-xs font-bold text-kb-primary uppercase tracking-wider">Follow Us</div>
            <div className="flex items-center gap-3">
              <a href="#facebook" className="w-9 h-9 rounded-full bg-kb-elevated hover:bg-kb-green hover:text-white flex items-center justify-center transition-all border border-kb-border text-kb-secondary text-[10px]">
                FB
              </a>
              <a href="#twitter" className="w-9 h-9 rounded-full bg-kb-elevated hover:bg-kb-green hover:text-white flex items-center justify-center transition-all border border-kb-border text-kb-secondary text-[10px]">
                TW
              </a>
              <a href="#instagram" className="w-9 h-9 rounded-full bg-kb-elevated hover:bg-kb-green hover:text-white flex items-center justify-center transition-all border border-kb-border text-kb-secondary text-[10px]">
                IG
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Payment Provider Icons Bar */}
        <div className="mt-8 pt-6 border-t border-kb-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-kb-secondary">
          <div className="flex flex-wrap items-center gap-4 opacity-90">
            <span className="font-extrabold text-kb-primary text-xs tracking-wider">VISA</span>
            <span className="font-extrabold text-kb-primary text-xs tracking-wider">mastercard</span>
            <span className="font-bold text-kb-secondary">interswitch</span>
            <span className="font-bold text-kb-secondary">OPay</span>
            <span className="font-bold text-kb-secondary">Flutterwave</span>
            <span className="font-bold text-kb-secondary">Monnify</span>
            <span className="font-bold text-kb-secondary">Unity Bank</span>
          </div>

          <div className="flex items-center gap-2">
            <span>© KingsBet. All rights reserved</span>
            <span className="w-5 h-5 rounded-full bg-red-600 text-white font-extrabold text-[9px] flex items-center justify-center border border-red-400">
              18+
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
