"use client";

import React from "react";
import Link from "next/link";
import { useOwner } from "@/contexts/OwnerContext";
import { Building2, MapPin, BedDouble, Plus, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export function PropertyOverviewCard() {
  const { selectedProperty, properties } = useOwner();

  if (!selectedProperty) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-2xs text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-brand-offwhite border border-brand-border flex items-center justify-center mx-auto text-brand-charcoal">
          <Building2 className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-brand-charcoal">No Property Selected</h4>
        <p className="text-xs text-brand-muted max-w-sm mx-auto">
          Add or switch properties to view capacity, occupancy, and room configurations.
        </p>
        <Link
          href="/owner/properties"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-obsidian text-white text-xs font-semibold hover:bg-brand-obsidian-hover transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Property</span>
        </Link>
      </div>
    );
  }

  const occupancyRate = Math.round(
    (selectedProperty.occupiedBeds / selectedProperty.totalBeds) * 100
  );
  const vacantBeds = selectedProperty.totalBeds - selectedProperty.occupiedBeds;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-brand-border shadow-2xs space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-obsidian text-brand-lime flex items-center justify-center flex-shrink-0 shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-brand-charcoal tracking-tight">
                {selectedProperty.name}
              </h3>
              <span className="text-[10px] font-semibold bg-brand-lime/30 text-brand-charcoal px-2 py-0.5 rounded-full border border-[#b4e655]">
                {selectedProperty.type}
              </span>
            </div>
            <p className="text-xs text-brand-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand-muted" />
              <span>{selectedProperty.address}, {selectedProperty.city}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/owner/rooms"
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand-border bg-brand-offwhite text-brand-charcoal hover:bg-[#EBEEE8] transition-colors"
          >
            <span>Manage Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Visual Occupancy & Bed Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Capacity */}
        <div className="p-3.5 rounded-xl bg-brand-offwhite border border-brand-border/70">
          <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
            Room Inventory
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-brand-charcoal">
              {selectedProperty.totalRooms}
            </span>
            <span className="text-xs text-brand-muted">Active Rooms</span>
          </div>
          <p className="text-[10px] text-brand-muted mt-1">
            Single, Double & Triple Sharing
          </p>
        </div>

        {/* Current Occupancy */}
        <div className="p-3.5 rounded-xl bg-brand-offwhite border border-brand-border/70">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
              Occupancy Rate
            </span>
            <span className="text-xs font-bold text-brand-charcoal">{occupancyRate}%</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-brand-charcoal">
              {selectedProperty.occupiedBeds}
            </span>
            <span className="text-xs text-brand-muted">
              / {selectedProperty.totalBeds} Beds Filled
            </span>
          </div>
          {/* Lime progress bar */}
          <div className="w-full bg-[#E2E5DF] h-2.5 rounded-full mt-2.5 overflow-hidden p-0.5 border border-[#D5D9D2]">
            <div
              className="bg-brand-lime h-full rounded-full transition-all duration-500 shadow-2xs"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Vacant Beds */}
        <div className="p-3.5 rounded-xl bg-brand-offwhite border border-brand-border/70">
          <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
            Vacant Beds Ready
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-brand-charcoal">
              {vacantBeds}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Available for Admission</span>
          </div>
          <p className="text-[10px] text-brand-muted mt-1">
            Immediate Move-in Available
          </p>
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-brand-muted gap-2 border-t border-brand-border/70">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>Biometric & Digital Attendance Connected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-charcoal" />
          <span>Police Verification & KYC Verification Active</span>
        </div>
      </div>
    </div>
  );
}
