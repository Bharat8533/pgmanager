import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Clock } from "lucide-react";

interface PlaceholderPageProps {
  moduleName: string;
  moduleSubtitle: string;
  icon: React.ReactNode;
  features: string[];
}

export function PlaceholderPage({
  moduleName,
  moduleSubtitle,
  icon,
  features,
}: PlaceholderPageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Module Overview Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-brand-border shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-obsidian text-brand-lime flex items-center justify-center shadow-xs flex-shrink-0">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-charcoal tracking-tight">
                  {moduleName}
                </h2>
                <span className="text-[11px] font-semibold bg-brand-lime/40 text-brand-charcoal px-2.5 py-0.5 rounded-full border border-[#b4e655]">
                  Phase 2 Module
                </span>
              </div>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
                {moduleSubtitle}
              </p>
            </div>
          </div>

          <Link
            href="/owner/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-brand-border text-xs font-semibold text-brand-charcoal hover:bg-brand-offwhite transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Feature roadmap pill list */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-charcoal">
            <Clock className="w-3.5 h-3.5 text-brand-muted" />
            <span>Core Capabilities Planned for this Module</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-brand-offwhite/80 border border-brand-border/60 flex items-start gap-2.5 text-xs text-brand-charcoal"
              >
                <div className="w-5 h-5 rounded-md bg-white border border-brand-border flex items-center justify-center text-[10px] font-bold text-brand-charcoal flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="font-medium leading-relaxed">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase notification note */}
        <div className="mt-4 p-4 rounded-xl bg-brand-offwhite border border-brand-border/80 flex items-center gap-3 text-xs text-brand-muted">
          <Sparkles className="w-4 h-4 text-brand-charcoal flex-shrink-0" />
          <span>
            This module UI foundation and routing are fully connected inside <strong>OwnerLayout</strong>. Detailed CRUD tables, form modals, and data hooks will be implemented in subsequent phases.
          </span>
        </div>
      </div>
    </div>
  );
}
