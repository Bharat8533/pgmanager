"use client";

import React from "react";
import { BedOccupancyOverview } from "@/data/bedOccupancyData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Bed, Sparkles, TrendingUp, AlertTriangle, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface BedOccupancyChartProps {
  data: BedOccupancyOverview;
}

export function BedOccupancyChart({ data }: BedOccupancyChartProps) {
  // Horizontal stacked representation for single bar
  const stackedData = [
    {
      category: "Beds",
      Occupied: data.occupiedBeds,
      Available: data.availableBeds,
      Reserved: data.reservedBeds,
      Maintenance: data.maintenanceBeds,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-charcoal tracking-tight">
              Bed Availability & Occupancy
            </h3>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            Real unit capacity & individual bed allocation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full">
            {data.occupancyRate}% Bed Occ.
          </span>
          <span className="hidden sm:inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-1 rounded-full">
            {data.capacityUtilization} Utilization
          </span>
        </div>
      </div>

      {/* Primary Capacity Metric Cards (Occupied vs Available vs Total) */}
      <div className="grid grid-cols-3 gap-3 my-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
            Total Beds
          </span>
          <span className="text-xl sm:text-2xl font-black text-brand-charcoal">
            {data.totalBeds}
          </span>
          <span className="text-[10px] text-brand-muted block mt-0.5">Full Capacity</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
            Occupied Beds
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">
            {data.occupiedBeds}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Generating Rent</span>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
            Available Beds
          </span>
          <span className="text-xl sm:text-2xl font-black text-blue-700">
            {data.availableBeds}
          </span>
          <span className="text-[10px] text-blue-600 block mt-0.5">Ready for Rent</span>
        </div>
      </div>

      {/* Horizontal Stacked Bar Visualizer */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-brand-charcoal text-[11px]">Capacity Distribution</span>
          <span className="text-brand-muted text-[11px]">
            {data.occupiedBeds} of {data.totalBeds} filled
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(data.occupiedBeds / data.totalBeds) * 100}%` }}
            title={`Occupied: ${data.occupiedBeds}`}
          />
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(data.availableBeds / data.totalBeds) * 100}%` }}
            title={`Available: ${data.availableBeds}`}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: `${(data.reservedBeds / data.totalBeds) * 100}%` }}
            title={`Reserved: ${data.reservedBeds}`}
          />
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${(data.maintenanceBeds / data.totalBeds) * 100}%` }}
            title={`Maintenance: ${data.maintenanceBeds}`}
          />
        </div>

        {/* Bar Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
          {data.categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-1.5 text-[11px]">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-brand-charcoal font-semibold">{cat.name}:</span>
              <span className="text-brand-muted">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sharing Configuration Breakdown */}
      <div className="border-t border-slate-100 pt-3">
        <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-2">
          Sharing Plan Performance
        </p>
        <div className="space-y-1.5">
          {data.sharingBreakdown.map((share) => (
            <div
              key={share.type}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-charcoal">{share.type}</span>
                <span className="text-[10px] text-brand-muted bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
                  {share.pricePerBed}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-brand-muted">
                  {share.occupiedBeds}/{share.totalBeds} beds
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {share.occupancyRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Difference Note: Room vs Bed */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-[11px] text-brand-muted">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
        <span className="leading-tight">{data.insightNote}</span>
      </div>
    </div>
  );
}
