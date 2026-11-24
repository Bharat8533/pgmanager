import React from "react";
import { DashboardSummaryCardData } from "@/types/owner";
import { Building2, BedDouble, Users, CreditCard, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSummaryCardsProps {
  cards: DashboardSummaryCardData[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-4 h-4 text-brand-charcoal" />,
  BedDouble: <BedDouble className="w-4 h-4 text-brand-charcoal" />,
  Users: <Users className="w-4 h-4 text-brand-charcoal" />,
  CreditCard: <CreditCard className="w-4 h-4 text-brand-charcoal" />,
};

export function DashboardSummaryCards({ cards }: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const icon = ICON_MAP[card.iconName] || <Building2 className="w-4 h-4 text-brand-charcoal" />;

        return (
          <div
            key={card.id}
            className="p-5 rounded-2xl bg-white border border-brand-border shadow-2xs hover:shadow-sm hover:border-[#CCD1C8] transition-all group flex flex-col justify-between"
          >
            {/* Top Row: Icon + Trend Badge (Prevents bottom-row truncation) */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-offwhite border border-brand-border flex items-center justify-center transition-colors group-hover:bg-brand-lime/25 group-hover:border-[#b4e655]">
                {icon}
              </div>

              {card.trend && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>{card.trend.value}</span>
                </span>
              )}
            </div>

            {/* Middle: Prominent Metric Value */}
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-charcoal tracking-tight">
                {card.value}
              </div>

              {/* Bottom: Title & Full Description without Truncation */}
              <div>
                <p className="text-xs font-bold text-brand-charcoal">
                  {card.title}
                </p>
                <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
