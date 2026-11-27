"use client";

import React from "react";
import { RoomFiltersState } from "@/types/room";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomFiltersProps {
  filters: RoomFiltersState;
  onFilterChange: (filters: Partial<RoomFiltersState>) => void;
  onResetFilters: () => void;
  availableFloors: string[];
  totalCount: number;
  filteredCount: number;
}

export function RoomFilters({
  filters,
  onFilterChange,
  onResetFilters,
  availableFloors,
  totalCount,
  filteredCount,
}: RoomFiltersProps) {
  const isFiltered =
    filters.searchQuery !== "" ||
    filters.roomType !== "all" ||
    filters.roomStatus !== "all" ||
    filters.floor !== "all" ||
    filters.sortBy !== "room_asc";

  const roomTypeOptions = [
    { label: "All Room Types", value: "all" },
    { label: "Single Sharing", value: "Single Sharing" },
    { label: "Double Sharing", value: "Double Sharing" },
    { label: "Triple Sharing", value: "Triple Sharing" },
    { label: "Four Sharing", value: "Four Sharing" },
    { label: "Custom", value: "Custom" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "all" },
    { label: "Fully Occupied", value: "fully_occupied" },
    { label: "Partially Occupied", value: "partially_occupied" },
    { label: "Available", value: "available" },
    { label: "Fully Reserved", value: "fully_reserved" },
    { label: "Under Maintenance", value: "under_maintenance" },
    { label: "Inactive", value: "inactive" },
  ];

  const sortOptions = [
    { label: "Room: 101 → 304", value: "room_asc" },
    { label: "Room: 304 → 101", value: "room_desc" },
    { label: "Highest Occupancy", value: "occupancy_high" },
    { label: "Lowest Occupancy", value: "occupancy_low" },
    { label: "Most Beds", value: "beds_high" },
    { label: "Least Beds", value: "beds_low" },
  ];

  
  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border/80 dark:border-[#222E42] p-3 sm:p-4 shadow-2xs space-y-3">
      {/* Top Search & Primary Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-muted dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search by room number, floor, sharing type, or resident name..."
            className="w-full h-10 pl-9 pr-8 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white dark:bg-[#151D2A] dark:hover:bg-[#1A2332] dark:focus:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 focus:border-brand-obsidian dark:focus:border-brand-lime transition-all placeholder:text-brand-muted/70 dark:placeholder:text-slate-500 text-brand-charcoal dark:text-white"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal dark:text-slate-400 dark:hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial sm:w-48">
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as RoomFiltersState["sortBy"] })}
              className="w-full h-10 pl-8 pr-7 text-xs bg-slate-50 hover:bg-slate-100/80 dark:bg-[#151D2A] dark:hover:bg-[#1A2332] rounded-xl border border-brand-border/80 dark:border-[#263346] focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 font-medium text-brand-charcoal dark:text-white cursor-pointer appearance-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Pill */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="h-10 px-3 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-500/15 hover:bg-rose-100/80 dark:hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs flex-shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-[#1E2638]">
        {/* Room Type Selector */}
        <div>
          <label className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider block mb-1">
            Room Type
          </label>
          <select
            value={filters.roomType}
            onChange={(e) => onFilterChange({ roomType: e.target.value })}
            className="w-full h-9 px-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 dark:bg-[#151D2A] dark:hover:bg-[#1A2332] rounded-lg border border-brand-border/70 dark:border-[#263346] text-brand-charcoal dark:text-white font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-obsidian dark:focus:ring-brand-lime"
          >
            {roomTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Room Status Selector */}
        <div>
          <label className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider block mb-1">
            Occupancy Status
          </label>
          <select
            value={filters.roomStatus}
            onChange={(e) => onFilterChange({ roomStatus: e.target.value })}
            className="w-full h-9 px-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 dark:bg-[#151D2A] dark:hover:bg-[#1A2332] rounded-lg border border-brand-border/70 dark:border-[#263346] text-brand-charcoal dark:text-white font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-obsidian dark:focus:ring-brand-lime"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Floor Selector */}
        <div className="col-span-2 sm:col-span-1">
          <label className="text-[10px] font-bold text-brand-muted dark:text-slate-400 uppercase tracking-wider block mb-1">
            Floor
          </label>
          <select
            value={filters.floor}
            onChange={(e) => onFilterChange({ floor: e.target.value })}
            className="w-full h-9 px-2.5 text-xs bg-slate-50 hover:bg-slate-100/70 dark:bg-[#151D2A] dark:hover:bg-[#1A2332] rounded-lg border border-brand-border/70 dark:border-[#263346] text-brand-charcoal dark:text-white font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-obsidian dark:focus:ring-brand-lime"
          >
            <option value="all" className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">All Floors</option>
            {availableFloors.map((floor) => (
              <option key={floor} value={floor} className="bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white">
                {floor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count & Active Pills indicator */}
      <div className="flex items-center justify-between text-xs text-brand-muted dark:text-slate-400 pt-1">
        <p className="text-[11px] font-medium">
          Showing <strong className="text-brand-charcoal dark:text-white">{filteredCount}</strong> of{" "}
          <strong className="text-brand-charcoal dark:text-white">{totalCount}</strong> rooms in this property
        </p>

        {isFiltered && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1E2638] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#263346]">
            Filters Active
          </span>
        )}
      </div>
    </div>
  );
}
