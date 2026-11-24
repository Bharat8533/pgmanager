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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending (₹{guest.pendingAmount.toLocaleString("en-IN")})
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Overdue (₹{guest.pendingAmount.toLocaleString("en-IN")})
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
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
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
            Living in PG
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-800">
            Upcoming Move-In
          </span>
        );
      case "checked_out":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gray-100 text-gray-700">
            Checked Out
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-xs hover:shadow-sm transition-all space-y-3">
      {/* Top Header: Resident Name (No profile image) + Stay Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-brand-charcoal truncate">
              {guest.name}
            </h4>
            {guest.gender && (
              <span className="text-[10px] font-bold text-brand-muted px-1.5 py-0.2 bg-gray-100 rounded">
                {guest.gender[0]}
              </span>
            )}
          </div>
          <p className="text-xs text-brand-muted flex items-center gap-1 mt-0.5 truncate">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{guest.phone}</span>
          </p>
          {guest.aadhaarMasked && (
            <p className="text-[10px] text-brand-muted/80 tracking-wider">
              ID: {guest.aadhaarMasked}
            </p>
          )}
        </div>

        <div>{getStayBadge(guest.stayStatus)}</div>
      </div>

      {/* Room & Bed Allocation */}
      <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-brand-border/60 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-brand-muted font-medium">Room Allocation:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-brand-border text-brand-charcoal">
              Room {guest.roomNumber}
            </span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-brand-lime text-brand-obsidian">
              Bed {guest.bedNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-brand-muted pt-1 border-t border-brand-border/40">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand-muted flex-shrink-0" />
            <span>Admitted: {guest.admissionDate}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-brand-charcoal">
            <Clock className="w-3 h-3 text-brand-lime" />
            <span>{guest.livingSince}</span>
          </div>
        </div>

        {guest.expectedCheckoutDate && (
          <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold flex items-center justify-between">
            <span>Notice Date:</span>
            <span>Check-out {guest.expectedCheckoutDate}</span>
          </div>
        )}
      </div>

      {/* Financial row */}
      <div className="flex items-center justify-between text-xs pt-1">
        <div>
          <p className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
            Monthly Rent
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm font-black text-brand-charcoal">
              ₹{guest.monthlyRent.toLocaleString("en-IN")}
            </span>
            {getRentBadge(guest.rentStatus)}
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-brand-muted tracking-wider flex items-center justify-end gap-1">
            <ShieldCheck className="w-3 h-3 text-indigo-600" />
            <span>Deposit Held</span>
          </p>
          <p className="text-xs font-bold text-indigo-700 mt-0.5">
            ₹{guest.securityDeposit.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Card Actions Footer (View, Edit, Checkout, and Delete) */}
      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-brand-border/60">
        <button
          type="button"
          onClick={() => onView(guest)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold bg-[#F8FAFC] hover:bg-black/5 text-brand-charcoal border border-brand-border rounded-xl transition-all"
        >
          <Eye className="w-3.5 h-3.5 text-brand-muted" />
          <span>Details</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(guest)}
          className="p-2 text-xs font-bold bg-[#F8FAFC] hover:bg-black/5 text-brand-charcoal border border-brand-border rounded-xl transition-all"
          title="Edit Resident"
        >
          <Edit className="w-3.5 h-3.5 text-brand-muted" />
        </button>

        {guest.stayStatus === "active" && (
          <button
            type="button"
            onClick={() => onCheckout(guest)}
            className="p-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl transition-all"
            title="Check Out Resident"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-600" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(guest)}
          className="p-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-all"
          title="Delete Resident Record"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
        </button>
      </div>
    </div>
  );
}
