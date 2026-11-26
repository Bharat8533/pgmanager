"use client";

import React from "react";
import {
  Search,
  Calendar,
  Filter,
  CreditCard,
  ArrowUpDown,
  RotateCcw,
  X,
} from "lucide-react";
import {
  PaymentFiltersState,
  PaymentDateFilterOption,
  PaymentMethod,
  RentLedgerStatus,
} from "@/types/payment";

interface PaymentFiltersProps {
  filters: PaymentFiltersState;
  onFilterChange: <K extends keyof PaymentFiltersState>(
    key: K,
    value: PaymentFiltersState[K]
  ) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

const DATE_OPTIONS: { label: string; value: PaymentDateFilterOption }[] = [
  { label: "This Month", value: "this_month" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "this_week" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Previous Month", value: "previous_month" },
  { label: "This Financial Year", value: "this_financial_year" },
  { label: "Custom Date Range", value: "custom" },
];

const PAYMENT_METHODS: PaymentMethod[] = [
  "UPI",
  "Cash",
  "Bank Transfer",
  "Debit Card",
  "Credit Card",
  "Other",
];

const PAYMENT_STATUSES: { label: string; value: RentLedgerStatus }[] = [
  { label: "Paid in Full", value: "paid" },
  { label: "Partially Paid", value: "partial" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
];

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  const isCustomDate = filters.dateRange === "custom";

  const isFiltered =
    filters.search !== "" ||
    filters.dateRange !== "this_month" ||
    filters.paymentStatus !== "all" ||
    filters.paymentMethod !== "all" ||
    filters.sortBy !== "newest";

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-[#E2E5DF] dark:border-[#222E42] p-4 shadow-xs space-y-3.5">
      {/* Search Input Bar (Full Width, Crisp & Responsive) */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78] dark:text-slate-400" />
        <input
          type="text"
          placeholder="Search by resident name, room number, phone number, or invoice ID..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="w-full h-11 pl-10 pr-10 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm text-[#171A18] dark:text-white placeholder-[#777D78] dark:placeholder:text-slate-500 focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all font-medium"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFilterChange("search", "")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#777D78] hover:text-[#171A18] dark:text-slate-400 dark:hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Select Controls & Count Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Date Range Dropdown */}
          <div className="relative inline-flex items-center">
            <Calendar className="w-3.5 h-3.5 absolute left-3 text-[#777D78] dark:text-slate-400 pointer-events-none" />
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange("dateRange", e.target.value as PaymentDateFilterOption)}
              aria-label="Filter Date Range"
              className="h-9.5 pl-8.5 pr-7 bg-[#FAFAF8] dark:bg-[#151D2A] hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs font-semibold text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer appearance-none"
            >
              {DATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="dark:bg-[#151D2A]">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#777D78] dark:text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Payment Status Dropdown */}
          <div className="relative inline-flex items-center">
            <Filter className="w-3.5 h-3.5 absolute left-3 text-[#777D78] dark:text-slate-400 pointer-events-none" />
            <select
              value={filters.paymentStatus}
              onChange={(e) => onFilterChange("paymentStatus", e.target.value as any)}
              aria-label="Filter Payment Status"
              className="h-9.5 pl-8.5 pr-7 bg-[#FAFAF8] dark:bg-[#151D2A] hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs font-semibold text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer appearance-none"
            >
              <option value="all" className="dark:bg-[#151D2A]">All Statuses</option>
              {PAYMENT_STATUSES.map((st) => (
                <option key={st.value} value={st.value} className="dark:bg-[#151D2A]">
                  {st.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#777D78] dark:text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Payment Method Dropdown */}
          <div className="relative inline-flex items-center">
            <CreditCard className="w-3.5 h-3.5 absolute left-3 text-[#777D78] dark:text-slate-400 pointer-events-none" />
            <select
              value={filters.paymentMethod}
              onChange={(e) => onFilterChange("paymentMethod", e.target.value as any)}
              aria-label="Filter Payment Method"
              className="h-9.5 pl-8.5 pr-7 bg-[#FAFAF8] dark:bg-[#151D2A] hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs font-semibold text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer appearance-none"
            >
              <option value="all" className="dark:bg-[#151D2A]">All Methods</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m} className="dark:bg-[#151D2A]">
                  {m}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#777D78] dark:text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative inline-flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-[#777D78] dark:text-slate-400 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value as any)}
              aria-label="Sort Records"
              className="h-9.5 pl-8.5 pr-7 bg-[#FAFAF8] dark:bg-[#151D2A] hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs font-semibold text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer appearance-none"
            >
              <option value="newest" className="dark:bg-[#151D2A]">Newest First</option>
              <option value="oldest" className="dark:bg-[#151D2A]">Oldest First</option>
              <option value="amount_high" className="dark:bg-[#151D2A]">Amount: High to Low</option>
              <option value="amount_low" className="dark:bg-[#151D2A]">Amount: Low to High</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#777D78] dark:text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="h-9.5 px-3 text-[#B91C1C] dark:text-rose-400 hover:text-[#991B1B] bg-[#FEE2E2]/60 dark:bg-rose-500/15 hover:bg-[#FEE2E2] dark:hover:bg-rose-500/25 rounded-xl transition-all border border-[#FCA5A5]/60 dark:border-rose-500/30 flex items-center gap-1.5 text-xs font-bold active:scale-95 cursor-pointer shadow-2xs"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Filtered count badge */}
        <div className="text-xs font-semibold text-[#777D78] dark:text-slate-400 bg-[#FAFAF8] dark:bg-[#151D2A] px-3 py-2 rounded-xl border border-[#E2E5DF] dark:border-[#263346] shrink-0">
          Showing <span className="font-extrabold text-[#171A18] dark:text-white">{totalFilteredCount}</span> records
        </div>
      </div>

      {/* Custom Date Range Inputs */}
      {isCustomDate && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-[#F4F5F2] dark:bg-[#151D2A] rounded-xl border border-[#E2E5DF] dark:border-[#263346] animate-in fade-in duration-200">
          <span className="text-xs font-bold text-[#171A18] dark:text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#171A18] dark:text-brand-lime" /> Custom Range:
          </span>
          <div className="flex items-center gap-2 text-xs">
            <label className="text-[#777D78] dark:text-slate-400 font-medium">From:</label>
            <input
              type="date"
              value={filters.customStartDate}
              onChange={(e) => onFilterChange("customStartDate", e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-[#111622] border border-[#E2E5DF] dark:border-[#263346] rounded-lg text-xs text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label className="text-[#777D78] dark:text-slate-400 font-medium">To:</label>
            <input
              type="date"
              value={filters.customEndDate}
              onChange={(e) => onFilterChange("customEndDate", e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-[#111622] border border-[#E2E5DF] dark:border-[#263346] rounded-lg text-xs text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime"
            />
          </div>
          {(filters.customStartDate || filters.customEndDate) && (
            <button
              type="button"
              onClick={() => {
                onFilterChange("customStartDate", "");
                onFilterChange("customEndDate", "");
              }}
              className="text-xs text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white underline font-medium cursor-pointer"
            >
              Clear dates
            </button>
          )}
        </div>
      )}
    </div>
  );
};
