"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property } from "@/types/owner";
import { getAmenityIcon } from "@/components/properties/AmenitiesSelector";
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

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl border border-brand-border shadow-2xl overflow-y-auto z-10 animate-scaleUp no-scrollbar">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-lime/30 text-brand-charcoal flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-brand-charcoal" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-brand-charcoal truncate">
                {property.name}
              </h2>
              <p className="text-xs text-brand-muted truncate">
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
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-muted hover:text-brand-charcoal flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Main Photo Gallery Preview */}
          <div className="space-y-2">
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={images[selectedPhotoIndex] || property.coverImage}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-brand-obsidian/85 text-brand-lime font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
                {property.type}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-brand-charcoal font-black text-xs shadow-xs backdrop-blur-xs">
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

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                Total Rooms
              </span>
              <span className="text-xl font-black text-brand-charcoal">
                {property.totalRooms}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                Total Beds
              </span>
              <span className="text-xl font-black text-brand-charcoal">
                {property.totalBeds}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Occupied Beds
              </span>
              <span className="text-xl font-black text-emerald-700">
                {property.occupiedBeds}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Available Beds
              </span>
              <span className="text-xl font-black text-blue-700">
                {property.availableBeds}
              </span>
            </div>
          </div>

          {/* Occupancy bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-brand-charcoal">Capacity Utilization</span>
              <span className="text-emerald-700">{occupancyRate}% Occupied</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
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
            <div className="flex items-center justify-between text-[11px] text-brand-muted mt-2">
              <span>{property.occupiedBeds} Occupied</span>
              <span>{property.availableBeds} Available</span>
              <span>{property.reservedBeds} Reserved</span>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                Property Overview
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                {property.description}
              </p>
            </div>
          )}

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-2">
              Included Amenities & Perks ({property.amenities.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2 text-xs text-brand-charcoal font-medium"
                >
                  <span className="text-blue-600 flex-shrink-0">
                    {getAmenityIcon(amenity)}
                  </span>
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                Full Address
              </span>
              <p className="text-xs text-brand-charcoal font-medium">
                {property.address}
                {property.addressLine2 ? `, ${property.addressLine2}` : ""}
              </p>
              <p className="text-xs text-brand-muted">
                {property.locality}, {property.city}, {property.state} – {property.pincode}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                Operational Contact
              </span>
              <p className="text-xs text-brand-charcoal font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{property.contactPhone || "+91 98180 12345"}</span>
              </p>
              {property.contactEmail && (
                <p className="text-xs text-brand-muted flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">{property.contactEmail}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-brand-muted">
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
              className="px-4 py-1.5 rounded-xl bg-brand-obsidian text-white font-bold text-xs hover:bg-brand-obsidian-hover transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
