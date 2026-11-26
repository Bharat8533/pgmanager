"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property, PropertyStatus } from "@/types/owner";
import { getAmenityIcon } from "@/components/owner/properties/AmenitiesSelector";
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
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border/80 dark:border-[#222E42] shadow-xs hover:shadow-lg dark:hover:shadow-indigo-950/20 transition-all duration-200 overflow-hidden flex flex-col justify-between group">
        <div>
          {/* Cover Image Container */}
          <div className="relative aspect-16/9 bg-slate-100 dark:bg-[#141A26] overflow-hidden">
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
                  className="w-7 h-7 rounded-full bg-white/90 dark:bg-[#111622]/90 hover:bg-white dark:hover:bg-[#182030] text-brand-charcoal dark:text-white border border-slate-200/60 dark:border-white/10 flex items-center justify-center shadow-xs transition-colors"
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
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#151D2C] rounded-xl shadow-xl border border-brand-border dark:border-[#253246] py-1.5 z-40 animate-fadeIn text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onViewDetails(property);
                        }}
                        className="w-full text-left px-3 py-2 text-brand-charcoal dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center gap-2 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>View Details</span>
                      </button>

                      <Link
                        href={`/owner/properties/${property.id}/rooms`}
                        className="w-full text-left px-3 py-2 text-brand-charcoal dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center gap-2 font-medium"
                      >
                        <Bed className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Manage Rooms</span>
                      </Link>

                      <Link
                        href={`/owner/properties/${property.id}/edit`}
                        className="w-full text-left px-3 py-2 text-brand-charcoal dark:text-white hover:bg-slate-50 dark:hover:bg-[#1E293B] flex items-center gap-2 font-medium"
                      >
                        <Edit className="w-3.5 h-3.5 text-brand-charcoal dark:text-slate-300" />
                        <span>Edit Property</span>
                      </Link>

                      <div className="my-1 border-t border-slate-100 dark:border-[#253246]" />

                      <div className="px-3 py-1 text-[10px] uppercase font-bold text-brand-muted dark:text-slate-400">
                        Change Status
                      </div>

                      {property.status !== "active" && (
                        <button
                          type="button"
                          onClick={() => setConfirmStatusModal("active")}
                          className="w-full text-left px-3 py-1.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 font-semibold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Active</span>
                        </button>
                      )}

                      {property.status !== "under_maintenance" && (
                        <button
                          type="button"
                          onClick={() => setConfirmStatusModal("under_maintenance")}
                          className="w-full text-left px-3 py-1.5 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 font-semibold"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Mark Maintenance</span>
                        </button>
                      )}

                      {property.status !== "inactive" && (
                        <button
                          type="button"
                          onClick={() => setConfirmStatusModal("inactive")}
                          className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B] flex items-center gap-2 font-semibold"
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
            <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-white/95 dark:bg-[#111622]/95 dark:text-white dark:border dark:border-white/10 text-brand-charcoal text-[11px] font-black shadow-xs backdrop-blur-xs">
              From {formatINR(property.monthlyStartingRent)} <span className="text-[9px] font-normal text-brand-muted dark:text-slate-400">/mo</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-3">
            {/* Title & Locality */}
            <div>
              <h3 className="text-base font-extrabold text-brand-charcoal dark:text-white tracking-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {property.name}
              </h3>
              <p className="text-xs text-brand-muted dark:text-slate-300 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 text-brand-muted dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">{property.locality}, {property.city}</span>
              </p>
            </div>

            {/* Description snippet */}
            {property.description && (
              <p className="text-xs text-brand-muted dark:text-slate-300 line-clamp-2 leading-relaxed">
                {property.description}
              </p>
            )}

            {/* Amenities Preview */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {visibleAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#151D2A] border border-slate-200/60 dark:border-[#243144] text-[10px] font-semibold text-slate-700 dark:text-slate-200"
                >
                  <span className="text-blue-600 dark:text-blue-400">{getAmenityIcon(amenity)}</span>
                  <span className="truncate max-w-[90px]">{amenity}</span>
                </span>
              ))}

              {remainingAmenitiesCount > 0 && (
                <span
                  onClick={() => onViewDetails(property)}
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#151D2A] border border-slate-200/60 dark:border-[#243144] text-[10px] font-bold text-brand-muted dark:text-slate-300 hover:text-brand-charcoal dark:hover:text-white cursor-pointer"
                >
                  +{remainingAmenitiesCount} more
                </span>
              )}
            </div>

            {/* Room & Bed Occupancy Breakdown - Distinct Semantic Micro-Cards */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#1E293B]">
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {/* Rooms Card - Indigo Identity */}
                <div className="bg-indigo-50/70 dark:bg-[#15192E] p-2 rounded-xl border border-indigo-100/80 dark:border-indigo-500/35 transition-all">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Building2 className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[9px] uppercase font-bold text-indigo-700 dark:text-indigo-300 block tracking-wider">
                      Rooms
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-indigo-950 dark:text-white block">
                    {property.totalRooms}
                  </span>
                </div>

                {/* Total Beds Card - Sky/Blue Identity */}
                <div className="bg-sky-50/70 dark:bg-[#0F1E29] p-2 rounded-xl border border-sky-100/80 dark:border-sky-500/35 transition-all">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Bed className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400" />
                    <span className="text-[9px] uppercase font-bold text-sky-700 dark:text-sky-300 block tracking-wider truncate">
                      Beds
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-sky-950 dark:text-white block">
                    {property.totalBeds}
                  </span>
                </div>

                {/* Occupied Card - Emerald Identity */}
                <div className="bg-emerald-50/80 dark:bg-[#0E241B] p-2 rounded-xl border border-emerald-200/80 dark:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Users className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block tracking-wider truncate">
                      Occupied
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-200 block">
                    {property.occupiedBeds}
                  </span>
                </div>

                {/* Available Card - Amber/Gold Identity */}
                <div className="bg-amber-50/80 dark:bg-[#231E10] p-2 rounded-xl border border-amber-200/80 dark:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-[9px] uppercase font-bold text-amber-700 dark:text-amber-300 block tracking-wider truncate">
                      Available
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-amber-800 dark:text-amber-200 block">
                    {property.availableBeds}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-brand-muted dark:text-slate-300 text-[10px] uppercase">
                    Occupancy
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {occupancyRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-[#1A2332] rounded-full h-1.5 overflow-hidden flex">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      occupancyRate >= 85 ? "bg-emerald-500" : occupancyRate >= 70 ? "bg-blue-600 dark:bg-blue-500" : "bg-amber-500"
                    )}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-3 bg-slate-50/80 dark:bg-[#0D121B] border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(property)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-brand-border dark:border-[#28354A] bg-white dark:bg-[#151D2A] hover:bg-slate-50 dark:hover:bg-[#1D2738] text-xs font-bold text-brand-charcoal dark:text-white shadow-2xs transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>View Details</span>
          </button>

          <Link
            href={`/owner/properties/${property.id}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-brand-obsidian dark:bg-[#1F293D] hover:bg-brand-obsidian-hover dark:hover:bg-[#28354D] border dark:border-white/10 text-white text-xs font-bold shadow-2xs transition-all"
          >
            <Edit className="w-3.5 h-3.5 text-brand-lime" />
            <span>Edit Property</span>
          </Link>
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {confirmStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#121620] rounded-2xl border border-brand-border dark:border-[#242E40] p-5 max-w-sm w-full shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-brand-charcoal dark:text-white">
                Change Property Status?
              </h3>
            </div>

            <p className="text-xs text-brand-muted dark:text-slate-300 leading-relaxed mb-4">
              Are you sure you want to change <strong>{property.name}</strong> to{" "}
              <span className="font-bold uppercase text-brand-charcoal dark:text-white">
                {confirmStatusModal.replace("_", " ")}
              </span>
              ? The property record will remain intact and visible in filters.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmStatusModal(null)}
                className="px-3 py-1.5 text-xs font-semibold text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmStatus(confirmStatusModal)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-brand-obsidian dark:bg-brand-lime dark:text-brand-obsidian hover:bg-brand-obsidian-hover rounded-xl shadow-xs"
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
