import React from 'react';
import { BillRecord } from '../types';
import { Sun, CheckCircle2, ShieldCheck, Printer, Barcode } from 'lucide-react';

interface BillDocumentPreviewProps {
  bill: BillRecord;
  theme: 'dark' | 'light';
}

export const BillDocumentPreview: React.FC<BillDocumentPreviewProps> = ({ bill, theme }) => {
  const isDark = theme === 'dark';
  const isCredit = (bill.payable_within_due_date ?? 0) < 0;
  const isZeroDue = bill.payable_within_due_date === 0;

  // Provider styles & authentic headers
  const providerMeta = {
    KE: {
      name: 'K-ELECTRIC LIMITED',
      regNum: 'CUIN: 0000405 · GST: 02-01-2716-001-64',
      subtitle: 'Energy That Moves Karachi · Consumer Electricity Bill',
      accentColor: '#F97316',
      badgeBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      headerBg: isDark
        ? 'bg-gradient-to-r from-orange-950/70 via-[#181C2C] to-slate-900 border-orange-500/30'
        : 'bg-gradient-to-r from-orange-100/90 via-amber-50 to-orange-50 border-orange-300',
      headerText: isDark ? 'text-orange-400' : 'text-orange-900',
      emblem: '⚡ KE',
    },
    LESCO: {
      name: 'LAHORE ELECTRIC SUPPLY COMPANY',
      regNum: 'GOVT OF PAKISTAN · PEPCO / WAPDA · LESCO HOUSE',
      subtitle: 'Electricity Consumer Bill (General & Prosumer)',
      accentColor: '#06B6D4',
      badgeBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      headerBg: isDark
        ? 'bg-gradient-to-r from-cyan-950/70 via-[#181C2C] to-slate-900 border-cyan-500/30'
        : 'bg-gradient-to-r from-cyan-100/90 via-sky-50 to-blue-50 border-cyan-300',
      headerText: isDark ? 'text-cyan-400' : 'text-sky-900',
      emblem: '💧 LESCO',
    },
    IESCO: {
      name: 'ISLAMABAD ELECTRIC SUPPLY COMPANY',
      regNum: 'FEDERAL CAPITAL TERRITORY · GST: 07-01-2716-002-82',
      subtitle: 'Your Better Service - Our Pride · Consumer Bill',
      accentColor: '#10B981',
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      headerBg: isDark
        ? 'bg-gradient-to-r from-emerald-950/70 via-[#181C2C] to-slate-900 border-emerald-500/30'
        : 'bg-gradient-to-r from-emerald-100/90 via-teal-50 to-emerald-50 border-emerald-300',
      headerText: isDark ? 'text-emerald-400' : 'text-emerald-900',
      emblem: '🏛️ IESCO',
    },
  }[bill.provider];

  return (
    <div
      className={`rounded-3xl border transition-all text-xs font-sans overflow-hidden shadow-2xl relative ${
        isDark
          ? 'bg-[#111422] border-[#22283E] text-slate-200'
          : 'bg-white border-slate-300 text-slate-800'
      }`}
    >
      {/* Visual Watermark in background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <span className="text-8xl font-black uppercase tracking-widest font-mono">
          {bill.provider}
        </span>
      </div>

      {/* Top Utility Header */}
      <div className={`p-5 border-b ${providerMeta.headerBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shrink-0">
              {providerMeta.emblem}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`font-black text-base sm:text-lg tracking-tight ${providerMeta.headerText}`}>
                  {providerMeta.name}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">{providerMeta.regNum}</p>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {providerMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono bg-black/10 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">BILLING MONTH</span>
            <span className="font-black text-lg text-amber-500">{bill.bill_month}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">ID: {bill.bill_id}</span>
          </div>
        </div>
      </div>

      {/* Barcode & Reference Ribbon */}
      <div
        className={`px-5 py-2.5 border-b flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono ${
          isDark ? 'bg-[#0E101B] border-[#1E2335]' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <Barcode className="w-16 h-5 text-slate-400" />
          <span className="font-bold text-slate-400">
            REF: <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{bill.bill_id}-0842-PK</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
            ORIGINAL RECORD
          </span>
          <span className="text-slate-400">{bill.filename}</span>
        </div>
      </div>

      {/* Consumer & Connection Details Grid */}
      <div
        className={`p-4 border-b grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono ${
          isDark ? 'border-[#1E2335] bg-[#0C0E18]' : 'border-slate-200 bg-slate-50/70'
        }`}
      >
        <div className="p-2 rounded-xl bg-black/10">
          <span className="text-slate-400 block text-[10px] uppercase">Tariff Category</span>
          <span className="font-bold text-amber-400">{bill.tariff || 'A-1 Standard'}</span>
        </div>
        <div className="p-2 rounded-xl bg-black/10">
          <span className="text-slate-400 block text-[10px] uppercase">Sanctioned Load</span>
          <span className="font-bold text-cyan-400">{bill.sanctioned_load_kw} kW</span>
        </div>
        <div className="p-2 rounded-xl bg-black/10">
          <span className="text-slate-400 block text-[10px] uppercase">Issue Date</span>
          <span className="font-semibold text-slate-300">{bill.issue_date || 'N/A'}</span>
        </div>
        <div className="p-2 rounded-xl bg-black/10">
          <span className="text-slate-400 block text-[10px] uppercase">Payment Due Date</span>
          <span className="font-black text-rose-400">{bill.due_date || 'N/A'}</span>
        </div>
      </div>

      {/* Meter Reading Box */}
      <div className="p-5 border-b border-dashed border-slate-700/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Meter Reading Registers
            </span>
          </div>
          <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            {bill.units_consumed !== null ? `${bill.units_consumed} kWh Billed` : 'Net Metering Export/Import'}
          </span>
        </div>

        {/* Readings Columns */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-black/20 font-mono text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Previous Reading</span>
            <span className="font-bold text-slate-300 text-sm">
              {bill.previous_reading != null ? bill.previous_reading.toLocaleString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Present Reading</span>
            <span className="font-bold text-slate-300 text-sm">
              {bill.current_reading != null ? bill.current_reading.toLocaleString() : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Units Consumed</span>
            <span className="font-black text-amber-400 text-sm">
              {bill.units_consumed != null ? `${bill.units_consumed} kWh` : 'Multi-Tariff'}
            </span>
          </div>
        </div>

        {/* Additional Net-Metering breakdown if available */}
        {bill.metadata?.meter_registers && (
          <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px] text-center">
            {bill.metadata.meter_registers.map((reg: any, i: number) => (
              <div key={i} className="p-2 rounded-xl bg-black/15 border border-slate-800/40">
                <span className="text-[10px] text-slate-400 block">{reg.type}</span>
                <span className="font-bold text-cyan-300">{reg.units} kWh</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Itemized Charges & Taxes Breakdown */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Electricity Charges */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              Electricity Charges (PKR)
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {bill.charges.map((c, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400 capitalize">{c.type.replace('_', ' ')}:</span>
                  <span className={`font-semibold ${(c.amount ?? 0) < 0 ? 'text-emerald-400 font-bold' : 'text-slate-200'}`}>
                    {c.amount != null
                      ? c.amount < 0
                        ? `-PKR ${Math.abs(c.amount).toLocaleString()}`
                        : `PKR ${c.amount.toLocaleString()}`
                      : 'N/A'}
                  </span>
                </div>
              ))}
              <div className="flex justify-between py-1 font-bold text-amber-400 border-t border-slate-700/60 pt-1.5">
                <span>Total Charges:</span>
                <span>PKR {bill.total_charges != null ? bill.total_charges.toLocaleString() : '0'}</span>
              </div>
            </div>
          </div>

          {/* Taxes & Duties */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              Govt. Taxes & Surcharges (PKR)
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {bill.taxes.length > 0 ? (
                bill.taxes.map((t, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-400 capitalize">{t.type.replace('_', ' ')}:</span>
                    <span className="font-semibold text-pink-400">PKR {t.amount != null ? t.amount.toLocaleString() : '0'}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">Total Combined Taxes:</span>
                  <span className="font-semibold text-pink-400">PKR {bill.total_taxes != null ? bill.total_taxes.toLocaleString() : '0'}</span>
                </div>
              )}

              {bill.arrears != null && bill.arrears !== 0 && (
                <div className="flex justify-between py-1 border-b border-slate-800/40">
                  <span className="text-slate-400">
                    {bill.arrears < 0 ? 'Solar Surplus Credit:' : 'Arrears / Prior Balance:'}
                  </span>
                  <span className={`font-bold ${bill.arrears < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {bill.arrears < 0 ? `-PKR ${Math.abs(bill.arrears).toLocaleString()}` : `PKR ${bill.arrears.toLocaleString()}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 font-bold text-pink-400 border-t border-slate-700/60 pt-1.5">
                <span>Total Taxes:</span>
                <span>PKR {bill.total_taxes != null ? bill.total_taxes.toLocaleString() : '0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grand Total Settlement Card */}
      <div
        className={`p-5 border-t ${
          isDark ? 'bg-[#0A0C16] border-[#1E2335]' : 'bg-slate-100 border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
              AMOUNT PAYABLE WITHIN DUE DATE
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5">
              {isCredit ? (
                <span className="text-emerald-400 flex items-center gap-2">
                  <Sun className="w-6 h-6 animate-spin-slow" />
                  -PKR {Math.abs(bill.payable_within_due_date ?? 0).toLocaleString()} (CR)
                </span>
              ) : isZeroDue ? (
                <span className="text-cyan-400 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" /> PKR 0.00 (SETTLED)
                </span>
              ) : (
                <span className="text-amber-400">
                  PKR {bill.payable_within_due_date != null ? bill.payable_within_due_date.toLocaleString() : 'N/A'}
                </span>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right text-xs font-mono">
            <span className="text-slate-400 block text-[11px]">PAYABLE AFTER DUE DATE:</span>
            <span className="font-extrabold text-rose-400 text-base">
              {bill.payable_after_due_date != null
                ? `PKR ${bill.payable_after_due_date.toLocaleString()}`
                : 'SURCHARGE EXEMPT'}
            </span>
          </div>
        </div>
      </div>

      {/* Authentic Pakistani Utility Disclaimer in Urdu & English */}
      <div
        className={`px-5 py-3 border-t text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left ${
          isDark ? 'bg-[#080911] text-slate-400 border-[#1B1F30]' : 'bg-slate-200 text-slate-600 border-slate-300'
        }`}
      >
        <span className="font-sans font-medium" dir="rtl">
          بجلی چوری قومی جرم ہے۔ شکایات اور رہنمائی کے لیے ہیلپ لائن 118 پر رابطہ کریں۔
        </span>
        <span className="font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED CONSUMER INVOICE
        </span>
      </div>
    </div>
  );
};
