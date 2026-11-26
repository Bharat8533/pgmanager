"use client";

import React, { useState } from "react";
import {
  ComplaintFiltersState,
  ComplaintCategory,
  ComplaintPriority,
} from "@/types/complaint";
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
} from "@/constants/mockComplaintsData";
import {
  Search,
  Filter,
  Calendar,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  User,
  BedDouble,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplaintFiltersProps {
  filters: ComplaintFiltersState;
  onFilterChange: <K extends keyof ComplaintFiltersState>(
    key: K,
    value: ComplaintFiltersState[K]
  ) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalCount: number;
  availableResidents: { id: string; name: string }[];
  availableRooms: string[];
}

export function ComplaintFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
  totalCount,
  availableResidents,
  availableRooms,
}: ComplaintFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFiltersCount = [
    filters.category !== "all",
    filters.priority !== "all",
    filters.dateRange !== "all",
    filters.residentId !== "all",
    filters.roomNumber !== "all",
    Boolean(filters.search.trim()),
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] p-3.5 sm:p-4 shadow-2xs space-y-3">
      {/* Primary Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-2.5">
        {/* Global Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-muted dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search by resident name, room number, complaint title or ID..."
            className="w-full text-xs pl-9 pr-8 py-2 rounded-xl border border-brand-border dark:border-[#263346] bg-brand-offwhite/40 dark:bg-[#151D2A] focus:bg-white dark:focus:bg-[#182232] text-brand-charcoal dark:text-white placeholder:text-brand-muted dark:placeholder:text-slate-500 focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="relative min-w-[130px]">
            <select
              value={filters.dateRange}
              onChange={(e) =>
                onFilterChange(
                  "dateRange",
                  e.target.value as ComplaintFiltersState["dateRange"]
                )
              }
              aria-label="Filter by date range"
              className="w-full text-xs py-2 pl-3 pr-7 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="all" className="dark:bg-[#151D2A]">All Dates</option>
              <option value="today" className="dark:bg-[#151D2A]">Today</option>
              <option value="yesterday" className="dark:bg-[#151D2A]">Yesterday</option>
              <option value="last_7_days" className="dark:bg-[#151D2A]">Last 7 Days</option>
              <option value="last_30_days" className="dark:bg-[#151D2A]">Last 30 Days</option>
              <option value="this_month" className="dark:bg-[#151D2A]">This Month</option>
              <option value="previous_month" className="dark:bg-[#151D2A]">Previous Month</option>
              <option value="custom" className="dark:bg-[#151D2A]">Custom Range...</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Category Dropdown */}
          <div className="relative min-w-[150px]">
            <select
              value={filters.category}
              onChange={(e) =>
                onFilterChange(
                  "category",
                  e.target.value as ComplaintFiltersState["category"]
                )
              }
              aria-label="Filter by complaint category"
              className="w-full text-xs py-2 pl-3 pr-7 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="all" className="dark:bg-[#151D2A]">All Categories</option>
              {Object.values(COMPLAINT_CATEGORIES).map((cat) => (
                <option key={cat.id} value={cat.id} className="dark:bg-[#151D2A]">
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Priority Dropdown */}
          <div className="relative min-w-[120px]">
            <select
              value={filters.priority}
              onChange={(e) =>
                onFilterChange(
                  "priority",
                  e.target.value as ComplaintFiltersState["priority"]
                )
              }
              aria-label="Filter by priority level"
              className="w-full text-xs py-2 pl-3 pr-7 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="all" className="dark:bg-[#151D2A]">All Priorities</option>
              <option value="urgent" className="dark:bg-[#151D2A]">Urgent</option>
              <option value="high" className="dark:bg-[#151D2A]">High</option>
              <option value="medium" className="dark:bg-[#151D2A]">Medium</option>
              <option value="low" className="dark:bg-[#151D2A]">Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange(
                  "sortBy",
                  e.target.value as ComplaintFiltersState["sortBy"]
                )
              }
              aria-label="Sort complaints by"
              className="w-full text-xs py-2 pl-3 pr-7 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none appearance-none cursor-pointer font-medium"
            >
              <option value="newest" className="dark:bg-[#151D2A]">Newest First</option>
              <option value="oldest" className="dark:bg-[#151D2A]">Oldest First</option>
              <option value="priority_desc" className="dark:bg-[#151D2A]">Highest Priority</option>
              <option value="priority_asc" className="dark:bg-[#151D2A]">Lowest Priority</option>
              <option value="status" className="dark:bg-[#151D2A]">By Status</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-brand-muted dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer",
              showAdvanced || activeFiltersCount > 0
                ? "bg-brand-obsidian dark:bg-brand-lime text-white dark:text-brand-obsidian border-brand-obsidian dark:border-brand-lime"
                : "bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 border-brand-border dark:border-[#263346] hover:bg-brand-offwhite dark:hover:bg-[#1E293B]"
            )}
            title="Toggle room & resident filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-lime dark:bg-brand-obsidian text-brand-charcoal dark:text-brand-lime text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker (Shown when dateRange === 'custom') */}
      {filters.dateRange === "custom" && (
        <div className="p-3 bg-brand-offwhite/50 dark:bg-[#151D2A] rounded-xl border border-brand-border/70 dark:border-[#263346] flex flex-wrap items-center gap-3 text-xs animate-fadeIn">
          <span className="font-bold text-brand-charcoal dark:text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
            <span>Custom Dates:</span>
          </span>
          <div className="flex items-center gap-2">
            <label className="text-brand-muted dark:text-slate-400">From:</label>
            <input
              type="date"
              value={filters.customStartDate}
              onChange={(e) => onFilterChange("customStartDate", e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-brand-border dark:border-[#263346] bg-white dark:bg-[#111622] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-brand-muted dark:text-slate-400">To:</label>
            <input
              type="date"
              value={filters.customEndDate}
              onChange={(e) => onFilterChange("customEndDate", e.target.value)}
              className="text-xs p-1.5 rounded-lg border border-brand-border dark:border-[#263346] bg-white dark:bg-[#111622] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Advanced Filters Drawer/Row */}
      {showAdvanced && (
        <div className="pt-3 border-t border-brand-border/60 dark:border-[#1E2638] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
          {/* Resident Filter */}
          <div>
            <label className="block text-[11px] font-bold text-brand-muted dark:text-slate-400 mb-1 flex items-center gap-1">
              <User className="w-3 h-3 text-brand-muted dark:text-slate-400" />
              <span>Specific Resident</span>
            </label>
            <select
              value={filters.residentId}
              onChange={(e) => onFilterChange("residentId", e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none"
            >
              <option value="all" className="dark:bg-[#151D2A]">All Residents</option>
              {availableResidents.map((res) => (
                <option key={res.id} value={res.id} className="dark:bg-[#151D2A]">
                  {res.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Filter */}
          <div>
            <label className="block text-[11px] font-bold text-brand-muted dark:text-slate-400 mb-1 flex items-center gap-1">
              <BedDouble className="w-3 h-3 text-brand-muted dark:text-slate-400" />
              <span>Specific Room</span>
            </label>
            <select
              value={filters.roomNumber}
              onChange={(e) => onFilterChange("roomNumber", e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white focus:border-brand-charcoal dark:focus:border-brand-lime focus:outline-none"
            >
              <option value="all" className="dark:bg-[#151D2A]">All Rooms</option>
              {availableRooms.map((rm) => (
                <option key={rm} value={rm} className="dark:bg-[#151D2A]">
                  Room {rm}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Clear in Advanced */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={onResetFilters}
              disabled={activeFiltersCount === 0}
              className="w-full py-2 px-3 rounded-xl border border-brand-border dark:border-[#263346] text-xs font-semibold text-brand-charcoal dark:text-slate-200 bg-brand-offwhite dark:bg-[#151D2A] hover:bg-brand-border dark:hover:bg-[#1E293B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Summary & Active Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-brand-border/40 dark:border-[#1E2638] text-xs">
        <div className="flex items-center gap-2">
          <span className="text-brand-muted dark:text-slate-400 text-[11px]">
            Showing <strong className="text-brand-charcoal dark:text-white font-bold">{totalFilteredCount}</strong> of {totalCount} complaints
          </span>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline transition-colors flex items-center gap-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Active Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.category !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              <span>{COMPLAINT_CATEGORIES[filters.category]?.label}</span>
              <button
                type="button"
                onClick={() => onFilterChange("category", "all")}
                className="hover:text-blue-900 dark:hover:text-white"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}

          {filters.priority !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
              <span className="uppercase">{filters.priority}</span>
              <button
                type="button"
                onClick={() => onFilterChange("priority", "all")}
                className="hover:text-amber-900 dark:hover:text-white"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}

          {filters.dateRange !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-offwhite dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 border border-brand-border dark:border-[#263346]">
              <span>Date: {filters.dateRange.replace(/_/g, " ")}</span>
              <button
                type="button"
                onClick={() => onFilterChange("dateRange", "all")}
                className="hover:text-brand-charcoal dark:hover:text-white"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
