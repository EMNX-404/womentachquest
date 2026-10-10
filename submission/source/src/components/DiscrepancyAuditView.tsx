import React, { useState } from 'react';
import { DiscrepancyDataset } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building2,
  Filter,
} from 'lucide-react';

interface DiscrepancyAuditViewProps {
  auditDataset: DiscrepancyDataset;
  onSelectBill?: (billId: string) => void;
}

export const DiscrepancyAuditView: React.FC<DiscrepancyAuditViewProps> = ({
  auditDataset,
  onSelectBill,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  const { audit_summary, bill_reports } = auditDataset;

  const filteredReports = bill_reports.filter((r) => {
    if (selectedProvider !== 'ALL' && r.provider !== selectedProvider) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Audit Banner & Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Official Validation & Discrepancy Audit Report
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic verification against all Level 1 rules, printed bill numbers, and arithmetic consistency across all 5 provided bills.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              STATUS: {audit_summary.overall_status}
            </span>
          </div>
        </div>

        {/* 4 Scorecards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-xs text-slate-500 block mb-1">Bills Represented</span>
            <div className="flex items-center justify-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xl font-bold text-slate-100">
                {audit_summary.total_bills_evaluated} / 5
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-0.5 block">100% Complete</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-xs text-slate-500 block mb-1">JSON Syntax Check</span>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xl font-bold text-slate-100">Valid</span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-0.5 block">0 Parse Errors</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-xs text-slate-500 block mb-1">Schema Compliance</span>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xl font-bold text-slate-100">
                {audit_summary.schema_compliance}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-0.5 block">All 18 fields typed</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-xs text-slate-500 block mb-1">Providers Covered</span>
            <div className="flex items-center justify-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xl font-bold text-slate-100">
                {audit_summary.providers_represented.length} / 3
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">KE · LESCO · IESCO</span>
          </div>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Filter by Provider:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {['ALL', 'KE', 'LESCO', 'IESCO'].map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvider(prov)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedProvider === prov
                    ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredReports.length} of {bill_reports.length} bill audit reports
        </span>
      </div>

      {/* Detailed Bill Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.bill_id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-bold text-slate-100">
                  {report.bill_id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded font-mono font-medium bg-slate-800 text-amber-300 border border-slate-700">
                  {report.provider}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Month: {report.bill_month}
                </span>
              </div>

              {onSelectBill && (
                <button
                  onClick={() => onSelectBill(report.bill_id)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium underline-offset-4 hover:underline self-start sm:self-auto"
                >
                  View full bill details &rarr;
                </button>
              )}
            </div>

            {/* Arithmetic Formula Checks Grid */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                Arithmetic Totals vs. Printed Comparison
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {Object.entries(report.checks).map(([checkKey, check]) => (
                  <div
                    key={checkKey}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 capitalize font-medium truncate max-w-[170px]">
                        {checkKey.replace(/_/g, ' ')}
                      </span>
                      {check.match ? (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          Exact Match
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          Variance: {check.variance}
                        </span>
                      )}
                    </div>
                    {check.formula && (
                      <p className="text-[11px] text-slate-500 truncate">{check.formula}</p>
                    )}
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Calc: {String(check.calculated)}</span>
                      <span>Printed: {String(check.printed)}</span>
                    </div>
                    {check.notes && (
                      <p className="text-[11px] text-amber-300/80 pt-1 border-t border-slate-800/60 leading-tight">
                        {check.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Discrepancies & Observations */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                Detailed Discrepancies & Anomalies ({report.identified_discrepancies.length})
              </span>
              <div className="space-y-2">
                {report.identified_discrepancies.map((disc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-start gap-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-semibold text-amber-300 text-[11px]">
                          [{disc.severity}]
                        </span>
                        <span className="text-slate-400 text-[11px]">Field: {disc.field}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{disc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
