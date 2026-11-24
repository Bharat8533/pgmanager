"use client";

import React from "react";
import { Property } from "@/types/owner";
import {
  Building2,
  BedDouble,
  Bed,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Percent,
} from "lucide-react";

interface PropertyStatsProps {
  properties: Property[];
}

export function PropertyStats({ properties }: PropertyStatsProps) {
  // Compute aggregate statistics dynamically from properties
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === "active").length;
  const totalRooms = properties.reduce((acc, p) => acc + (Number(p.totalRooms) || 0), 0);
  const totalBeds = properties.reduce((acc, p) => acc + (Number(p.totalBeds) || 0), 0);
  const occupiedBeds = properties.reduce((acc, p) => acc + (Number(p.occupiedBeds) || 0), 0);
  const availableBeds = properties.reduce((acc, p) => acc + (Number(p.availableBeds) || 0), 0);
  const reservedBeds = properties.reduce((acc, p) => acc + (Number(p.reservedBeds) || 0), 0);

  const overallOccupancyRate =
    totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const stats = [
    {
      id: "stat-properties",
      label: "Total Properties",
      value: totalProperties,
      subValue: `${activeProperties} Active`,
      icon: <Building2 className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      id: "stat-rooms",
      label: "Total Rooms",
      value: totalRooms,
      subValue: "Across Portfolio",
      icon: <BedDouble className="w-4 h-4 text-indigo-600" />,
      bg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      id: "stat-beds",
      label: "Total Beds Capacity",
      value: totalBeds,
      subValue: "Full Capacity",
      icon: <Bed className="w-4 h-4 text-brand-charcoal" />,
      bg: "bg-slate-100 text-brand-charcoal border-slate-200",
    },
    {
      id: "stat-occupied",
      label: "Occupied Beds",
      value: occupiedBeds,
      subValue: "Generating Rent",
      icon: <Users className="w-4 h-4 text-emerald-600" />,
      bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      id: "stat-available",
      label: "Available Beds",
      value: availableBeds,
      subValue: "Ready to Sell",
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      id: "stat-reserved",
      label: "Reserved Beds",
      value: reservedBeds,
      subValue: "Tokens Paid",
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      bg: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      id: "stat-occupancy",
      label: "Portfolio Occupancy",
      value: `${overallOccupancyRate}%`,
      subValue: `${occupiedBeds}/${totalBeds} Beds`,
      icon: <Percent className="w-4 h-4 text-brand-charcoal" />,
      bg: "bg-brand-lime/30 text-brand-charcoal border-brand-charcoal/20",
      isProgress: true,
      rate: overallOccupancyRate,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {stats.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-brand-border/80 p-3.5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider truncate">
              {item.label}
            </span>
            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 ${item.bg}`}>
              {item.icon}
            </div>
          </div>

          <div>
            <p className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight">
              {item.value}
            </p>
            <p className="text-[10px] text-brand-muted font-medium truncate mt-0.5">
              {item.subValue}
            </p>

            {item.isProgress && (
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-brand-obsidian h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, item.rate || 0))}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
