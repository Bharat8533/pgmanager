"use client";

import React, { useState } from "react";
import { RoomOccupancyOverview } from "@/data/roomOccupancyData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { BedDouble, CheckCircle2, Info, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomOccupancyChartProps {
  data: RoomOccupancyOverview;
}

export function RoomOccupancyChart({ data }: RoomOccupancyChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = data.categories.map((c) => ({
    name: c.name,
    value: c.count,
    percentage: c.percentage,
    color: c.color,
    description: c.description,
  }));

  const activeCategory = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-charcoal tracking-tight">
              Room Occupancy Overview
            </h3>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            Physical room distribution and operational status
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            {data.occupancyRate}% Occupied
          </span>
        </div>
      </div>

      {/* Middle: Chart + Legend */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-3">
        {/* Donut Chart with Center Total */}
        <div className="md:col-span-6 flex items-center justify-center relative min-h-[200px]">
          <div className="w-full h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-200 cursor-pointer hover:opacity-80"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-brand-obsidian text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-white/10 select-none">
                          <p className="font-bold flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            {item.name}
                          </p>
                          <p className="text-white/80 mt-1">
                            {item.value} Rooms ({item.percentage}%)
                          </p>
                          <p className="text-[10px] text-brand-lime mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Info in Donut Hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
              {activeCategory ? activeCategory.value : data.totalRooms}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted -mt-0.5">
              {activeCategory ? activeCategory.name.replace(" Rooms", "") : "Total Rooms"}
            </span>
          </div>
        </div>

        {/* Legend & Stat Breakdown */}
        <div className="md:col-span-6 flex flex-col gap-2">
          {chartData.map((cat, idx) => {
            const isHovered = activeIndex === idx;
            return (
              <div
                key={cat.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={cn(
                  "p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                  isHovered
                    ? "bg-slate-50 border-slate-300 shadow-2xs"
                    : "bg-white border-transparent hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-md flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand-charcoal truncate">
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-brand-muted truncate">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-xs font-black text-brand-charcoal">
                    {cat.value}
                  </span>
                  <span className="text-[10px] text-brand-muted font-medium ml-1">
                    ({cat.percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-brand-muted bg-slate-50/70 p-2.5 rounded-xl">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-[11px] leading-snug">{data.statusSummary}</span>
      </div>
    </div>
  );
}
