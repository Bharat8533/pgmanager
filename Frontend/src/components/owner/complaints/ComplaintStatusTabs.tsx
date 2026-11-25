"use client";

import React from "react";
import { ComplaintStatus, ComplaintStatsData } from "@/types/complaint";
import { cn } from "@/lib/utils";
import { Inbox, Clock, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

interface ComplaintStatusTabsProps {
  activeTab: ComplaintStatus | "all";
  onTabChange: (tab: ComplaintStatus | "all") => void;
  stats: ComplaintStatsData;
}

export function ComplaintStatusTabs({
  activeTab,
  onTabChange,
  stats,
}: ComplaintStatusTabsProps) {
  const tabs = [
    {
      id: "all" as const,
      label: "All Complaints",
      count: stats.total,
      icon: <Inbox className="w-3.5 h-3.5" />,
    },
    {
      id: "new" as const,
      label: "New",
      count: stats.new,
      icon: <Clock className="w-3.5 h-3.5" />,
      activeColor: "bg-blue-600 text-white",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "pending" as const,
      label: "Pending",
      count: stats.pending,
      icon: <RotateCcw className="w-3.5 h-3.5" />,
      activeColor: "bg-amber-600 text-white",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      id: "resolved" as const,
      label: "Resolved",
      count: stats.resolved,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      activeColor: "bg-emerald-600 text-white",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "rejected" as const,
      label: "Rejected",
      count: stats.rejected,
      icon: <XCircle className="w-3.5 h-3.5" />,
      activeColor: "bg-rose-600 text-white",
      badgeColor: "bg-rose-100 text-rose-800",
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-white border border-brand-border rounded-2xl shadow-2xs overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer",
              isActive
                ? "bg-brand-obsidian text-white shadow-xs"
                : "text-brand-muted hover:text-brand-charcoal hover:bg-brand-offwhite"
            )}
          >
            <span className={cn(isActive ? "text-brand-lime" : "text-brand-muted")}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px] font-extrabold min-w-[20px] text-center",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-brand-offwhite text-brand-charcoal border border-brand-border/60"
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
