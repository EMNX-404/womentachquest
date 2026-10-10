export type ProviderType = 'KE' | 'LESCO' | 'IESCO';

export type ChargeType =
  | 'energy'
  | 'fixed'
  | 'fpa'
  | 'quarterly_adjustment'
  | 'surcharge'
  | 'meter_rent'
  | 'subsidy'
  | 'other';

export type TaxType =
  | 'gst'
  | 'electricity_duty'
  | 'income_tax'
  | 'municipal_tax'
  | 'other_tax';

export interface ChargeItem {
  type: ChargeType;
  amount: number;
}

export interface TaxItem {
  type: TaxType;
  amount: number;
}

export interface BillLevel1Schema {
  provider: ProviderType;
  tariff: string | null;
  sanctioned_load_kw: number | null;
  bill_month: string | null;
  reading_date: string | null;
  issue_date: string | null;
  due_date: string | null;
  previous_reading: number | null;
  current_reading: number | null;
  units_consumed: number | null;
  charges: ChargeItem[];
  total_charges: number | null;
  taxes: TaxItem[];
  total_taxes: number | null;
  current_bill: number | null;
  arrears: number | null;
  payable_within_due_date: number | null;
  payable_after_due_date: number | null;
  metadata?: Record<string, any>;
}

export interface MonthHistoryItem {
  month: string;
  units: number;
  billAmount: number;
  paymentAmount?: number;
  status?: string;
}

export interface BillRecord extends BillLevel1Schema {
  bill_id: string;
  filename: string;
  history?: MonthHistoryItem[];
}

export interface CheckItem {
  formula?: string;
  calculated: number | string;
  printed: number | string;
  match?: boolean;
  variance?: number;
  notes?: string;
  rule_3_credit_compliance?: boolean;
}

export interface DiscrepancyItem {
  severity: string;
  field: string;
  description: string;
}

export interface BillAuditReport {
  bill_id: string;
  provider: ProviderType;
  bill_month: string;
  syntax_valid: boolean;
  fields_complete: boolean;
  checks: Record<string, CheckItem>;
  identified_discrepancies: DiscrepancyItem[];
}

export interface AuditSummary {
  total_bills_evaluated: number;
  valid_json_syntax: boolean;
  all_bills_represented: boolean;
  schema_compliance: string;
  providers_represented: string[];
  overall_status: string;
}

export interface DiscrepancyDataset {
  audit_summary: AuditSummary;
  bill_reports: BillAuditReport[];
}
