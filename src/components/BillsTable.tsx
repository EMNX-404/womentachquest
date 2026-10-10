import React, { useState } from 'react';
import { BillRecord } from '../types';
import {
  Download,
  CheckCircle2,
  Clock,
  Sun,
  Eye,
  Plus,
} from 'lucide-react';

interface BillsTableProps {
  bills: BillRecord[];
  onSelectBill: (billId: string) => void;
  onOpenUpload: () => void;
  searchQuery: string;
  theme?: 'dark' | 'light';
}

export const BillsTable: React.FC<BillsTableProps> = ({
  bills,
  onSelectBill,
  onOpenUpload,
  searchQuery,
  theme = 'dark',
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');

  const isDark = theme === 'dark';

  // Filter logic
  const filtered = bills.filter((b) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = b.bill_id.toLowerCase().includes(q);
      const matchProv = b.provider.toLowerCase().includes(q);
      const matchTariff = (b.tariff || '').toLowerCase().includes(q);
      if (!matchId && !matchProv && !matchTariff) return false;
    }

    // Provider filter
    if (selectedProvider !== 'ALL' && b.provider !== selectedProvider) {
      return false;
    }

    // Status filter
    if (selectedStatus === 'DUE') {
      return (b.payable_within_due_date ?? 0) > 0;
    }
    if (selectedStatus === 'CREDIT') {
      return (b.payable_within_due_date ?? 0) <= 0;
    }
    if (selectedStatus === 'COMMERCIAL') {
      return b.tariff?.includes('A-2');
    }

    return true;
  });

  // Category counts
  const dueCount = bills.filter((b) => (b.payable_within_due_date ?? 0) > 0).length;
  const creditCount = bills.filter((b) => (b.payable_within_due_date ?? 0) <= 0).length;
  const commercialCount = bills.filter((b) => b.tariff?.includes('A-2')).length;

  return (
    <div className="space-y-6">
      {/* 4 Colored Category Status Cards (matching Screenshot 2 Order List top cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: All Bills */}
        <div
          onClick={() => setSelectedStatus('ALL')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer select-none relative overflow-hidden ${
            selectedStatus === 'ALL'
              ? isDark
                ? 'bg-[#1C2030] border-blue-500 shadow-lg shadow-blue-500/10'
                : 'bg-blue-50/70 border-blue-400 shadow-md'
              : isDark
              ? 'bg-[#161822] hover:bg-[#1A1D2A] border-[#212638]'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider font-mono">
              All Bills
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-black font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {bills.length}
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Accounts active
            </span>
          </div>
        </div>

        {/* Card 2: Due for Payment */}
        <div
          onClick={() => setSelectedStatus('DUE')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer select-none relative overflow-hidden ${
            selectedStatus === 'DUE'
              ? isDark
                ? 'bg-[#1C2030] border-amber-500 shadow-lg shadow-amber-500/10'
                : 'bg-amber-50/70 border-amber-400 shadow-md'
              : isDark
              ? 'bg-[#161822] hover:bg-[#1A1D2A] border-[#212638]'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">
              Payable Dues
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-mono">{dueCount}</span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Due this month
            </span>
          </div>
        </div>

        {/* Card 3: Solar Credit / Advance */}
        <div
          onClick={() => setSelectedStatus('CREDIT')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer select-none relative overflow-hidden ${
            selectedStatus === 'CREDIT'
              ? isDark
                ? 'bg-[#1C2030] border-emerald-500 shadow-lg shadow-emerald-500/10'
                : 'bg-emerald-50/70 border-emerald-400 shadow-md'
              : isDark
              ? 'bg-[#161822] hover:bg-[#1A1D2A] border-[#212638]'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider font-mono">
              Solar Credit
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {creditCount}
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Zero PKR due
            </span>
          </div>
        </div>

        {/* Card 4: Commercial Connections */}
        <div
          onClick={() => setSelectedStatus('COMMERCIAL')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer select-none relative overflow-hidden ${
            selectedStatus === 'COMMERCIAL'
              ? isDark
                ? 'bg-[#1C2030] border-purple-500 shadow-lg shadow-purple-500/10'
                : 'bg-purple-50/70 border-purple-400 shadow-md'
              : isDark
              ? 'bg-[#161822] hover:bg-[#1A1D2A] border-[#212638]'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider font-mono">
              Commercial
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-black font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {commercialCount}
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Tariff A-2
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div
        className={`rounded-3xl p-6 shadow-sm space-y-4 border ${
          isDark
            ? 'bg-[#161822] border-[#212638] text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-md shadow-slate-200/50'
        }`}
      >
        {/* Table Toolbar */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? 'border-[#212638]' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black tracking-tight">Accounts & Invoices</h3>
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                isDark ? 'bg-[#1E2230] text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {filtered.length} of {bills.length} Records
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Filter by Provider */}
            <div
              className={`flex items-center gap-1 p-1 rounded-2xl border ${
                isDark ? 'bg-[#10121A] border-[#212638]' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {['ALL', 'KE', 'LESCO', 'IESCO'].map((prov) => (
                <button
                  key={prov}
                  onClick={() => setSelectedProvider(prov)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    selectedProvider === prov
                      ? isDark
                        ? 'bg-[#22283A] text-amber-300 shadow-sm'
                        : 'bg-white text-amber-700 shadow-sm border border-slate-200'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>

            {/* Export CSV */}
            <a
              href="/api/export/level1.csv"
              download="bills_summary.csv"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-colors ${
                isDark
                  ? 'bg-[#1E2232] hover:bg-[#252B3E] text-slate-200 border-[#2B3248]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>

            {/* Scan Bill */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Scan Bill</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold uppercase tracking-wider font-mono ${
                  isDark ? 'border-[#212638] text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                <th className="py-3 px-4">Bill ID</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Tariff & Load</th>
                <th className="py-3 px-4">Units Used</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-sm ${
                isDark ? 'divide-[#1D2130]' : 'divide-slate-100'
              }`}
            >
              {filtered.map((bill) => {
                const isCredit = (bill.payable_within_due_date ?? 0) < 0;
                const isZeroDue = bill.payable_within_due_date === 0;

                return (
                  <tr
                    key={bill.bill_id}
                    onClick={() => onSelectBill(bill.bill_id)}
                    className={`transition-colors cursor-pointer group ${
                      isDark ? 'hover:bg-[#1A1E2C]' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Bill ID */}
                    <td className="py-4 px-4 font-mono font-bold group-hover:text-amber-500 transition-colors">
                      {bill.bill_id}
                      <span className="block text-xs font-normal text-slate-400 font-sans">
                        {bill.filename}
                      </span>
                    </td>

                    {/* Provider */}
                    <td className="py-4 px-4 font-bold">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-mono border ${
                          bill.provider === 'KE'
                            ? 'text-orange-500 bg-orange-500/10 border-orange-500/20'
                            : bill.provider === 'LESCO'
                            ? 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
                            : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                        }`}
                      >
                        {bill.provider}
                      </span>
                    </td>

                    {/* Tariff */}
                    <td className="py-4 px-4 text-xs">
                      <span className="font-mono font-bold block">{bill.tariff || 'Standard'}</span>
                      <span className="text-slate-400">
                        {bill.sanctioned_load_kw ? `${bill.sanctioned_load_kw} kW Load` : 'Active'}
                      </span>
                    </td>

                    {/* Units Consumed */}
                    <td className="py-4 px-4 font-mono font-bold">
                      {bill.units_consumed !== null ? (
                        <span className="text-sm font-extrabold">{bill.units_consumed} kWh</span>
                      ) : (
                        <span className="text-xs text-slate-400">Multi-Register</span>
                      )}
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-4 font-mono text-xs font-semibold">
                      {bill.due_date || 'N/A'}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 text-right font-mono font-black text-base">
                      {bill.payable_within_due_date != null ? (
                        isCredit ? (
                          <span className="text-emerald-500">
                            -PKR {Math.abs(bill.payable_within_due_date).toLocaleString()}
                          </span>
                        ) : isZeroDue ? (
                          <span className="text-slate-400">PKR 0.00</span>
                        ) : (
                          <span className="text-amber-500">
                            PKR {bill.payable_within_due_date.toLocaleString()}
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    {/* Status Pill Badge */}
                    <td className="py-4 px-4 text-center">
                      {isCredit ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                          <Sun className="w-3.5 h-3.5" /> Advance Credit
                        </span>
                      ) : isZeroDue ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-cyan-500 bg-cyan-500/10 border border-cyan-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Fully Settled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> Payment Due
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBill(bill.bill_id);
                        }}
                        className={`p-2 rounded-xl transition-colors inline-flex items-center justify-center ${
                          isDark
                            ? 'bg-[#202536] hover:bg-amber-500 hover:text-slate-950 text-slate-300'
                            : 'bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700'
                        }`}
                        title="Inspect full details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
