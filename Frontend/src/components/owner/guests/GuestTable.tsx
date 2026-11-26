"use client";

import React from "react";
import { Guest } from "@/types/guest";
import {
  Calendar,
  Phone,
  Eye,
  Edit,
  LogOut,
  Trash2,
  ShieldCheck,
  Clock,
  UserX,
  Plus,
  ChevronLeft,
  ChevronRight,
  BedDouble,
} from "lucide-react";

interface GuestTableProps {
  guests: Guest[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onView: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onCheckout: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
  onAddGuest: () => void;
  onResetFilters?: () => void;
}

export function GuestTable({
  guests,
  totalCount,
  currentPage,
  totalPages,
  itemsPerPage = 10,
  onPageChange,
  onView,
  onEdit,
  onCheckout,
  onDelete,
  onAddGuest,
  onResetFilters,
}: GuestTableProps) {
  if (totalCount === 0) {
    return (
      <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] flex items-center justify-center mx-auto mb-4 text-brand-muted dark:text-slate-400">
          <UserX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-brand-charcoal dark:text-white mb-1">
          No residents found
        </h3>
        <p className="text-xs text-brand-muted dark:text-slate-400 max-w-sm mx-auto mb-5">
          No resident records matched your selected search query or filters for this property.
        </p>
        <div className="flex items-center justify-center gap-3">
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-4 py-2 text-xs font-bold bg-[#F8FAFC] dark:bg-[#151D2A] hover:bg-black/5 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-white border border-brand-border dark:border-[#263346] rounded-xl transition-all"
            >
              Reset Filters
            </button>
          )}
          <button
            type="button"
            onClick={onAddGuest}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-brand-obsidian dark:bg-brand-lime text-white dark:text-brand-obsidian hover:bg-black dark:hover:bg-[#c9ef3b] rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-brand-lime dark:text-brand-obsidian" />
            <span>+ Add Guest</span>
          </button>
        </div>
      </div>
    );
  }

  const getRentBadge = (guest: Guest) => {
    switch (guest.rentStatus) {
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

  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-brand-border dark:border-[#222E42] shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#151D2A] text-[11px] font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">
              <th className="py-3 px-4">Resident Name & Contact</th>
              <th className="py-3 px-4">Room & Bed</th>
              <th className="py-3 px-4">Admission & Stay</th>
              <th className="py-3 px-4">Monthly Rent</th>
              <th className="py-3 px-4">Deposit Held</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60 dark:divide-[#1E2638] text-xs">
            {guests.map((guest) => (
              <tr
                key={guest.id}
                className="hover:bg-[#F8FAFC]/80 dark:hover:bg-[#1E293B]/50 transition-colors group"
              >
                {/* Column 1: Resident Name & Contact (No profile photo / avatar) */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-brand-charcoal dark:text-white text-sm">
                        {guest.name}
                      </span>
                      {guest.gender && (
                        <span className="text-[10px] font-bold text-brand-muted dark:text-slate-400 px-1.5 py-0.2 bg-gray-100 dark:bg-[#1E2638] rounded">
                          {guest.gender[0]}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-brand-muted dark:text-slate-400 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-brand-muted dark:text-slate-400" />
                        {guest.phone}
                      </span>
                      {guest.aadhaarMasked && (
                        <span className="text-[10px] tracking-wider text-brand-muted/80 dark:text-slate-500">
                          · ID: {guest.aadhaarMasked}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Column 2: Room & Bed (Property column removed since scoped to current PG) */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold px-2.5 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] text-brand-charcoal dark:text-slate-200 text-xs">
                      Room {guest.roomNumber}
                    </span>
                    <span className="font-black px-2 py-0.5 rounded-md bg-brand-lime text-brand-obsidian dark:bg-brand-lime/15 dark:text-brand-lime dark:border dark:border-brand-lime/30 text-[11px]">
                      Bed {guest.bedNumber}
                    </span>
                  </div>
                </td>

                {/* Column 3: Admission & Stay */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-brand-charcoal dark:text-slate-200 font-medium">
                      <Calendar className="w-3 h-3 text-brand-muted dark:text-slate-400" />
                      <span>{guest.admissionDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-brand-muted dark:text-slate-400 font-semibold">
                      <Clock className="w-3 h-3 text-brand-lime" />
                      <span>{guest.livingSince}</span>
                    </div>
                    {guest.expectedCheckoutDate && (
                      <span className="inline-block text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 px-1.5 py-0.5 rounded">
                        Notice: {guest.expectedCheckoutDate}
                      </span>
                    )}
                  </div>
                </td>

                {/* Column 4: Monthly Rent */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <span className="font-black text-sm text-brand-charcoal dark:text-white">
                      ₹{guest.monthlyRent.toLocaleString("en-IN")}
                      <span className="text-[10px] text-brand-muted dark:text-slate-400 font-normal">/mo</span>
                    </span>
                    <div>{getRentBadge(guest)}</div>
                  </div>
                </td>

                {/* Column 5: Deposit Held */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 font-bold text-indigo-700 dark:text-purple-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400 flex-shrink-0" />
                      <span>₹{guest.securityDeposit.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-[10px] text-brand-muted dark:text-slate-400">
                      {guest.stayStatus === "checked_out"
                        ? `Refunded: ₹${guest.depositRefunded.toLocaleString("en-IN")}`
                        : "Escrow Liability"}
                    </p>
                  </div>
                </td>

                {/* Column 6: Status */}
                <td className="py-3.5 px-4">
                  <div>{getStayBadge(guest.stayStatus)}</div>
                </td>

                {/* Column 7: Actions (With View, Edit, Checkout, and Delete) */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => onView(guest)}
                      className="p-1.5 rounded-lg text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1E2638] transition-all"
                      title="View Guest Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Info */}
                    <button
                      type="button"
                      onClick={() => onEdit(guest)}
                      className="p-1.5 rounded-lg text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1E2638] transition-all"
                      title="Edit Guest Info"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Check Out (for currently active residents) */}
                    {guest.stayStatus === "active" && (
                      <button
                        type="button"
                        onClick={() => onCheckout(guest)}
                        className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/20 transition-all"
                        title="Check Out Resident"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Resident (Permanently delete left/past guest or cancel record) */}
                    <button
                      type="button"
                      onClick={() => onDelete(guest)}
                      className="p-1.5 rounded-lg text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-all ml-0.5"
                      title="Delete Guest Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Count Footer (10 bookings per page) */}
      <div className="px-4 py-3 bg-[#F8FAFC] dark:bg-[#0D111A] border-t border-brand-border dark:border-[#1E2638] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-muted dark:text-slate-400">
        <div>
          <span>
            Showing <strong className="text-brand-charcoal dark:text-white">{startRecord}</strong> to{" "}
            <strong className="text-brand-charcoal dark:text-white">{endRecord}</strong> of{" "}
            <strong className="text-brand-charcoal dark:text-white">{totalCount}</strong> guest bookings
          </span>
        </div>

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            {/* Previous Page */}
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {/* Page Number Buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    pageNum === currentPage
                      ? "bg-brand-obsidian dark:bg-brand-lime text-brand-lime dark:text-brand-obsidian shadow-xs"
                      : "bg-white dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] text-brand-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-[#1E293B]"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Page */}
            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-brand-border dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-white hover:bg-gray-50 dark:hover:bg-[#1E293B] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
