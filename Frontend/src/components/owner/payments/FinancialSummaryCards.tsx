"use client";

import React from "react";
import {
  Wallet,
  CheckCircle2,
  Clock,
  Banknote,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { FinancialSummaryStats } from "@/types/payment";

interface FinancialSummaryCardsProps {
  stats: FinancialSummaryStats;
  dateRangeLabel: string;
}

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  stats,
  dateRangeLabel,
}) => {
  // Format human-friendly label
  const formattedRange =
    dateRangeLabel === "this_month"
      ? "This Month"
      : dateRangeLabel === "today"
      ? "Today"
      : dateRangeLabel === "yesterday"
      ? "Yesterday"
      : dateRangeLabel === "this_week"
      ? "This Week"
      : dateRangeLabel === "last_7_days"
      ? "Last 7 Days"
      : dateRangeLabel === "last_30_days"
      ? "Last 30 Days"
      : dateRangeLabel === "previous_month"
      ? "Previous Month"
      : dateRangeLabel === "this_financial_year"
      ? "FY 2026-27"
      : dateRangeLabel === "previous_financial_year"
      ? "FY 2025-26"
      : dateRangeLabel === "custom"
      ? "Custom Range"
      : dateRangeLabel;

  return (
    <div className="space-y-3.5">
      {/* Primary Hero Financial Metrics (3 Cards - Spacious, Bold, Never Truncated) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Rent Expected */}
        <div className="bg-white rounded-2xl border border-[#E2E5DF] p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden flex flex-col justify-between group">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#777D78]">
              Total Rent Expected
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FAFAF8] border border-[#E2E5DF] flex items-center justify-center text-[#171A18] shrink-0 group-hover:bg-[#171A18] group-hover:text-[#C6F36B] transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="my-1">
            <div className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black text-[#171A18] tracking-tight">
              ₹{stats.totalRentExpected.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#777D78] pt-3 border-t border-[#F0F2EE] mt-3">
            <span className="font-medium text-[#777D78]">Billing Cycle:</span>
            <span className="font-bold text-[#171A18] bg-[#F4F5F2] px-2.5 py-1 rounded-lg border border-[#E2E5DF]/60">
              {formattedRange}
            </span>
          </div>
        </div>

        {/* Card 2: Rent Collected (Success / Cashflow) */}
        <div className="bg-white rounded-2xl border border-[#86EFAC]/70 p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden flex flex-col justify-between border-l-4 border-l-[#22C55E] group">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
              Rent Collected
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              {stats.collectionRate}% Recovered
            </span>
          </div>

          <div className="my-1">
            <div className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black text-[#15803D] tracking-tight">
              ₹{stats.totalRentCollected.toLocaleString("en-IN")}
            </div>
          </div>

          {/* Mini Recovery Progress Bar */}
          <div className="space-y-1.5 pt-3 border-t border-[#F0F2EE] mt-3">
            <div className="w-full bg-[#E2E5DF]/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#22C55E] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, stats.collectionRate))}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#777D78]">
              <span>Verified Cash & Bank</span>
              <span className="font-bold text-[#15803D]">
                ₹{(stats.totalRentCollected / 1000).toFixed(1)}k of ₹{(stats.totalRentExpected / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Rent (Urgent Action) */}
        <div className={`bg-white rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden flex flex-col justify-between border-l-4 group ${
          stats.totalPendingRent > 0
            ? "border border-[#FCA5A5]/70 border-l-[#EF4444]"
            : "border border-[#E2E5DF] border-l-[#22C55E]"
        }`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${
              stats.totalPendingRent > 0 ? "text-[#B91C1C]" : "text-[#15803D]"
            }`}>
              Pending Dues
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                stats.totalPendingRent > 0
                  ? "bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]"
                  : "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]"
              }`}
            >
              {stats.totalPendingRent > 0 ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  Action Required
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All Paid
                </>
              )}
            </span>
          </div>

          <div className="my-1">
            <div
              className={`text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black tracking-tight ${
                stats.totalPendingRent > 0 ? "text-[#B91C1C]" : "text-[#15803D]"
              }`}
            >
              ₹{stats.totalPendingRent.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#777D78] pt-3 border-t border-[#F0F2EE] mt-3">
            <span className="font-medium">Outstanding Balances:</span>
            <span className={`font-bold ${stats.totalPendingRent > 0 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
              {stats.totalPendingRent > 0 ? "Requires Follow-up" : "Zero Dues Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Payment Channels & Deposit Liability (3 Balanced Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Cash Collections */}
        <div className="bg-white rounded-2xl border border-[#E2E5DF] p-4 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857] flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 text-[#047857]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777D78] block">
                Cash Collections
              </span>
              <span className="text-base sm:text-lg font-black text-[#171A18] block mt-0.5">
                ₹{stats.cashCollections.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#047857] bg-[#ECFDF5] px-2.5 py-1 rounded-lg border border-[#A7F3D0]/60">
            Physical Cash
          </span>
        </div>

        {/* Online Collections */}
        <div className="bg-white rounded-2xl border border-[#E2E5DF] p-4 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-[#0369A1]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777D78] block">
                Online Collections
              </span>
              <span className="text-base sm:text-lg font-black text-[#171A18] block mt-0.5">
                ₹{stats.onlineCollections.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#0369A1] bg-[#E0F2FE] px-2.5 py-1 rounded-lg border border-[#BAE6FD]/60">
            UPI / NetBanking
          </span>
        </div>

        {/* Security Deposits Held */}
        <div className="bg-white rounded-2xl border border-[#E2E5DF] p-4 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#5B21B6] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#5B21B6]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777D78] block">
                Deposit Liability
              </span>
              <span className="text-base sm:text-lg font-black text-[#5B21B6] block mt-0.5">
                ₹{stats.securityDepositHeld.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#5B21B6] bg-[#EDE9FE] px-2.5 py-1 rounded-lg border border-[#DDD6FE]/60">
            Refundable
          </span>
        </div>
      </div>
    </div>
  );
};
