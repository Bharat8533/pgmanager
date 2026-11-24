"use client";

import React from "react";
import { RoomSummaryStats } from "@/types/room";
import {
  DoorClosed,
  BedDouble,
  Users,
  CheckCircle2,
  Clock,
  Wrench,
  Percent,
  CreditCard,
  AlertCircle,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomStatsProps {
  stats: RoomSummaryStats;
}

export function RoomStats({ stats }: RoomStatsProps) {
  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  const statItems = [
    {
      label: "Total Rooms",
      value: stats.totalRooms,
      subValue: `${stats.occupiedBeds} of ${stats.totalBeds} beds occupied`,
      icon: <DoorClosed className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50/70",
      border: "border-blue-100",
    },
    {
      label: "Bed Capacity",
      value: stats.totalBeds,
      subValue: `${stats.availableBeds} beds ready for move-in`,
      icon: <BedDouble className="w-4 h-4 text-brand-obsidian" />,
      bg: "bg-slate-50",
      border: "border-slate-200/80",
    },
    {
      label: "Occupied Beds",
      value: stats.occupiedBeds,
      subValue: `${stats.occupancyRate}% live occupancy`,
      icon: <Users className="w-4 h-4 text-emerald-700" />,
      bg: "bg-emerald-50/70",
      border: "border-emerald-200/60",
    },
    {
      label: "Available Beds",
      value: stats.availableBeds,
      subValue: "Immediate admission ready",
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      bg: "bg-blue-50/60",
      border: "border-blue-200/60",
    },
    {
      label: "Reserved Beds",
      value: stats.reservedBeds,
      subValue: "Advance tokens received",
      icon: <Clock className="w-4 h-4 text-amber-700" />,
      bg: "bg-amber-50/70",
      border: "border-amber-200/60",
    },
    {
      label: "Under Maintenance",
      value: stats.maintenanceBeds,
      subValue: "Excluded from inventory",
      icon: <Wrench className="w-4 h-4 text-rose-600" />,
      bg: "bg-rose-50/70",
      border: "border-rose-200/60",
    },
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      subValue: "Occupied / Total Beds",
      icon: <Percent className="w-4 h-4 text-emerald-700" />,
      bg: "bg-emerald-50/60",
      border: "border-emerald-200/60",
    },
    {
      label: "Rent Collected",
      value: formatINR(stats.rentCollectedThisMonth),
      subValue: "Active room collections",
      icon: <CreditCard className="w-4 h-4 text-emerald-700" />,
      bg: "bg-emerald-50/60",
      border: "border-emerald-200/60",
    },
    {
      label: "Pending Rent",
      value: formatINR(stats.pendingRent),
      subValue: stats.pendingRent > 0 ? "Requires collection" : "Zero pending dues",
      icon: <AlertCircle className="w-4 h-4 text-amber-700" />,
      bg: "bg-amber-50/70",
      border: "border-amber-200/60",
    },
    {
      label: "Security Deposits",
      value: formatINR(stats.securityDepositsHeld),
      subValue: "Held liability (not revenue)",
      icon: <ShieldCheck className="w-4 h-4 text-purple-700" />,
      bg: "bg-purple-50/70",
      border: "border-purple-200/60",
    },
    {
      label: "Upcoming Check-outs",
      value: stats.upcomingCheckoutsCount,
      subValue: "Notice periods active",
      icon: <CalendarDays className="w-4 h-4 text-indigo-700" />,
      bg: "bg-indigo-50/70",
      border: "border-indigo-200/60",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {statItems.slice(0, 6).map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-brand-border/80 p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-semibold text-brand-muted truncate">
              {item.label}
            </span>
            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0", item.bg, item.border, "border")}>
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
          </div>
        </div>
      ))}
    </div>
  );
}
