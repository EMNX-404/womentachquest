import React, { useState } from 'react';
import { BillRecord, BillAuditReport } from '../types';
import {
  Calendar,
  Gauge,
  Receipt,
  FileCode,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
} from 'lucide-react';

interface BillDetailViewProps {
  bill: BillRecord;
  auditReport?: BillAuditReport;
  onOpenQnA?: () => void;
}

export const BillDetailView: React.FC<BillDetailViewProps> = ({
  bill,
  auditReport,
  onOpenQnA,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'audit' | 'json'>('overview');
  const [copiedJson, setCopiedJson] = useState(false);

  // Pure Level 1 schema output (18 fields, no metadata)
  const level1CleanObject = {
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
  };

  const jsonString = JSON.stringify(level1CleanObject, null, 2);
  const singleLineJson = JSON.stringify(level1CleanObject);

  const handleCopyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Detail Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-mono text-slate-100">{bill.bill_id}</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
              Provider: {bill.provider}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Month: {bill.bill_month}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Source Image: {bill.filename} · Tariff: {bill.tariff || 'Not printed'} · Load: {bill.sanctioned_load_kw} kW
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeSubTab === 'overview'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bill Breakdown
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'audit'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Audit & Discrepancies
          </button>
          <button
            onClick={() => setActiveSubTab('json')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeSubTab === 'json'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            Level 1 JSON
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Breakdown */}
      {activeSubTab === 'overview' && (
        <div className="p-6 space-y-6">
          {/* Key Dates Timeline & Readings Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Key Dates
              </span>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reading:</span>
                  <span className="text-slate-200">{bill.reading_date || 'null'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Issue:</span>
                  <span className="text-slate-200">{bill.issue_date || 'null'}</span>
                </div>
                <div className="flex justify-between font-semibold text-amber-300">
                  <span>Due Date:</span>
                  <span>{bill.due_date || 'null'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                Meter Readings
              </span>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Previous:</span>
                  <span className="text-slate-200">
                    {bill.previous_reading !== null ? bill.previous_reading : 'null'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current:</span>
                  <span className="text-slate-200">
                    {bill.current_reading !== null ? bill.current_reading : 'null'}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-emerald-400">
                  <span>Consumed:</span>
                  <span>
                    {bill.units_consumed !== null ? `${bill.units_consumed} kWh` : 'Multi-register'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-slate-400" />
                Monthly Billing
              </span>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Charges:</span>
                  <span className="text-slate-200">
                    {bill.total_charges != null ? `PKR ${bill.total_charges.toLocaleString()}` : 'null'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Taxes:</span>
                  <span className="text-slate-200">
                    {bill.total_taxes != null ? `PKR ${bill.total_taxes.toLocaleString()}` : 'null'}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-slate-100">
                  <span>Current Bill:</span>
                  <span>
                    {bill.current_bill != null ? `PKR ${bill.current_bill.toLocaleString()}` : 'null'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
                Settlement & Due Amounts
              </span>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Arrears/Credit:</span>
                  <span
                    className={
                      (bill.arrears ?? 0) < 0
                        ? 'text-emerald-400'
                        : (bill.arrears ?? 0) > 0
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }
                  >
                    {bill.arrears != null ? `PKR ${bill.arrears.toLocaleString()}` : 'null'}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-amber-300">
                  <span>On Due Date:</span>
                  <span>
                    {bill.payable_within_due_date != null
                      ? `PKR ${bill.payable_within_due_date.toLocaleString()}`
                      : 'null'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>After Due Date:</span>
                  <span>
                    {bill.payable_after_due_date != null
                      ? `PKR ${bill.payable_after_due_date.toLocaleString()}`
                      : 'null (Not to be paid)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charges and Taxes Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Charges Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Charges Breakdown ({bill.charges.length} line items)
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Subtotal: {bill.total_charges != null ? `PKR ${bill.total_charges.toLocaleString()}` : 'N/A'}
                </span>
              </div>
              {bill.charges.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No itemized charges listed.</p>
              ) : (
                <div className="space-y-2">
                  {bill.charges.map((charge, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">#{idx + 1}</span>
                        <span className="capitalize text-slate-200 font-medium">
                          {charge.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span
                        className={
                          (charge.amount ?? 0) < 0
                            ? 'text-emerald-400 font-semibold'
                            : 'text-slate-300'
                        }
                      >
                        {charge.amount != null
                          ? charge.amount < 0
                            ? `-PKR ${Math.abs(charge.amount).toLocaleString()}`
                            : `PKR ${charge.amount.toLocaleString()}`
                          : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Taxes Table */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Taxes Breakdown ({bill.taxes.length} line items)
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Total Taxes: {bill.total_taxes != null ? `PKR ${bill.total_taxes.toLocaleString()}` : 'N/A'}
                </span>
              </div>
              {bill.taxes.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Combined Tax Amount Printed</p>
                  <p className="text-slate-400">
                    In accordance with Level 1 Rule 9: only aggregated tax ({bill.total_taxes != null ? `PKR ${bill.total_taxes}` : 'N/A'}) was printed without individual lines. Array correctly returned as <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">[]</code>.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bill.taxes.map((tax, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px]">#{idx + 1}</span>
                        <span className="capitalize text-slate-200 font-medium">
                          {tax.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-slate-300">
                        PKR {tax.amount != null ? tax.amount.toLocaleString() : '0'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Bill Metadata & Notes */}
          {bill.metadata && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 block mb-2 font-sans font-semibold">
                Contextual Bill Information & Metadata
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-300">
                {Object.entries(bill.metadata).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-slate-800/50 py-1">
                    <span className="text-slate-500">{key}:</span>
                    <span className="text-slate-200 text-right truncate max-w-[280px]">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick link to Level 2 Q&A */}
          {onOpenQnA && (
            <div className="flex justify-end pt-2">
              <button
                onClick={onOpenQnA}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Ask questions about {bill.bill_id}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Discrepancy & Arithmetic Audit */}
      {activeSubTab === 'audit' && (
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Discrepancy & Verification Audit for {bill.bill_id}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Deterministic verification comparing extracted line items, formulas, and printed bill totals to uncover utility company rounding errors, truncation quirks, and credit handling.
            </p>
          </div>

          {auditReport?.checks && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                Arithmetic Checks & Formulas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(auditReport.checks).map(([checkKey, check]) => (
                  <div
                    key={checkKey}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 capitalize">
                        {checkKey.replace(/_/g, ' ')}
                      </span>
                      {check.match ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Match
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" /> Variance: {check.variance} PKR
                        </span>
                      )}
                    </div>
                    {check.formula && (
                      <p className="text-slate-500 text-[11px]">Formula: {check.formula}</p>
                    )}
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Calculated: {String(check.calculated)}</span>
                      <span>Printed on Bill: {String(check.printed)}</span>
                    </div>
                    {check.notes && (
                      <p className="text-amber-300/80 text-[11px] pt-1 border-t border-slate-800/80">
                        {check.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {auditReport?.identified_discrepancies && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                Identified Discrepancies & Observations ({auditReport.identified_discrepancies.length})
              </h4>
              <div className="space-y-2.5">
                {auditReport.identified_discrepancies.map((disc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono">
                        {disc.severity}
                      </span>
                      <span className="font-mono text-slate-400">Field: {disc.field}</span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">{disc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Level 1 JSON Inspector */}
      {activeSubTab === 'json' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Level 1 Schema Valid
              </span>
              <span className="text-xs text-slate-400">
                18 strictly-typed fields conforming to WTQ requirements
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyJson(singleLineJson)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                title="Copy single-line JSON for CSV insertion"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy for CSV
              </button>
              <button
                onClick={() => handleCopyJson(jsonString)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                title="Copy formatted JSON"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Pretty JSON
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-200/90 overflow-x-auto max-h-[500px]">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
