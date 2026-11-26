"use client";

import React from "react";
import { Guest } from "@/types/guest";
import {
  BedDouble,
  Calendar,
  Phone,
  Eye,
  Edit,
  LogOut,
  Trash2,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface GuestCardProps {
  guest: Guest;
  onView: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onCheckout: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
}

export function GuestCard({
  guest,
  onView,
  onEdit,
  onCheckout,
  onDelete,
}: GuestCardProps) {
  const getRentBadge = (status: Guest["rentStatus"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending (₹{guest.pendingAmount.toLocaleString("en-IN")})
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Overdue (₹{guest.pendingAmount.toLocaleString("en-IN")})
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Partial (₹{guest.pendingAmount.toLocaleString("en-IN")} due)
          </span>
        );
    }
  };

  const getStayBadge = (status: Guest["stayStatus"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            Living in PG
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            Upcoming Move-In
          </span>
        );
      case "checked_out":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Checked Out
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] p-4 shadow-2xs hover:shadow-xs transition-all space-y-3">
      {/* Top Header: Resident Name (No profile image) + Stay Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-brand-charcoal dark:text-white truncate">
              {guest.name}
            </h4>
            {guest.gender && (
              <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 px-1.5 py-0.2 bg-gray-100 dark:bg-[#1E2638] rounded">
                {guest.gender[0]}
              </span>
            )}
          </div>
          <p className="text-xs text-brand-muted dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{guest.phone}</span>
          </p>
          {guest.aadhaarMasked && (
            <p className="text-[10px] text-brand-muted/80 dark:text-slate-500 tracking-wider">
              ID: {guest.aadhaarMasked}
            </p>
          )}
        </div>

        <div>{getStayBadge(guest.stayStatus)}</div>
      </div>

      {/* Room & Bed Allocation */}
      <div className="bg-[#F8FAFC] dark:bg-[#151D2A] rounded-xl p-2.5 border border-brand-border/60 dark:border-[#263346] text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-brand-muted dark:text-slate-400 font-medium">Room Allocation:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white dark:bg-[#111622] border border-brand-border dark:border-[#263346] text-brand-charcoal dark:text-white">
              Room {guest.roomNumber}
            </span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-brand-lime text-brand-obsidian dark:bg-brand-lime/15 dark:text-brand-lime dark:border dark:border-brand-lime/30">
              Bed {guest.bedNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-brand-muted dark:text-slate-400 pt-1 border-t border-brand-border/40 dark:border-[#1E2638]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand-muted dark:text-slate-400 flex-shrink-0" />
            <span>Admitted: {guest.admissionDate}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-brand-charcoal dark:text-white">
            <Clock className="w-3 h-3 text-brand-lime" />
            <span>{guest.livingSince}</span>
          </div>
        </div>

        {guest.expectedCheckoutDate && (
          <div className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded-md font-semibold flex items-center justify-between">
            <span>Notice Date:</span>
            <span>Check-out {guest.expectedCheckoutDate}</span>
          </div>
        )}
      </div>

      {/* Financial row */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div>
          <p className="text-[10px] uppercase font-bold text-brand-muted dark:text-slate-400 tracking-wider">
            Monthly Rent
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm font-black text-brand-charcoal dark:text-white">
              ₹{guest.monthlyRent.toLocaleString("en-IN")}
            </span>
            {getRentBadge(guest.rentStatus)}
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-brand-muted dark:text-slate-400 tracking-wider flex items-center justify-end gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-purple-400" />
            <span>Deposit Held</span>
          </p>
          <p className="text-xs font-bold text-indigo-700 dark:text-purple-300 mt-0.5">
            ₹{guest.securityDeposit.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Card Actions Footer (View, Edit, Checkout, and Delete) */}
      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-brand-border/60 dark:border-[#1E2638]">
        <button
          type="button"
          onClick={() => onView(guest)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold bg-[#F8FAFC] dark:bg-[#151D2A] hover:bg-black/5 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-white border border-brand-border dark:border-[#263346] rounded-xl transition-all shadow-2xs"
        >
          <Eye className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
          <span>Details</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(guest)}
          className="p-2 text-xs font-bold bg-[#F8FAFC] dark:bg-[#151D2A] hover:bg-black/5 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-white border border-brand-border dark:border-[#263346] rounded-xl transition-all shadow-2xs"
          title="Edit Resident"
        >
          <Edit className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
        </button>

        {guest.stayStatus === "active" && (
          <button
            type="button"
            onClick={() => onCheckout(guest)}
            className="p-2 text-xs font-bold bg-amber-50 dark:bg-amber-500/15 hover:bg-amber-100 dark:hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded-xl transition-all shadow-2xs"
            title="Check Out Resident"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(guest)}
          className="p-2 text-xs font-bold bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 rounded-xl transition-all shadow-2xs"
          title="Delete Resident Record"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
        </button>
      </div>
    </div>
  );
}
