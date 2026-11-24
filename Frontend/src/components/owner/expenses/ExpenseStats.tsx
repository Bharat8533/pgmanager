"use client";

import React from "react";
import { ExpenseSummaryStats } from "@/types/expense";
import {
  Wallet,
  CalendarDays,
  CalendarCheck2,
  TrendingUp,
  Scale,
  IndianRupee,
} from "lucide-react";

interface ExpenseStatsProps {
  stats: ExpenseSummaryStats;
  dateRangeLabel?: string;
  dateRange?: string;
}

export function ExpenseStats({ stats, dateRangeLabel, dateRange }: ExpenseStatsProps) {
  const displayRange =
    dateRangeLabel ||
    (dateRange === "this_month"
      ? "This Month"
      : dateRange === "today"
      ? "Today"
      : dateRange === "yesterday"
      ? "Yesterday"
      : dateRange === "last_7_days"
      ? "Last 7 Days"
      : dateRange === "last_30_days"
      ? "Last 30 Days"
      : dateRange === "previous_month"
      ? "Previous Month"
      : dateRange === "custom"
      ? "Custom Range"
      : "Active Filter");

  const total = Number(stats?.totalExpenses ?? (stats as any)?.totalFilteredExpenses ?? 0);
  const thisMonth = Number(stats?.thisMonthExpenses ?? 0);
  const today = Number(stats?.todayExpenses ?? 0);
  const highestName = stats?.highestCategoryName ?? (stats as any)?.highestCategory?.category ?? "None";
  const highestAmount = Number(stats?.highestCategoryAmount ?? (stats as any)?.highestCategory?.amount ?? 0);
  const avgDaily = Number(stats?.averageDailyExpense ?? 0);

  const cards = [
    {
      id: "total",
      label: "Total Expenses",
      value: `₹${total.toLocaleString("en-IN")}`,
      helper: displayRange,
      icon: <Wallet className="w-4 h-4 text-brand-obsidian" />,
      bgIcon: "bg-slate-100",
      accent: "border-l-4 border-l-brand-obsidian",
    },
    {
      id: "this-month",
      label: "This Month",
      value: `₹${thisMonth.toLocaleString("en-IN")}`,
      helper: "Current billing cycle",
      icon: <CalendarDays className="w-4 h-4 text-blue-700" />,
      bgIcon: "bg-blue-50",
      accent: "border-l-4 border-l-blue-500",
    },
    {
      id: "today",
      label: "Today's Spending",
      value: `₹${today.toLocaleString("en-IN")}`,
      helper: today > 0 ? "Daily payouts recorded" : "No expenses today",
      icon: <CalendarCheck2 className="w-4 h-4 text-emerald-700" />,
      bgIcon: "bg-emerald-50",
      accent: "border-l-4 border-l-emerald-500",
      badge: today > 0 ? "Active" : undefined,
      badgeClass: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "highest-category",
      label: "Highest Category",
      value: highestName || "None",
      helper: highestAmount > 0 ? `₹${highestAmount.toLocaleString("en-IN")} total` : "No data",
      icon: <TrendingUp className="w-4 h-4 text-amber-700" />,
      bgIcon: "bg-amber-50",
      accent: "border-l-4 border-l-amber-500",
      badge: highestAmount > 0 ? "Major Cost" : undefined,
      badgeClass: "bg-amber-100 text-amber-800",
    },
    {
      id: "average-daily",
      label: "Avg Daily Expense",
      value: `₹${avgDaily.toLocaleString("en-IN")}`,
      helper: "Daily burn rate",
      icon: <Scale className="w-4 h-4 text-purple-700" />,
      bgIcon: "bg-purple-50",
      accent: "border-l-4 border-l-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`relative bg-white rounded-2xl border border-brand-border p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between ${card.accent}`}
        >
          {/* Card Top Row */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted truncate">
              {card.label}
            </span>
            <div
              className={`w-7 h-7 rounded-lg ${card.bgIcon} flex items-center justify-center flex-shrink-0 shadow-2xs`}
            >
              {card.icon}
            </div>
          </div>

          {/* Metric Value */}
          <div className="my-1">
            <p className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight truncate">
              {card.value}
            </p>
          </div>

          {/* Footer note or badge */}
          <div className="flex items-center justify-between text-[11px] text-brand-muted mt-1 pt-1.5 border-t border-brand-border/40">
            <span className="truncate">{card.helper}</span>
            {card.badge && (
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0 ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
