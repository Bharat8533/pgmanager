"use client";

import React from "react";
import { Search, X, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusFilterOption = "all" | "active" | "inactive" | "under_maintenance";
export type OccupancyFilterOption = "all" | "high" | "medium" | "low";
export type SortOption =
  | "recently_added"
  | "name_asc"
  | "name_desc"
  | "occupancy_high"
  | "occupancy_low"
  | "beds_high"
  | "beds_low";

interface PropertyFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilterOption;
  onStatusChange: (val: StatusFilterOption) => void;
  cityFilter: string;
  onCityChange: (val: string) => void;
  occupancyFilter: OccupancyFilterOption;
  onOccupancyChange: (val: OccupancyFilterOption) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
  onResetFilters: () => void;
  availableCities: string[];
  totalResultsCount: number;
  totalPropertiesCount: number;
}

export function PropertyFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  cityFilter,
  onCityChange,
  occupancyFilter,
  onOccupancyChange,
  sortBy,
  onSortChange,
  onResetFilters,
  availableCities,
  totalResultsCount,
  totalPropertiesCount,
}: PropertyFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    cityFilter !== "all" ||
    occupancyFilter !== "all" ||
    sortBy !== "recently_added";

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border/80 dark:border-[#222E42] p-4 shadow-xs space-y-3">
      {/* Row 1: Search bar + Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-muted dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by property name, locality, address or city..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-brand-border dark:border-[#263143] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal dark:text-white placeholder:text-brand-muted/70 dark:placeholder:text-slate-500 font-medium bg-slate-50/50 dark:bg-[#0E121A] hover:bg-white dark:hover:bg-[#121722]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-brand-muted dark:text-slate-400 flex-shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-charcoal dark:text-white" />
            <span className="font-semibold text-brand-charcoal dark:text-white hidden sm:inline">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-brand-border dark:border-[#263143] bg-white dark:bg-[#0E121A] text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 cursor-pointer"
          >
            <option value="recently_added">Recently Added</option>
            <option value="name_asc">Property Name (A–Z)</option>
            <option value="name_desc">Property Name (Z–A)</option>
            <option value="occupancy_high">Highest Occupancy</option>
            <option value="occupancy_low">Lowest Occupancy</option>
            <option value="beds_high">Most Beds Capacity</option>
            <option value="beds_low">Fewest Beds Capacity</option>
          </select>
        </div>
      </div>

      {/* Row 2: Filter Pills (Status, City, Occupancy) & Reset Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status filter buttons */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-[#0E121A] p-0.5 border border-slate-200/80 dark:border-[#263143]">
            {[
              { id: "all", label: "All Status" },
              { id: "active", label: "Active" },
              { id: "inactive", label: "Inactive" },
              { id: "under_maintenance", label: "Maintenance" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onStatusChange(st.id as StatusFilterOption)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all",
                  statusFilter === st.id
                    ? "bg-white dark:bg-[#1E2738] text-brand-charcoal dark:text-white shadow-2xs"
                    : "text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white"
                )}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* City Selector */}
          <select
            value={cityFilter}
            onChange={(e) => onCityChange(e.target.value)}
            className="px-2.5 py-1 text-xs font-semibold rounded-xl border border-brand-border dark:border-[#263143] bg-white dark:bg-[#0E121A] text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 cursor-pointer"
          >
            <option value="all">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Occupancy Tier Filter */}
          <select
            value={occupancyFilter}
            onChange={(e) => onOccupancyChange(e.target.value as OccupancyFilterOption)}
            className="px-2.5 py-1 text-xs font-semibold rounded-xl border border-brand-border dark:border-[#263143] bg-white dark:bg-[#0E121A] text-brand-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 cursor-pointer"
          >
            <option value="all">All Occupancy</option>
            <option value="high">High (&gt;85% Occupied)</option>
            <option value="medium">Medium (70%–85%)</option>
            <option value="low">Low (&lt;70% Occupied)</option>
          </select>
        </div>

        {/* Results Counter & Reset Filter */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="text-[11px] font-semibold text-brand-muted dark:text-slate-300">
            Showing <strong className="text-brand-charcoal dark:text-white font-bold">{totalResultsCount}</strong> of {totalPropertiesCount} properties
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-800/60 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
