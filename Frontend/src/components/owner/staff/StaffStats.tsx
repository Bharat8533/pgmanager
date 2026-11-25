"use client";

import React from "react";
import { StaffStatsData } from "@/types/staff";
import { Users, UserCheck, Clock, UserX } from "lucide-react";

interface StaffStatsProps {
  stats: StaffStatsData;
}

export function StaffStats({ stats }: StaffStatsProps) {
  const activePercent =
    stats.totalStaff > 0
      ? Math.round((stats.activeStaff / stats.totalStaff) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* 1. Total Staff */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all group">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md truncate max-w-[100px] sm:max-w-none">
              Total Staff
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-brand-muted font-medium">Workforce</p>
          <p className="text-xl sm:text-3xl font-black text-brand-charcoal tracking-tight mt-0.5 sm:mt-1">
            {stats.totalStaff}
          </p>
        </div>
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-brand-muted flex-wrap gap-1">
          <span className="text-slate-600 font-medium">All properties</span>
          <span className="text-emerald-600 font-bold">{activePercent}% Active</span>
        </div>
      </div>

      {/* 2. Active Staff */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all group">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md truncate max-w-[100px] sm:max-w-none">
              On Duty
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-brand-muted font-medium">Active Staff</p>
          <p className="text-xl sm:text-3xl font-black text-emerald-700 tracking-tight mt-0.5 sm:mt-1">
            {stats.activeStaff}
          </p>
        </div>
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-brand-muted flex-wrap gap-1">
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Working</span>
          </span>
          <span className="text-slate-500">Live roster</span>
        </div>
      </div>

      {/* 3. On Leave */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all group">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md truncate max-w-[100px] sm:max-w-none">
              On Leave
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-brand-muted font-medium">Staff on Leave</p>
          <p className="text-xl sm:text-3xl font-black text-amber-600 tracking-tight mt-0.5 sm:mt-1">
            {stats.onLeaveStaff}
          </p>
        </div>
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-brand-muted flex-wrap gap-1">
          <span className="text-amber-700 font-semibold">Away</span>
          <span className="text-slate-500">Sanctioned</span>
        </div>
      </div>

      {/* 4. Inactive Staff */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all group">
        <div>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md truncate max-w-[100px] sm:max-w-none">
              Inactive
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <UserX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-[11px] sm:text-xs text-brand-muted font-medium">Deactivated</p>
          <p className="text-xl sm:text-3xl font-black text-brand-charcoal tracking-tight mt-0.5 sm:mt-1">
            {stats.inactiveStaff}
          </p>
        </div>
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-brand-muted flex-wrap gap-1">
          <span className="text-rose-700 font-semibold">Ex-Staff</span>
          <span className="text-slate-500">Archived</span>
        </div>
      </div>
    </div>
  );
}
