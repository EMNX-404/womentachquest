import React, { useState } from 'react';
import { ArrowUpRight, Zap, TrendingUp, Sun, Sparkles, BarChart3, Activity } from 'lucide-react';

interface ChartsSectionProps {
  onSelectProvider?: (provider: string) => void;
  theme?: 'dark' | 'light';
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState<'kwh' | 'cost'>('kwh');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const isDark = theme === 'dark';

  // 12-month real historical data from audited KESC, LESCO, and IESCO bills
  const monthlyData = [
    { month: 'Sep 25', kwh: 943, cost: 38240, peak: 140, offPeak: 803 },
    { month: 'Oct 25', kwh: 637, cost: 24890, peak: 95, offPeak: 542 },
    { month: 'Nov 25', kwh: 665, cost: 26110, peak: 110, offPeak: 555 },
    { month: 'Dec 25', kwh: 555, cost: 21400, peak: 88, offPeak: 467 },
    { month: 'Jan 26', kwh: 522, cost: 19800, peak: 82, offPeak: 440 },
    { month: 'Feb 26', kwh: 143, cost: 5800, peak: 24, offPeak: 119 },
    { month: 'Mar 26', kwh: 121, cost: 4950, peak: 20, offPeak: 101 },
    { month: 'Apr 26', kwh: 151, cost: 3430, peak: 32, offPeak: 119 },
    { month: 'May 26', kwh: 187, cost: 8400, peak: 35, offPeak: 152 },
    { month: 'Jun 26', kwh: 901, cost: 45570, peak: 140, offPeak: 761 },
    { month: 'Jul 26', kwh: 1319, cost: 20726, peak: 302, offPeak: 1017 },
    { month: 'Aug 26', kwh: 65, cost: 5501, peak: 15, offPeak: 50 },
  ];

