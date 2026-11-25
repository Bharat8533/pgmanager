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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-brand-border/60">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-brand-obsidian text-brand-lime flex items-center justify-center shadow-xs shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight">
            Staff Management
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted max-w-xl">
          Manage your team, assign responsibilities, and keep employee records organized across your PG operations.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap self-stretch sm:self-auto justify-end">
        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-brand-charcoal transition-all shadow-2xs active:scale-95 shrink-0"
          title="Refresh staff roster"
          aria-label="Refresh data"
        >
          <RotateCw
            className={`w-4 h-4 text-slate-500 ${
              isRefreshing ? "animate-spin text-blue-600" : ""
            }`}
          />
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExportStaff}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-brand-charcoal text-xs font-bold transition-all shadow-2xs active:scale-95 flex-1 sm:flex-initial"
        >
          <Download className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Export Excel</span>
        </button>

        {/* Add Staff Button */}
        <button
          type="button"
          onClick={onAddStaff}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-obsidian text-brand-lime text-xs font-bold hover:bg-black transition-all shadow-xs active:scale-95 flex-1 sm:flex-initial"
        >
          <Plus className="w-4 h-4 text-brand-lime shrink-0" />
          <span>Add Staff</span>
        </button>
      </div>
    </div>
  );
}
