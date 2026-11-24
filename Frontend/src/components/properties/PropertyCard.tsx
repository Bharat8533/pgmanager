"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property, PropertyStatus } from "@/types/owner";
import { getAmenityIcon } from "@/components/properties/AmenitiesSelector";
import {
  MapPin,
  Building2,
  Bed,
  Users,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  Eye,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onStatusChange: (id: string, newStatus: PropertyStatus) => void;
}

export function PropertyCard({
  property,
  onViewDetails,
  onStatusChange,
}: PropertyCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState<PropertyStatus | null>(null);

  const occupancyRate = property.totalBeds > 0
    ? Math.round((property.occupiedBeds / property.totalBeds) * 100)
    : 0;

  const formatINR = (val?: number) =>
    val ? "₹" + val.toLocaleString("en-IN") : "₹12,000";

  // Status badge config
  const statusConfig = {
    active: {
      label: "Active",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      dotClass: "bg-emerald-500",
    },
    inactive: {
      label: "Inactive",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
      dotClass: "bg-slate-400",
    },
    under_maintenance: {
      label: "Maintenance",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
      dotClass: "bg-amber-500",
    },
  }[property.status] || {
    label: property.status,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  };

  const visibleAmenities = property.amenities.slice(0, 3);
  const remainingAmenitiesCount = Math.max(0, property.amenities.length - 3);

  const handleConfirmStatus = (status: PropertyStatus) => {
    onStatusChange(property.id, status);
    setConfirmStatusModal(null);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-brand-border/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
        <div>
          {/* Cover Image Container */}
          <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
            <img
              src={property.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />

            {/* Gradient Overlay for Top Badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* Top Left: Type Pill */}
            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-brand-obsidian/85 text-brand-lime font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs shadow-xs">
              {property.type}
            </div>

            {/* Top Right: Status Badge & More Menu */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs backdrop-blur-md",
                  statusConfig.badgeClass
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dotClass)} />
                <span>{statusConfig.label}</span>
              </span>

              {/* More Actions Menu Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-brand-charcoal flex items-center justify-center shadow-xs transition-colors"
                  aria-label="Property actions"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-brand-border py-1.5 z-40 animate-fadeIn text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onViewDetails(property);
                        }}
                        className="w-full text-left px-3 py-2 text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Details</span>
                      </button>

                      <Link
                        href={`/owner/properties/${property.id}/rooms`}
                        className="w-full text-left px-3 py-2 text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <Bed className="w-3.5 h-3.5 text-blue-600" />
                        <span>Manage Rooms</span>
                      </Link>

                      <Link
                        href={`/owner/properties/${property.id}/edit`}
                        className="w-full text-left px-3 py-2 text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <Edit className="w-3.5 h-3.5 text-brand-charcoal" />
                        <span>Edit Property</span>
                      </Link>

                      <div className="my-1 border-t border-slate-100" />

                      <div className="px-3 py-1 text-[10px] uppercase font-bold text-brand-muted">
                        Change Status
                      </div>

                      {property.status !== "active" && (
                        <button
                          type="button"
                          onClick={() => setConfirmStatusModal("active")}
                          className="w-full text-left px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-semibold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Active</span>
                        </button>
                      )}

                      {property.status !== "under_maintenance" && (
                        <button
                          type="button"
                          onClick={() => setConfirmStatusModal("under_maintenance")}
                          className="w-full text-left px-3 py-1.5 text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-semibold"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Mark Maintenance</span>
                        </button>
                      )}

                      {property.status !== "inactive" && (
                        <button
                          type="button"
                          onClick={() => setConfirmStatusModal("inactive")}
                          className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-100 flex items-center gap-2 font-semibold"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Mark Inactive</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Overlay: Price Pill */}
            <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-white/95 text-brand-charcoal text-[11px] font-black shadow-xs backdrop-blur-xs">
              From {formatINR(property.monthlyStartingRent)} <span className="text-[9px] font-normal text-brand-muted">/mo</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-3">
            {/* Title & Locality */}
            <div>
              <h3 className="text-base font-extrabold text-brand-charcoal tracking-tight truncate group-hover:text-blue-600 transition-colors">
                {property.name}
              </h3>
              <p className="text-xs text-brand-muted flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-brand-muted flex-shrink-0" />
                <span className="truncate">{property.locality}, {property.city}</span>
              </p>
            </div>

            {/* Description snippet */}
            {property.description && (
              <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                {property.description}
              </p>
            )}

            {/* Amenities Preview */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {visibleAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 text-[10px] font-semibold text-slate-700"
                >
                  <span className="text-blue-600">{getAmenityIcon(amenity)}</span>
                  <span className="truncate max-w-[90px]">{amenity}</span>
                </span>
              ))}

              {remainingAmenitiesCount > 0 && (
                <span
                  onClick={() => onViewDetails(property)}
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-brand-muted hover:text-brand-charcoal cursor-pointer"
                >
                  +{remainingAmenitiesCount} more
                </span>
              )}
            </div>

            {/* Room & Bed Occupancy Breakdown */}
            <div className="pt-2 border-t border-slate-100">
              <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">
                    Rooms
                  </span>
                  <span className="text-xs font-black text-brand-charcoal">
                    {property.totalRooms}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">
                    Total Beds
                  </span>
                  <span className="text-xs font-black text-brand-charcoal">
                    {property.totalBeds}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-emerald-700 block">
                    Occupied
                  </span>
                  <span className="text-xs font-black text-emerald-700">
                    {property.occupiedBeds}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-blue-700 block">
                    Available
                  </span>
                  <span className="text-xs font-black text-blue-700">
                    {property.availableBeds}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-brand-muted text-[10px] uppercase">
                    Occupancy
                  </span>
                  <span className="font-bold text-emerald-700">
                    {occupancyRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      occupancyRate >= 85 ? "bg-emerald-500" : occupancyRate >= 70 ? "bg-blue-600" : "bg-amber-500"
                    )}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(property)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-xs font-bold text-brand-charcoal shadow-2xs transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>View Details</span>
          </button>

          <Link
            href={`/owner/properties/${property.id}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-brand-obsidian text-white text-xs font-bold hover:bg-brand-obsidian-hover shadow-2xs transition-all"
          >
            <Edit className="w-3.5 h-3.5 text-brand-lime" />
            <span>Edit Property</span>
          </Link>
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {confirmStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-brand-border p-5 max-w-sm w-full shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-brand-charcoal">
                Change Property Status?
              </h3>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed mb-4">
              Are you sure you want to change <strong>{property.name}</strong> to{" "}
              <span className="font-bold uppercase text-brand-charcoal">
                {confirmStatusModal.replace("_", " ")}
              </span>
              ? The property record will remain intact and visible in filters.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmStatusModal(null)}
                className="px-3 py-1.5 text-xs font-semibold text-brand-muted hover:text-brand-charcoal rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmStatus(confirmStatusModal)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-brand-obsidian hover:bg-brand-obsidian-hover rounded-xl shadow-xs"
              >
                Confirm Status
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
