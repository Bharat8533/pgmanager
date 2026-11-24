export type PaymentMethod =
  | "Cash"
  | "UPI"
  | "Bank Transfer"
  | "Debit Card"
  | "Credit Card"
  | "Other";

export type PaymentType =
  | "Monthly Rent"
  | "Security Deposit"
  | "Advance Rent"
  | "Other Charges";

export type PaymentStatus = "completed" | "reversed" | "refunded" | "pending";

export type RentLedgerStatus = "paid" | "partial" | "pending" | "overdue";

export interface PaymentAllocation {
  billingMonth: string;
  amountAllocated: number;
}

export interface PaymentProofAttachment {
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface PaymentRecord {
  id: string; // e.g. "PAY-2026-1049"
  propertyId: string;
  propertyName: string;
  residentId: string;
  residentName: string;
  residentPhone: string;
  roomNumber: string;
  bedNumber: string;
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  billingMonth: string; // e.g. "November 2026"
  allocations?: PaymentAllocation[];
  transactionReference?: string; // UPI UTR or Bank IMPS Ref
  notes?: string;
  proofAttachment?: PaymentProofAttachment;
  status: PaymentStatus;
  reversedAt?: string;
  reversalReason?: string;
  refundedAmount?: number;
  createdAt: string;
}

export interface RentLedgerItem {
  id: string; // e.g. "LEDGER-101-NOV"
  residentId: string;
  residentName: string;
  residentPhone: string;
  residentEmail?: string;
  propertyId: string;
  propertyName: string;
  roomId: string;
  roomNumber: string;
  bedNumber: string;
  billingMonth: string; // e.g. "November 2026"
  rentAmount: number; // Total billed
  paidAmount: number; // Total received
  pendingAmount: number; // Outstanding
  dueDate: string; // YYYY-MM-DD
  paymentStatus: RentLedgerStatus;
  lastPaymentDate?: string;
  stayStatus: "active" | "checked_out";
  notes?: string;
}

export interface FinancialSummaryStats {
  totalRentExpected: number;
  totalRentCollected: number;
  totalPendingRent: number;
  collectionRate: number; // (Collected / Expected) * 100
  cashCollections: number;
  onlineCollections: number;
  securityDepositHeld: number;
  refundedRentAmount: number;
}

export interface OutstandingAgingCategory {
  count: number;
  amount: number;
}

export interface OutstandingAgingSummary {
  notYetDue: OutstandingAgingCategory;
  days1to7: OutstandingAgingCategory;
  days8to15: OutstandingAgingCategory;
  days16to30: OutstandingAgingCategory;
  daysAbove30: OutstandingAgingCategory;
  totalOutstanding: number;
}

export interface ResidentDepositRecord {
  residentId: string;
  residentName: string;
  residentPhone: string;
  roomNumber: string;
  bedNumber: string;
  propertyId: string;
  propertyName: string;
  depositReceived: number;
  dateReceived: string;
  adjustments: number;
  refunds: number;
  currentBalance: number;
  notes?: string;
}

export interface MonthlyCollectionTrendPoint {
  month: string; // e.g. "Jun", "Jul"
  expectedRent: number;
  collectedRent: number;
  pendingRent: number;
}

export interface PaymentMethodDataPoint {
  method: PaymentMethod;
  amount: number;
  percentage: number;
  count: number;
}

export interface CollectionPerformanceDistribution {
  paidCount: number;
  paidAmount: number;
  partialCount: number;
  partialAmount: number;
  pendingCount: number;
  pendingAmount: number;
  overdueCount: number;
  overdueAmount: number;
}

export type PaymentDateFilterOption =
  | "this_month"
  | "today"
  | "this_week"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "previous_month"
  | "this_financial_year"
  | "previous_financial_year"
  | "custom";

export interface PaymentFiltersState {
  search: string;
  dateRange: PaymentDateFilterOption;
  customStartDate: string;
  customEndDate: string;
  paymentStatus: "all" | RentLedgerStatus;
  paymentMethod: "all" | PaymentMethod;
  paymentType: "all" | PaymentType;
  billingMonth: "all" | string;
  sortBy: "newest" | "oldest" | "amount_high" | "amount_low";
}

export interface RecordPaymentPayload {
  residentId: string;
  residentName: string;
  residentPhone: string;
  propertyId: string;
  propertyName: string;
  roomNumber: string;
  bedNumber: string;
  amount: number;
  paymentDate: string;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  billingMonth: string;
  allocations?: PaymentAllocation[];
  transactionReference?: string;
  notes?: string;
  proofAttachment?: PaymentProofAttachment;
}

export interface CAReportOptions {
  reportType:
    | "payment_transactions"
    | "rent_ledger"
    | "outstanding_dues"
    | "security_deposits"
    | "payment_methods"
    | "consolidated_summary";
  propertyId: string;
  propertyName: string;
  startDate?: string;
  endDate?: string;
  dateRangeLabel: string;
  paymentMethod?: string;
  paymentType?: string;
  paymentStatus?: string;
}
