import React, { useState } from 'react';
import { BillRecord } from '../types';
import {
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Code2,
} from 'lucide-react';

interface JsonValidatorViewProps {
  bills: BillRecord[];
}

interface ValidationResult {
  isValidSyntax: boolean;
  parseError?: string;
  fieldChecks: {
    name: string;
    passed: boolean;
    detail: string;
  }[];
  isFullyCompliant: boolean;
}

export const JsonValidatorView: React.FC<JsonValidatorViewProps> = ({ bills }) => {
  const [selectedBillId, setSelectedBillId] = useState<string>(bills[0]?.bill_id || 'IESCO_0004');
  const [inputJson, setInputJson] = useState<string>(() => {
    const b = bills[0];
    if (!b) return '{}';
    const cleanObj = {
      provider: b.provider,
      tariff: b.tariff,
      sanctioned_load_kw: b.sanctioned_load_kw,
      bill_month: b.bill_month,
      reading_date: b.reading_date,
      issue_date: b.issue_date,
      due_date: b.due_date,
      previous_reading: b.previous_reading,
      current_reading: b.current_reading,
      units_consumed: b.units_consumed,
      charges: b.charges,
      total_charges: b.total_charges,
      taxes: b.taxes,
      total_taxes: b.total_taxes,
      current_bill: b.current_bill,
      arrears: b.arrears,
      payable_within_due_date: b.payable_within_due_date,
      payable_after_due_date: b.payable_after_due_date,
    };
    return JSON.stringify(cleanObj, null, 2);
  });

  const [copied, setCopied] = useState(false);

  const loadBill = (billId: string) => {
    setSelectedBillId(billId);
    const b = bills.find((x) => x.bill_id === billId);
    if (b) {
      const cleanObj = {
        provider: b.provider,
        tariff: b.tariff,
        sanctioned_load_kw: b.sanctioned_load_kw,
        bill_month: b.bill_month,
        reading_date: b.reading_date,
        issue_date: b.issue_date,
        due_date: b.due_date,
        previous_reading: b.previous_reading,
        current_reading: b.current_reading,
        units_consumed: b.units_consumed,
        charges: b.charges,
        total_charges: b.total_charges,
        taxes: b.taxes,
        total_taxes: b.total_taxes,
        current_bill: b.current_bill,
        arrears: b.arrears,
        payable_within_due_date: b.payable_within_due_date,
        payable_after_due_date: b.payable_after_due_date,
      };
      setInputJson(JSON.stringify(cleanObj, null, 2));
    }
  };

  const validateJson = (text: string): ValidationResult => {
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e: any) {
      return {
        isValidSyntax: false,
        parseError: e.message,
        fieldChecks: [],
        isFullyCompliant: false,
      };
    }

    const checks: { name: string; passed: boolean; detail: string }[] = [];

    // Check 1: Provider
    const prov = parsed.provider;
    const provPassed = ['KE', 'LESCO', 'IESCO'].includes(prov);
    checks.push({
      name: 'Provider Enum (Rule 7)',
      passed: provPassed,
      detail: provPassed
        ? `Valid: ${prov}`
        : `Invalid provider: '${prov}'. Must be KE, LESCO, or IESCO.`,
    });

    // Check 2: All 18 Level 1 fields present
    const requiredFields = [
      'provider',
      'tariff',
      'sanctioned_load_kw',
      'bill_month',
      'reading_date',
      'issue_date',
      'due_date',
      'previous_reading',
      'current_reading',
      'units_consumed',
      'charges',
      'total_charges',
      'taxes',
      'total_taxes',
      'current_bill',
      'arrears',
      'payable_within_due_date',
      'payable_after_due_date',
    ];
    const missing = requiredFields.filter((f) => !(f in parsed));
    checks.push({
      name: 'All 18 Schema Fields Present',
      passed: missing.length === 0,
      detail:
        missing.length === 0
          ? 'All 18 required Level 1 keys present in object.'
          : `Missing keys: ${missing.join(', ')}`,
    });

    // Check 3: Date formatting
    const bm = parsed.bill_month;
    const bmValid = bm === null || /^\d{4}-\d{2}$/.test(String(bm));
    checks.push({
      name: 'Bill Month Format (YYYY-MM)',
      passed: bmValid,
      detail: bmValid ? `Valid: ${bm}` : `Invalid month format: ${bm}. Expected YYYY-MM.`,
    });

    const dates = ['reading_date', 'issue_date', 'due_date'];
    const invalidDates = dates.filter(
      (d) => parsed[d] !== null && !/^\d{4}-\d{2}-\d{2}$/.test(String(parsed[d]))
    );
    checks.push({
      name: 'Reading, Issue, Due Dates (YYYY-MM-DD)',
      passed: invalidDates.length === 0,
      detail:
        invalidDates.length === 0
          ? 'All dates valid or correctly null.'
          : `Invalid format in: ${invalidDates.join(', ')}`,
    });

    // Check 4: Charges Array & Subsidies negative
    const charges = parsed.charges;
    const isChargesArray = Array.isArray(charges);
    let chargesDetail = 'Charges is array.';
    let chargesPassed = isChargesArray;
    if (isChargesArray) {
      const positiveSubsidies = charges.filter(
        (c: any) => c.type === 'subsidy' && typeof c.amount === 'number' && c.amount > 0
      );
      if (positiveSubsidies.length > 0) {
        chargesPassed = false;
        chargesDetail = 'Rule 3 Violation: Subsidy amount must be negative!';
      } else {
        chargesDetail = `${charges.length} charges line items correctly typed.`;
      }
    } else {
      chargesDetail = 'Charges must be an array.';
    }
    checks.push({
      name: 'Charges Array & Negative Subsidies (Rule 3 & 8)',
      passed: chargesPassed,
      detail: chargesDetail,
    });

    // Check 5: Taxes Array
    const taxes = parsed.taxes;
    const isTaxesArray = Array.isArray(taxes);
    checks.push({
      name: 'Taxes Array (Rule 9)',
      passed: isTaxesArray,
      detail: isTaxesArray
        ? `${taxes.length} taxes lines. (Empty [] when only combined amount is printed).`
        : 'Taxes must be an array.',
    });

    // Check 6: No PII (Rule 6)
    const forbiddenPii = ['name', 'address', 'cnic', 'consumer_id', 'reference_no', 'meter_no'];
    const piiFound = forbiddenPii.filter((p) => p in parsed);
    checks.push({
      name: 'Zero Personal Identifiers (Rule 6)',
      passed: piiFound.length === 0,
      detail:
        piiFound.length === 0
          ? 'Passed: No PII fields found in extracted Level 1 output.'
          : `Rule 6 Violation: Found PII keys: ${piiFound.join(', ')}`,
    });

    const isFullyCompliant = checks.every((c) => c.passed);

    return {
      isValidSyntax: true,
      fieldChecks: checks,
      isFullyCompliant,
    };
  };

  const validation = validateJson(inputJson);

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    try {
      const obj = JSON.parse(inputJson);
      setInputJson(JSON.stringify(obj, null, 2));
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-6 h-6 text-sky-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Level 1 JSON Schema & Compliance Validator
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Test, edit, and validate any extracted bill object against the 18 required fields, null typing, date constraints, and negative credit rules.
            </p>
          </div>

          {/* Quick Select Bill to Load */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-medium">Load Bill:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {bills.map((b) => (
                <button
                  key={b.bill_id}
                  onClick={() => loadBill(b.bill_id)}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all ${
                    selectedBillId === b.bill_id
                      ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b.bill_id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor & Validator Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Box */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>JSON Input Buffer</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFormat}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition-colors flex items-center gap-1"
                title="Format JSON"
              >
                <RefreshCw className="w-3 h-3" /> Format
              </button>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy
              </button>
            </div>
          </div>

          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            className="w-full h-[520px] bg-slate-950 text-amber-300/90 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500/50 resize-none font-medium leading-relaxed"
            placeholder="Paste bill JSON here to validate..."
          />
        </div>

        {/* Validation Status Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                Validation Summary
              </h3>
              {validation.isFullyCompliant ? (
                <span className="flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Compliant
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5" /> Issues Found
                </span>
              )}
            </div>

            {/* Syntax Status */}
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
                validation.isValidSyntax
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {validation.isValidSyntax ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Syntax: Valid UTF-8 JSON</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Syntax Error:</span>
                    <span className="text-[11px] text-rose-200">{validation.parseError}</span>
                  </div>
                </>
              )}
            </div>

            {/* Rule Checks List */}
            {validation.isValidSyntax && (
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  Rules & Schema Criteria
                </span>
                {validation.fieldChecks.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{check.name}</span>
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-[11px] ${
                        check.passed ? 'text-slate-400' : 'text-rose-300 font-semibold'
                      }`}
                    >
                      {check.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 font-mono block">
              WTQ Submission Compliance Tip:
            </span>
            <p>
              In <code className="text-amber-300">level1.csv</code>, store this validated JSON on a single line per row using standard CSV quoting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
