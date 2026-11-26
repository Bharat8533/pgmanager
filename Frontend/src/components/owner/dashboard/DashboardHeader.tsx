"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOwner } from "@/contexts/OwnerContext";
import {
  Calendar,
  RotateCw,
  Plus,
  ChevronDown,
  Sparkles,
  Building2,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DateRangeOption =
  | "today"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "custom";

interface DateOptionMeta {
  id: DateRangeOption;
  label: string;
  badge?: string;
}

const DATE_OPTIONS: DateOptionMeta[] = [
  { id: "today", label: "Today" },
  { id: "last7days", label: "Last 7 Days" },
  { id: "last30days", label: "Last 30 Days" },
  { id: "thisMonth", label: "This Month", badge: "Default" },
  { id: "lastMonth", label: "Last Month" },
  { id: "thisYear", label: "This Year (FY 26-27)" },
  { id: "custom", label: "Custom Date Range..." },
];

interface DashboardHeaderProps {
  dateRange: DateRangeOption;
  onDateRangeChange: (val: DateRangeOption) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  lastUpdatedText?: string;
}

export function DashboardHeader({
  dateRange,
  onDateRangeChange,
  onRefresh,
  isRefreshing = false,
  lastUpdatedText = "Just now",
}: DashboardHeaderProps) {
  const { ownerProfile, selectedProperty } = useOwner();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customStart, setCustomStart] = useState("2026-11-01");
  const [customEnd, setCustomEnd] = useState("2026-11-24");

  // Time-aware greeting
  const greeting = React.useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const activeOption = DATE_OPTIONS.find((o) => o.id === dateRange) || DATE_OPTIONS[3];

  const handleSelectOption = (opt: DateRangeOption) => {
    if (opt === "custom") {
      setIsDropdownOpen(false);
      setIsCustomModalOpen(true);
    } else {
      onDateRangeChange(opt);
      setIsDropdownOpen(false);
    }
  };

  const applyCustomRange = () => {
    setIsCustomModalOpen(false);
    onDateRangeChange("custom");
  };

  return (
    <div className="flex flex-col gap-4 pb-2 border-b border-brand-border/60">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Greeting & Property Badge */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-charcoal uppercase tracking-wider bg-brand-lime/25 text-brand-charcoal px-2.5 py-0.5 rounded-full border border-brand-lime/50 shadow-2xs">
              <Sparkles className="w-3 h-3 text-brand-charcoal" />
              <span>Owner Overview</span>
            </span>

            <span className="text-xs text-brand-muted">•</span>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal bg-white border border-brand-border px-2.5 py-0.5 rounded-full shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{selectedProperty ? selectedProperty.name : "Portfolio • All Properties"}</span>
            </div>

            <span className="text-xs text-brand-muted hidden sm:inline">•</span>

            <span className="text-xs text-brand-muted hidden sm:inline">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal tracking-tight">
            {greeting}, {ownerProfile.name}!
          </h1>

          <p className="text-sm text-brand-muted mt-1 leading-relaxed">
            Here&apos;s what&apos;s happening with your PG business today.
          </p>
        </div>

        {/* Right: Date Filter, Refresh & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-brand-border text-brand-charcoal text-xs font-semibold hover:border-brand-charcoal/30 shadow-2xs transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-label="Select date range"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{dateRange === "custom" ? `${customStart} to ${customEnd}` : activeOption.label}</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-brand-muted transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-56 max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-xl border border-brand-border py-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-brand-muted tracking-wider border-b border-brand-border/50">
                    Filter Dashboard By Period
                  </div>
                  {DATE_OPTIONS.map((opt) => {
                    const isSelected = dateRange === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors",
                          isSelected
                            ? "bg-blue-50 text-blue-600 font-bold"
                            : "text-brand-charcoal hover:bg-slate-50 font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          ) : (
                            <span className="w-3.5 h-3.5" />
                          )}
                          <span>{opt.label}</span>
                        </div>
                        {opt.badge && (
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 text-brand-muted">
                            {opt.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-brand-border text-brand-charcoal text-xs font-semibold hover:border-brand-charcoal/30 shadow-2xs transition-all active:scale-[0.98] focus:outline-none"
            title={`Last updated ${lastUpdatedText}`}
          >
            <RotateCw
              className={cn(
                "w-3.5 h-3.5 text-brand-muted transition-transform",
                isRefreshing && "animate-spin text-blue-600"
              )}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Quick Action: Add Booking */}
          <Link
            href="/owner/bookings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-obsidian text-white text-xs font-semibold hover:bg-brand-obsidian-hover shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-brand-lime" />
            <span>Add Booking</span>
          </Link>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-brand-border shadow-2xl w-full max-w-md p-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-brand-charcoal">
                  Select Custom Date Range
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-brand-muted hover:text-brand-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4">
              <div>
                <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-brand-charcoal font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-brand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-brand-charcoal font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-brand-muted hover:text-brand-charcoal rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCustomRange}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
