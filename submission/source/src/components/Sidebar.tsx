import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  ShieldCheck,
  Sparkles,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'bills' | 'analytics' | 'audit' | 'ai';
  setActiveView: (view: 'dashboard' | 'bills' | 'analytics' | 'audit' | 'ai') => void;
  onOpenUpload: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onOpenUpload,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'bills', label: 'Bills & Dues', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit & Checks', icon: ShieldCheck },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  ] as const;

  return (
    <aside
      className={`w-20 lg:w-68 border-r flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 transition-colors select-none ${
        isDark
          ? 'bg-[#0E111D] border-[#1E2230] text-slate-200'
          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div
          className={`h-20 flex items-center px-4 lg:px-6 border-b gap-3 ${
            isDark ? 'border-[#1E2230]' : 'border-slate-100'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 shrink-0">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="hidden lg:block">
            <h1
              className={`text-lg font-black tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              PowerPulse
            </h1>
            <p className="text-xs text-amber-500 font-bold tracking-wide">Utility Intelligence</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 lg:p-4 space-y-1.5">
          <p className="hidden lg:block text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2 font-mono">
            Portal Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all group relative ${
                  isActive
                    ? isDark
                      ? 'bg-[#1C2034] text-amber-300 shadow-sm border border-amber-500/20'
                      : 'bg-amber-50 text-amber-950 border border-amber-300 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-[#151828]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={item.label}
              >
                {isActive && (
                  <div className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-amber-400 rounded-r-full shadow-sm shadow-amber-400" />
                )}
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-amber-500'
                      : isDark
                      ? 'text-slate-400 group-hover:text-slate-200'
                      : 'text-slate-500 group-hover:text-slate-900'
                  }`}
                />
                <span className="hidden lg:block text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile, Theme Toggle & Action */}
      <div
        className={`p-3 lg:p-4 border-t space-y-3 ${
          isDark ? 'border-[#1E2230]' : 'border-slate-100'
        }`}
      >
        {/* Theme Toggle Button in Sidebar */}
        <button
          onClick={onToggleTheme}
          className={`w-full hidden lg:flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
            isDark
              ? 'bg-[#151828] hover:bg-[#1E2338] border-[#202538] text-amber-300'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <span className="flex items-center gap-2.5">
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
            )}
            <span className="font-bold">{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </span>
          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-black ${
            isDark ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-200 text-slate-800'
          }`}>
            {theme}
          </span>
        </button>

        {/* Quick Scan Button */}
        <button
          onClick={onOpenUpload}
          className="w-full hidden lg:flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Scan New Bill</span>
        </button>

        {/* User Card */}
        <div
          className={`flex items-center gap-3 p-3 rounded-2xl border ${
            isDark
              ? 'bg-[#151828] border-[#1E2230]/70'
              : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-extrabold text-xs ring-2 ring-amber-500/30 shrink-0">
            EF
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Eman Fatima
            </p>
            <p className={`text-[11px] font-medium truncate ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              Energy Auditor
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
