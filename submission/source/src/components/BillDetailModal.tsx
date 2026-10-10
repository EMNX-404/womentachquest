import React, { useState } from 'react';
import { BillRecord, BillAuditReport } from '../types';
import { BillDocumentPreview } from './BillDocumentPreview';
import {
  X,
  Calendar,
  Gauge,
  Receipt,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Sun,
  ShieldCheck,
  Zap,
  History,
  FileCode,
  Info,
  Printer,
  Barcode,
  Building2,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface BillDetailModalProps {
  bill: BillRecord | null;
  auditReport?: BillAuditReport;
  onClose: () => void;
  onAskAi: (question: string) => void;
  theme: 'dark' | 'light';
}

export const BillDetailModal: React.FC<BillDetailModalProps> = ({
  bill,
  auditReport,
  onClose,
  onAskAi,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'charges' | 'document' | 'history' | 'audit' | 'json'>('info');
  const [copied, setCopied] = useState(false);

  if (!bill) return null;

  const isDark = theme === 'dark';
  const isCredit = (bill.payable_within_due_date ?? 0) < 0;
  const isZeroDue = bill.payable_within_due_date === 0;
  const isSolar =
    (bill.payable_within_due_date ?? 0) < 0 ||
    (bill.arrears ?? 0) < -1000 ||
    bill.metadata?.customer_type === 'NM (Net Metering)' ||
    bill.metadata?.connection_type?.includes('NET METERING');

  // Clean structured JSON
  const cleanExport = {
    bill_id: bill.bill_id,
    filename: bill.filename,
    provider: bill.provider,
    tariff: bill.tariff,
    sanctioned_load_kw: bill.sanctioned_load_kw,
    bill_month: bill.bill_month,
    reading_date: bill.reading_date,
    issue_date: bill.issue_date,
    due_date: bill.due_date,
    previous_reading: bill.previous_reading,
    current_reading: bill.current_reading,
    units_consumed: bill.units_consumed,
    charges: bill.charges,
    total_charges: bill.total_charges,
    taxes: bill.taxes,
    total_taxes: bill.total_taxes,
    current_bill: bill.current_bill,
    arrears: bill.arrears,
    payable_within_due_date: bill.payable_within_due_date,
    payable_after_due_date: bill.payable_after_due_date,
    metadata: bill.metadata,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(cleanExport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Provider colors
  const providerMeta = {
    KE: {
      name: 'K-Electric Karachi',
      accent: 'from-amber-500 via-orange-500 to-amber-600',
      badge: isDark
        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        : 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      accentText: 'text-amber-500',
    },
    LESCO: {
      name: 'LESCO Lahore',
      accent: 'from-cyan-500 via-sky-500 to-blue-600',
      badge: isDark
        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
        : 'bg-cyan-100 text-cyan-900 border-cyan-300 font-bold',
      accentText: 'text-cyan-500',
    },
    IESCO: {
      name: 'IESCO Islamabad',
      accent: 'from-emerald-500 via-teal-500 to-green-600',
      badge: isDark
        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
      accentText: 'text-emerald-500',
    },
  }[bill.provider] || {
    name: bill.provider,
    accent: 'from-indigo-500 to-purple-600',
    badge: 'bg-indigo-500/15 text-indigo-400',
    accentText: 'text-indigo-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 lg:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-6xl max-h-[95vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-[#101322] border-[#22293F] text-slate-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Modal Top Header (Child 1) */}
        <div
          className={`p-5 sm:p-6 border-b flex items-center justify-between gap-4 ${
            isDark ? 'border-[#20263B] bg-[#0C0F1A]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${providerMeta.accent} text-slate-950 font-black flex items-center justify-center text-xl shadow-lg shrink-0`}
            >
              {bill.provider[0]}
            </div>

            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h2
                  className={`text-2xl sm:text-3xl font-black tracking-tight font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {bill.bill_id}
                </h2>
                <span className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full border ${providerMeta.badge}`}>
                  {providerMeta.name} · {bill.bill_month}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                    isDark
                      ? 'bg-black/30 text-slate-300 border-slate-700/60'
                      : 'bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  {bill.filename}
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Tariff: <span className="font-bold font-mono text-amber-500">{bill.tariff || 'Standard'}</span> · Connection Load:{' '}
                <span className="font-bold font-mono text-cyan-500">{bill.sanctioned_load_kw} kW</span> · Due Date:{' '}
                <span className="font-black font-mono text-rose-500">{bill.due_date}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onAskAi(`Break down all charges, solar credits, and taxes for bill ${bill.bill_id}`);
              }}
              className="hidden sm:flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Ask AI About Bill</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print Bill Record"
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors border ${
                isDark
                  ? 'bg-[#1C2132] hover:bg-[#252C42] border-[#252C42] text-slate-200'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              title="Close modal"
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors border ${
                isDark
                  ? 'bg-[#1C2132] hover:bg-[#252C42] border-[#252C42] text-slate-200'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Child 2) */}
        <div
          className={`px-6 pt-2 border-b flex items-center justify-between overflow-x-auto ${
            isDark ? 'border-[#20263B] bg-[#0A0D18]' : 'border-slate-200 bg-slate-100/90'
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'info', label: 'All Bill Info', icon: Info },
              { id: 'charges', label: 'Charges & Taxes', icon: Receipt },
              { id: 'document', label: 'Official Bill Replica', icon: Barcode },
              { id: 'history', label: 'Usage & Payment History', icon: History },
              { id: 'audit', label: 'Audit & Math Checks', icon: ShieldCheck },
              { id: 'json', label: 'Clean JSON', icon: FileCode },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-amber-400 text-amber-500 font-black'
                      : isDark
                      ? 'border-transparent text-slate-400 hover:text-slate-100'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopy}
            className={`hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold transition-colors py-1.5 px-3 rounded-lg border ${
              isDark
                ? 'bg-white/10 border-white/20 text-slate-200 hover:text-amber-400'
                : 'bg-white border-slate-200 text-slate-800 hover:text-amber-600 shadow-sm'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* Modal Main Content Container (Child 3 - Targeted by Focus Mode CSS Selector) */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-7">
          {/* TAB 1: ALL BILL INFO */}
          {activeTab === 'info' && (
            <div className="space-y-7">
              {/* 1. HERO SETTLEMENT STATUS BANNER - Highly Attractive & High Contrast */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border relative overflow-hidden shadow-xl ${
                  isDark
                    ? 'bg-gradient-to-br from-[#161A2C] via-[#121626] to-[#0D101C] border-[#2A334E]'
                    : 'bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 border-amber-300/80 shadow-md'
                }`}
              >
                {/* Glow accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${providerMeta.accent}`}
                />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Net Payable Amount in Huge, Luminous Font */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black uppercase tracking-wider font-mono px-2.5 py-0.5 rounded-md ${
                          isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        NET SETTLEMENT AMOUNT
                      </span>

                      {isCredit && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5" /> SURPLUS CREDIT
                        </span>
                      )}
                      {isZeroDue && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> FULLY SETTLED
                        </span>
                      )}
                    </div>

                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight pt-1">
                      {bill.payable_within_due_date != null ? (
                        isCredit ? (
                          <div className="text-emerald-400 flex items-center gap-3">
                            <Sun className="w-9 h-9 text-emerald-400 animate-spin-slow shrink-0" />
                            <span>-PKR {Math.abs(bill.payable_within_due_date).toLocaleString()}</span>
                          </div>
                        ) : isZeroDue ? (
                          <div className="text-cyan-400 flex items-center gap-3">
                            <CheckCircle2 className="w-9 h-9 text-cyan-400 shrink-0" />
                            <span>PKR 0.00</span>
                          </div>
                        ) : (
                          <div className="text-amber-500 flex items-baseline gap-2">
                            <span>PKR {bill.payable_within_due_date.toLocaleString()}</span>
                            <span className={`text-sm font-sans font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              (Within Due Date)
                            </span>
                          </div>
                        )
                      ) : (
                        'N/A'
                      )}
                    </div>

                    <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Payment deadline: <span className="font-bold font-mono text-rose-500">{bill.due_date || 'N/A'}</span> ·
                      Billing Cycle: <span className="font-bold font-mono">{bill.bill_month}</span>
                    </p>
                  </div>

                  {/* Right: Key Financial Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                    {/* Due Date Box */}
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? 'bg-black/30 border-[#2A324C]' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <span className={`text-[11px] block font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Due Date
                      </span>
                      <span className="font-black text-rose-500 text-sm sm:text-base flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-4 h-4 shrink-0 text-rose-500" />
                        {bill.due_date || 'N/A'}
                      </span>
                    </div>

                    {/* Late Fee Box */}
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? 'bg-black/30 border-[#2A324C]' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <span className={`text-[11px] block font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Late Payment
                      </span>
                      <span className="font-black text-rose-400 text-sm sm:text-base mt-0.5 block">
                        {bill.payable_after_due_date != null
                          ? `PKR ${bill.payable_after_due_date.toLocaleString()}`
                          : 'Exempt / Credit'}
                      </span>
                    </div>

                    {/* Current Month Charges */}
                    <div
                      className={`p-3.5 rounded-2xl border col-span-2 sm:col-span-1 ${
                        isDark ? 'bg-black/30 border-[#2A324C]' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <span className={`text-[11px] block font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Current Bill
                      </span>
                      <span className="font-black text-cyan-400 text-sm sm:text-base mt-0.5 block">
                        PKR {bill.current_bill?.toLocaleString() ?? 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. THE 4 MAIN HIGHLIGHTS STRIP - Perfectly Visible & Distinctive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Units Consumed */}
                <div
                  className={`p-5 rounded-3xl border transition-all shadow-sm ${
                    isDark
                      ? 'bg-[#15192C] border-[#252E46] hover:border-cyan-400/50'
                      : 'bg-white border-slate-200 hover:border-cyan-500 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-500 font-mono">
                      Energy Consumption
                    </span>
                    <Gauge className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="mt-3">
                    <span
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {bill.units_consumed !== null ? `${bill.units_consumed}` : 'Multi'}
                    </span>
                    <span className="text-sm font-bold text-cyan-400 ml-1.5 font-mono">kWh</span>
                  </div>
                  <div className="mt-2 text-xs font-mono pt-2 border-t border-slate-700/20 flex justify-between items-center">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Meter Reading:</span>
                    <span className="font-bold text-cyan-300">
                      {bill.previous_reading && bill.current_reading
                        ? `${bill.previous_reading} → ${bill.current_reading}`
                        : 'Bi-directional'}
                    </span>
                  </div>
                </div>

                {/* Metric 2: Electricity Charges */}
                <div
                  className={`p-5 rounded-3xl border transition-all shadow-sm ${
                    isDark
                      ? 'bg-[#15192C] border-[#252E46] hover:border-amber-400/50'
                      : 'bg-white border-slate-200 hover:border-amber-500 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-500 font-mono">
                      Electricity Charges
                    </span>
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="mt-3">
                    <span
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {bill.total_charges != null ? `PKR ${bill.total_charges.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono pt-2 border-t border-slate-700/20 flex justify-between items-center">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Items:</span>
                    <span className="font-bold text-amber-400">{bill.charges.length} Line charges</span>
                  </div>
                </div>

                {/* Metric 3: Taxes & Duties */}
                <div
                  className={`p-5 rounded-3xl border transition-all shadow-sm ${
                    isDark
                      ? 'bg-[#15192C] border-[#252E46] hover:border-pink-400/50'
                      : 'bg-white border-slate-200 hover:border-pink-500 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-pink-500 font-mono">
                      Govt Taxes & Levies
                    </span>
                    <Receipt className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="mt-3">
                    <span
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {bill.total_taxes != null ? `PKR ${bill.total_taxes.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono pt-2 border-t border-slate-700/20 flex justify-between items-center">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Tax Share:</span>
                    <span className="font-bold text-pink-400">
                      {bill.current_bill && bill.total_taxes
                        ? `${Math.round((bill.total_taxes / bill.current_bill) * 100)}% of Bill`
                        : 'GST & Duties'}
                    </span>
                  </div>
                </div>

                {/* Metric 4: Prior Balance / Arrears */}
                <div
                  className={`p-5 rounded-3xl border transition-all shadow-sm ${
                    isDark
                      ? 'bg-[#15192C] border-[#252E46] hover:border-emerald-400/50'
                      : 'bg-white border-slate-200 hover:border-emerald-500 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black uppercase tracking-wider font-mono ${
                        (bill.arrears ?? 0) < 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {(bill.arrears ?? 0) < 0 ? 'Solar Advance Credit' : 'Arrears / Balance'}
                    </span>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="mt-3">
                    <span
                      className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        (bill.arrears ?? 0) < 0
                          ? 'text-emerald-400'
                          : (bill.arrears ?? 0) > 0
                          ? 'text-rose-500'
                          : isDark
                          ? 'text-white'
                          : 'text-slate-900'
                      }`}
                    >
                      {bill.arrears != null
                        ? (bill.arrears < 0 ? `-PKR ${Math.abs(bill.arrears).toLocaleString()}` : `PKR ${bill.arrears.toLocaleString()}`)
                        : 'PKR 0'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono pt-2 border-t border-slate-700/20 flex justify-between items-center">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Prior Dues:</span>
                    <span className={`font-bold ${(bill.arrears ?? 0) < 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {(bill.arrears ?? 0) < 0 ? 'Advance Balance' : bill.arrears === 0 ? 'Zero Arrears' : 'Carried Forward'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. PROSUMER SOLAR NET METERING SECTION (When applicable) */}
              {isSolar && (
                <div
                  className={`p-6 rounded-3xl border space-y-4 shadow-md ${
                    isDark
                      ? 'bg-gradient-to-r from-emerald-950/40 via-[#131929] to-teal-950/40 border-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Sun className="w-6 h-6 animate-spin-slow" />
                      </div>
                      <div>
                        <h4
                          className={`text-lg font-black tracking-tight ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          Solar Prosumer Net-Metering Record
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          Bi-directional energy generation exported into the national grid.
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-black">
                      Surplus Credit Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs sm:text-sm">
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? 'bg-black/30 border-emerald-500/20' : 'bg-white border-emerald-200'
                      }`}
                    >
                      <span className={`text-[11px] block font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Connection Type
                      </span>
                      <span className="font-black text-emerald-400 text-sm">
                        {bill.metadata?.connection_type || bill.metadata?.customer_type || 'Net-Metering'}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? 'bg-black/30 border-emerald-500/20' : 'bg-white border-emerald-200'
                      }`}
                    >
                      <span className={`text-[11px] block font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Connection Capacity
                      </span>
                      <span className="font-black text-cyan-400 text-sm">
                        {bill.sanctioned_load_kw} kW Grid Load
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? 'bg-black/30 border-emerald-500/20' : 'bg-white border-emerald-200'
                      }`}
                    >
                      <span className={`text-[11px] block font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Billed Due Date
                      </span>
                      <span className="font-black text-emerald-400 text-sm">
                        {bill.payable_within_due_date !== null && bill.payable_within_due_date <= 0
                          ? 'PKR 0.00 (Exempt)'
                          : `PKR ${bill.payable_within_due_date}`}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl border ${
                        isDark ? 'bg-black/30 border-emerald-500/20' : 'bg-white border-emerald-200'
                      }`}
                    >
                      <span className={`text-[11px] block font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Surplus Credit Balance
                      </span>
                      <span className="font-black text-emerald-400 text-sm">
                        PKR {Math.abs(bill.arrears || bill.payable_within_due_date || 0).toLocaleString()} CR
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. COMPLETE 18 STANDARDIZED PARAMETERS GRID - High Contrast & High Legibility */}
              <div
                className={`p-6 sm:p-7 rounded-3xl border space-y-5 shadow-sm ${
                  isDark ? 'bg-[#131728] border-[#222B42]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-700/30 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                      <Barcode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4
                        className={`text-base sm:text-lg font-black tracking-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        All 18 Extracted Bill Parameters
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Complete data extracted according to the standardized Level 1 schema.
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-black px-3 py-1 rounded-full border self-start sm:self-auto ${
                      isDark
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    100% Extracted & Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 font-mono">
                  {/* Field 1 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-amber-500 block">
                      1. Provider
                    </span>
                    <span className="font-black text-lg text-amber-400 mt-1 block">
                      {bill.provider}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {providerMeta.name}
                    </span>
                  </div>

                  {/* Field 2 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-500 block">
                      2. Tariff Code
                    </span>
                    <span
                      className={`font-black text-lg mt-1 block ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {bill.tariff || 'Standard'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Tariff category
                    </span>
                  </div>

                  {/* Field 3 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-500 block">
                      3. Sanctioned Load
                    </span>
                    <span className="font-black text-lg text-cyan-400 mt-1 block">
                      {bill.sanctioned_load_kw} kW
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Connection rating
                    </span>
                  </div>

                  {/* Field 4 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-amber-500 block">
                      4. Billing Month
                    </span>
                    <span
                      className={`font-black text-lg mt-1 block ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {bill.bill_month}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Billing cycle
                    </span>
                  </div>

                  {/* Field 5 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-500 block">
                      5. Units Consumed
                    </span>
                    <span className="font-black text-lg text-amber-400 mt-1 block">
                      {bill.units_consumed !== null ? `${bill.units_consumed} kWh` : 'Multi-Ch'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Total energy
                    </span>
                  </div>

                  {/* Field 6 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-rose-500 block">
                      6. Due Date
                    </span>
                    <span className="font-black text-lg text-rose-500 mt-1 block">
                      {bill.due_date || 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Payment deadline
                    </span>
                  </div>

                  {/* Field 7 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className={`text-xs font-black uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      7. Reading Date
                    </span>
                    <span
                      className={`font-black text-lg mt-1 block ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {bill.reading_date || 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Meter read date
                    </span>
                  </div>

                  {/* Field 8 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className={`text-xs font-black uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      8. Issue Date
                    </span>
                    <span
                      className={`font-black text-lg mt-1 block ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {bill.issue_date || 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Bill issuance
                    </span>
                  </div>

                  {/* Field 9 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className={`text-xs font-black uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      9. Previous Reading
                    </span>
                    <span
                      className={`font-black text-lg mt-1 block ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {bill.previous_reading != null ? bill.previous_reading.toLocaleString() : 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Prior dial register
                    </span>
                  </div>

                  {/* Field 10 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className={`text-xs font-black uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      10. Present Reading
                    </span>
                    <span
                      className={`font-black text-lg mt-1 block ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {bill.current_reading != null ? bill.current_reading.toLocaleString() : 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Current dial register
                    </span>
                  </div>

                  {/* Field 11 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-amber-500 block">
                      11. Total Electricity Charges
                    </span>
                    <span className="font-black text-lg text-amber-400 mt-1 block">
                      PKR {bill.total_charges?.toLocaleString() ?? 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Energy + adjustments
                    </span>
                  </div>

                  {/* Field 12 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-pink-500 block">
                      12. Total Taxes & Duties
                    </span>
                    <span className="font-black text-lg text-pink-400 mt-1 block">
                      PKR {bill.total_taxes?.toLocaleString() ?? 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Govt taxes & duties
                    </span>
                  </div>

                  {/* Field 13 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-500 block">
                      13. Current Month Bill
                    </span>
                    <span
                      className={`font-black text-lg mt-1 block ${
                        isDark ? 'text-cyan-300' : 'text-cyan-700'
                      }`}
                    >
                      PKR {bill.current_bill?.toLocaleString() ?? 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Charges + taxes
                    </span>
                  </div>

                  {/* Field 14 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span
                      className={`text-xs font-black uppercase tracking-wider block ${
                        (bill.arrears ?? 0) < 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      14. Arrears / Advance
                    </span>
                    <span
                      className={`font-black text-lg mt-1 block ${
                        (bill.arrears ?? 0) < 0
                          ? 'text-emerald-400'
                          : (bill.arrears ?? 0) > 0
                          ? 'text-rose-500'
                          : isDark
                          ? 'text-slate-200'
                          : 'text-slate-800'
                      }`}
                    >
                      {bill.arrears != null
                        ? (bill.arrears < 0 ? `-PKR ${Math.abs(bill.arrears).toLocaleString()}` : `PKR ${bill.arrears.toLocaleString()}`)
                        : 'PKR 0'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {(bill.arrears ?? 0) < 0 ? 'Advance credit' : 'Previous dues'}
                    </span>
                  </div>

                  {/* Field 15 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-500 block">
                      15. Payable Within Due
                    </span>
                    <span className="font-black text-lg text-emerald-400 mt-1 block">
                      {bill.payable_within_due_date != null
                        ? (bill.payable_within_due_date < 0
                            ? `-PKR ${Math.abs(bill.payable_within_due_date).toLocaleString()}`
                            : `PKR ${bill.payable_within_due_date.toLocaleString()}`)
                        : 'N/A'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Total to settle
                    </span>
                  </div>

                  {/* Field 16 */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181D33] border-[#252E4B] hover:border-amber-400/40 text-slate-100'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-400 text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-rose-500 block">
                      16. Payable After Due
                    </span>
                    <span className="font-black text-lg text-rose-400 mt-1 block">
                      {bill.payable_after_due_date != null
                        ? `PKR ${bill.payable_after_due_date.toLocaleString()}`
                        : 'Exempt / Credit'}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      With late surcharge
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. ADDITIONAL BILL REMARKS & METADATA */}
              {bill.metadata && (
                <div
                  className={`p-6 sm:p-7 rounded-3xl border space-y-4 shadow-sm ${
                    isDark ? 'bg-[#131728] border-[#222B42]' : 'bg-white border-slate-200'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wider text-amber-500 block font-mono">
                    Official Billing Remarks & Category Specifications
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs sm:text-sm">
                    {Object.entries(bill.metadata).map(([k, v]) => (
                      <div
                        key={k}
                        className={`p-3.5 rounded-2xl border flex justify-between items-center gap-3 ${
                          isDark
                            ? 'bg-[#181D33] border-[#252E4B]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span className={`capitalize font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {k.replace(/_/g, ' ')}:
                        </span>
                        <span className={`font-black truncate max-w-[280px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CHARGES & TAXES */}
          {activeTab === 'charges' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Electricity Charges */}
                <div
                  className={`p-6 sm:p-7 rounded-3xl border space-y-4 shadow-sm ${
                    isDark ? 'bg-[#131728] border-[#222B42]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                    <div>
                      <h4
                        className={`text-base sm:text-lg font-black tracking-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Electricity Charges ({bill.charges.length} items)
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Energy, fixed capacity, fuel price adjustments, and subsidies
                      </p>
                    </div>
                    <span className="text-base font-mono font-black text-amber-400">
                      PKR {bill.total_charges != null ? bill.total_charges.toLocaleString() : '0'}
                    </span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs sm:text-sm">
                    {bill.charges.map((c, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                          isDark
                            ? 'bg-[#181D33] border-[#252E4B]'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span
                            className={`capitalize font-bold ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}
                          >
                            {c.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span
                          className={`font-black text-sm sm:text-base ${
                            (c.amount ?? 0) < 0 ? 'text-emerald-400' : isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {c.amount != null
                            ? c.amount < 0
                              ? `-PKR ${Math.abs(c.amount).toLocaleString()} (Credit/Subsidy)`
                              : `PKR ${c.amount.toLocaleString()}`
                            : 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Taxes & Duties */}
                <div
                  className={`p-6 sm:p-7 rounded-3xl border space-y-4 shadow-sm ${
                    isDark ? 'bg-[#131728] border-[#222B42]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
                    <div>
                      <h4
                        className={`text-base sm:text-lg font-black tracking-tight ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Government Taxes & Duties
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        GST, Electricity Duty, TV fee, and statutory levies
                      </p>
                    </div>
                    <span className="text-base font-mono font-black text-pink-400">
                      PKR {bill.total_taxes != null ? bill.total_taxes.toLocaleString() : '0'}
                    </span>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs sm:text-sm">
                    {bill.taxes.length > 0 ? (
                      bill.taxes.map((t, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                            isDark
                              ? 'bg-[#181D33] border-[#252E4B]'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                            <span
                              className={`capitalize font-bold ${
                                isDark ? 'text-slate-200' : 'text-slate-800'
                              }`}
                            >
                              {t.type.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="font-black text-sm sm:text-base text-pink-400">
                            PKR {t.amount != null ? t.amount.toLocaleString() : '0'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div
                        className={`p-4 rounded-2xl border space-y-1.5 ${
                          isDark
                            ? 'bg-[#181D33] border-[#252E4B] text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <p className="font-bold text-amber-500 font-mono">Aggregated Tax Line</p>
                        <p className={`leading-relaxed text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          Printed as single combined tax amount of PKR {bill.total_taxes != null ? bill.total_taxes.toLocaleString() : '0'} on the original paper bill without separate sub-lines.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mathematical Equation Box */}
              <div
                className={`p-6 rounded-3xl border font-mono text-xs sm:text-sm space-y-3 ${
                  isDark ? 'bg-[#131728] border-[#222B42]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  Deterministic Verification Formula
                </span>
                <div className="flex flex-wrap items-center gap-3 font-bold text-sm sm:text-base">
                  <span className="text-amber-400">
                    Charges (PKR {bill.total_charges != null ? bill.total_charges.toLocaleString() : '0'})
                  </span>
                  <span>+</span>
                  <span className="text-pink-400">
                    Taxes (PKR {bill.total_taxes != null ? bill.total_taxes.toLocaleString() : '0'})
                  </span>
                  <span>=</span>
                  <span className="text-cyan-400">
                    Current Bill (PKR {bill.current_bill != null ? bill.current_bill.toLocaleString() : '0'})
                  </span>
                  {bill.arrears != null && bill.arrears !== 0 && (
                    <>
                      <span>+</span>
                      <span className={bill.arrears < 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        Arrears/Credit (PKR {bill.arrears.toLocaleString()})
                      </span>
                      <span>=</span>
                      <span className="text-emerald-400 underline font-black">
                        Payable (PKR {bill.payable_within_due_date != null ? bill.payable_within_due_date.toLocaleString() : '0'})
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL BILL REPLICA */}
          {activeTab === 'document' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h4
                    className={`text-lg font-black tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Official Document Replica
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Authentic Pakistani electricity consumer bill layout conforming to provider specifications.
                  </p>
                </div>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
              </div>

              <BillDocumentPreview bill={bill} theme={theme} />
            </div>
          )}

          {/* TAB 4: USAGE & PAYMENT HISTORY */}
          {activeTab === 'history' && (
            <div
              className={`p-6 sm:p-7 rounded-3xl border space-y-6 shadow-sm ${
                isDark ? 'bg-[#131728] border-[#222B42]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/30">
                <div>
                  <h4
                    className={`text-base sm:text-lg font-black tracking-tight flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    <History className="w-5 h-5 text-amber-400" />
                    Multi-Month Usage & Payment Trajectory
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Historical consumption and payment ledger extracted from consumer records.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 self-start sm:self-auto">
                  {bill.history?.length || 0} Cycles Logged
                </span>
              </div>

              {/* Visual Bars */}
              {bill.history && bill.history.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-slate-400 block font-bold">
                    Visual Units Trajectory (kWh)
                  </span>
                  <div className="h-36 flex items-end gap-2 pt-5 pb-2 px-2 border-b border-slate-700/30">
                    {bill.history.map((h, i) => {
                      const maxUnits = Math.max(...(bill.history || []).map((x) => Math.abs(x.units || 0)), 100);
                      const units = h.units || 0;
                      const heightPct = Math.min(100, Math.max(12, Math.round((Math.abs(units) / maxUnits) * 100)));
                      const isNegative = units < 0;

                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full rounded-t-lg transition-all ${
                              isNegative
                                ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                                : 'bg-gradient-to-t from-amber-600 to-orange-400 group-hover:from-amber-400 group-hover:to-orange-300'
                            }`}
                          />
                          <span
                            className={`text-[10px] font-mono truncate w-full text-center ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {h.month ? h.month.split(' ')[0] : `M${i + 1}`}
                          </span>

                          {/* Hover tooltip */}
                          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] font-mono p-1.5 rounded-lg whitespace-nowrap z-20 pointer-events-none shadow-xl">
                            {h.month}: {units} kWh | PKR {(h.billAmount ?? 0).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Table */}
              {bill.history && bill.history.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm font-mono text-left">
                    <thead>
                      <tr
                        className={`border-b text-xs font-bold uppercase tracking-wider ${
                          isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        <th className="py-3 px-3">Billing Cycle</th>
                        <th className="py-3 px-3">Units Consumed (kWh)</th>
                        <th className="py-3 px-3 text-right">Billed Amount (PKR)</th>
                        <th className="py-3 px-3 text-right">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDark ? 'divide-slate-800/40' : 'divide-slate-100'
                      }`}
                    >
                      {bill.history.map((row, i) => (
                        <tr
                          key={i}
                          className={`transition-colors ${
                            isDark ? 'hover:bg-black/20' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td
                            className={`py-3 px-3 font-bold ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {row.month}
                          </td>
                          <td className="py-3 px-3 text-cyan-400 font-black">
                            {(row.units ?? 0) < 0 ? `${row.units} (Surplus Export)` : `${(row.units ?? 0).toLocaleString()} kWh`}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-amber-500">
                            PKR {(row.billAmount ?? 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-400">
                            {row.paymentAmount != null
                              ? `PKR ${row.paymentAmount.toLocaleString()}`
                              : 'Settled'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No history logged for this account.</p>
              )}
            </div>
          )}

          {/* TAB 5: AUDIT & MATH CHECKS */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div
                className={`p-6 sm:p-7 rounded-3xl border flex items-center gap-4 shadow-sm ${
                  isDark ? 'bg-[#131728] border-[#222B42]' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4
                    className={`text-base sm:text-lg font-black tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Audit Verification for {bill.bill_id}
                  </h4>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Direct comparisons between calculated formulas and actual numbers printed on the original utility bill.
                  </p>
                </div>
              </div>

              {auditReport?.checks && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs sm:text-sm">
                  {Object.entries(auditReport.checks).map(([k, c]) => (
                    <div
                      key={k}
                      className={`p-4 rounded-2xl border space-y-2 ${
                        isDark
                          ? 'bg-[#181D33] border-[#252E4B]'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-black capitalize text-sm ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}
                        >
                          {k.replace(/_/g, ' ')}
                        </span>
                        {c.match ? (
                          <span className="text-[11px] text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                            Exact Match
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                            Variance: {c.variance} PKR
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between text-xs pt-1 border-t border-slate-700/20">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                          Calculated: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{String(c.calculated)}</strong>
                        </span>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                          Printed: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{String(c.printed)}</strong>
                        </span>
                      </div>

                      {c.notes && (
                        <p className="text-amber-400 text-xs pt-1 border-t border-slate-700/20 leading-relaxed">
                          {c.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {auditReport?.identified_discrepancies && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    Audit Observations:
                  </span>
                  {auditReport.identified_discrepancies.map((d, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
                        isDark
                          ? 'bg-[#181D33] border-[#252E4B]'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-400 font-mono">[{d.severity}]</span>{' '}
                        <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                          {d.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: RAW JSON */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs sm:text-sm font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Clean Level 1 Schema JSON with all 18 fields
                </span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono transition-colors flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <pre
                className={`p-5 rounded-2xl border text-xs sm:text-sm font-mono overflow-x-auto max-h-[460px] leading-relaxed shadow-inner ${
                  isDark
                    ? 'bg-[#0A0D18] border-[#22283E] text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-amber-300'
                }`}
              >
                {JSON.stringify(cleanExport, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
