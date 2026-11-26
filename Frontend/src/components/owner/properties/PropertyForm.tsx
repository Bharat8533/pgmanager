"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Property, PropertyStatus, PropertyType } from "@/types/owner";
import { AmenitiesSelector } from "@/components/owner/properties/AmenitiesSelector";
import { PropertyImageUpload } from "@/components/owner/properties/PropertyImageUpload";
import {
  Building2,
  MapPin,
  Bed,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES: PropertyType[] = [
  "Boys PG",
  "Girls PG",
  "Co-living",
  "Family Accommodation",
  "Other",
];

const PROPERTY_STATUSES: { id: PropertyStatus; label: string; desc: string }[] = [
  { id: "active", label: "Active", desc: "Open for admissions and visible in searches" },
  { id: "inactive", label: "Inactive", desc: "Temporarily closed or archived" },
  { id: "under_maintenance", label: "Under Maintenance", desc: "Renovations / repairs in progress" },
];

const propertySchema = z.object({
  name: z.string().min(3, "Property name must be at least 3 characters"),
  type: z.string().min(1, "Please select property type"),
  description: z.string().default(""),
  contactPhone: z
    .string()
    .min(10, "Please enter a valid 10-digit phone number")
    .regex(/^[0-9+ \-]+$/, "Invalid phone format"),
  contactEmail: z.string().default(""),
  address: z.string().min(3, "Address is required"),
  addressLine2: z.string().default(""),
  locality: z.string().min(2, "Locality / Area is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .min(6, "PIN code must be 6 digits")
    .max(6, "PIN code must be 6 digits")
    .regex(/^[0-9]{6}$/, "Must be a 6-digit Indian PIN code"),
  totalRooms: z.number().min(1, "Must have at least 1 room"),
  totalBeds: z.number().min(1, "Must have at least 1 bed"),
  occupiedBeds: z.number().min(0, "Cannot be negative"),
  reservedBeds: z.number().min(0, "Cannot be negative"),
  monthlyStartingRent: z.number().min(0, "Cannot be negative").default(12000),
  status: z.enum(["active", "inactive", "under_maintenance"]),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  mode: "create" | "edit";
  initialData?: Property;
  onSubmit: (data: Omit<Property, "id"> & { id?: string }) => void;
  isSubmitting?: boolean;
}

export function PropertyForm({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
}: PropertyFormProps) {
  const router = useRouter();

  // Images state
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : initialData?.coverImage
        ? [initialData.coverImage]
        : ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"]
  );

  const [coverImage, setCoverImage] = useState<string>(
    initialData?.coverImage || images[0] || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
  );

  // Amenities state
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || [
      "Wi-Fi",
      "Air Conditioning",
      "Power Backup",
      "CCTV",
      "Housekeeping",
      "Attached Bathroom",
    ]
  );

  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "Co-living",
      description: initialData?.description || "",
      contactPhone: initialData?.contactPhone || "+91 98180 12345",
      contactEmail: initialData?.contactEmail || "",
      address: initialData?.address || "",
      addressLine2: initialData?.addressLine2 || "",
      locality: initialData?.locality || "",
      city: initialData?.city || "Gurgaon",
      state: initialData?.state || "Haryana",
      pincode: initialData?.pincode || "122003",
      totalRooms: Number(initialData?.totalRooms) || 10,
      totalBeds: Number(initialData?.totalBeds) || 20,
      occupiedBeds: Number(initialData?.occupiedBeds) || 0,
      reservedBeds: Number(initialData?.reservedBeds) || 0,
      monthlyStartingRent: Number(initialData?.monthlyStartingRent) || 12000,
      status: initialData?.status || "active",
    },
  });

  const watchTotalBeds = watch("totalBeds") || 0;
  const watchOccupiedBeds = watch("occupiedBeds") || 0;
  const watchReservedBeds = watch("reservedBeds") || 0;
  const watchStatus = watch("status");

  // Calculate available beds dynamically
  const calculatedAvailableBeds = Math.max(
    0,
    Number(watchTotalBeds) - Number(watchOccupiedBeds) - Number(watchReservedBeds)
  );

  const handleFormSubmit = (data: PropertyFormData) => {
    setFormError(null);

    // Bed reconciliation check
    if (Number(data.occupiedBeds) + Number(data.reservedBeds) > Number(data.totalBeds)) {
      setFormError(
        `Occupied beds (${data.occupiedBeds}) + Reserved beds (${data.reservedBeds}) cannot exceed Total Beds (${data.totalBeds})!`
      );
      return;
    }

    if (images.length === 0) {
      setFormError("Please upload or provide at least one property image.");
      return;
    }

    if (selectedAmenities.length === 0) {
      setFormError("Please select at least one amenity for the property.");
      return;
    }

    const availableBeds = Math.max(
      0,
      Number(data.totalBeds) - Number(data.occupiedBeds) - Number(data.reservedBeds)
    );

    const propertyPayload: Omit<Property, "id"> & { id?: string } = {
      id: initialData?.id,
      name: data.name,
      type: data.type,
      description: data.description || "",
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      address: data.address,
      addressLine2: data.addressLine2,
      locality: data.locality,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      totalRooms: Number(data.totalRooms),
      totalBeds: Number(data.totalBeds),
      occupiedBeds: Number(data.occupiedBeds),
      availableBeds,
      reservedBeds: Number(data.reservedBeds),
      status: data.status,
      coverImage: coverImage || images[0],
      images: images,
      amenities: selectedAmenities,
      monthlyStartingRent: Number(data.monthlyStartingRent) || 0,
      createdAt: initialData?.createdAt || "Today",
    };

    onSubmit(propertyPayload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {formError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* SECTION 1: Basic Information */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-charcoal">
              Basic Property Information
            </h3>
            <p className="text-[11px] text-brand-muted">
              Display name, classification, and operational contacts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Property Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Property Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. StayManage Residency, Green Valley PG"
              {...register("name")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Property Type <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("type")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium bg-white"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.type.message}</p>
            )}
          </div>

          {/* Starting Monthly Rent */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Starting Monthly Rent (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-brand-muted">₹</span>
              <input
                type="number"
                placeholder="12000"
                {...register("monthlyStartingRent", { valueAsNumber: true })}
                className="w-full pl-7 pr-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Manager / Caretaker Phone <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-brand-muted" />
              <input
                type="text"
                placeholder="+91 98180 12345"
                {...register("contactPhone")}
                className="w-full pl-8 pr-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
              />
            </div>
            {errors.contactPhone && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.contactPhone.message}</p>
            )}
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Property Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-brand-muted" />
              <input
                type="email"
                placeholder="branch@staymanage.in"
                {...register("contactEmail")}
                className="w-full pl-8 pr-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
              />
            </div>
            {errors.contactEmail && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.contactEmail.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Property Description & Highlights
            </label>
            <textarea
              rows={3}
              placeholder="Describe nearby landmarks, food options, proximity to tech parks or universities..."
              {...register("description")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Location & Address */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-charcoal">
              Property Address & Location
            </h3>
            <p className="text-[11px] text-brand-muted">
              Standard Indian address details for tenant verification and direction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Address Line 1 */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Address Line 1 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Building No, Plot No, Street Name"
              {...register("address")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
            />
            {errors.address && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.address.message}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              placeholder="Floor, Landmark, Near Metro"
              {...register("addressLine2")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
            />
          </div>

          {/* Locality */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Locality / Area <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sector 45, Hauz Khas, Knowledge Park"
              {...register("locality")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
            />
            {errors.locality && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.locality.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Gurgaon, Delhi, Noida"
              {...register("city")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
            />
            {errors.city && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.city.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              State <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Haryana, Delhi, Uttar Pradesh"
              {...register("state")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
            />
            {errors.state && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.state.message}</p>
            )}
          </div>

          {/* PIN code */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              PIN Code (6 digits) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 122003"
              {...register("pincode")}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-medium"
            />
            {errors.pincode && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.pincode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Capacity & Bed Inventory Allocation */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Bed className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-charcoal">
              Room & Bed Inventory Capacity
            </h3>
            <p className="text-[11px] text-brand-muted">
              Configure initial unit numbers. All bed allocations must mathematically reconcile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Rooms */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Total Rooms <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register("totalRooms", { valueAsNumber: true })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-bold"
            />
            {errors.totalRooms && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.totalRooms.message}</p>
            )}
          </div>

          {/* Total Beds */}
          <div>
            <label className="block text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-1">
              Total Beds Capacity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              {...register("totalBeds", { valueAsNumber: true })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-obsidian/20 text-brand-charcoal font-bold"
            />
            {errors.totalBeds && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.totalBeds.message}</p>
            )}
          </div>

          {/* Occupied Beds */}
          <div>
            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              Occupied Beds
            </label>
            <input
              type="number"
              min={0}
              {...register("occupiedBeds", { valueAsNumber: true })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-200 bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-emerald-800 font-bold"
            />
            {errors.occupiedBeds && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.occupiedBeds.message}</p>
            )}
          </div>

          {/* Reserved Beds */}
          <div>
            <label className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              Reserved Beds
            </label>
            <input
              type="number"
              min={0}
              {...register("reservedBeds", { valueAsNumber: true })}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 bg-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-amber-800 font-bold"
            />
            {errors.reservedBeds && (
              <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.reservedBeds.message}</p>
            )}
          </div>
        </div>

        {/* Dynamic calculation banner */}
        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-blue-900 font-semibold">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              Available Beds to Sell: <strong className="text-blue-700 text-sm font-black">{calculatedAvailableBeds}</strong>
            </span>
          </div>
          <span className="text-[11px] text-blue-700 font-medium">
            (Total {watchTotalBeds} − Occupied {watchOccupiedBeds} − Reserved {watchReservedBeds})
          </span>
        </div>
      </div>

      {/* SECTION 4: Property Photos */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-xs">
        <PropertyImageUpload
          images={images}
          coverImage={coverImage}
          onImagesChange={setImages}
          onCoverImageChange={setCoverImage}
        />
      </div>

      {/* SECTION 5: Amenities */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-xs">
        <AmenitiesSelector
          selectedAmenities={selectedAmenities}
          onChange={setSelectedAmenities}
        />
      </div>

      {/* SECTION 6: Operational Status */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-xs space-y-3">
        <div>
          <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block">
            Property Status <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-brand-muted mt-0.5">
            Mark whether this branch is actively accepting admissions or under repairs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROPERTY_STATUSES.map((st) => {
            const isSelected = watchStatus === st.id;
            return (
              <label
                key={st.id}
                onClick={() => setValue("status", st.id)}
                className={cn(
                  "p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between group",
                  isSelected
                    ? "bg-slate-50 border-brand-obsidian ring-1 ring-brand-obsidian shadow-2xs"
                    : "bg-white border-brand-border/80 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-brand-charcoal">
                    {st.label}
                  </span>
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center",
                      isSelected
                        ? "border-brand-obsidian bg-brand-obsidian text-brand-lime"
                        : "border-slate-300"
                    )}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brand-lime" />}
                  </div>
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">
                  {st.desc}
                </p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-brand-obsidian text-white shadow-2xl flex items-center justify-between gap-4 border border-white/10 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.push("/owner/properties")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Return</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-lime text-brand-obsidian font-extrabold text-xs shadow-md hover:bg-brand-lime-hover active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-obsidian border-t-transparent rounded-full animate-spin" />
                <span>Saving Property...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{mode === "create" ? "Save & Onboard Property" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
