"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOwner } from "@/contexts/OwnerContext";
import { Building2, ChevronDown, Check, Plus, MapPin, Building, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertySwitcher() {
  const router = useRouter();
  const {
    properties,
    selectedProperty,
    selectProperty,
    propertyScenario,
    setPropertyScenario,
  } = useOwner();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    selectProperty(id);
    setIsOpen(false);
  };

  const handleAddProperty = () => {
    setIsOpen(false);
    router.push("/owner/properties");
  };

  // Scenario 1: Empty state (No properties)
  if (properties.length === 0 || !selectedProperty) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-amber-300 bg-amber-50/60 hover:bg-amber-50 text-amber-900 text-xs font-medium transition-colors"
        >
          <Building className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">No Property Added</span>
          <span className="sm:hidden">No PG</span>
          <ChevronDown className="w-3.5 h-3.5 text-amber-700 ml-1" />
        </button>

        {isOpen && (
          <div className="absolute right-0 sm:right-0 mt-2 w-[calc(100vw-24px)] max-w-[300px] sm:w-72 rounded-xl bg-white border border-brand-border p-4 shadow-xl z-50 animate-fadeIn">
            <div className="text-center py-2 space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-700">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-brand-charcoal">
                No Properties Found
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Add your first PG property to begin managing rooms, beds, and residents.
              </p>
              <button
                type="button"
                onClick={handleAddProperty}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand-obsidian text-white text-xs font-semibold hover:bg-brand-obsidian-hover transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Your First Property
              </button>
            </div>

            {/* Demo Scenario Switcher for Reviewer */}
            <div className="mt-3 pt-3 border-t border-brand-border/60 text-[10px] text-brand-muted">
              <span className="font-semibold block mb-1">Testing Demo Scenarios:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPropertyScenario("multiple")}
                  className="px-2 py-0.5 rounded bg-brand-offwhite hover:bg-brand-border text-brand-charcoal"
                >
                  3 Properties
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyScenario("single")}
                  className="px-2 py-0.5 rounded bg-brand-offwhite hover:bg-brand-border text-brand-charcoal"
                >
                  1 Property
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Scenario 2 & 3: Single or Multiple properties
  const isSingleProperty = properties.length === 1;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl border border-brand-border bg-white hover:bg-brand-offwhite hover:border-[#CCD1C8] transition-all text-left shadow-2xs group"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 rounded-lg bg-brand-offwhite border border-brand-border flex items-center justify-center text-brand-charcoal flex-shrink-0">
          <Building2 className="w-4 h-4 text-brand-charcoal" />
        </div>

        <div className="flex flex-col min-w-0 pr-0.5 sm:pr-1">
          <span className="text-xs font-semibold text-brand-charcoal truncate max-w-[85px] sm:max-w-[180px]">
            {selectedProperty.name}
          </span>
          <span className="text-[10px] text-brand-muted hidden sm:flex items-center gap-1 truncate">
            <MapPin className="w-2.5 h-2.5 text-brand-muted flex-shrink-0" />
            <span className="truncate">{selectedProperty.city}</span>
          </span>
        </div>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-brand-muted transition-transform duration-150 flex-shrink-0",
            isOpen && "rotate-180 text-brand-charcoal"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-0 mt-2 w-[calc(100vw-24px)] max-w-[320px] sm:w-80 rounded-xl bg-white border border-brand-border shadow-xl z-50 p-2 animate-fadeIn">
          {/* Dropdown Header */}
          <div className="px-3 py-2 border-b border-brand-border/70 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-charcoal">Switch Property</p>
              <p className="text-[10px] text-brand-muted">
                {isSingleProperty ? "1 Property Available" : `${properties.length} Active Properties`}
              </p>
            </div>
            <span className="text-[10px] font-medium bg-brand-lime/30 text-brand-charcoal px-2 py-0.5 rounded-full border border-brand-lime">
              Owner Mode
            </span>
          </div>

          {/* Properties List */}
          <div className="py-1.5 max-h-60 overflow-y-auto space-y-1">
            {properties.map((property) => {
              const isSelected = property.id === selectedProperty.id;
              return (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => handleSelect(property.id)}
                  className={cn(
                    "w-full flex items-start justify-between p-2.5 rounded-lg text-left transition-colors",
                    isSelected
                      ? "bg-brand-offwhite border border-brand-border text-brand-charcoal"
                      : "hover:bg-brand-offwhite/60 text-brand-charcoal border border-transparent"
                  )}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5",
                        isSelected
                          ? "bg-brand-obsidian text-white"
                          : "bg-brand-offwhite border border-brand-border text-brand-charcoal"
                      )}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-brand-charcoal truncate">
                        {property.name}
                      </p>
                      <p className="text-[10px] text-brand-muted flex items-center gap-1 mt-0.5">
                        <span>{property.address}, {property.city}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-brand-muted">
                        <span>{property.totalRooms} Rooms</span>
                        <span>•</span>
                        <span>
                          {property.occupiedBeds}/{property.totalBeds} Beds Filled
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-brand-lime flex items-center justify-center flex-shrink-0 mt-1 border border-[#b4e655]">
                      <Check className="w-3 h-3 text-brand-charcoal stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="pt-2 mt-1 border-t border-brand-border/70">
            <button
              type="button"
              onClick={handleAddProperty}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-brand-charcoal hover:bg-brand-offwhite transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-brand-charcoal" />
              <span>Add New Property</span>
            </button>
          </div>

          {/* Demo Scenario Toggles for testing all three states */}
          <div className="pt-2 mt-1 border-t border-brand-border/40 px-2 py-1 bg-brand-offwhite/50 rounded-b-lg">
            <div className="flex items-center justify-between text-[10px] text-brand-muted">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Test Scenario:</span>
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPropertyScenario("multiple")}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-medium",
                    propertyScenario === "multiple"
                      ? "bg-brand-obsidian text-white"
                      : "bg-white text-brand-muted hover:text-brand-charcoal border border-brand-border"
                  )}
                >
                  Multi (3)
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyScenario("single")}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-medium",
                    propertyScenario === "single"
                      ? "bg-brand-obsidian text-white"
                      : "bg-white text-brand-muted hover:text-brand-charcoal border border-brand-border"
                  )}
                >
                  Single (1)
                </button>
                <button
                  type="button"
                  onClick={() => setPropertyScenario("empty")}
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-medium",
                    propertyScenario === "empty"
                      ? "bg-brand-obsidian text-white"
                      : "bg-white text-brand-muted hover:text-brand-charcoal border border-brand-border"
                  )}
                >
                  Empty (0)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
