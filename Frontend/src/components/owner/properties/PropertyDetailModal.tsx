"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property } from "@/types/owner";
import { getAmenityIcon } from "@/components/owner/properties/AmenitiesSelector";
import {
  X,
  MapPin,
  Building2,
  Bed,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Edit,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: (id: string) => void;
}

export function PropertyDetailModal({
  property,
  isOpen,
  onClose,
  onEditClick,
}: PropertyDetailModalProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!isOpen || !property) return null;

  const images = property.images && property.images.length > 0
    ? property.images
    : [property.coverImage];

  const occupancyRate = property.totalBeds > 0
    ? Math.round((property.occupiedBeds / property.totalBeds) * 100)
    : 0;

  const formatINR = (val?: number) =>
    val ? "₹" + val.toLocaleString("en-IN") : "₹12,000";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#12161F] rounded-3xl border border-brand-border dark:border-[#222C3A] shadow-2xl overflow-y-auto z-10 animate-scaleUp no-scrollbar">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-white/95 dark:bg-[#12161F]/95 backdrop-blur-md border-b border-slate-100 dark:border-[#202736]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-lime/30 text-brand-charcoal flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-brand-charcoal" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-brand-charcoal dark:text-white truncate">
                {property.name}
              </h2>
              <p className="text-xs text-brand-muted dark:text-slate-300 truncate">
                {property.locality}, {property.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onEditClick(property.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-obsidian bg-brand-lime hover:bg-brand-lime-hover rounded-xl shadow-xs transition-all"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#1A2230] hover:bg-slate-200 dark:hover:bg-[#242E40] text-brand-muted dark:text-slate-300 hover:text-brand-charcoal dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Main Photo Gallery Preview */}
          <div className="space-y-2">
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#1A2230] border border-slate-200 dark:border-[#253042]">
              <img
                src={images[selectedPhotoIndex] || property.coverImage}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-obsidian/85 text-brand-lime font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
                {property.type}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#12161F]/95 text-brand-charcoal dark:text-white dark:border dark:border-white/10 font-black text-xs shadow-xs backdrop-blur-xs">
                From {formatINR(property.monthlyStartingRent)}/mo
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(i)}
                    className={cn(
                      "w-16 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all",
                      selectedPhotoIndex === i
                        ? "border-brand-obsidian ring-2 ring-brand-lime"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Metrics Grid - Redesigned Semantic Micro-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Total Rooms - Indigo Identity */}
            <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-[#15192E] border border-indigo-100/80 dark:border-indigo-500/35 text-center">
              <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">
                Total Rooms
              </span>
              <span className="text-xl font-black text-indigo-950 dark:text-white block mt-0.5">
                {property.totalRooms}
              </span>
            </div>

            {/* Total Beds - Sky Identity */}
            <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-[#0F1E29] border border-sky-100/80 dark:border-sky-500/35 text-center">
              <Bed className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 block">
                Total Beds
              </span>
              <span className="text-xl font-black text-sky-950 dark:text-white block mt-0.5">
                {property.totalBeds}
              </span>
            </div>

            {/* Occupied Beds - Emerald Identity */}
            <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-[#0E241B] border border-emerald-200/80 dark:border-emerald-500/40 text-center">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                Occupied Beds
              </span>
              <span className="text-xl font-black text-emerald-800 dark:text-emerald-200 block mt-0.5">
                {property.occupiedBeds}
              </span>
            </div>

            {/* Available Beds - Amber Identity */}
            <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-[#231E10] border border-amber-200/80 dark:border-amber-500/40 text-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                Available Beds
              </span>
              <span className="text-xl font-black text-amber-800 dark:text-amber-200 block mt-0.5">
                {property.availableBeds}
              </span>
            </div>
          </div>

          {/* Occupancy bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#141B28] border border-slate-200/60 dark:border-[#222E42]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-brand-charcoal dark:text-white">Capacity Utilization</span>
              <span className="text-emerald-700 dark:text-emerald-400">{occupancyRate}% Occupied</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-[#0B0F17] rounded-full h-2.5 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${(property.occupiedBeds / property.totalBeds) * 100}%` }}
              />
              <div
                className="bg-blue-600 h-full"
                style={{ width: `${(property.availableBeds / property.totalBeds) * 100}%` }}
              />
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${(property.reservedBeds / property.totalBeds) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-brand-muted dark:text-slate-300 mt-2 font-medium">
              <span>{property.occupiedBeds} Occupied</span>
              <span>{property.availableBeds} Available</span>
              <span>{property.reservedBeds} Reserved</span>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-1">
                Property Overview
              </h4>
              <p className="text-xs text-brand-muted dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-[#141B28] p-3 rounded-xl border border-slate-200/50 dark:border-[#222E42]">
                {property.description}
              </p>
            </div>
          )}

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs font-bold text-brand-charcoal dark:text-white uppercase tracking-wider mb-2">
              Included Amenities & Perks ({property.amenities.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#141B28] border border-slate-200/60 dark:border-[#222E42] flex items-center gap-2 text-xs text-brand-charcoal dark:text-slate-100 font-semibold"
                >
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                    {getAmenityIcon(amenity)}
                  </span>
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-[#1E2638]">
            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#141B28] border border-slate-200/60 dark:border-[#222E42] space-y-1">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                Full Address
              </span>
              <p className="text-xs text-brand-charcoal dark:text-white font-bold">
                {property.address}
                {property.addressLine2 ? `, ${property.addressLine2}` : ""}
              </p>
              <p className="text-xs text-brand-muted dark:text-slate-300">
                {property.locality}, {property.city}, {property.state} – {property.pincode}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#141B28] border border-slate-200/60 dark:border-[#222E42] space-y-1">
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                Operational Contact
              </span>
              <p className="text-xs text-brand-charcoal dark:text-white font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{property.contactPhone || "+91 98180 12345"}</span>
              </p>
              {property.contactEmail && (
                <p className="text-xs text-brand-muted dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate">{property.contactEmail}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0D111A] border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between text-xs">
          <span className="text-brand-muted dark:text-slate-400">
            Added on {property.createdAt || "Jan 2026"}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/owner/properties/${property.id}/rooms`}
              className="px-3.5 py-1.5 rounded-xl bg-brand-lime text-brand-obsidian font-extrabold text-xs hover:bg-brand-lime-hover transition-colors shadow-2xs"
            >
              Manage Rooms & Beds →
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-brand-obsidian dark:bg-[#1F293D] border dark:border-white/10 text-white font-bold text-xs hover:bg-brand-obsidian-hover dark:hover:bg-[#28354D] transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
