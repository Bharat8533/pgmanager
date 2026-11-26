"use client";

import React from "react";
import { FinancialSummaryBreakdown } from "@/data/collectionData";
import {
  Wallet,
  Clock,
  ShieldCheck,
  Coins,
  ArrowUpRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialSummaryCardsProps {
  summary: FinancialSummaryBreakdown;
}

export function FinancialSummaryCards({ summary }: FinancialSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 h-full">
      {/* 1. Total Rent Collected */}
      <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
              Earned Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xs text-brand-muted font-medium">Total Rent Inflow</p>
          <p className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight mt-0.5">
            {summary.totalRentCollectedFormatted}
          </p>
        </div>

        <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[11px]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {summary.rentComparisonText}
          </span>
          <span className="text-[10px] text-brand-muted">Settled via UPI/Bank</span>
        </div>
      </div>

      {/* 2. Pending Rent Balance */}
      <div className="bg-white rounded-2xl  p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
              Outstanding Due
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xs text-brand-muted font-medium">Pending Rent Balance</p>
          <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight mt-0.5">
            {summary.pendingRentFormatted}
          </p>
        </div>

        <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
            {summary.tenantsPendingCount} tenants with pending balance
          </span>
          <span className="text-[10px] text-brand-muted">Follow-up sent</span>
        </div>
      </div>

      {/* 3. Security Deposit Held (STRICTLY SEPARATE LIABILITY) */}
      <div className="bg-white rounded-2xl  p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
        {/* Subtle decorative purple accent border on left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-purple-600" />
              <span>Refundable Liability</span>
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xs text-brand-muted font-medium">Security Deposits Held</p>
          <p className="text-xl sm:text-2xl font-black text-purple-950 dark:text-purple-200 tracking-tight mt-0.5">
            {summary.securityDepositFormatted}
          </p>
        </div>

        <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-purple-700 dark:text-purple-300 font-semibold text-[11px]">
            Held for {summary.activeDepositCount} active tenants
          </span>
          <span className="text-[10px] text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 border border-transparent dark:border-purple-800/60 px-1.5 py-0.5 rounded font-medium">
            Non-Revenue
          </span>
        </div>
      </div>

      {/* 4. Other Income */}
      <div className="bg-white rounded-2xl  p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
              Ancillary Income
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xs text-brand-muted font-medium">Services & Utilities</p>
          <p className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight mt-0.5">
            {summary.otherIncomeFormatted}
          </p>
        </div>

        <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-brand-muted text-[11px] truncate">
            {summary.otherIncomeDescription}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">100% Inflow</span>
        </div>
      </div>
    </div>
  );
}
