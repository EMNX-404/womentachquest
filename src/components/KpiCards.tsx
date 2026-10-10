import React from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, Sun, ShieldCheck, Zap } from 'lucide-react';

interface KpiCardsProps {
  totalBilled: number;
  totalUnits: number;
  totalSolarCredits: number;
  billCount: number;
  onCardClick?: (metric: string) => void;
  theme?: 'dark' | 'light';
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  totalBilled,
  totalUnits,
  totalSolarCredits,
  billCount,
  onCardClick,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Card 1: Total Billed */}
      <div
        onClick={() => onCardClick?.('billed')}
        className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer group shadow-xl border relative overflow-hidden ${
          isDark
            ? 'bg-[#131626] hover:bg-[#181D33] border-[#22293F] hover:border-amber-500/50 hover:shadow-amber-500/10'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-400 hover:shadow-2xl shadow-slate-200/60'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Total Billed Due
          </span>
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-[#1F253C] group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400'
                : 'bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-700'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <h2
            className={`text-3xl lg:text-4xl font-black font-mono tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            PKR {totalBilled.toLocaleString()}
          </h2>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <TrendingUp className="w-3.5 h-3.5" /> +4.2%
          </span>
          <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-600 font-medium'}>all accounts combined</span>
        </div>
      </div>

      {/* Card 2: Units Consumed */}
      <div
        onClick={() => onCardClick?.('units')}
        className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer group shadow-xl border relative overflow-hidden ${
          isDark
            ? 'bg-[#131626] hover:bg-[#181D33] border-[#22293F] hover:border-cyan-500/50 hover:shadow-cyan-500/10'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-cyan-400 hover:shadow-2xl shadow-slate-200/60'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 to-teal-500" />
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Energy Consumed
          </span>
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-[#1F253C] group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400'
                : 'bg-slate-100 group-hover:bg-cyan-100 text-slate-600 group-hover:text-cyan-700'
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <h2
            className={`text-3xl lg:text-4xl font-black font-mono tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {totalUnits.toLocaleString()}
            <span
              className={`text-lg lg:text-xl font-bold ml-1.5 ${
                isDark ? 'text-cyan-400' : 'text-cyan-700'
              }`}
            >
              kWh
            </span>
          </h2>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-black text-cyan-400 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
            <TrendingDown className="w-3.5 h-3.5" /> TOU Metered
          </span>
          <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-600 font-medium'}>peak & off-peak</span>
        </div>
      </div>

      {/* Card 3: Solar Net Credits */}
      <div
        onClick={() => onCardClick?.('solar')}
        className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer group shadow-xl border relative overflow-hidden ${
          isDark
            ? 'bg-[#131626] hover:bg-[#181D33] border-[#22293F] hover:border-emerald-500/50 hover:shadow-emerald-500/10'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-400 hover:shadow-2xl shadow-slate-200/60'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500" />
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Solar Surplus Credits
          </span>
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-[#1F253C] group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-400'
                : 'bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700'
            }`}
          >
            <Sun className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <h2 className="text-3xl lg:text-4xl font-black text-emerald-400 font-mono tracking-tight">
            PKR {Math.abs(totalSolarCredits).toLocaleString()}
          </h2>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-black text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Prosumer Net
          </span>
          <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-600 font-medium'}>active solar accounts</span>
        </div>
      </div>

      {/* Card 4: Bills Processed */}
      <div
        onClick={() => onCardClick?.('verified')}
        className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer group shadow-xl border relative overflow-hidden ${
          isDark
            ? 'bg-[#131626] hover:bg-[#181D33] border-[#22293F] hover:border-amber-500/50 hover:shadow-amber-500/10'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-400 hover:shadow-2xl shadow-slate-200/60'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500" />
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Evaluated Meters
          </span>
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-[#1F253C] group-hover:bg-purple-500/20 text-slate-400 group-hover:text-purple-400'
                : 'bg-slate-100 group-hover:bg-purple-100 text-slate-600 group-hover:text-purple-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <h2
            className={`text-3xl lg:text-4xl font-black font-mono tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {billCount}
            <span
              className={`text-lg lg:text-xl font-normal ml-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Bills
            </span>
          </h2>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-black text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            KE · LESCO · IESCO
          </span>
          <span className={isDark ? 'text-slate-400 font-medium' : 'text-slate-600 font-medium'}>100% audited math</span>
        </div>
      </div>
    </div>
  );
};