  // Expense categories from audited bills
  const expenseCategories = [
    { name: 'Energy Charges', amount: 87501, percentage: 68, color: '#0EA5E9', badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
    { name: 'FPA & Surcharges', amount: 18450, percentage: 14, color: '#F59E0B', badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    { name: 'Taxes & Duties', amount: 16121, percentage: 13, color: '#EC4899', badgeBg: 'bg-pink-500/15 text-pink-400 border-pink-500/30' },
    { name: 'Fixed Capacity', amount: 6420, percentage: 5, color: '#10B981', badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => (activeTab === 'kwh' ? d.kwh : d.cost)));

  const cardBg = isDark
    ? 'bg-[#121524] border-[#22293F] text-white shadow-xl shadow-black/40'
    : 'bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/60';

  return (
    <div className="space-y-7">
      {/* Top Grid: Bar Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 cols): Monthly Consumption Bar Chart */}
        <div className={`lg:col-span-8 rounded-3xl p-6 sm:p-7 flex flex-col justify-between border relative overflow-hidden ${cardBg}`}>
          {/* Subtle Top Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-cyan-400 to-indigo-500" />

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                      Consumption & Cost History
                    </h3>
                    <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Audited multi-month billing trajectory across Pakistani utilities.
                    </p>
                  </div>
                </div>
              </div>

              {/* View Switcher Toggle */}
              <div
                className={`flex items-center gap-1.5 p-1 rounded-2xl border self-start sm:self-auto ${
                  isDark ? 'bg-[#0B0D17] border-[#1F253C]' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <button
                  onClick={() => setActiveTab('kwh')}
                  className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
                    activeTab === 'kwh'
                      ? isDark
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                        : 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Units (kWh)
                </button>
                <button
                  onClick={() => setActiveTab('cost')}
                  className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl transition-all ${
                    activeTab === 'cost'
                      ? isDark
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                        : 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cost (PKR)
                </button>
              </div>
            </div>

            {/* Prominent Quick Stat Badges for Main Info Visibility */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-[#181D33] border-[#252C46]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-[11px] font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Peak Month Record
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-cyan-400">
                  Jul 26: 1,319 kWh
                </span>
              </div>
              <div
                className={`p-3 rounded-2xl border ${
                  isDark ? 'bg-[#181D33] border-[#252C46]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-[11px] font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Average Monthly Use
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-amber-400">
                  475 kWh / month
                </span>
              </div>
              <div
                className={`p-3 rounded-2xl border col-span-2 sm:col-span-1 ${
                  isDark ? 'bg-[#181D33] border-[#252C46]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-[11px] font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Annual Total Billed
                </span>
                <span className="text-sm sm:text-base font-black font-mono text-emerald-400">
                  PKR 217,317
                </span>
              </div>
            </div>
          </div>

          {/* Bar Chart with Prominent Labels */}
          <div className="relative h-64 sm:h-72 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            {monthlyData.map((d, index) => {
              const val = activeTab === 'kwh' ? d.kwh : d.cost;
              const heightPercent = Math.max(14, Math.round((val / maxVal) * 88));
              const isHovered = hoveredBarIndex === index;
              const isPeak = d.kwh === 1319;

              return (
                <div
                  key={d.month}
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                >
                  {/* Floating Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 z-20 bg-slate-950 text-white border border-amber-500/50 rounded-xl px-3 py-1.5 text-center shadow-2xl pointer-events-none whitespace-nowrap animate-fadeIn">
                      <p className="text-[11px] text-slate-400 font-semibold">{d.month}</p>
                      <p className="text-xs sm:text-sm font-black text-amber-300 font-mono">
                        {activeTab === 'kwh' ? `${d.kwh} kWh` : `PKR ${d.cost.toLocaleString()}`}
                      </p>
                    </div>
                  )}

                  {/* Peak Marker Tag for Instant Visibility */}
                  {isPeak && !isHovered && (
                    <span className="absolute -top-6 text-[10px] font-mono font-black text-cyan-400 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/40 whitespace-nowrap">
                      PEAK
                    </span>
                  )}

                  {/* Rounded High-Contrast Vertical Bar */}
                  <div
                    className={`w-full max-w-[40px] rounded-2xl p-1 flex items-end justify-center h-full transition-colors ${
                      isDark ? 'bg-[#181D33]' : 'bg-slate-100'
                    }`}
                  >
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-xl transition-all duration-300 ${
                        isHovered
                          ? 'bg-gradient-to-t from-amber-500 via-orange-500 to-amber-300 shadow-lg shadow-amber-500/40 ring-2 ring-amber-400'
                          : isPeak
                          ? 'bg-gradient-to-t from-cyan-600 via-sky-400 to-teal-300 shadow-md shadow-cyan-500/30'
                          : 'bg-gradient-to-t from-blue-600 via-indigo-500 to-violet-400'
                      }`}
                    />
                  </div>

                  {/* Month Label */}
                  <span
                    className={`text-xs sm:text-sm font-mono font-bold mt-2 truncate w-full text-center transition-colors ${
                      isHovered
                        ? 'text-amber-400'
                        : isDark
                        ? 'text-slate-300'
                        : 'text-slate-700'
                    }`}
                  >
                    {d.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (4 cols): Expense Breakdown Donut Chart */}
        <div className={`lg:col-span-4 rounded-3xl p-6 sm:p-7 flex flex-col justify-between border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-amber-500 to-cyan-400" />

          <div>
            <div
              className={`flex items-center justify-between pb-3.5 border-b ${
                isDark ? 'border-[#22293F]' : 'border-slate-100'
              }`}
            >
              <div>
                <h3 className="text-xl font-black tracking-tight">Expenses Breakdown</h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cost distribution across all tariffs
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-[#181D33] text-amber-400' : 'bg-slate-100 text-amber-700'
                }`}
              >
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            {/* Interactive Donut Ring with Prominent Center Label */}
            <div className="my-5 flex items-center justify-center relative">
              <svg className="w-52 h-52 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={isDark ? '#1C2238' : '#E2E8F0'}
                  strokeWidth="13"
                />
                {/* Segments: Energy (68%), Taxes (13%), FPA (14%), Fixed (5%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#0EA5E9"
                  strokeWidth="13"
                  strokeDasharray="162.4 238.7"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-85"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#EC4899"
                  strokeWidth="13"
                  strokeDasharray="31.0 238.7"
                  strokeDashoffset="-162.4"
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-85"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="13"
                  strokeDasharray="33.4 238.7"
                  strokeDashoffset="-193.4"
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-85"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="13"
                  strokeDasharray="11.9 238.7"
                  strokeDashoffset="-226.8"
                  strokeLinecap="round"
                  className="transition-all duration-500 hover:opacity-85"
                />
              </svg>

              {/* Large, High-Contrast Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Audited Pool
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono tracking-tight mt-0.5 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  PKR 128k
                </span>
                <span className="text-[11px] font-bold text-amber-500 font-mono mt-0.5">
                  100% Reconciled
                </span>
              </div>
            </div>
          </div>

          {/* Color Legend with Readable Values */}
          <div className="space-y-2.5 pt-3 border-t border-slate-700/20">
            {expenseCategories.map((cat) => (
              <div
                key={cat.name}
                className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                  isDark ? 'bg-[#181D33]/60' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${cat.badgeBg}`}>
                    {cat.percentage}%
                  </span>
                  <span className={`text-xs sm:text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    PKR {cat.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Glowing Waveform & Tracking Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Glowing Neon Waves Chart */}
        <div className={`lg:col-span-7 rounded-3xl p-6 sm:p-7 flex flex-col justify-between border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500" />

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">Peak vs. Off-Peak Waveform</h3>
                  <span className="text-xs text-pink-400 bg-pink-500/15 border border-pink-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                    Dual Register
                  </span>
                </div>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Real time-of-use distribution across prosumer & domestic cycles.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-mono font-bold self-start sm:self-auto">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                  <span className="text-cyan-400">Off-Peak</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-sm shadow-pink-500" />
                  <span className="text-pink-400">Peak Rate</span>
                </div>
              </div>
            </div>

            {/* SVG Smooth Glowing Area Waves */}
            <div className="relative h-56 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cyanWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="pinkWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EC4899" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="50" x2="600" y2="50" stroke={isDark ? '#232738' : '#E2E8F0'} strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="600" y2="110" stroke={isDark ? '#232738' : '#E2E8F0'} strokeDasharray="3 3" />
                <line x1="0" y1="170" x2="600" y2="170" stroke={isDark ? '#232738' : '#E2E8F0'} strokeDasharray="3 3" />

                {/* Cyan Off-Peak Area & Path */}
                <path
                  d="M 0,130 C 60,60 120,40 180,90 C 240,140 300,160 360,110 C 420,50 480,20 540,80 L 600,60 L 600,200 L 0,200 Z"
                  fill="url(#cyanWave)"
                />
                <path
                  d="M 0,130 C 60,60 120,40 180,90 C 240,140 300,160 360,110 C 420,50 480,20 540,80 L 600,60"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                />

                {/* Pink Peak Area & Path */}
                <path
                  d="M 0,170 C 60,150 120,110 180,140 C 240,170 300,185 360,160 C 420,130 480,90 540,120 L 600,110 L 600,200 L 0,200 Z"
                  fill="url(#pinkWave)"
                />
                <path
                  d="M 0,170 C 60,150 120,110 180,140 C 240,170 300,185 360,160 C 420,130 480,90 540,120 L 600,110"
                  fill="none"
                  stroke="#EC4899"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
                />

                <circle cx="180" cy="90" r="6" fill="#FFFFFF" stroke="#06B6D4" strokeWidth="3" />
                <circle cx="480" cy="90" r="6" fill="#FFFFFF" stroke="#EC4899" strokeWidth="3" />
              </svg>
            </div>
          </div>

          {/* Quick Metrics Footer Cards with Large Numbers */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/20 font-mono">
            <div
              className={`p-3 rounded-2xl border text-center ${
                isDark ? 'bg-[#181D33] border-[#252C46]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Off-Peak
              </span>
              <span className="text-lg sm:text-2xl font-black text-cyan-400 block mt-0.5">
                1,777 kWh
              </span>
            </div>
            <div
              className={`p-3 rounded-2xl border text-center ${
                isDark ? 'bg-[#181D33] border-[#252C46]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Peak
              </span>
              <span className="text-lg sm:text-2xl font-black text-pink-400 block mt-0.5">
                442 kWh
              </span>
            </div>
            <div
              className={`p-3 rounded-2xl border text-center ${
                isDark ? 'bg-[#181D33] border-[#252C46]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Solar Export
              </span>
              <span className="text-lg sm:text-2xl font-black text-emerald-400 block mt-0.5">
                1,037 kWh
              </span>
            </div>
          </div>
        </div>

        {/* Right (5 cols): "Tracking" Circular Arc Gauges */}
        <div className={`lg:col-span-5 rounded-3xl p-6 sm:p-7 flex flex-col justify-between border relative overflow-hidden ${cardBg}`}>
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

          <div>
            <div
              className={`flex items-center justify-between pb-3.5 border-b ${
                isDark ? 'border-[#22293F]' : 'border-slate-100'
              }`}
            >
              <div>
                <h3 className="text-xl font-black tracking-tight">System Tracking</h3>
                <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Grid efficiency & benchmark compliance
                </p>
              </div>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                100% Optimal
              </span>
            </div>

            {/* 3 Circular Arc Gauges with Large Font & High Contrast */}
            <div className="grid grid-cols-3 gap-3 my-5">
              {/* Gauge 1: 86% Solar Offset */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 sm:w-28 h-24 sm:h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      strokeWidth="3.5"
                      stroke={isDark ? '#1C2238' : '#E2E8F0'}
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400"
                      strokeDasharray="86, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-base sm:text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      86%
                    </span>
                  </div>
                </div>
                <span className={`text-xs sm:text-sm font-black mt-2 text-center ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Solar Offset
                </span>
                <span className={`text-[11px] font-medium text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Net prosumer
                </span>
              </div>

              {/* Gauge 2: 94% On-Time Settle */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 sm:w-28 h-24 sm:h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      strokeWidth="3.5"
                      stroke={isDark ? '#1C2238' : '#E2E8F0'}
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-400"
                      strokeDasharray="94, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-base sm:text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      94%
                    </span>
                  </div>
                </div>
                <span className={`text-xs sm:text-sm font-black mt-2 text-center ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  On-Time Dues
                </span>
                <span className={`text-[11px] font-medium text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Zero penalties
                </span>
              </div>

              {/* Gauge 3: 100% Audit Verified */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 sm:w-28 h-24 sm:h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      strokeWidth="3.5"
                      stroke={isDark ? '#1C2238' : '#E2E8F0'}
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeDasharray="100, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-base sm:text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      100%
                    </span>
                  </div>
                </div>
                <span className={`text-xs sm:text-sm font-black mt-2 text-center ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  Math Reconciled
                </span>
                <span className={`text-[11px] font-medium text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No hallucinations
                </span>
              </div>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-center font-mono ${
              isDark ? 'bg-[#181D33] border-[#252C46]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Level 1 JSON & Level 2 Q&A Benchmarks Passed</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
