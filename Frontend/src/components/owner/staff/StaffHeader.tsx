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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-border/60">
      <div>
        <div className="flex items-center gap-2 mb-1">
          
          <h1 className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight">
            Staff Management
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted">
          Manage your team, assign responsibilities, and keep employee records organized across your PG operations.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
        
        <button
          type="button"
          onClick={onExportStaff}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-brand-charcoal text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          <Download className="w-4 h-4 text-brand-muted" />
          <span>Export Staff</span>
        </button>

        <button
          type="button"
          onClick={onAddStaff}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-obsidian text-brand-lime text-xs font-bold hover:bg-black transition-all shadow-xs active:scale-95"
        >
          <Plus className="w-4 h-4 text-brand-lime" />
          <span>Add Staff</span>
        </button>
      </div>
    </div>
  );
}
