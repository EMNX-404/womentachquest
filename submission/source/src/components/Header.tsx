import React from 'react';
import { FileJson, FileSpreadsheet, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'bills' | 'audit' | 'validator' | 'qa' | 'live';
  setActiveTab: (tab: 'bills' | 'audit' | 'validator' | 'qa' | 'live') => void;
  billCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, billCount }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">
                WTQ Utility Bill Decoder
              </h1>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Validated
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Women Tech Quest Build Track · K-Electric · LESCO · IESCO · gemini-3.1-flash-lite
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Functional segmented controls) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('bills')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'bills'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bills Dataset ({billCount})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Discrepancy Audit
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'qa'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Level 2 Q&A
          </button>
          <button
            onClick={() => setActiveTab('validator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'validator'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            JSON Validator
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'live'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Gemini Vision
          </button>
        </div>

        {/* Action Downloads */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <a
            href="/api/export/level1.csv"
            download="level1.csv"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            title="Download Level 1 CSV with single-line escaped JSONs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            level1.csv
          </a>
          <a
            href="/api/export/level2.csv"
            download="level2.csv"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            title="Download Level 2 CSV with 60 answers"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            level2.csv
          </a>
        </div>
      </div>
    </header>
  );
};
