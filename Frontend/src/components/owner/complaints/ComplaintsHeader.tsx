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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-lime/30 text-brand-charcoal border border-brand-lime uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-charcoal" />
            <span>OPERATIONAL TICKETING</span>
          </span>
          {selectedProperty && (
            <span className="text-xs text-brand-muted hidden sm:inline-flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-brand-muted" />
              <span className="font-medium text-brand-charcoal">{selectedProperty.name}</span>
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
          Complaints Management
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
          Manage resident concerns, track reported issues, and ensure a better living experience.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-charcoal bg-white hover:bg-brand-offwhite border border-brand-border shadow-2xs transition-colors active:scale-95 disabled:opacity-60"
          title="Refresh dataset from storage"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-brand-muted ${isRefreshing ? "animate-spin text-brand-charcoal" : ""}`}
          />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-obsidian text-white hover:bg-brand-obsidian-hover shadow-xs transition-colors active:scale-95"
          title="Export filtered complaints to Excel"
        >
          <Download className="w-3.5 h-3.5 text-brand-lime" />
          <span>Export Complaints</span>
        </button>
      </div>
    </div>
  );
}
