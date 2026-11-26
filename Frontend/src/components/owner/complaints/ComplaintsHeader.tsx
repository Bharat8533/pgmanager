"use client";

import React, { useState } from "react";
import { Download, RefreshCw, Building2, Sparkles } from "lucide-react";
import { useOwner } from "@/contexts/OwnerContext";

interface ComplaintsHeaderProps {
  onExport: () => void;
  onRefresh: () => void;
  totalFilteredCount: number;
}

export function ComplaintsHeader({
  onExport,
  onRefresh,
  totalFilteredCount,
}: ComplaintsHeaderProps) {
  const { selectedProperty } = useOwner();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-lime/20 dark:bg-brand-lime/15 text-brand-charcoal dark:text-brand-lime border border-brand-lime/40 dark:border-brand-lime/30 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-charcoal dark:text-brand-lime" />
            <span>OPERATIONAL TICKETING</span>
          </span>
          {selectedProperty && (
            <span className="text-xs text-brand-muted dark:text-slate-400 hidden sm:inline-flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
              <span className="font-medium text-brand-charcoal dark:text-slate-200">{selectedProperty.name}</span>
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-charcoal dark:text-white tracking-tight">
          Complaints Management
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted dark:text-slate-400 mt-0.5">
          Manage resident concerns, track reported issues, and ensure a better living experience.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-charcoal dark:text-slate-200 bg-white dark:bg-[#151D2A] hover:bg-brand-offwhite dark:hover:bg-[#1E293B] border border-brand-border dark:border-[#263346] shadow-2xs transition-colors active:scale-95 disabled:opacity-60 cursor-pointer"
          title="Refresh dataset from storage"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-brand-muted dark:text-slate-400 ${isRefreshing ? "animate-spin text-brand-charcoal dark:text-brand-lime" : ""}`}
          />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-obsidian dark:bg-brand-lime text-white dark:text-brand-obsidian hover:bg-brand-obsidian-hover dark:hover:bg-[#bbf057] shadow-xs transition-colors active:scale-95 cursor-pointer"
          title="Export filtered complaints to Excel"
        >
          <Download className="w-3.5 h-3.5 text-brand-lime dark:text-brand-obsidian" />
          <span>Export Complaints</span>
        </button>
      </div>
    </div>
  );
}
