"use client";

import React from "react";
import { StaffStatsData } from "@/types/staff";
import { Users, UserCheck, Clock, UserX, TrendingUp } from "lucide-react";

interface StaffStatsProps {
  stats: StaffStatsData;
}

export function StaffStats({ stats }: StaffStatsProps) {
  const activePercent =
    stats.totalStaff > 0
      ? Math.round((stats.activeStaff / stats.totalStaff) * 100)
      : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Staff */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
              Total Workforce
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-brand-muted font-medium">Total Staff Members</p>
          <p className="text-xl sm:text-3xl font-black text-brand-charcoal tracking-tight mt-1">
            {stats.totalStaff}
          </p>
        </div>
        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand-muted">
          <span className="text-[11px] font-semibold text-brand-charcoal">All properties</span>
          <span className="text-[10px] text-emerald-600 font-bold">{activePercent}% Active</span>
        </div>
      </div>

      {/* 2. Active Staff */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              On Duty
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-brand-muted font-medium">Active Employees</p>
          <p className="text-xl sm:text-3xl font-black text-emerald-700 tracking-tight mt-1">
            {stats.activeStaff}
          </p>
        </div>
        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand-muted">
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Currently working</span>
          </span>
          <span className="text-[10px] text-brand-muted">Daily operations</span>
        </div>
      </div>

      {/* 3. On Leave */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              Sanctioned Leave
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-brand-muted font-medium">Staff on Leave</p>
          <p className="text-xl sm:text-3xl font-black text-amber-600 tracking-tight mt-1">
            {stats.onLeaveStaff}
          </p>
        </div>
        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand-muted">
          <span className="text-[11px] text-amber-700 font-semibold">Temporary absence</span>
          <span className="text-[10px] text-brand-muted">Returning soon</span>
        </div>
      </div>

      {/* 4. Inactive Staff */}
      <div className="bg-white rounded-2xl border border-brand-border/80 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
              Deactivated
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-brand-muted font-medium">Inactive Staff</p>
          <p className="text-xl sm:text-3xl font-black text-brand-charcoal tracking-tight mt-1">
            {stats.inactiveStaff}
          </p>
        </div>
        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-brand-muted">
          <span className="text-[11px] text-rose-700 font-semibold">Resigned / Ex-staff</span>
          <span className="text-[10px] text-brand-muted">Archived record</span>
        </div>
      </div>
    </div>
  );
}
