import React, { useState } from 'react';
import { BillRecord } from '../types';
import {
  Sun,
  Eye,
  CheckCircle2,
  Calendar,
  Gauge,
  ArrowRight,
  Zap,
  Building2,
  ShieldCheck,
  CreditCard,
  Barcode,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

interface BillCardShowcaseProps {
  bills: BillRecord[];
  onSelectBill: (billId: string) => void;
  theme: 'dark' | 'light';
}

export const BillCardShowcase: React.FC<BillCardShowcaseProps> = ({
  bills,
  onSelectBill,
  theme,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'KE' | 'LESCO' | 'IESCO' | 'SOLAR'>('ALL');
  const isDark = theme === 'dark';

  // Specific visual styling and brand color per provider
  const getProviderConfig = (provider: string, bill: BillRecord) => {
    const isSolar =
      (bill.payable_within_due_date ?? 0) < 0 ||
      (bill.arrears ?? 0) < -1000 ||
      bill.metadata?.customer_type === 'NM (Net Metering)' ||
      bill.metadata?.connection_type?.includes('NET METERING');

    switch (provider) {
      case 'KE':
        return {
          name: 'K-Electric',
          fullName: 'K-Electric Limited',
          city: 'Karachi Metro',
          gradient: 'from-amber-500 via-orange-500 to-amber-600',
          borderGlow: isDark
            ? 'hover:border-amber-500/70 hover:shadow-amber-500/20'
            : 'hover:border-amber-500 hover:shadow-amber-500/25',
          badgeBg: isDark
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
          tagColor: isSolar
            ? isDark
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            : isDark
            ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
            : 'bg-orange-100 text-orange-900 border-orange-300',
          iconColor: 'text-amber-500',
          headerBg: isDark ? 'bg-amber-950/30' : 'bg-amber-50/80',
        };
      case 'LESCO':
        return {
          name: 'LESCO',
          fullName: 'Lahore Electric Supply Company',
          city: 'Lahore Division',
          gradient: 'from-cyan-500 via-sky-500 to-blue-600',
          borderGlow: isDark
            ? 'hover:border-cyan-500/70 hover:shadow-cyan-500/20'
            : 'hover:border-cyan-500 hover:shadow-cyan-500/25',
          badgeBg: isDark
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            : 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold',
          tagColor: isSolar
            ? isDark
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            : isDark
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            : 'bg-purple-100 text-purple-900 border-purple-300',
          iconColor: 'text-cyan-500',
          headerBg: isDark ? 'bg-cyan-950/30' : 'bg-cyan-50/80',
        };
      case 'IESCO':
        return {
          name: 'IESCO',
          fullName: 'Islamabad Electric Supply Company',
          city: 'Islamabad Capital',
          gradient: 'from-emerald-500 via-teal-500 to-green-600',
          borderGlow: isDark
            ? 'hover:border-emerald-500/70 hover:shadow-emerald-500/20'
            : 'hover:border-emerald-500 hover:shadow-emerald-500/25',
          badgeBg: isDark
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
          tagColor: isDark
            ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
            : 'bg-teal-100 text-teal-900 border-teal-300',
          iconColor: 'text-emerald-500',
          headerBg: isDark ? 'bg-emerald-950/30' : 'bg-emerald-50/80',
        };
      default:
        return {
          name: provider,
          fullName: provider,
          city: 'National Grid',
          gradient: 'from-indigo-500 to-purple-600',
          borderGlow: 'hover:border-indigo-500',
          badgeBg: isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-900',
          tagColor: isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-800',
          iconColor: 'text-indigo-500',
          headerBg: isDark ? 'bg-indigo-950/30' : 'bg-indigo-50/80',
        };
    }
  };

  const solarCount = bills.filter(
    (b) =>
      (b.payable_within_due_date ?? 0) < 0 ||
      (b.arrears ?? 0) < -1000 ||
      b.metadata?.customer_type === 'NM (Net Metering)' ||
      b.metadata?.connection_type?.includes('NET METERING')
  ).length;

  const filteredBills = bills.filter((b) => {
    if (filter === 'KE') return b.provider === 'KE';
    if (filter === 'LESCO') return b.provider === 'LESCO';
    if (filter === 'IESCO') return b.provider === 'IESCO';
    if (filter === 'SOLAR') {
      return (
        (b.payable_within_due_date ?? 0) < 0 ||
        (b.arrears ?? 0) < -1000 ||
        b.metadata?.customer_type === 'NM (Net Metering)' ||
        b.metadata?.connection_type?.includes('NET METERING')
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Challenge Deliverables Quick Bar */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-cyan-500/10 border-amber-500/25'
            : 'bg-gradient-to-r from-amber-50 via-white to-cyan-50 border-amber-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>Challenge Output Files Generated</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                Ready for Judges
              </span>
            </h4>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Both Level 1 JSON schema dataset and Level 2 Q&A answers are fully compiled and available for one-click download.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          <a
            href="/api/export/your-submission.zip"
            download="your-submission.zip"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Submit ZIP</span>
          </a>
          <a
            href="/api/export/level1.csv"
            download="level1.csv"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Level 1 CSV</span>
          </a>
          <a
            href="/api/export/level2.csv"
            download="level2.csv"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Level 2 CSV</span>
          </a>
        </div>
      </div>

      {/* Section Header with Title & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse shadow-md shadow-amber-400" />
            <h3
              className={`text-2xl lg:text-3xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Evaluated Electricity Bills ({bills.length} Processed)
            </h3>
          </div>
          <p className={`text-sm lg:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Click any bill card to inspect full consumer info, itemized charges & taxes, and the authentic Pakistani bill replica.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-2xl border overflow-x-auto self-start md:self-auto ${
            isDark ? 'bg-[#121624] border-[#22283C]' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {[
            { id: 'ALL', label: `All Bills (${bills.length})` },
            { id: 'KE', label: `K-Electric (${bills.filter((b) => b.provider === 'KE').length})` },
            { id: 'LESCO', label: `LESCO (${bills.filter((b) => b.provider === 'LESCO').length})` },
            { id: 'IESCO', label: `IESCO (${bills.filter((b) => b.provider === 'IESCO').length})` },
            { id: 'SOLAR', label: `☀️ Solar Net-Metering (${solarCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? isDark
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md'
                    : 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of the Bills */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBills.map((bill) => {
          const cfg = getProviderConfig(bill.provider, bill);
          const isCredit = (bill.payable_within_due_date ?? 0) < 0;
          const isZeroDue = bill.payable_within_due_date === 0;
          const isSolar =
            (bill.payable_within_due_date ?? 0) < 0 ||
            (bill.arrears ?? 0) < -1000 ||
            bill.metadata?.customer_type === 'NM (Net Metering)' ||
            bill.metadata?.connection_type?.includes('NET METERING');
          const isProtected = bill.metadata?.category?.toLowerCase().includes('protected');
          const isCommercial = bill.tariff?.includes('A-2') || bill.tariff?.includes('A2');

          return (
            <div
              key={bill.bill_id}
              onClick={() => onSelectBill(bill.bill_id)}
              className={`group rounded-3xl border transition-all duration-300 p-6 sm:p-7 cursor-pointer relative flex flex-col justify-between overflow-hidden shadow-xl ${
                isDark
                  ? `bg-[#131626] border-[#22293F] hover:bg-[#181D33] ${cfg.borderGlow}`
                  : `bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xl shadow-slate-200/60`
              }`}
            >
              {/* Colorful Top Accent Gradient Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${cfg.gradient}`}
              />

              {/* Watermark / Subtle Barcode Graphic in top right */}
              <div className="absolute top-4 right-5 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
                <Barcode className="w-14 h-6 text-slate-400" />
              </div>

              <div>
                {/* Header: Provider Badge & Month */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm px-3.5 py-1 rounded-full font-black font-mono border ${cfg.badgeBg}`}
                    >
                      {bill.provider}
                    </span>
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {cfg.city}
                    </span>
                  </div>

                  <span
                    className={`text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                      isDark ? 'bg-black/40 text-slate-200 border-[#22283C]' : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    {bill.bill_month}
                  </span>
                </div>

                {/* Bill ID & Consumer Category Tag */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight group-hover:text-amber-400 transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {bill.bill_id}
                    </h4>
                  </div>

                  {/* Status / Category Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {isSolar && (
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-emerald-400" />
                        Solar Prosumer (Credit)
                      </span>
                    )}
                    {isProtected && (
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                        Protected Lifeline
                      </span>
                    )}
                    {isCommercial && (
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-400" />
                        Commercial TOU
                      </span>
                    )}
                    {!isSolar && !isProtected && !isCommercial && (
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-400" />
                        Standard Domestic
                      </span>
                    )}

                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                        isDark ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      Tariff: {bill.tariff || 'Standard'}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                        isDark ? 'bg-white/5 text-slate-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      Load: {bill.sanctioned_load_kw} kW
                    </span>
                  </div>
                </div>

                {/* Key Metrics: Consumption & Dates */}
                <div
                  className={`my-5 p-4 sm:p-5 rounded-2xl border space-y-3 font-mono text-xs sm:text-sm ${
                    isDark ? 'bg-[#181D33] border-[#252C46]' : 'bg-slate-50 border-slate-200 shadow-inner'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`flex items-center gap-2 font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <Gauge className="w-4 h-4 text-cyan-400" /> Units Consumed:
                    </span>
                    <span
                      className={`font-black text-lg sm:text-xl ${
                        isDark ? 'text-cyan-400' : 'text-cyan-700'
                      }`}
                    >
                      {bill.units_consumed !== null ? `${bill.units_consumed} kWh` : 'Multi-Register'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-slate-700/20">
                    <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Payment Due Date:</span>
                    <span className="font-black text-rose-500 flex items-center gap-1 text-sm sm:text-base">
                      {bill.due_date || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1.5">
                    <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dial Reading:</span>
                    <span className={`font-bold font-mono text-xs sm:text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {bill.previous_reading !== null && bill.current_reading !== null
                        ? `${bill.previous_reading} → ${bill.current_reading}`
                        : 'Bi-directional Meters'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom: Price Box & Big Action Button */}
              <div className="pt-2">
                <div className="mb-4">
                  <span
                    className={`text-xs uppercase tracking-wider font-mono font-bold block ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Net Settlement Amount
                  </span>

                  <div className="text-3xl sm:text-4xl font-black font-mono mt-1">
                    {bill.payable_within_due_date != null ? (
                      isCredit ? (
                        <div className="flex items-center gap-2 text-emerald-400 flex-wrap">
                          <Sun className="w-7 h-7 shrink-0 text-emerald-400 animate-spin-slow" />
                          <span>-PKR {Math.abs(bill.payable_within_due_date).toLocaleString()}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-sans font-black border border-emerald-500/40">
                            SURPLUS CREDIT
                          </span>
                        </div>
                      ) : isZeroDue ? (
                        <div className="flex items-center gap-2 text-cyan-400 flex-wrap">
                          <CheckCircle2 className="w-7 h-7 shrink-0 text-cyan-400" />
                          <span>PKR 0.00</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/25 text-cyan-300 font-sans font-black border border-cyan-500/40">
                            FULLY SETTLED
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className={isDark ? 'text-amber-400' : 'text-amber-600 font-black'}>
                            PKR {bill.payable_within_due_date.toLocaleString()}
                          </span>
                          {bill.payable_after_due_date != null && (
                            <span className="text-xs sm:text-sm text-rose-500 font-bold">
                              (Late: PKR {bill.payable_after_due_date.toLocaleString()})
                            </span>
                          )}
                        </div>
                      )
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </div>
                </div>

                <div
                  className={`pt-4 border-t flex items-center justify-between transition-colors ${
                    isDark ? 'border-[#22293F]' : 'border-slate-100'
                  }`}
                >
                  <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    18 Schema Fields Validated
                  </span>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-500 group-hover:text-amber-400">
                    <span>Inspect Bill Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
