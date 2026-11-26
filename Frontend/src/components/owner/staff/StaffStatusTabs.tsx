"use client";

import React from "react";
import { StaffStatus } from "@/types/staff";
import { cn } from "@/lib/utils";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

interface StaffStatusTabsProps {
  activeTab: StaffStatus | "all";
  onTabChange: (tab: StaffStatus | "all") => void;
  counts: {
    all: number;
    active: number;
    on_leave: number;
    inactive: number;
  };
}

export function StaffStatusTabs({
  activeTab,
  onTabChange,
  counts,
}: StaffStatusTabsProps) {
  const tabs = [
    {
      id: "all" as const,
      label: "All Staff",
      count: counts.all,
      icon: <Users className="w-3.5 h-3.5" />,
      activeColor: "bg-brand-obsidian text-white border-brand-obsidian dark:bg-[#1E293B] dark:text-brand-lime dark:border-[#C6F36B]/40",
      badgeColor: "bg-white/20 dark:bg-black/40 text-white dark:text-brand-lime",
    },
    {
      id: "active" as const,
      label: "Active",
      count: counts.active,
      icon: <UserCheck className="w-3.5 h-3.5" />,
      activeColor: "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-600/90 dark:border-emerald-500",
      badgeColor: "bg-white/20 dark:bg-black/40 text-white",
    },
    {
      id: "on_leave" as const,
      label: "On Leave",
      count: counts.on_leave,
      icon: <Clock className="w-3.5 h-3.5" />,
      activeColor: "bg-amber-600 text-white border-amber-600 dark:bg-amber-600/90 dark:border-amber-500",
      badgeColor: "bg-white/20 dark:bg-black/40 text-white",
    },
    {
      id: "inactive" as const,
      label: "Inactive",
      count: counts.inactive,
      icon: <UserX className="w-3.5 h-3.5" />,
      activeColor: "bg-slate-700 text-white border-slate-700 dark:bg-slate-700/90 dark:border-slate-600",
      badgeColor: "bg-white/20 dark:bg-black/40 text-white",
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap active:scale-95 shadow-2xs",
              isActive
                ? tab.activeColor
                : "bg-white dark:bg-[#111622] text-brand-charcoal dark:text-slate-300 border-brand-border dark:border-[#222E42] hover:bg-slate-50 dark:hover:bg-[#182232]"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-extrabold",
                isActive ? tab.badgeColor : "bg-slate-100 dark:bg-[#182232] text-brand-muted dark:text-slate-400"
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
