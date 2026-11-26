"use client";

import React, { useState } from "react";
import { StaffFiltersState, StaffRole } from "@/types/staff";
import { useOwner } from "@/contexts/OwnerContext";
import {
  Search,
  Filter,
  X,
  Building2,
  Briefcase,
  Calendar,
  IndianRupee,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffFiltersProps {
  filters: StaffFiltersState;
  onFilterChange: (updates: Partial<StaffFiltersState>) => void;
  onClearAll: () => void;
  totalMatching: number;
}

const ROLES: StaffRole[] = [
  "Manager",
  "Warden",
  "Security Guard",
  "Cook / Chef",
  "Housekeeping",
  "Maintenance Staff",
  "Receptionist",
  "Accountant",
  "Other",
];

export function StaffFilters({
  filters,
  onFilterChange,
  onClearAll,
  totalMatching,
}: StaffFiltersProps) {
  const { properties } = useOwner();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Calculate active filter count
  const activeCount = [
    filters.search !== "",
    filters.role !== "all",
    filters.propertyId !== "all",
    filters.joiningDateRange !== "all",
    filters.minSalary !== "" && filters.minSalary !== undefined,
    filters.maxSalary !== "" && filters.maxSalary !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/90 dark:border-[#222E42] p-3.5 sm:p-4 shadow-2xs space-y-3">
      {/* Top Search & Primary Filters Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Global Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search staff by name, ID, phone, role..."
            className="w-full h-10 pl-9 pr-8 text-xs bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 focus:bg-white dark:focus:bg-[#182232] text-brand-charcoal dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Role Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-[120px] max-w-full">
            <select
              value={filters.role}
              onChange={(e) => onFilterChange({ role: e.target.value as StaffRole | "all" })}
              className="w-full h-10 px-3 pr-8 text-xs bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 text-brand-charcoal dark:text-white font-semibold cursor-pointer appearance-none transition-colors truncate"
            >
              <option value="all" className="dark:bg-[#151D2A] dark:text-white">All Roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r} className="dark:bg-[#151D2A] dark:text-white">
                  {r}
                </option>
              ))}
            </select>
            <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Property Dropdown */}
          <div className="relative flex-1 sm:flex-initial min-w-[140px] max-w-full">
            <select
              value={filters.propertyId}
              onChange={(e) => onFilterChange({ propertyId: e.target.value })}
              className="w-full h-10 px-3 pr-8 text-xs bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 text-brand-charcoal dark:text-white font-semibold cursor-pointer appearance-none transition-colors truncate"
            >
              <option value="all" className="dark:bg-[#151D2A] dark:text-white">All Properties</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id} className="dark:bg-[#151D2A] dark:text-white">
                  {p.name}
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={cn(
              "h-10 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 shrink-0",
              isAdvancedOpen || activeCount > 2
                ? "bg-brand-obsidian text-white border-brand-obsidian dark:bg-brand-lime dark:text-[#0A0D12] dark:border-brand-lime"
                : "bg-slate-50 dark:bg-[#151D2A] border-slate-200 dark:border-[#263346] text-brand-charcoal dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-lime text-brand-obsidian text-[10px] font-black flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Tray (Expandable) */}
      {isAdvancedOpen && (
        <div className="pt-3 border-t border-slate-100 dark:border-[#1E2638] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-100">
          {/* Joining Date Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Joining Date
            </label>
            <div className="relative">
              <select
                value={filters.joiningDateRange}
                onChange={(e) =>
                  onFilterChange({
                    joiningDateRange: e.target.value as StaffFiltersState["joiningDateRange"],
                  })
                }
                className="w-full h-9 px-2.5 pr-8 text-xs bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 text-brand-charcoal dark:text-white font-medium cursor-pointer appearance-none"
              >
                <option value="all" className="dark:bg-[#151D2A] dark:text-white">Any Joining Date</option>
                <option value="today" className="dark:bg-[#151D2A] dark:text-white">Today</option>
                <option value="this_month" className="dark:bg-[#151D2A] dark:text-white">This Month</option>
                <option value="last_30_days" className="dark:bg-[#151D2A] dark:text-white">Last 30 Days</option>
                <option value="custom" className="dark:bg-[#151D2A] dark:text-white">Custom Date Range...</option>
              </select>
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {filters.joiningDateRange === "custom" && (
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <input
                  type="date"
                  value={filters.customStartDate || ""}
                  onChange={(e) => onFilterChange({ customStartDate: e.target.value })}
                  className="h-8 px-2 text-[11px] bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-lg text-brand-charcoal dark:text-white"
                  placeholder="Start"
                />
                <input
                  type="date"
                  value={filters.customEndDate || ""}
                  onChange={(e) => onFilterChange({ customEndDate: e.target.value })}
                  className="h-8 px-2 text-[11px] bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-lg text-brand-charcoal dark:text-white"
                  placeholder="End"
                />
              </div>
            )}
          </div>

          {/* Salary Range (Min - Max) */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Monthly Salary Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                value={filters.minSalary ?? ""}
                onChange={(e) =>
                  onFilterChange({
                    minSalary: e.target.value ? Number(e.target.value) : "",
                  })
                }
                placeholder="Min ₹"
                className="h-9 px-2.5 text-xs bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 text-brand-charcoal dark:text-white"
              />
              <input
                type="number"
                value={filters.maxSalary ?? ""}
                onChange={(e) =>
                  onFilterChange({
                    maxSalary: e.target.value ? Number(e.target.value) : "",
                  })
                }
                placeholder="Max ₹"
                className="h-9 px-2.5 text-xs bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 text-brand-charcoal dark:text-white"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Sort Records By
            </label>
            <div className="flex items-center gap-1.5">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({
                    sortBy: e.target.value as StaffFiltersState["sortBy"],
                  })
                }
                className="flex-1 h-9 px-2.5 text-xs bg-slate-50 dark:bg-[#151D2A] border border-slate-200 dark:border-[#263346] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 dark:focus:ring-brand-lime/20 text-brand-charcoal dark:text-white font-medium"
              >
                <option value="name" className="dark:bg-[#151D2A] dark:text-white">Staff Name</option>
                <option value="joiningDate" className="dark:bg-[#151D2A] dark:text-white">Joining Date</option>
                <option value="salary" className="dark:bg-[#151D2A] dark:text-white">Monthly Salary</option>
                <option value="employeeId" className="dark:bg-[#151D2A] dark:text-white">Employee ID</option>
              </select>

              <button
                type="button"
                onClick={() =>
                  onFilterChange({
                    sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
                  })
                }
                className="h-9 px-2.5 rounded-xl border border-slate-200 dark:border-[#263346] bg-slate-50 dark:bg-[#151D2A] hover:bg-slate-100 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-slate-200 flex items-center justify-center text-xs font-bold transition-colors"
                title={`Order: ${filters.sortOrder.toUpperCase()}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase ml-1">{filters.sortOrder}</span>
              </button>
            </div>
          </div>

          {/* Quick Clear Filter Column */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={onClearAll}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#263346] bg-slate-100 dark:bg-[#182232] hover:bg-slate-200 dark:hover:bg-[#222E42] text-brand-charcoal dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips & Counter Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing <strong className="text-brand-charcoal dark:text-white">{totalMatching}</strong> staff members
          </span>

          {/* Filter Badges */}
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#182232] text-[11px] font-bold text-brand-charcoal dark:text-slate-200 border border-slate-200 dark:border-[#263346]">
              Search: &quot;{filters.search}&quot;
              <button
                type="button"
                onClick={() => onFilterChange({ search: "" })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.role !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[11px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              Role: {filters.role}
              <button
                type="button"
                onClick={() => onFilterChange({ role: "all" })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.propertyId !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-[11px] font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
              Property: {properties.find((p) => p.id === filters.propertyId)?.name || filters.propertyId}
              <button
                type="button"
                onClick={() => onFilterChange({ propertyId: "all" })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.joiningDateRange !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-[11px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              Joining: {filters.joiningDateRange.replace("_", " ")}
              <button
                type="button"
                onClick={() => onFilterChange({ joiningDateRange: "all" })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(filters.minSalary !== "" && filters.minSalary !== undefined) ||
          (filters.maxSalary !== "" && filters.maxSalary !== undefined) ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              Salary: ₹{filters.minSalary || 0} - ₹{filters.maxSalary || "∞"}
              <button
                type="button"
                onClick={() => onFilterChange({ minSalary: "", maxSalary: "" })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ) : null}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors ml-auto"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
