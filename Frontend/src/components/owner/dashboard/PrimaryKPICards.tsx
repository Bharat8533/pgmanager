"use client";

import React from "react";
import { KPICardMetric } from "@/data/dashboardStats";
import {
  Building2,
  BedDouble,
  Users,
  CreditCard,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryKPICardsProps {
  cards: KPICardMetric[];
}

export function PrimaryKPICards({ cards }: PrimaryKPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        return <KPICardItem key={card.id} card={card} />;
      })}
    </div>
  );
}

function KPICardItem({ card }: { card: KPICardMetric }) {
  // Color configuration
  const colorStyles = {
    blue: {
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "text-blue-600",
      progressBg: "bg-blue-600",
      pillBg: "bg-blue-50 text-blue-700 border-blue-200/60",
    },
    green: {
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "text-emerald-600",
      progressBg: "bg-emerald-500",
      pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    },
    orange: {
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      accent: "text-amber-600",
      progressBg: "bg-amber-500",
      pillBg: "bg-amber-50 text-amber-700 border-amber-200/60",
    },
    red: {
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      accent: "text-rose-600",
      progressBg: "bg-rose-500",
      pillBg: "bg-rose-50 text-rose-700 border-rose-200/60",
    },
    purple: {
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      accent: "text-purple-600",
      progressBg: "bg-purple-600",
      pillBg: "bg-purple-50 text-purple-700 border-purple-200/60",
    },
  }[card.statusColor] || {
    iconBg: "bg-slate-50 text-slate-600 border-slate-100",
    accent: "text-slate-600",
    progressBg: "bg-slate-500",
    pillBg: "bg-slate-50 text-slate-700 border-slate-200/60",
  };

  const renderIcon = () => {
    switch (card.iconName) {
      case "Building2":
        return <Building2 className="w-4 h-4" />;
      case "BedDouble":
        return <BedDouble className="w-4 h-4" />;
      case "Bed":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
          </svg>
        );
      case "Users":
        return <Users className="w-4 h-4" />;
      case "TrendingUp":
        return <TrendingUp className="w-4 h-4" />;
      case "CreditCard":
        return <CreditCard className="w-4 h-4" />;
      case "AlertCircle":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl border border-brand-border/80 p-4 shadow-xs",
        "flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300"
      )}
    >
      {/* Top Row: Icon Container and Trend Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div
          className={cn(
            "w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105",
            colorStyles.iconBg
          )}
        >
          {renderIcon()}
        </div>

        {card.trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-tight",
              card.trend.isPositive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                : "bg-rose-50 text-rose-700 border-rose-200/60"
            )}
          >
            {card.trend.isPositive ? (
              <ArrowUpRight className="w-2.5 h-2.5 flex-shrink-0" />
            ) : (
              <ArrowDownRight className="w-2.5 h-2.5 flex-shrink-0" />
            )}
            <span>{card.trend.value}</span>
          </span>
        )}
      </div>

      {/* Middle: Title & Primary Metric */}
      <div>
        <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 truncate">
          {card.title}
        </p>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight">
            {card.value}
          </span>
          {card.secondaryMetric && (
            <span className="text-[11px] font-semibold text-brand-muted truncate">
              {card.secondaryMetric}
            </span>
          )}
        </div>
      </div>

      {/* Bottom: Progress bar (if present) & Supporting Text */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
        {typeof card.progressPercent === "number" && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", colorStyles.progressBg)}
              style={{ width: `${Math.min(100, Math.max(0, card.progressPercent))}%` }}
            />
          </div>
        )}
        <p className="text-[11px] text-brand-muted truncate" title={card.supportingText}>
          {card.supportingText}
        </p>
      </div>
    </div>
  );
}
