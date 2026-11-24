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
      <div className="bg-white rounded-2xl border border-brand-border p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-brand-border flex items-center justify-center mx-auto mb-4 text-brand-muted">
          <UserX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-brand-charcoal mb-1">
          No residents found
        </h3>
        <p className="text-xs text-brand-muted max-w-sm mx-auto mb-5">
          No resident records matched your selected search query or filters for this property.
        </p>
        <div className="flex items-center justify-center gap-3">
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-4 py-2 text-xs font-bold bg-[#F8FAFC] hover:bg-black/5 text-brand-charcoal border border-brand-border rounded-xl transition-all"
            >
              Reset Filters
            </button>
          )}
          <button
            type="button"
            onClick={onAddGuest}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-brand-obsidian text-white hover:bg-black rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-brand-lime" />
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

  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              <th className="py-3 px-4">Resident Name & Contact</th>
              <th className="py-3 px-4">Room & Bed</th>
              <th className="py-3 px-4">Admission & Stay</th>
              <th className="py-3 px-4">Monthly Rent</th>
              <th className="py-3 px-4">Deposit Held</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60 text-xs">
            {guests.map((guest) => (
              <tr
                key={guest.id}
                className="hover:bg-[#F8FAFC]/80 transition-colors group"
              >
                {/* Column 1: Resident Name & Contact (No profile photo / avatar) */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-brand-charcoal text-sm">
                        {guest.name}
                      </span>
                      {guest.gender && (
                        <span className="text-[10px] font-bold text-brand-muted px-1.5 py-0.2 bg-gray-100 rounded">
                          {guest.gender[0]}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-brand-muted flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-brand-muted" />
                        {guest.phone}
                      </span>
                      {guest.aadhaarMasked && (
                        <span className="text-[10px] tracking-wider text-brand-muted/80">
                          · ID: {guest.aadhaarMasked}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Column 2: Room & Bed (Property column removed since scoped to current PG) */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-brand-border text-brand-charcoal text-xs">
                      Room {guest.roomNumber}
                    </span>
                    <span className="font-black px-2 py-0.5 rounded-md bg-brand-lime text-brand-obsidian text-[11px]">
                      Bed {guest.bedNumber}
                    </span>
                  </div>
                </td>

                {/* Column 3: Admission & Stay */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-brand-charcoal font-medium">
                      <Calendar className="w-3 h-3 text-brand-muted" />
                      <span>{guest.admissionDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-brand-muted font-semibold">
                      <Clock className="w-3 h-3 text-brand-lime" />
                      <span>{guest.livingSince}</span>
                    </div>
                    {guest.expectedCheckoutDate && (
                      <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                        Notice: {guest.expectedCheckoutDate}
                      </span>
                    )}
                  </div>
                </td>

                {/* Column 4: Monthly Rent */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1">
                    <span className="font-black text-sm text-brand-charcoal">
                      ₹{guest.monthlyRent.toLocaleString("en-IN")}
                      <span className="text-[10px] text-brand-muted font-normal">/mo</span>
                    </span>
                    <div>{getRentBadge(guest)}</div>
                  </div>
                </td>

                {/* Column 5: Deposit Held */}
                <td className="py-3.5 px-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 font-bold text-indigo-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span>₹{guest.securityDeposit.toLocaleString("en-IN")}</span>
                    </div>
                    <p className="text-[10px] text-brand-muted">
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
                      className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-black/5 transition-all"
                      title="View Guest Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Info */}
                    <button
                      type="button"
                      onClick={() => onEdit(guest)}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-black/5 transition-all"
                      title="Edit Guest Info"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Check Out (for currently active residents) */}
                    {guest.stayStatus === "active" && (
                      <button
                        type="button"
                        onClick={() => onCheckout(guest)}
                        className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
                        title="Check Out Resident"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Resident (Permanently delete left/past guest or cancel record) */}
                    <button
                      type="button"
                      onClick={() => onDelete(guest)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-all ml-0.5"
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
      <div className="px-4 py-3 bg-[#F8FAFC] border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-muted">
        <div>
          <span>
            Showing <strong className="text-brand-charcoal">{startRecord}</strong> to{" "}
            <strong className="text-brand-charcoal">{endRecord}</strong> of{" "}
            <strong className="text-brand-charcoal">{totalCount}</strong> guest bookings
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-brand-border bg-white text-brand-charcoal hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
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
                      ? "bg-brand-obsidian text-brand-lime shadow-xs"
                      : "bg-white border border-brand-border text-brand-charcoal hover:bg-gray-50"
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
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-brand-border bg-white text-brand-charcoal hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
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
