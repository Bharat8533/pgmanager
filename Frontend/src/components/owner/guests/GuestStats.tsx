"use client";

import React from "react";
import { GuestSummaryStats } from "@/types/guest";
import {
  Users,
  UserCheck,
  CalendarClock,
  History,
  AlertCircle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

interface GuestStatsProps {
  stats: GuestSummaryStats;
  selectedPropertyName?: string;
}

export function GuestStats({ stats, selectedPropertyName }: GuestStatsProps) {
  const cards = [
    {
      id: "total",
      label: "Total Guests",
      value: stats.totalGuests.toString(),
      helper: selectedPropertyName ? `in ${selectedPropertyName}` : "All registered records",
      icon: <Users className="w-4 h-4 text-brand-obsidian dark:text-slate-200" />,
      bgIcon: "bg-white/80 dark:bg-[#1E2638] dark:border dark:border-[#263346]",
      accent: "border-l-4 border-l-brand-obsidian dark:border-l-slate-400",
    },
    {
      id: "living",
      label: "Currently Living",
      value: stats.currentlyLiving.toString(),
      helper: "Active in rooms",
      icon: <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
      bgIcon: "bg-emerald-50 dark:bg-emerald-500/15 dark:border dark:border-emerald-500/30",
      accent: "border-l-4 border-l-emerald-500",
      badge: "Active",
      badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    {
      id: "upcoming-checkouts",
      label: "Upcoming Check-outs",
      value: stats.upcomingCheckouts.toString(),
      helper: "Next 14 days notice",
      icon: <CalendarClock className="w-4 h-4 text-amber-700 dark:text-amber-400" />,
      bgIcon: "bg-amber-50 dark:bg-amber-500/15 dark:border dark:border-amber-500/30",
      accent: "border-l-4 border-l-amber-500",
      badge: stats.upcomingCheckouts > 0 ? "Notice Given" : undefined,
      badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
    },
    {
      id: "alumni",
      label: "Checked-out Alumni",
      value: stats.checkedOutGuests.toString(),
      helper: "Stay histories preserved",
      icon: <History className="w-4 h-4 text-brand-muted dark:text-slate-400" />,
      bgIcon: "bg-gray-100 dark:bg-[#1E2638] dark:border dark:border-[#263346]",
      accent: "border-l-4 border-l-gray-400 dark:border-l-slate-600",
    },
    {
      id: "pending-rent",
      label: "Pending Rent",
      value: `₹${stats.pendingRent.toLocaleString("en-IN")}`,
      helper: "Uncollected monthly dues",
      icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      bgIcon: "bg-rose-50 dark:bg-rose-500/15 dark:border dark:border-rose-500/30",
      accent: "border-l-4 border-l-rose-500",
      isAlert: stats.pendingRent > 0,
      badge: stats.pendingRent > 0 ? "Action Required" : "Cleared",
      badgeClass: stats.pendingRent > 0 ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    {
      id: "deposits",
      label: "Security Deposits Held",
      value: `₹${stats.securityDepositsHeld.toLocaleString("en-IN")}`,
      helper: "Refundable escrow liability",
      icon: <ShieldCheck className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />,
      bgIcon: "bg-indigo-50 dark:bg-indigo-500/15 dark:border dark:border-indigo-500/30",
      accent: "border-l-4 border-l-indigo-500",
      badge: "Escrow",
      badgeClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`relative bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${card.accent}`}
        >
          {/* Card Top Row */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400 truncate">
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
            <p className="text-xl sm:text-2xl font-black text-brand-charcoal dark:text-white tracking-tight truncate">
              {card.value}
            </p>
          </div>

          {/* Footer note or badge */}
          <div className="flex items-center justify-between text-[11px] text-brand-muted dark:text-slate-400 mt-1 pt-1.5 border-t border-brand-border/40 dark:border-[#1E2638]">
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

