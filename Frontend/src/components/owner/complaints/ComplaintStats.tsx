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
      icon: <Inbox className="w-4 h-4 text-brand-charcoal" />,
      subtext: `${stats.urgentCount} urgent priority`,
      bgAccent: "bg-white",
      borderColor: activeStatusTab === "all" ? "border-brand-obsidian ring-2 ring-brand-obsidian/10" : "border-brand-border",
      badgeBg: "bg-brand-offwhite text-brand-charcoal",
    },
    {
      id: "new" as const,
      label: "New",
      count: stats.new,
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      subtext: "Awaiting owner review",
      bgAccent: "bg-blue-50/30",
      borderColor: activeStatusTab === "new" ? "border-blue-600 ring-2 ring-blue-500/20" : "border-blue-100",
      badgeBg: "bg-blue-100/70 text-blue-800",
    },
    {
      id: "pending" as const,
      label: "Pending",
      count: stats.pending,
      icon: <RotateCcw className="w-4 h-4 text-amber-600" />,
      subtext: "Currently in progress",
      bgAccent: "bg-amber-50/30",
      borderColor: activeStatusTab === "pending" ? "border-amber-600 ring-2 ring-amber-500/20" : "border-amber-100",
      badgeBg: "bg-amber-100/70 text-amber-800",
    },
    {
      id: "resolved" as const,
      label: "Resolved",
      count: stats.resolved,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      subtext: `${stats.resolutionRatePercent}% resolution rate`,
      bgAccent: "bg-emerald-50/30",
      borderColor: activeStatusTab === "resolved" ? "border-emerald-600 ring-2 ring-emerald-500/20" : "border-emerald-100",
      badgeBg: "bg-emerald-100/70 text-emerald-800",
    },
    {
      id: "rejected" as const,
      label: "Rejected",
      count: stats.rejected,
      icon: <XCircle className="w-4 h-4 text-rose-600" />,
      subtext: "Declined with reasons",
      bgAccent: "bg-rose-50/30",
      borderColor: activeStatusTab === "rejected" ? "border-rose-600 ring-2 ring-rose-500/20" : "border-rose-100",
      badgeBg: "bg-rose-100/70 text-rose-800",
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
              <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                {card.label}
              </span>
              <div className="w-7 h-7 rounded-lg bg-white border border-brand-border/60 flex items-center justify-center shrink-0 shadow-2xs">
                {card.icon}
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
                {card.count}
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", card.badgeBg)}>
                {card.subtext}
              </span>
            </div>

            {isSelected && (
              <div className="absolute bottom-0 inset-x-0 h-1 bg-brand-charcoal" />
            )}
          </button>
        );
      })}
    </div>
  );
}
