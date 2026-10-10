import { useState, useEffect } from 'react';
import { BillRecord, DiscrepancyDataset } from './types';
import { STATIC_BILLS, STATIC_DISCREPANCIES } from './data/staticBills';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { KpiCards } from './components/KpiCards';
import { BillCardShowcase } from './components/BillCardShowcase';
import { ChartsSection } from './components/ChartsSection';
import { BillsTable } from './components/BillsTable';
import { BillDetailModal } from './components/BillDetailModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { UploadModal } from './components/UploadModal';
import { ShieldCheck, Sparkles, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

export default function App() {
  // Theme state initialized from localStorage for persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('powerpulse_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const [activeView, setActiveView] = useState<'dashboard' | 'bills' | 'analytics' | 'audit' | 'ai'>('dashboard');
  const [bills, setBills] = useState<BillRecord[]>(STATIC_BILLS);
  const [auditDataset, setAuditDataset] = useState<DiscrepancyDataset>(STATIC_DISCREPANCIES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiQuestionPrompt, setAiQuestionPrompt] = useState<string>('');

  // Persist theme changes & update HTML class
  useEffect(() => {
    localStorage.setItem('powerpulse_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Toggle Theme handler
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch live bills from server if available
  useEffect(() => {
    fetch('/api/bills')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.bills && Array.isArray(data.bills)) {
          const staticMap = new Map(STATIC_BILLS.map((b) => [b.bill_id, b]));
          const mergedBills = data.bills.map((b: BillRecord) => {
            const staticMatch = staticMap.get(b.bill_id);
            return {
              ...staticMatch,
              ...b,
              history: b.history || staticMatch?.history || [],
              metadata: { ...(staticMatch?.metadata || {}), ...(b.metadata || {}) },
            };
          });
          setBills(mergedBills);
        }
      })
      .catch(() => {});

    fetch('/api/discrepancies')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.audit_summary) {
          setAuditDataset(data);
        }
      })
      .catch(() => {});
  }, []);

  // Compute overall KPI aggregates
  const totalBilled = bills.reduce((acc, b) => acc + (b.payable_within_due_date ?? 0), 0);
  const totalUnits = bills.reduce((acc, b) => acc + (b.units_consumed ?? 0), 0);
  const totalSolarCredits = bills.reduce((acc, b) => {
    const arr = b.arrears ?? 0;
    return arr < 0 ? acc + arr : acc;
  }, 0);

  const selectedBill = bills.find((b) => b.bill_id === selectedBillId) || null;
  const selectedAudit = auditDataset.bill_reports.find((r) => r.bill_id === selectedBillId);

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-row font-sans transition-colors duration-200 selection:bg-amber-500/20 selection:text-amber-500 ${
        isDark ? 'bg-[#0B0D15] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Sleek Modern Left Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenUpload={() => setShowUploadModal(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header with search & theme toggle */}
        <TopNav
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
          onOpenUpload={() => setShowUploadModal(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 p-5 sm:p-7 lg:p-9 max-w-7xl w-full mx-auto space-y-9">
          {/* VIEW 1: Overview Dashboard */}
          {activeView === 'dashboard' && (
            <div className="space-y-9">
              {/* 4 Stat Cards */}
              <KpiCards
                totalBilled={totalBilled}
                totalUnits={Math.round(totalUnits)}
                totalSolarCredits={totalSolarCredits}
                billCount={bills.length}
                theme={theme}
                onCardClick={(m) => {
                  if (m === 'verified') setActiveView('audit');
                  else setActiveView('bills');
                }}
              />

              {/* The 5 Bills Showcase (Front & Center) */}
              <BillCardShowcase
                bills={bills}
                onSelectBill={(id) => setSelectedBillId(id)}
                theme={theme}
              />

              {/* Visual Charts & Gauges Section */}
              <ChartsSection theme={theme} />

              {/* Bills List / Table */}
              <BillsTable
                bills={bills}
                onSelectBill={(id) => setSelectedBillId(id)}
                onOpenUpload={() => setShowUploadModal(true)}
                searchQuery={searchQuery}
                theme={theme}
              />
            </div>
          )}

          {/* VIEW 2: Bills & Accounts */}
          {activeView === 'bills' && (
            <div className="space-y-9">
              <BillCardShowcase
                bills={bills}
                onSelectBill={(id) => setSelectedBillId(id)}
                theme={theme}
              />

              <BillsTable
                bills={bills}
                onSelectBill={(id) => setSelectedBillId(id)}
                onOpenUpload={() => setShowUploadModal(true)}
                searchQuery={searchQuery}
                theme={theme}
              />
            </div>
          )}

          {/* VIEW 3: Detailed Analytics */}
          {activeView === 'analytics' && (
            <div className="space-y-9">
              <div
                className={`rounded-3xl p-6 sm:p-8 border shadow-sm ${
                  isDark ? 'bg-[#141724] border-[#22283C]' : 'bg-white border-slate-200'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Energy & Cost Intelligence
                </h2>
                <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Multi-month consumption trajectories, peak-hour load distribution, and tax ratios across Pakistani electricity providers.
                </p>
              </div>

              <ChartsSection theme={theme} />
            </div>
          )}

          {/* VIEW 4: Audit & Checks */}
          {activeView === 'audit' && (
            <div className="space-y-6">
              <div
                className={`rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDark ? 'bg-[#141724] border-[#22283C]' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Bill Verification & Audit Checks
                    </h2>
                  </div>
                  <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Every arithmetic formula, printed subtotal, and tax line has been verified against the original bills.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-mono font-bold px-4 py-2 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> 100% Math Verified
                  </span>
                </div>
              </div>

              {/* Reports Grid */}
              <div className="space-y-4">
                {auditDataset.bill_reports.map((report) => (
                  <div
                    key={report.bill_id}
                    className={`rounded-3xl p-6 sm:p-7 border space-y-5 transition-all shadow-sm ${
                      isDark
                        ? 'bg-[#141724] border-[#22283C] hover:border-[#2C334A]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/40 gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl sm:text-2xl font-black">
                          {report.bill_id}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 font-bold font-mono">
                          {report.provider}
                        </span>
                        <span className="text-xs sm:text-sm font-mono text-slate-400">
                          Month: {report.bill_month}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedBillId(report.bill_id)}
                        className="text-xs sm:text-sm font-black text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1 self-start sm:self-auto"
                      >
                        <span>Inspect Full Bill</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Formula Checks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(report.checks).map(([k, c]) => (
                        <div
                          key={k}
                          className={`p-4 rounded-2xl border text-xs sm:text-sm font-mono space-y-1.5 ${
                            isDark ? 'bg-black/25 border-[#22283C]' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold capitalize text-slate-300">
                              {k.replace(/_/g, ' ')}
                            </span>
                            {c.match ? (
                              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                Exact Match
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-400 font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                Diff: {c.variance} PKR
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between text-slate-400 text-xs pt-1">
                            <span>Calculated: {String(c.calculated)}</span>
                            <span>Printed: {String(c.printed)}</span>
                          </div>
                          {c.notes && (
                            <p className="text-amber-300/90 text-xs pt-1.5 border-t border-slate-800/40 leading-relaxed">
                              {c.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Observations */}
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">
                        Audit Findings:
                      </span>
                      {report.identified_discrepancies.map((d, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                            isDark ? 'bg-black/25 border-[#22283C]' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <span className="font-black text-amber-500 font-mono">[{d.severity}]</span>{' '}
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {d.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: Dedicated AI Assistant View */}
          {activeView === 'ai' && (
            <div
              className={`rounded-3xl p-6 sm:p-9 space-y-6 border shadow-sm ${
                isDark ? 'bg-[#141724] border-[#22283C]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shrink-0">
                  <Sparkles className="w-7 h-7 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    AI Energy & Billing Assistant
                  </h2>
                  <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Ask any question about your electricity bills, solar benefits, fuel price adjustments, and rates.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  'Which bill has solar credit surplus?',
                  'What is my total tax amount across all accounts?',
                  'How many units were consumed in Karachi Metro?',
                  'Explain the fuel price adjustment (FPA) formula',
                  'Compare LESCO vs KESC energy rates',
                  'Why did bill KESC_0004 have PKR 0 due date payment?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setAiQuestionPrompt(q);
                      setShowAiModal(true);
                    }}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between group ${
                      isDark
                        ? 'bg-black/25 hover:bg-[#1A1F30] border-[#22283C] hover:border-amber-400/40 text-slate-300 hover:text-white'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <span>{q}</span>
                    <span className="text-amber-500 group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => {
                    setAiQuestionPrompt('');
                    setShowAiModal(true);
                  }}
                  className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Open Full AI Chat Assistant</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bill Detail Modal with Split Document Preview & All Info */}
      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          auditReport={selectedAudit}
          onClose={() => setSelectedBillId(null)}
          onAskAi={(q) => {
            setAiQuestionPrompt(q);
            setShowAiModal(true);
          }}
          theme={theme}
        />
      )}

      {/* AI Assistant Modal */}
      {showAiModal && (
        <AiAssistantModal
          bills={bills}
          initialQuestion={aiQuestionPrompt}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Upload & Scan Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onDecoded={(data) => {
            if (data?.provider) {
              const newRecord: BillRecord = {
                bill_id: `CUSTOM_${bills.length + 1}`,
                filename: 'uploaded_bill.png',
                ...data,
              };
              setBills((prev) => [newRecord, ...prev]);
              setShowUploadModal(false);
              setSelectedBillId(newRecord.bill_id);
            }
          }}
        />
      )}
    </div>
  );
}
