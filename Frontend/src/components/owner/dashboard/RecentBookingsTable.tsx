"use client";

import React from "react";
import Link from "next/link";
import { RecentBookingRecord } from "@/data/bookingsData";
import {
  CalendarCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentBookingsTableProps {
  bookings: RecentBookingRecord[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  const getStatusBadge = (status: RecentBookingRecord["status"]) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Confirmed</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Token</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/70 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-[#222E42] shadow-xs flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1E2638]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 border border-blue-200/60 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-charcoal dark:text-white tracking-tight">
              Recent Bookings & Reservations
            </h3>
          </div>
          <p className="text-xs text-brand-muted dark:text-slate-300 mt-0.5">
            Upcoming admissions, room holds, and token deposits
          </p>
        </div>

        <Link
          href="/owner/bookings"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group flex-shrink-0 self-start sm:self-auto"
        >
          <span>View All Bookings</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Mobile Card List (Visible on mobile screens < md) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {bookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-brand-muted px-4">
            No bookings found for the selected property.
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="p-3.5 space-y-2.5 hover:bg-slate-50/60 dark:hover:bg-[#18212D] transition-colors rounded-xl">
              {/* Tenant Row + Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                    {booking.avatarInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-brand-charcoal text-xs truncate">
                      {booking.tenantName}
                    </p>
                    <p className="text-[10px] text-brand-muted truncate">
                      {booking.tenantPhone}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              {/* Property & Room */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-brand-muted text-[11px] min-w-0 truncate">
                  <Building2 className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" />
                  <span className="truncate">{booking.propertyName}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold flex-shrink-0">
                  {booking.roomBed}
                </span>
              </div>

              {/* Dates & Amounts */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-100 text-[11px]">
                <div>
                  <span className="text-[10px] text-brand-muted block">Check-in Date</span>
                  <span className="font-bold text-brand-charcoal">{booking.checkInDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-muted block">Rent / Advance</span>
                  <span className="font-extrabold text-brand-charcoal">{formatINR(booking.bookingAmount)}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Paid: {formatINR(booking.advancePaid)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (Visible on >= md screens) */}
      <div className="hidden md:block overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="bg-slate-100 dark:bg-[#151D2A] text-[10px] uppercase font-bold text-brand-muted dark:text-slate-300 tracking-wider">
              <th className="py-2.5 px-4">Tenant</th>
              <th className="py-2.5 px-4">Property</th>
              <th className="py-2.5 px-4">Room / Bed</th>
              <th className="py-2.5 px-4">Booking Date</th>
              <th className="py-2.5 px-4">Check-in Date</th>
              <th className="py-2.5 px-4 text-right">Rent / Advance</th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638] text-xs">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-brand-muted">
                  No bookings found for the selected property.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-[#1A2332] transition-colors border-0"
                >
                  {/* Tenant */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                        {booking.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-brand-charcoal truncate">
                          {booking.tenantName}
                        </p>
                        <p className="text-[10px] text-brand-muted truncate">
                          {booking.tenantPhone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Property */}
                  <td className="py-3 px-4 text-brand-charcoal font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" />
                      <span className="truncate">{booking.propertyName}</span>
                    </div>
                  </td>

                  {/* Room / Bed */}
                  <td className="py-3 px-4 font-semibold text-brand-charcoal whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px]">
                      {booking.roomBed}
                    </span>
                  </td>

                  {/* Booking Date */}
                  <td className="py-3 px-4 text-brand-muted whitespace-nowrap">
                    {booking.bookingDate}
                  </td>

                  {/* Check-in Date */}
                  <td className="py-3 px-4 font-bold text-brand-charcoal whitespace-nowrap">
                    {booking.checkInDate}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <p className="font-extrabold text-brand-charcoal">
                      {formatINR(booking.bookingAmount)}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold">
                      Paid: {formatINR(booking.advancePaid)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count indicator */}
      <div className="p-3 bg-slate-100 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-brand-muted">
        <span>Showing latest {bookings.length} reservations</span>
        <span className="font-medium text-brand-charcoal">
          Tokens deposited directly into operating account
        </span>
      </div>
    </div>
  );
}
