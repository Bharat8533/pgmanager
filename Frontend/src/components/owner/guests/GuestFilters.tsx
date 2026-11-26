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
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] p-4 shadow-2xs space-y-3.5">
      {/* Top Row: Search Input + Rent Status + Sort Dropdowns + Reset Button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-muted dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Search by name, phone (+91), room number, or email..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl text-xs sm:text-sm text-brand-charcoal dark:text-white placeholder:text-brand-muted/70 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-lime focus:border-brand-obsidian dark:focus:border-brand-lime transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal dark:text-slate-400 dark:hover:text-white p-0.5 rounded-md"
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
            className="w-full bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-brand-charcoal dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
          >
            <option value="all" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Rent: All Statuses</option>
            <option value="paid" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Rent: Paid (No Dues)</option>
            <option value="pending" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Rent: Pending</option>
            <option value="overdue" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Rent: Overdue (Urgent)</option>
            <option value="partial" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Rent: Partial Paid</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative min-w-[170px]">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="w-full bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-brand-charcoal dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-lime cursor-pointer"
          >
            <option value="admission_desc" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Newest Admissions First</option>
            <option value="admission_asc" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Oldest Residents First</option>
            <option value="name_asc" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Name: A to Z</option>
            <option value="name_desc" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Name: Z to A</option>
            <option value="pending_desc" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Highest Pending Rent</option>
            <option value="checkout_asc" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">Upcoming Check-out First</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25 border border-rose-200 dark:border-rose-500/30 rounded-xl transition-all shadow-2xs whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Bottom Row: Stay Status Pills Filter */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-brand-border/60 dark:border-[#1E2638]">
        <span className="text-[11px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider mr-1">
          Status:
        </span>

        {/* All Tab */}
        <button
          type="button"
          onClick={() => onChange({ stayStatus: "all" })}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filters.stayStatus === "all"
              ? "bg-brand-obsidian dark:bg-brand-lime text-brand-lime dark:text-brand-obsidian shadow-xs"
              : "bg-[#F8FAFC] dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 hover:bg-black/5 dark:hover:bg-[#1E293B] border border-brand-border dark:border-[#263346]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Records</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filters.stayStatus === "all"
                ? "bg-brand-lime dark:bg-brand-obsidian text-brand-obsidian dark:text-brand-lime"
                : "bg-gray-200 dark:bg-[#1E2638] text-gray-700 dark:text-slate-300"
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
              ? "bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs"
              : "bg-[#F8FAFC] dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 hover:bg-black/5 dark:hover:bg-[#1E293B] border border-brand-border dark:border-[#263346]"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Currently Living</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filters.stayStatus === "active"
                ? "bg-white dark:bg-[#111622] text-emerald-800 dark:text-emerald-300"
                : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
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
              ? "bg-amber-600 dark:bg-amber-500 text-white dark:text-brand-obsidian shadow-xs"
              : "bg-[#F8FAFC] dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 hover:bg-black/5 dark:hover:bg-[#1E293B] border border-brand-border dark:border-[#263346]"
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Upcoming Check-ins</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filters.stayStatus === "upcoming"
                ? "bg-white dark:bg-[#111622] text-amber-800 dark:text-amber-300"
                : "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300"
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
              ? "bg-gray-800 dark:bg-slate-700 text-white shadow-xs"
              : "bg-[#F8FAFC] dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 hover:bg-black/5 dark:hover:bg-[#1E293B] border border-brand-border dark:border-[#263346]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Checked Out (Alumni)</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              filters.stayStatus === "checked_out"
                ? "bg-white dark:bg-[#111622] text-gray-800 dark:text-slate-300"
                : "bg-gray-200 dark:bg-[#1E2638] text-gray-700 dark:text-slate-300"
            }`}
          >
            {counts.checked_out}
          </span>
        </button>
      </div>
    </div>
  );
}
