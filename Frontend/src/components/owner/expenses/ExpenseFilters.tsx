"use client";

import React from "react";
import {
  Search,
  Filter,
  Calendar,
  Building2,
  Tag,
  CreditCard,
  ArrowUpDown,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";
import {
  ExpenseFiltersState,
  DateFilterOption,
  ExpenseCategory,
  PaymentMode,
  DEFAULT_EXPENSE_CATEGORIES,
} from "@/types/expense";

interface ExpenseFiltersProps {
  filters: ExpenseFiltersState;
  onFilterChange: <K extends keyof ExpenseFiltersState>(
    key: K,
    value: ExpenseFiltersState[K]
  ) => void;
  onResetFilters: () => void;
  onExportExcel: () => void;
  totalFilteredCount: number;
}

const DATE_OPTIONS: { label: string; value: DateFilterOption }[] = [
  { label: "This Month", value: "this_month" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Previous Month", value: "previous_month" },
  { label: "Custom Range", value: "custom" },
];

const PAYMENT_MODES: PaymentMode[] = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Credit Card",
  "Debit Card",
];

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onExportExcel,
  totalFilteredCount,
}) => {
  const isCustomDate = filters.dateRange === "custom";

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-[#E2E5DF] dark:border-[#222E42] p-5 shadow-xs space-y-4">
      {/* Top Bar: Search, Date Preset, and Export CTA */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78] dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, remark, vendor or ID..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm text-[#171A18] dark:text-white placeholder-[#777D78] dark:placeholder-slate-400 focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all"
          />
        </div>

        {/* Date Filter & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="relative flex items-center">
            <Calendar className="w-4 h-4 absolute left-3 text-[#777D78] dark:text-slate-400 pointer-events-none" />
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange("dateRange", e.target.value as DateFilterOption)}
              aria-label="Select Date Range"
              className="pl-9 pr-8 py-2 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm font-medium text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all appearance-none cursor-pointer"
            >
              {DATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="dark:bg-[#151D2A] dark:text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export to Excel CTA */}
          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#171A18] dark:bg-[#151D2A] hover:bg-[#2A2E2B] dark:hover:bg-[#1E293B] text-white rounded-xl text-xs sm:text-sm font-semibold border border-transparent dark:border-[#263346] transition-all shadow-xs cursor-pointer active:scale-98"
            title="Download Excel spreadsheet of currently filtered expenses"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#C6F36B] dark:text-brand-lime" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Inputs (Shown only if Custom Range is selected) */}
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
              Reset Range
            </button>
          )}
        </div>
      )}

      {/* Secondary Row: Category, Payment Mode, Sort, Clear */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0F2EE] dark:border-[#1E2638]">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="relative flex items-center">
            <Tag className="w-3.5 h-3.5 absolute left-3 text-[#777D78] dark:text-slate-400 pointer-events-none" />
            <select
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              aria-label="Filter by Category"
              className="pl-8 pr-7 py-1.5 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs font-medium text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer max-w-[190px] truncate"
            >
              <option value="all" className="dark:bg-[#151D2A] dark:text-white">All Categories</option>
              {DEFAULT_EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-[#151D2A] dark:text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode Filter */}
          <div className="relative flex items-center">
            <CreditCard className="w-3.5 h-3.5 absolute left-3 text-[#777D78] dark:text-slate-400 pointer-events-none" />
            <select
              value={filters.paymentMode}
              onChange={(e) => onFilterChange("paymentMode", e.target.value)}
              aria-label="Filter by Payment Mode"
              className="pl-8 pr-7 py-1.5 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs font-medium text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer"
            >
              <option value="all" className="dark:bg-[#151D2A] dark:text-white">All Payment Modes</option>
              {PAYMENT_MODES.map((mode) => (
                <option key={mode} value={mode} className="dark:bg-[#151D2A] dark:text-white">
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-[#777D78] dark:text-slate-400 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value as any)}
              aria-label="Sort Expenses By"
              className="pl-8 pr-7 py-1.5 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs font-medium text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime transition-all cursor-pointer"
            >
              <option value="newest" className="dark:bg-[#151D2A] dark:text-white">Newest First</option>
              <option value="oldest" className="dark:bg-[#151D2A] dark:text-white">Oldest First</option>
              <option value="amount_high" className="dark:bg-[#151D2A] dark:text-white">Amount: High to Low</option>
              <option value="amount_low" className="dark:bg-[#151D2A] dark:text-white">Amount: Low to High</option>
              <option value="category" className="dark:bg-[#151D2A] dark:text-white">Category (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#777D78] dark:text-slate-400">
            Found: <strong className="text-[#171A18] dark:text-white font-bold">{totalFilteredCount}</strong> records
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] rounded-lg transition-all cursor-pointer"
            title="Reset all filters to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
