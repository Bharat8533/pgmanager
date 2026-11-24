"use client";

import React from "react";
import { GuestFiltersState, StayStatus, RentStatus } from "@/types/guest";
import {
  Search,
  X,
  RotateCcw,
  UserCheck,
  CalendarCheck,
  History,
  Users,
} from "lucide-react";

interface GuestFiltersProps {
  filters: GuestFiltersState;
  onChange: (updated: Partial<GuestFiltersState>) => void;
  onReset: () => void;
  counts: {
    all: number;
    active: number;
    upcoming: number;
    checked_out: number;
  };
}

export function GuestFilters({
  filters,
  onChange,
  onReset,
  counts,
}: GuestFiltersProps) {
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.stayStatus !== "all" ||
    filters.rentStatus !== "all" ||
    filters.sortBy !== "admission_desc";

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs space-y-3.5">
      {/* Top Row: Search Input + Rent Status + Sort Dropdowns + Reset Button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Search by name, phone (+91), room number, or email..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#F8FAFC] border border-brand-border rounded-xl text-xs sm:text-sm text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-brand-obsidian transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal p-0.5 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Rent Status Filter */}
        <div className="relative min-w-[160px]">
          <select
            value={filters.rentStatus}
            onChange={(e) => onChange({ rentStatus: e.target.value as "all" | RentStatus })}
            className="w-full bg-[#F8FAFC] border border-brand-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-brand-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
          >
            <option value="all">Rent: All Statuses</option>
            <option value="paid">Rent: Paid (No Dues)</option>
            <option value="pending">Rent: Pending</option>
            <option value="overdue">Rent: Overdue (Urgent)</option>
            <option value="partial">Rent: Partial Paid</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative min-w-[170px]">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="w-full bg-[#F8FAFC] border border-brand-border rounded-xl px-3 py-2.5 text-xs sm:text-sm text-brand-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
          >
            <option value="admission_desc">Newest Admissions First</option>
            <option value="admission_asc">Oldest Residents First</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="pending_desc">Highest Pending Rent</option>
            <option value="checkout_asc">Upcoming Check-out First</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shadow-2xs whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Stay Status Pills Filter */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-border/60">
        <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mr-1">
          Status:
        </span>

        {/* All Tab */}
        <button
          type="button"
          onClick={() => onChange({ stayStatus: "all" })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.stayStatus === "all"
              ? "bg-brand-obsidian text-brand-lime shadow-xs"
              : "bg-[#F8FAFC] text-brand-charcoal hover:bg-black/5 border border-brand-border"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Records</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filters.stayStatus === "all"
                ? "bg-brand-lime text-brand-obsidian"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {counts.all}
          </span>
        </button>

        {/* Currently Living (Active) */}
        <button
          type="button"
          onClick={() => onChange({ stayStatus: "active" })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.stayStatus === "active"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-[#F8FAFC] text-brand-charcoal hover:bg-black/5 border border-brand-border"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Currently Living</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filters.stayStatus === "active"
                ? "bg-white text-emerald-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {counts.active}
          </span>
        </button>

        {/* Upcoming Check-ins */}
        <button
          type="button"
          onClick={() => onChange({ stayStatus: "upcoming" })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.stayStatus === "upcoming"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-[#F8FAFC] text-brand-charcoal hover:bg-black/5 border border-brand-border"
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Upcoming Check-ins</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filters.stayStatus === "upcoming"
                ? "bg-white text-amber-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {counts.upcoming}
          </span>
        </button>

        {/* Checked Out */}
        <button
          type="button"
          onClick={() => onChange({ stayStatus: "checked_out" })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.stayStatus === "checked_out"
              ? "bg-gray-800 text-white shadow-xs"
              : "bg-[#F8FAFC] text-brand-charcoal hover:bg-black/5 border border-brand-border"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Checked Out (Alumni)</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filters.stayStatus === "checked_out"
                ? "bg-white text-gray-800"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {counts.checked_out}
          </span>
        </button>
      </div>
    </div>
  );
}
