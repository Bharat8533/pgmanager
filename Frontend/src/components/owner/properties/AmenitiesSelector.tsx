"use client";

import React, { useState } from "react";
import {
  Wifi,
  Wind,
  Video,
  Shirt,
  Car,
  Utensils,
  Sparkles,
  Zap,
  Bath,
  ShieldCheck,
  Package,
  Users,
  ChevronsUp,
  Droplet,
  Plus,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AmenityDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const STANDARD_AMENITIES: AmenityDefinition[] = [
  { id: "Wi-Fi", label: "Wi-Fi", icon: <Wifi className="w-4 h-4" /> },
  { id: "Air Conditioning", label: "Air Conditioning", icon: <Wind className="w-4 h-4" /> },
  { id: "CCTV", label: "CCTV Surveillance", icon: <Video className="w-4 h-4" /> },
  { id: "Laundry", label: "Laundry Service", icon: <Shirt className="w-4 h-4" /> },
  { id: "Parking", label: "Vehicle Parking", icon: <Car className="w-4 h-4" /> },
  { id: "Food / Mess", label: "Food / Mess Meals", icon: <Utensils className="w-4 h-4" /> },
  { id: "Housekeeping", label: "Daily Housekeeping", icon: <Sparkles className="w-4 h-4" /> },
  { id: "Power Backup", label: "100% Power Backup", icon: <Zap className="w-4 h-4" /> },
  { id: "Attached Bathroom", label: "Attached Bathroom", icon: <Bath className="w-4 h-4" /> },
  { id: "Security", label: "24/7 Security Guard", icon: <ShieldCheck className="w-4 h-4" /> },
  { id: "Refrigerator", label: "Refrigerator", icon: <Package className="w-4 h-4" /> },
  { id: "Common Area", label: "Common Lounge Area", icon: <Users className="w-4 h-4" /> },
  { id: "Lift", label: "Elevator / Lift", icon: <ChevronsUp className="w-4 h-4" /> },
  { id: "RO Water", label: "RO Purified Water", icon: <Droplet className="w-4 h-4" /> },
];

export function getAmenityIcon(label: string): React.ReactNode {
  const match = STANDARD_AMENITIES.find((a) => a.id.toLowerCase() === label.toLowerCase() || a.label.toLowerCase() === label.toLowerCase());
  if (match) return match.icon;
  return <Sparkles className="w-3.5 h-3.5" />;
}

interface AmenitiesSelectorProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
  error?: string;
}

export function AmenitiesSelector({
  selectedAmenities,
  onChange,
  error,
}: AmenitiesSelectorProps) {
  const [customInput, setCustomInput] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      onChange(selectedAmenities.filter((a) => a !== name));
    } else {
      onChange([...selectedAmenities, name]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedAmenities.includes(trimmed)) {
      onChange([...selectedAmenities, trimmed]);
    }
    setCustomInput("");
    setIsAddingCustom(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
            Select Amenities & Features <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-brand-muted mt-0.5">
            Select all available facilities provided to residents at this property.
          </p>
        </div>

        <span className="text-xs font-semibold text-brand-charcoal bg-slate-100 px-2 py-0.5 rounded-full">
          {selectedAmenities.length} selected
        </span>
      </div>

      {/* Grid of standard amenities */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {STANDARD_AMENITIES.map((amenity) => {
          const isSelected = selectedAmenities.includes(amenity.id);
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggleAmenity(amenity.id)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 text-xs select-none group",
                isSelected
                  ? "bg-brand-lime/25 border-brand-charcoal/40 text-brand-charcoal font-bold shadow-2xs"
                  : "bg-white border-brand-border/80 text-brand-muted hover:border-slate-300 hover:text-brand-charcoal"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isSelected ? "text-brand-charcoal" : "text-brand-muted group-hover:text-brand-charcoal"
                  )}
                >
                  {amenity.icon}
                </span>
                <span className="truncate">{amenity.label}</span>
              </div>

              <div
                className={cn(
                  "w-4 h-4 rounded-md flex items-center justify-center border flex-shrink-0 transition-all",
                  isSelected
                    ? "bg-brand-obsidian border-brand-obsidian text-brand-lime"
                    : "border-slate-300 bg-white group-hover:border-slate-400"
                )}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Amenities tags if added */}
      {selectedAmenities.some((a) => !STANDARD_AMENITIES.some((sa) => sa.id === a)) && (
        <div className="pt-2">
          <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
            Custom Amenities Added
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedAmenities
              .filter((a) => !STANDARD_AMENITIES.some((sa) => sa.id === a))
              .map((custom) => (
                <span
                  key={custom}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime/30 border border-brand-charcoal/30 text-xs font-bold text-brand-charcoal"
                >
                  <Sparkles className="w-3 h-3 text-brand-charcoal" />
                  <span>{custom}</span>
                  <button
                    type="button"
                    onClick={() => toggleAmenity(custom)}
                    className="w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center text-brand-charcoal ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Add Custom Amenity button / inline form */}
      <div className="pt-1">
        {isAddingCustom ? (
          <form
            onSubmit={handleAddCustom}
            className="flex items-center gap-2 max-w-sm"
          >
            <input
              type="text"
              autoFocus
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Swimming Pool, Table Tennis..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-brand-obsidian text-white text-xs font-bold rounded-xl hover:bg-brand-obsidian-hover shadow-2xs"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingCustom(false);
                setCustomInput("");
              }}
              className="px-2.5 py-1.5 text-xs font-semibold text-brand-muted hover:text-brand-charcoal"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingCustom(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-charcoal hover:underline"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>+ Add Custom Amenity</span>
          </button>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
