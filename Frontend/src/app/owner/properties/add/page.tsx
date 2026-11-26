"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOwner } from "@/contexts/OwnerContext";
import { Property } from "@/types/owner";
import { PropertyForm } from "@/components/owner/properties/PropertyForm";
import { ArrowLeft, Sparkles, Building2, CheckCircle2 } from "lucide-react";

export default function AddPropertyPage() {
  const router = useRouter();
  const { addProperty } = useOwner();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleCreateProperty = (data: Omit<Property, "id"> & { id?: string }) => {
    setIsSubmitting(true);

    setTimeout(() => {
      const created = addProperty(data);
      setIsSubmitting(false);
      setSuccessToast(`"${created.name}" was successfully added to your portfolio!`);

      setTimeout(() => {
        router.push("/owner/properties");
      }, 700);
    }, 500);
  };

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
                <span>New Branch Onboarding</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal tracking-tight">
              Add New Property
            </h1>
            <p className="text-sm text-brand-muted mt-0.5 leading-relaxed">
              Add your PG property and its basic information to StayManage.
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

      {/* Reusable Form in 'create' mode */}
      <PropertyForm
        mode="create"
        onSubmit={handleCreateProperty}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
