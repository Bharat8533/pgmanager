"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOwner } from "@/contexts/OwnerContext";
import { Property } from "@/types/owner";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { ArrowLeft, Sparkles, Building2, CheckCircle2, AlertCircle } from "lucide-react";

interface EditPropertyClientProps {
  propertyId: string;
}

export function EditPropertyClient({ propertyId }: EditPropertyClientProps) {
  const router = useRouter();
  const { getPropertyById, updateProperty } = useOwner();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const existingProperty = getPropertyById(propertyId);

  const handleUpdateProperty = (data: Omit<Property, "id"> & { id?: string }) => {
    setIsSubmitting(true);

    setTimeout(() => {
      updateProperty(propertyId, data);
      setIsSubmitting(false);
      setSuccessToast(`"${data.name}" was successfully updated!`);

      setTimeout(() => {
        router.push("/owner/properties");
      }, 700);
    }, 500);
  };

  if (!existingProperty) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-charcoal">
            Property Not Found
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            We couldn&apos;t locate the property record you requested to edit. It may have been removed.
          </p>
        </div>
        <Link
          href="/owner/properties"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-obsidian text-white text-xs font-bold shadow-xs hover:bg-brand-obsidian-hover transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Properties</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Top Navigation & Header */}
      <div className="space-y-2">
        <Link
          href="/owner/properties"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-charcoal transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Properties</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-charcoal uppercase tracking-wider bg-brand-lime/30 text-brand-charcoal px-2.5 py-0.5 rounded-full border border-brand-lime/60">
                <Sparkles className="w-3 h-3 text-brand-charcoal" />
                <span>Edit Specifications</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal tracking-tight">
              Edit Property: {existingProperty.name}
            </h1>
            <p className="text-sm text-brand-muted mt-0.5 leading-relaxed">
              Update room capacities, gallery photos, amenities, and operational contacts.
            </p>
          </div>
        </div>
      </div>

      {/* Success Feedback Banner */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-xs animate-scaleUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successToast} Redirecting to properties listing...</span>
        </div>
      )}

      {/* Reusable Form in 'edit' mode with initialData */}
      <PropertyForm
        mode="edit"
        initialData={existingProperty}
        onSubmit={handleUpdateProperty}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
