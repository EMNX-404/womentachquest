import React from 'react';
import { Search, Calendar, Download, Plus, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onOpenUpload: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onSearchChange,
  searchQuery,
  onOpenUpload,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`border-b px-5 sm:px-8 py-4 sm:py-5 sticky top-0 z-30 transition-colors backdrop-blur-md ${
        isDark
          ? 'border-[#1E2230] bg-[#0E111C]/90'
          : 'border-slate-200 bg-white/95 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Humanized Greeting */}
        <div>
          <div className="flex items-center gap-2">
            <h1
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Utility Intelligence <span className="text-amber-500 font-bold">Portal</span>
            </h1>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time billing analytics, prosumer solar tracking, and verified electricity audits.
          </p>
        </div>

        {/* Right Search, Segmented Theme Toggle & Controls */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Segmented Theme Toggle (Light ☀️ | Dark 🌙) */}
          <div
            className={`flex items-center p-1 rounded-2xl border transition-all ${
              isDark ? 'bg-[#151827] border-[#22283C]' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <button
              onClick={() => {
                if (isDark) onToggleTheme();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                !isDark
                  ? 'bg-white text-amber-900 shadow-sm border border-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Light Theme"
            >
              <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500 fill-amber-400' : ''}`} />
              <span>Light</span>
            </button>

            <button
              onClick={() => {
                if (!isDark) onToggleTheme();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                isDark
                  ? 'bg-[#22273D] text-amber-300 shadow-sm border border-amber-500/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Switch to Dark Theme"
            >
              <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span>Dark</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search bills, tariff, city..."
              className={`w-full text-xs sm:text-sm pl-10 pr-4 py-2 rounded-2xl border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-[#151827] text-slate-100 placeholder:text-slate-500 border-[#22283C] focus:border-amber-400'
                  : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-amber-500'
              }`}
            />
          </div>

          {/* Export Actions for Challenge Deliverables */}
          <div className="hidden sm:flex items-center gap-1.5">
            <a
              href="/api/export/your-submission.zip"
              download="your-submission.zip"
              title="Download Complete Submission Package (your-submission.zip)"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-colors shadow-sm ${
                isDark
                  ? 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border-emerald-500/40'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Submit ZIP</span>
            </a>
            <a
              href="/api/export/level1.csv"
              download="level1.csv"
              title="Download Level 1 JSON Extraction CSV"
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-2xl text-xs font-bold border transition-colors ${
                isDark
                  ? 'bg-[#151827] hover:bg-[#1E2338] text-amber-400 border-amber-500/30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Level 1</span>
            </a>
            <a
              href="/api/export/level2.csv"
              download="level2.csv"
              title="Download Level 2 Q&A CSV"
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-2xl text-xs font-bold border transition-colors ${
                isDark
                  ? 'bg-[#151827] hover:bg-[#1E2338] text-cyan-400 border-cyan-500/30'
                  : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Level 2</span>
            </a>
          </div>

          {/* Scan Action */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Scan Bill</span>
          </button>
        </div>
      </div>
    </header>
  );
};
