import React from 'react';
import { BillRecord } from '../types';
import { Calendar, Gauge, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BillCardProps {
  bill: BillRecord;
  isSelected: boolean;
  onSelect: () => void;
  discrepancyCount?: number;
}

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  isSelected,
  onSelect,
  discrepancyCount = 0,
}) => {
  const getProviderColor = (p: string) => {
    switch (p) {
      case 'KE':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'LESCO':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'IESCO':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const isCredit = (bill.payable_within_due_date ?? 0) < 0;

  return (
    <div
      onClick={onSelect}
      className={`relative p-5 rounded-xl border transition-all cursor-pointer text-left group ${
        isSelected
          ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
              {bill.bill_id}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium border ${getProviderColor(
                bill.provider
              )}`}
            >
              {bill.provider}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono mt-0.5 block">
            {bill.filename}
          </span>
        </div>

        {/* Audit Status */}
        {discrepancyCount > 0 ? (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <AlertCircle className="w-3 h-3" />
            {discrepancyCount} audit note{discrepancyCount > 1 ? 's' : ''}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        )}
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800/80 mb-3 text-xs">
        <div>
          <span className="text-slate-500 block mb-0.5">Billing Month</span>
          <span className="font-mono font-medium text-slate-200 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {bill.bill_month || 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Units Consumed</span>
          <span className="font-mono font-medium text-slate-200 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            {bill.units_consumed !== null ? `${bill.units_consumed} kWh` : 'Multi-register'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Tariff</span>
          <span className="font-mono text-slate-300 truncate block">
            {bill.tariff || 'Not specified'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Sanctioned Load</span>
          <span className="font-mono text-slate-300">
            {bill.sanctioned_load_kw !== null ? `${bill.sanctioned_load_kw} kW` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 block">Payable (On Due Date)</span>
          <span
            className={`font-mono text-sm font-bold ${
              isCredit
                ? 'text-emerald-400'
                : bill.payable_within_due_date === 0
                ? 'text-slate-400'
                : 'text-amber-400'
            }`}
          >
            {bill.payable_within_due_date != null
              ? isCredit
                ? `PKR ${bill.payable_within_due_date} (Credit)`
                : `PKR ${bill.payable_within_due_date.toLocaleString()}`
              : 'N/A'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-amber-300 transition-colors">
          <span>Inspect</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
