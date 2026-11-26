"use client";

import React from "react";
import { UserCheck, Plus, Download, RotateCw } from "lucide-react";

interface StaffHeaderProps {
  onAddStaff: () => void;
  onExportStaff: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function StaffHeader({
  onAddStaff,
  onExportStaff,
  onRefresh,
  isRefreshing = false,
}: StaffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-brand-border/60 dark:border-[#222E42]">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-brand-obsidian text-brand-lime flex items-center justify-center shadow-xs shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">
            Staff Management
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted dark:text-slate-400 max-w-xl">
          Manage your team, assign responsibilities, and keep employee records organized across your PG operations.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap self-stretch sm:self-auto justify-end">
        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-[#263346] bg-white dark:bg-[#151D2A] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-slate-200 transition-all shadow-2xs active:scale-95 shrink-0"
          title="Refresh staff roster"
          aria-label="Refresh data"
        >
          <RotateCw
            className={`w-4 h-4 text-slate-500 dark:text-slate-400 ${
              isRefreshing ? "animate-spin text-blue-600 dark:text-blue-400" : ""
            }`}
          />
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExportStaff}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#263346] bg-white dark:bg-[#151D2A] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-slate-200 text-xs font-bold transition-all shadow-2xs active:scale-95 flex-1 sm:flex-initial"
        >
          <Download className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>Export Excel</span>
        </button>

        {/* Add Staff Button */}
        <button
          type="button"
          onClick={onAddStaff}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-obsidian text-brand-lime hover:bg-black dark:bg-brand-lime dark:text-[#0A0D12] dark:hover:bg-[#b8e85c] text-xs font-bold transition-all shadow-xs active:scale-95 flex-1 sm:flex-initial"
        >
          <Plus className="w-4 h-4 text-brand-lime dark:text-[#0A0D12] shrink-0" />
          <span>Add Staff</span>
        </button>
      </div>
    </div>
  );
}
