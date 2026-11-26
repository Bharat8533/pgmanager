"use client";

import React from "react";
import { ModernActivityItem } from "@/data/activitiesData";
import {
  UserPlus,
  CreditCard,
  CalendarCheck,
  AlertCircle,
  Bed,
  UserMinus,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentActivitiesTimelineProps {
  activities: ModernActivityItem[];
}

export function RecentActivitiesTimeline({
  activities,
}: RecentActivitiesTimelineProps) {
  const getActivityIcon = (category: ModernActivityItem["category"]) => {
    switch (category) {
      case "tenant":
        return <UserPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case "payment":
        return <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "booking":
        return <CalendarCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case "complaint":
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "room":
        return <Bed className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case "property":
        return <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-brand-charcoal dark:text-white" />;
    }
  };

  const getCategoryBadgeClass = (category: ModernActivityItem["category"]) => {
    switch (category) {
      case "tenant":
        return "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60";
      case "payment":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60";
      case "booking":
        return "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60";
      case "complaint":
        return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60";
      case "room":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60";
      case "property":
        return "bg-slate-100 text-slate-700 border-slate-200/60 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-[#131720] rounded-2xl shadow-xs p-5 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-3  dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-charcoal dark:text-white tracking-tight">
              Recent Activity Log
            </h3>
            <p className="text-xs text-brand-muted dark:text-slate-400">
              Live audit stream of PG branch events
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
          Live Sync
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="my-3 space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start gap-3.5 pl-1.5 group">
            {/* Timeline Icon Node */}
            <div className="w-6 h-6 rounded-full bg-white dark:bg-[#161D27] border-2 border-slate-200 dark:border-[#2A3446] group-hover:border-blue-500 dark:group-hover:border-blue-400 flex items-center justify-center flex-shrink-0 z-10 transition-colors shadow-2xs">
              {getActivityIcon(act.category)}
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0 bg-slate-50/60 dark:bg-[#161D27] group-hover:bg-slate-50 dark:group-hover:bg-[#1C2433] border border-slate-100 dark:border-[#242D3D] rounded-xl p-2.5 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-brand-charcoal dark:text-white truncate">
                  {act.title}
                </span>
                <span className="text-[10px] text-brand-muted dark:text-slate-400 whitespace-nowrap">
                  {act.timeAgo}
                </span>
              </div>

              <p className="text-[11px] text-brand-muted dark:text-slate-300 leading-relaxed line-clamp-2">
                {act.description}
              </p>

              <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-slate-200/40 dark:border-slate-800 text-[10px]">
                <span className="text-brand-muted dark:text-slate-400 truncate">
                  {act.propertyName} • by {act.actor}
                </span>
                {act.highlightText && (
                  <span className="font-bold text-blue-600 dark:text-blue-300 whitespace-nowrap bg-blue-50 dark:bg-blue-950/70 border border-transparent dark:border-blue-800/60 px-1.5 py-0.5 rounded">
                    {act.highlightText}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-brand-muted dark:text-slate-400">
        <span>System automatically logs check-ins & bank triggers</span>
      </div>
    </div>
  );
}
