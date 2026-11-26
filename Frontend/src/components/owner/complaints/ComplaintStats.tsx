"use client";

import React from "react";
import { ComplaintStatsData, ComplaintStatus } from "@/types/complaint";
import {
  Inbox,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplaintStatsProps {
  stats: ComplaintStatsData;
  activeStatusTab: ComplaintStatus | "all";
  onSelectStatus: (status: ComplaintStatus | "all") => void;
}

export function ComplaintStats({
  stats,
  activeStatusTab,
  onSelectStatus,
}: ComplaintStatsProps) {
  const cards = [
    {
      id: "all" as const,
      label: "Total Complaints",
      count: stats.total,
      icon: <Inbox className="w-4 h-4 text-brand-charcoal dark:text-brand-lime" />,
      subtext: `${stats.urgentCount} urgent priority`,
      bgAccent: "bg-white dark:bg-[#111622]",
      borderColor:
        activeStatusTab === "all"
          ? "border-brand-obsidian dark:border-brand-lime ring-2 ring-brand-obsidian/10 dark:ring-brand-lime/20"
          : "border-brand-border dark:border-[#222E42]",
      iconBg: "bg-[#FAFAF8] dark:bg-[#151D2A] border-brand-border/60 dark:border-[#263346]",
      badgeBg: "bg-brand-offwhite dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-300 border border-brand-border/60 dark:border-[#263346]",
      indicatorColor: "bg-brand-charcoal dark:bg-brand-lime",
    },
    {
      id: "new" as const,
      label: "New",
      count: stats.new,
      icon: <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      subtext: "Awaiting owner review",
      bgAccent: "bg-white dark:bg-[#111622]",
      borderColor:
        activeStatusTab === "new"
          ? "border-blue-600 dark:border-blue-400 ring-2 ring-blue-500/20"
          : "border-blue-100 dark:border-blue-500/30 border-l-4 border-l-blue-500",
      iconBg: "bg-blue-50/80 dark:bg-blue-500/15 border-blue-200/60 dark:border-blue-500/30",
      badgeBg: "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/30",
      indicatorColor: "bg-blue-600 dark:bg-blue-400",
    },
    {
      id: "pending" as const,
      label: "Pending",
      count: stats.pending,
      icon: <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      subtext: "Currently in progress",
      bgAccent: "bg-white dark:bg-[#111622]",
      borderColor:
        activeStatusTab === "pending"
          ? "border-amber-600 dark:border-amber-400 ring-2 ring-amber-500/20"
          : "border-amber-100 dark:border-amber-500/30 border-l-4 border-l-amber-500",
      iconBg: "bg-amber-50/80 dark:bg-amber-500/15 border-amber-200/60 dark:border-amber-500/30",
      badgeBg: "bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/30",
      indicatorColor: "bg-amber-600 dark:bg-amber-400",
    },
    {
      id: "resolved" as const,
      label: "Resolved",
      count: stats.resolved,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      subtext: `${stats.resolutionRatePercent}% resolution rate`,
      bgAccent: "bg-white dark:bg-[#111622]",
      borderColor:
        activeStatusTab === "resolved"
          ? "border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-500/20"
          : "border-emerald-100 dark:border-emerald-500/30 border-l-4 border-l-emerald-500",
      iconBg: "bg-emerald-50/80 dark:bg-emerald-500/15 border-emerald-200/60 dark:border-emerald-500/30",
      badgeBg: "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/30",
      indicatorColor: "bg-emerald-600 dark:bg-emerald-400",
    },
    {
      id: "rejected" as const,
      label: "Rejected",
      count: stats.rejected,
      icon: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      subtext: "Declined with reasons",
      bgAccent: "bg-white dark:bg-[#111622]",
      borderColor:
        activeStatusTab === "rejected"
          ? "border-rose-600 dark:border-rose-400 ring-2 ring-rose-500/20"
          : "border-rose-100 dark:border-rose-500/30 border-l-4 border-l-rose-500",
      iconBg: "bg-rose-50/80 dark:bg-rose-500/15 border-rose-200/60 dark:border-rose-500/30",
      badgeBg: "bg-rose-50 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-500/30",
      indicatorColor: "bg-rose-600 dark:bg-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card) => {
        const isSelected = activeStatusTab === card.id;
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={cn(
              "p-4 rounded-2xl border text-left transition-all relative overflow-hidden group shadow-2xs hover:shadow-xs cursor-pointer",
              card.bgAccent,
              card.borderColor
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={cn(
                  "w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs",
                  card.iconBg
                )}
              >
                {card.icon}
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-brand-charcoal dark:text-white tracking-tight">
                {card.count}
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", card.badgeBg)}>
                {card.subtext}
              </span>
            </div>

            {isSelected && (
              <div className={cn("absolute bottom-0 inset-x-0 h-1", card.indicatorColor)} />
            )}
          </button>
        );
      })}
    </div>
  );
}
