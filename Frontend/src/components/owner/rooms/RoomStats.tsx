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
      icon: <DoorClosed className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      bg: "bg-blue-50/80 dark:bg-blue-500/15",
      border: "border-blue-200/80 dark:border-blue-500/30",
    },
    {
      label: "Bed Capacity",
      value: stats.totalBeds,
      subValue: `${stats.availableBeds} beds ready for move-in`,
      icon: <BedDouble className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      bg: "bg-slate-100 dark:bg-slate-800/80",
      border: "border-slate-200 dark:border-slate-700/60",
    },
    {
      label: "Occupied Beds",
      value: stats.occupiedBeds,
      subValue: `${stats.occupancyRate}% live occupancy`,
      icon: <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
      bg: "bg-emerald-50/80 dark:bg-emerald-500/15",
      border: "border-emerald-200/80 dark:border-emerald-500/30",
    },
    {
      label: "Available Beds",
      value: stats.availableBeds,
      subValue: "Immediate admission ready",
      icon: <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
      bg: "bg-sky-50/80 dark:bg-sky-500/15",
      border: "border-sky-200/80 dark:border-sky-500/30",
    },
    {
      label: "Reserved Beds",
      value: stats.reservedBeds,
      subValue: "Advance tokens received",
      icon: <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />,
      bg: "bg-amber-50/80 dark:bg-amber-500/15",
      border: "border-amber-200/80 dark:border-amber-500/30",
    },
    {
      label: "Under Maintenance",
      value: stats.maintenanceBeds,
      subValue: "Excluded from inventory",
      icon: <Wrench className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      bg: "bg-rose-50/80 dark:bg-rose-500/15",
      border: "border-rose-200/80 dark:border-rose-500/30",
    },
    {
      label: "Occupancy Rate",
      value: `${stats.occupancyRate}%`,
      subValue: "Occupied / Total Beds",
      icon: <Percent className="w-4 h-4 text-teal-700 dark:text-teal-400" />,
      bg: "bg-teal-50/80 dark:bg-teal-500/15",
      border: "border-teal-200/80 dark:border-teal-500/30",
    },
    {
      label: "Rent Collected",
      value: formatINR(stats.rentCollectedThisMonth),
      subValue: "Active room collections",
      icon: <CreditCard className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />,
      bg: "bg-emerald-50/80 dark:bg-emerald-500/15",
      border: "border-emerald-200/80 dark:border-emerald-500/30",
    },
    {
      label: "Pending Rent",
      value: formatINR(stats.pendingRent),
      subValue: stats.pendingRent > 0 ? "Requires collection" : "Zero pending dues",
      icon: <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />,
      bg: "bg-amber-50/80 dark:bg-amber-500/15",
      border: "border-amber-200/80 dark:border-amber-500/30",
    },
    {
      label: "Security Deposits",
      value: formatINR(stats.securityDepositsHeld),
      subValue: "Held liability (not revenue)",
      icon: <ShieldCheck className="w-4 h-4 text-purple-700 dark:text-purple-400" />,
      bg: "bg-purple-50/80 dark:bg-purple-500/15",
      border: "border-purple-200/80 dark:border-purple-500/30",
    },
    {
      label: "Upcoming Check-outs",
      value: stats.upcomingCheckoutsCount,
      subValue: "Notice periods active",
      icon: <CalendarDays className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />,
      bg: "bg-indigo-50/80 dark:bg-indigo-500/15",
      border: "border-indigo-200/80 dark:border-indigo-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {statItems.slice(0, 6).map((item, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-[#111622] rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 dark:border-[#222E42] shadow-2xs hover:shadow-xs dark:hover:border-slate-700 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-semibold text-brand-muted dark:text-slate-300 truncate">
              {item.label}
            </span>
            <div className={cn("w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all", item.bg, item.border)}>
              {item.icon}
            </div>
          </div>

          <div>
            <p className="text-xl sm:text-2xl font-black text-brand-charcoal dark:text-white tracking-tight">
              {item.value}
            </p>
            <p className="text-[10px] text-brand-muted dark:text-slate-400 font-medium truncate mt-0.5">
              {item.subValue}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
