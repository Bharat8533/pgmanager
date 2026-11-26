"use client";

import React from "react";
import Link from "next/link";
import {
  UpcomingCheckInItem,
  UpcomingCheckOutItem,
  PendingComplaintItem,
} from "@/data/insightsData";
import {
  UserCheck,
  UserX,
  AlertTriangle,
  ArrowRight,
  Clock,
  Building2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OperationsWidgetsProps {
  checkIns: UpcomingCheckInItem[];
  checkOuts: UpcomingCheckOutItem[];
  complaints: PendingComplaintItem[];
}

export function OperationsWidgets({
  checkIns,
  checkOuts,
  complaints,
}: OperationsWidgetsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Upcoming Check-ins */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl p-4 border border-slate-200/80 dark:border-[#222E42] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-[#1E2638]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200/60 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-brand-charcoal dark:text-white">
                Upcoming Check-ins
              </h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200/60 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
              {checkIns.length} Scheduled
            </span>
          </div>

          <div className="space-y-2.5">
            {checkIns.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#151D2A] border border-slate-200/60 dark:border-[#222E42] flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-brand-charcoal dark:text-white truncate">
                    {item.tenantName}
                  </p>
                  <p className="text-[10px] text-brand-muted dark:text-slate-300 truncate">
                    {item.roomBed} • {item.propertyName}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] block">
                    {item.checkInDate}
                  </span>
                  <span className="text-[9px] text-brand-muted dark:text-slate-400">
                    {item.daysRemaining}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/owner/bookings"
          className="pt-2.5 mt-2 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300"
        >
          <span>Review All Check-ins</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Upcoming Check-outs */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl p-4 border border-slate-200/80 dark:border-[#222E42] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-[#1E2638]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 border border-blue-200/60 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UserX className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-brand-charcoal dark:text-white">
                Upcoming Check-outs
              </h4>
            </div>
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15 border border-blue-200/60 dark:border-blue-500/30 px-2 py-0.5 rounded-full">
              {checkOuts.length} Notices
            </span>
          </div>

          <div className="space-y-2.5">
            {checkOuts.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#151D2A] border border-slate-200/60 dark:border-[#222E42] flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-brand-charcoal dark:text-white truncate">
                    {item.tenantName}
                  </p>
                  <p className="text-[10px] text-brand-muted dark:text-slate-300 truncate">
                    {item.roomBed} • {item.propertyName}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-brand-charcoal dark:text-white text-[11px] block">
                    {item.checkOutDate}
                  </span>
                  <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
                    {item.noticeDaysRemaining}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/owner/tenants"
          className="pt-2.5 mt-2 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300"
        >
          <span>Manage Vacancies & Inspections</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3. Pending Complaints */}
      <div className="bg-white dark:bg-[#111622] rounded-2xl p-4 border border-slate-200/80 dark:border-[#222E42] shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-[#1E2638]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/15 border border-amber-200/60 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-brand-charcoal dark:text-white">
                Pending Complaints
              </h4>
            </div>
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 border border-amber-200/60 dark:border-amber-500/30 px-2 py-0.5 rounded-full">
              {complaints.length} Open Tickets
            </span>
          </div>

          <div className="space-y-2.5">
            {complaints.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#151D2A] border border-slate-200/60 dark:border-[#222E42] flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-brand-charcoal dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-brand-muted dark:text-slate-300 truncate">
                    {item.tenantName} • {item.roomNumber}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider block",
                      item.priority === "high"
                        ? "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
                        : "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
                    )}
                  >
                    {item.priority} Priority
                  </span>
                  <span className="text-[9px] text-brand-muted dark:text-slate-400">
                    {item.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/owner/complaints"
          className="pt-2.5 mt-2 border-t border-slate-100 dark:border-[#1E2638] flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300"
        >
          <span>Open Ticket Resolver</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
