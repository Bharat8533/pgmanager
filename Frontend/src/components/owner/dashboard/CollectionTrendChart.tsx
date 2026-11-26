"use client";

import React from "react";
import { CollectionDataPoint } from "@/data/collectionData";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, ArrowUpRight, IndianRupee, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionTrendChartProps {
  trendPoints: CollectionDataPoint[];
  dateRange: string;
}

export function CollectionTrendChart({
  trendPoints,
  dateRange,
}: CollectionTrendChartProps) {
  // Format Y-axis INR values concisely (e.g. 50k, 1L, 10L)
  const formatYAxis = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-charcoal tracking-tight">
              Collection & Revenue Inflows
            </h3>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            Cash inflows across rent, pending balances and service fees
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Period: {dateRange}
          </span>
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="w-full h-64 sm:h-72 my-2 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendPoints}
            margin={{ top: 15, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              {/* Rent Collected Gradient */}
              <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>

              {/* Pending Rent Gradient */}
              <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>

              {/* Other Collections Gradient */}
              <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />

            <XAxis
              dataKey="label"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#E2E8F0" }}
            />

            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-brand-obsidian text-white text-xs p-3 rounded-xl shadow-xl min-w-[180px]">
                      <p className="font-extrabold text-white pb-1.5 mb-2">
                        {label}
                      </p>
                      {payload.map((entry: any, i: number) => (
                        <div
                          key={`item-${i}`}
                          className="flex items-center justify-between gap-3 text-[11px] py-0.5"
                        >
                          <span className="flex items-center gap-1.5 text-white/80">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            {entry.name}:
                          </span>
                          <span className="font-bold text-white">
                            {formatINR(entry.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="rentCollected"
              name="Rent Collected"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRent)"
            />

            <Area
              type="monotone"
              dataKey="pendingRent"
              name="Pending Rent"
              stroke="#F59E0B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPending)"
            />

            <Area
              type="monotone"
              dataKey="otherCollections"
              name="Other Collections"
              stroke="#6366F1"
              strokeWidth={1.8}
              strokeDasharray="3 3"
              fillOpacity={1}
              fill="url(#colorOther)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Clean Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-brand-charcoal font-semibold text-[11px]">Rent Collected</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="text-brand-charcoal font-semibold text-[11px]">Pending Balance</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
            <span className="text-brand-charcoal font-semibold text-[11px]">Other Collections</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full self-start sm:self-auto flex-shrink-0">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>95.6% On-Time Collection</span>
        </div>
      </div>
    </div>
  );
}
