"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOwner } from "@/contexts/OwnerContext";
import { Property, PropertyStatus } from "@/types/owner";
import { PropertyStats } from "@/components/owner/properties/PropertyStats";
import {
  PropertyFilters,
  StatusFilterOption,
  OccupancyFilterOption,
  SortOption,
} from "@/components/owner/properties/PropertyFilters";
import { PropertyCard } from "@/components/owner/properties/PropertyCard";
import { PropertyDetailModal } from "@/components/owner/properties/PropertyDetailModal";
import {
  Building2,
  Plus,
  Sparkles,
  SearchX,
  RotateCcw,
} from "lucide-react";

export default function PropertiesListingPage() {
  const router = useRouter();
  const { properties, togglePropertyStatus } = useOwner();

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [occupancyFilter, setOccupancyFilter] = useState<OccupancyFilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recently_added");

  // Selected property for modal preview
  const [previewProperty, setPreviewProperty] = useState<Property | null>(null);

  // Extract distinct cities for the filter dropdown
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set);
  }, [properties]);

  // Filtered & Sorted Properties List
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // 1. Text search (Name, City, Locality, Address)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.type && p.type.toLowerCase().includes(q))
      );
    }

    // 2. Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // 3. City filter
    if (cityFilter !== "all") {
      result = result.filter(
        (p) => p.city.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    // 4. Occupancy filter
    if (occupancyFilter !== "all") {
      result = result.filter((p) => {
        const rate =
          p.totalBeds > 0 ? (p.occupiedBeds / p.totalBeds) * 100 : 0;
        if (occupancyFilter === "high") return rate >= 85;
        if (occupancyFilter === "medium") return rate >= 70 && rate < 85;
        if (occupancyFilter === "low") return rate < 70;
        return true;
      });
    }

    // 5. Sorting
    result.sort((a, b) => {
      const occA = a.totalBeds > 0 ? a.occupiedBeds / a.totalBeds : 0;
      const occB = b.totalBeds > 0 ? b.occupiedBeds / b.totalBeds : 0;

      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "occupancy_high":
          return occB - occA;
        case "occupancy_low":
          return occA - occB;
        case "beds_high":
          return b.totalBeds - a.totalBeds;
        case "beds_low":
          return a.totalBeds - b.totalBeds;
        case "recently_added":
        default:
          return 0; // Natural state order (newest first)
      }
    });

    return result;
  }, [properties, searchQuery, statusFilter, cityFilter, occupancyFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCityFilter("all");
    setOccupancyFilter("all");
    setSortBy("recently_added");
  };

  const handleStatusChange = (id: string, newStatus: PropertyStatus) => {
    togglePropertyStatus(id, newStatus);
  };

  const handleEditClick = (id: string) => {
    setPreviewProperty(null);
    router.push(`/owner/properties/${id}/edit`);
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn pb-12">
      {/* A. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-border/60 dark:border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-charcoal dark:text-brand-lime uppercase tracking-wider bg-brand-lime/30 dark:bg-brand-lime/15 px-2.5 py-0.5 rounded-full border border-brand-lime/60 dark:border-brand-lime/30 shadow-2xs">
              <Sparkles className="w-3 h-3 text-brand-charcoal dark:text-brand-lime" />
              <span>Multi-Property Portfolio</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal dark:text-white tracking-tight">
            Properties
          </h1>
          <p className="text-sm text-brand-muted dark:text-slate-300 mt-0.5 leading-relaxed">
            Manage all your PG properties, rooms, beds, and occupancy from one place.
          </p>
        </div>

        {/* Primary CTA: + Add Property */}
        <Link
          href="/owner/properties/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-lime hover:bg-brand-lime-hover text-brand-obsidian font-extrabold text-xs shadow-md transition-all active:scale-[0.98] border border-brand-obsidian/10"
        >
          <Plus className="w-4 h-4 text-brand-obsidian stroke-[3]" />
          <span>+ Add Property</span>
        </Link>
      </div>

      {/* B. OVERVIEW STATISTICS */}
      <section aria-label="Portfolio Summary Statistics">
        <PropertyStats properties={properties} />
      </section>

      {/* C. SEARCH, FILTER & SORTING BAR */}
      <section aria-label="Search and Filters">
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          cityFilter={cityFilter}
          onCityChange={setCityFilter}
          occupancyFilter={occupancyFilter}
          onOccupancyChange={setOccupancyFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          availableCities={availableCities}
          totalResultsCount={filteredProperties.length}
          totalPropertiesCount={properties.length}
        />
      </section>

      {/* D. PROPERTY CARDS GRID */}
      <section aria-label="Properties List">
        {properties.length === 0 ? (
          /* Empty State: Zero properties in account */
          <div className="bg-white dark:bg-[#111622] rounded-3xl border border-brand-border/80 dark:border-[#222E42] p-8 sm:p-12 text-center shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-lime/30 text-brand-charcoal dark:text-brand-lime flex items-center justify-center mx-auto shadow-xs border border-brand-lime/60 dark:border-brand-lime/30">
              <Building2 className="w-7 h-7 text-brand-charcoal dark:text-brand-lime" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-brand-charcoal dark:text-white">
                No properties added yet.
              </h3>
              <p className="text-xs text-brand-muted dark:text-slate-300 mt-1 leading-relaxed">
                Start managing your PG business by adding your first property. Configure rooms, bed inventory, and amenities easily.
              </p>
            </div>
            <Link
              href="/owner/properties/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-lime hover:bg-brand-lime-hover text-brand-obsidian font-extrabold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Your First Property</span>
            </Link>
          </div>
        ) : filteredProperties.length === 0 ? (
          /* Search Empty State: No matches for current filters */
          <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border/80 dark:border-[#222E42] p-8 sm:p-10 text-center shadow-xs max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#18212F] text-brand-muted dark:text-slate-300 flex items-center justify-center mx-auto">
              <SearchX className="w-6 h-6 text-brand-muted dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-charcoal dark:text-white">
                No properties found
              </h3>
              <p className="text-xs text-brand-muted dark:text-slate-300 mt-1">
                No properties match your active search &quot;{searchQuery}&quot; or filter criteria.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#28354D] text-brand-charcoal dark:text-white text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        ) : (
          /* Responsive 3-col on large, 2-col on md, 1-col on mobile */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onViewDetails={setPreviewProperty}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick View Details Preview Modal */}
      <PropertyDetailModal
        property={previewProperty}
        isOpen={previewProperty !== null}
        onClose={() => setPreviewProperty(null)}
        onEditClick={handleEditClick}
      />
    </div>
  );
}
