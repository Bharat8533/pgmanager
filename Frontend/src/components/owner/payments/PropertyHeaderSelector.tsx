"use client";

import React from "react";
import { Building2, MapPin, CheckCircle2, ChevronDown, ShieldCheck } from "lucide-react";
import { Property } from "@/types/owner";

interface PropertyHeaderSelectorProps {
  currentProperty: Property | null;
  allProperties: Property[];
  onSelectProperty: (propertyId: string) => void;
}

export const PropertyHeaderSelector: React.FC<PropertyHeaderSelectorProps> = ({
  currentProperty,
  allProperties,
  onSelectProperty,
}) => {
  if (!currentProperty) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E5DF] p-6 text-center shadow-xs">
        <Building2 className="w-8 h-8 text-[#777D78] mx-auto mb-2" />
        <h3 className="text-sm font-bold text-[#171A18]">No Property Selected</h3>
        <p className="text-xs text-[#777D78] mb-4">
          Please select a PG property to view its financial ledger, rent dues, and CA reports.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {allProperties.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProperty(p.id)}
              className="px-3.5 py-1.5 bg-[#171A18] text-white rounded-xl text-xs font-semibold hover:bg-[#2A2E2B] transition-all"
            >
              Select {p.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E5DF] p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Property Details with thumbnail */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-[#FAFAF8] border border-[#E2E5DF] overflow-hidden shrink-0 flex items-center justify-center">
          {currentProperty.images?.[0] ? (
            <img
              src={currentProperty.images[0]}
              alt={currentProperty.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-6 h-6 text-[#171A18]" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#171A18] truncate">
              {currentProperty.name}
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F4DF] text-[#1E5C1B] border border-[#C6F36B]/40">
              <CheckCircle2 className="w-3 h-3 text-[#1E5C1B]" />
              Active Branch
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#777D78] mt-0.5">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#777D78] shrink-0" />
              {currentProperty.address || `${currentProperty.city}, ${currentProperty.state}`}
            </span>
            <span className="hidden sm:inline-block text-[#CCD0C8]">•</span>
            <span className="hidden sm:inline-block font-medium text-[#171A18]">
              {currentProperty.totalRooms || 12} Rooms / {currentProperty.totalBeds || 28} Beds
            </span>
          </div>
        </div>
      </div>

      {/* Right: Switch Property Dropdown & Isolation Badge */}
      <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFAF8] border border-[#E2E5DF] text-[11px] font-semibold text-[#777D78]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#171A18]" />
          <span>Independent Financial View</span>
        </div>

        {allProperties.length > 1 && (
          <div className="relative flex items-center">
            <Building2 className="w-3.5 h-3.5 absolute left-3 text-[#777D78] pointer-events-none" />
            <select
              value={currentProperty.id}
              onChange={(e) => onSelectProperty(e.target.value)}
              aria-label="Switch active PG property"
              className="pl-8 pr-8 py-2 bg-[#FAFAF8] hover:bg-[#F4F5F2] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-bold text-[#171A18] focus:outline-hidden focus:border-[#171A18] transition-all cursor-pointer appearance-none shadow-2xs"
            >
              {allProperties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 text-[#777D78] pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};
