export const DEFAULT_EXPENSE_CATEGORIES = [
  "Electricity & Power",
  "Water & Tanker",
  "Internet & WiFi",
  "Repairs & Maintenance",
  "Cleaning & Housekeeping",
  "Groceries & Food Supplies",
  "Staff Salary",
  "Property Tax & Municipal",
  "Waste Management",
  "Pest Control",
  "Security & CCTV",
  "Marketing & Brokerage",
  "Furniture & Equipment",
  "Legal & Professional",
  "Miscellaneous",
] as const;

export type ExpenseCategory = typeof DEFAULT_EXPENSE_CATEGORIES[number] | string;

export type PaymentMode =
  | "Cash"
  | "UPI"
  | "Bank Transfer"
  | "Cheque"
  | "Credit Card"
  | "Debit Card"
  | "Other";

export type DateFilterOption =
  | "this_month"
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "previous_month"
  | "custom";

export interface ExpenseAttachment {
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  propertyId: string; // "prop-1", "prop-2", or "common"
  propertyName: string;
  amount: number;
  paymentMode: PaymentMode;
  date: string; // YYYY-MM-DD
  remark?: string;
  attachment?: ExpenseAttachment;
  createdAt?: string;
  recordedBy?: string;
}

export interface ExpenseFiltersState {
  propertyId: string; // "all", "prop-1", "prop-2", "common"
  category: string; // "all" or specific category
  dateRange: DateFilterOption;
  customStartDate: string;
  customEndDate: string;
  paymentMode: string; // "all" or specific mode
  sortBy: "newest" | "oldest" | "amount_high" | "amount_low" | "category";
  search: string;
}

export interface ExpenseSummaryStats {
  totalExpenses: number;
  thisMonthExpenses: number;
  todayExpenses: number;
  highestCategoryName: string;
  highestCategoryAmount: number;
  averageDailyExpense: number;
}

export interface ExpensePayload {
  title: string;
  category: string;
  propertyId: string;
  propertyName?: string;
  amount: number;
  paymentMode: PaymentMode;
  date: string;
  remark?: string;
  attachment?: ExpenseAttachment;
}

export interface MonthlyTrendDataPoint {
  month: string;
  amount: number;
}

export interface CategoryBreakdownDataPoint {
  category: string;
  amount: number;
  percentage: number;
}
