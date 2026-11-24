"use client";

import React, { useState, useMemo } from "react";
import { useRoom } from "@/contexts/RoomContext";
import { useOwner } from "@/contexts/OwnerContext";
import {
  Guest,
  GuestSummaryStats,
  GuestFiltersState,
  AddGuestPayload,
  StayStatus,
  RentStatus,
} from "@/types/guest";
import { GuestStats } from "@/components/owner/guests/GuestStats";
import { GuestFilters } from "@/components/owner/guests/GuestFilters";
import { GuestTable } from "@/components/owner/guests/GuestTable";
import { GuestCard } from "@/components/owner/guests/GuestCard";
import { GuestDetailsDrawer } from "@/components/owner/guests/GuestDetailsDrawer";
import { GuestFormModal } from "@/components/owner/guests/GuestFormModal";
import {
  Plus,
  Users,
  AlertCircle,
  CheckCircle2,
  X,
  LogOut,
  Trash2,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function BookingsAndResidentsPage() {
  const {
    guests,
    rooms,
    allBeds,
    addGuest,
    updateGuest,
    checkoutGuest,
    deleteGuest,
  } = useRoom();

  const { selectedProperty } = useOwner();
  const currentPropertyId = selectedProperty?.id || "prop-1";
  const currentPropertyName = selectedProperty?.name || "StayManage Residency";

  // Active Toast Notification State
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Drawer & Modal States
  const [selectedGuestForDetails, setSelectedGuestForDetails] = useState<Guest | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const [formModalMode, setFormModalMode] = useState<"add" | "edit">("add");
  const [selectedGuestForEdit, setSelectedGuestForEdit] = useState<Guest | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Checkout Confirmation Modal State
  const [guestToCheckout, setGuestToCheckout] = useState<Guest | null>(null);
  const [checkoutDate, setCheckoutDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [depositDeductions, setDepositDeductions] = useState<number>(0);
  const [checkoutNotes, setCheckoutNotes] = useState("");

  // Delete Confirmation Modal State
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);

  // Pagination State (10 records per page)
  const [currentPage, setCurrentPage] = useState(1);

  // Filters State (Property is strictly current property!)
  const [filters, setFilters] = useState<GuestFiltersState>({
    searchQuery: "",
    propertyId: currentPropertyId,
    stayStatus: "all",
    rentStatus: "all",
    sortBy: "admission_desc",
  });

  const handleFilterChange = (updated: Partial<GuestFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      propertyId: currentPropertyId,
      stayStatus: "all",
      rentStatus: "all",
      sortBy: "admission_desc",
    });
    setCurrentPage(1);
  };

  // Strictly scope guests to current selected property
  const currentPropertyGuests = useMemo(() => {
    return guests.filter((g) => g.propertyId === currentPropertyId);
  }, [guests, currentPropertyId]);

  // Dynamic 6 Metric Statistics Calculation for current property
  const stats: GuestSummaryStats = useMemo(() => {
    const totalGuests = currentPropertyGuests.length;
    const currentlyLiving = currentPropertyGuests.filter(
      (g) => g.stayStatus === "active"
    ).length;
    const upcomingCheckouts = currentPropertyGuests.filter(
      (g) => g.stayStatus === "active" && !!g.expectedCheckoutDate
    ).length;
    const checkedOutGuests = currentPropertyGuests.filter(
      (g) => g.stayStatus === "checked_out"
    ).length;
    const pendingRent = currentPropertyGuests.reduce(
      (sum, g) => sum + g.pendingAmount,
      0
    );
    const securityDepositsHeld = currentPropertyGuests.reduce((sum, g) => {
      if (g.stayStatus !== "checked_out") {
        return sum + g.depositBalance;
      }
      return sum;
    }, 0);

    return {
      totalGuests,
      currentlyLiving,
      upcomingCheckouts,
      checkedOutGuests,
      pendingRent,
      securityDepositsHeld,
    };
  }, [currentPropertyGuests]);

  // Status Tab Counts for current property
  const counts = useMemo(() => {
    const all = currentPropertyGuests.length;
    const active = currentPropertyGuests.filter((g) => g.stayStatus === "active").length;
    const upcoming = currentPropertyGuests.filter((g) => g.stayStatus === "upcoming").length;
    const checked_out = currentPropertyGuests.filter(
      (g) => g.stayStatus === "checked_out"
    ).length;
    return { all, active, upcoming, checked_out };
  }, [currentPropertyGuests]);

  // Filtered & Sorted Guests
  const filteredGuests = useMemo(() => {
    let result = [...currentPropertyGuests];

    // Search Query (name, phone, room, email)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.phone.includes(q) ||
          g.roomNumber.toLowerCase().includes(q) ||
          g.bedNumber.toLowerCase().includes(q) ||
          (g.email && g.email.toLowerCase().includes(q))
      );
    }

    // Stay Status Pill Filter
    if (filters.stayStatus !== "all") {
      result = result.filter((g) => g.stayStatus === filters.stayStatus);
    }

    // Rent Status Filter
    if (filters.rentStatus !== "all") {
      result = result.filter((g) => g.rentStatus === filters.rentStatus);
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "admission_desc":
          return b.admissionDate.localeCompare(a.admissionDate);
        case "admission_asc":
          return a.admissionDate.localeCompare(b.admissionDate);
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "pending_desc":
          return b.pendingAmount - a.pendingAmount;
        case "checkout_asc": {
          const dateA = a.expectedCheckoutDate || "9999-12-31";
          const dateB = b.expectedCheckoutDate || "9999-12-31";
          return dateA.localeCompare(dateB);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [currentPropertyGuests, filters]);

  // Pagination calculations (10 per page)
  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE) || 1;
  const paginatedGuests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGuests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredGuests, currentPage]);

  // Modal Handlers
  const handleOpenAdd = () => {
    setFormModalMode("add");
    setSelectedGuestForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (guest: Guest) => {
    setFormModalMode("edit");
    setSelectedGuestForEdit(guest);
    setIsFormModalOpen(true);
  };

  const handleOpenDetails = (guest: Guest) => {
    setSelectedGuestForDetails(guest);
    setIsDetailsDrawerOpen(true);
  };

  const handleOpenCheckout = (guest: Guest) => {
    setGuestToCheckout(guest);
    setCheckoutDate(new Date().toISOString().split("T")[0]);
    setDepositDeductions(0);
    setCheckoutNotes("");
  };

  const handleOpenDelete = (guest: Guest) => {
    setGuestToDelete(guest);
  };

  const handleConfirmDelete = () => {
    if (!guestToDelete) return;
    const res = deleteGuest(guestToDelete.id);
    if (res.success) {
      showToast(
        `Resident record for ${guestToDelete.name} deleted successfully from database.`,
        "success"
      );
      setGuestToDelete(null);
      // If current page is empty after deletion, move back one page
      if (paginatedGuests.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      showToast(res.error || "Failed to delete resident record.", "error");
    }
  };

  const handleFormSubmit = (payload: AddGuestPayload) => {
    if (formModalMode === "add") {
      const res = addGuest(payload);
      if (res.success && res.guest) {
        showToast(
          `Resident ${res.guest.name} admitted successfully to Room ${res.guest.roomNumber} (Bed ${res.guest.bedNumber}).`,
          "success"
        );
        return { success: true };
      }
      return { success: false, error: res.error };
    } else if (selectedGuestForEdit) {
      const res = updateGuest(selectedGuestForEdit.id, payload);
      if (res.success && res.guest) {
        showToast(`Resident record for ${res.guest.name} updated.`, "success");
        return { success: true };
      }
      return { success: false, error: res.error };
    }
    return { success: false, error: "Action could not be completed." };
  };

  const handleConfirmCheckout = () => {
    if (!guestToCheckout) return;

    const netRefund = Math.max(
      0,
      guestToCheckout.securityDeposit - depositDeductions
    );

    const res = checkoutGuest(
      guestToCheckout.id,
      checkoutDate,
      netRefund,
      depositDeductions,
      checkoutNotes
    );

    if (res.success) {
      showToast(
        `Resident ${guestToCheckout.name} checked out. Bed ${guestToCheckout.bedNumber} is now available.`,
        "success"
      );
      setGuestToCheckout(null);
    } else {
      showToast(res.error || "Failed to check out resident.", "error");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border transition-all animate-slideIn ${
            toast.type === "success"
              ? "bg-brand-obsidian text-brand-lime border-brand-lime/30"
              : "bg-rose-900 text-white border-rose-700"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-brand-lime" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
              Bookings & Residents
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-lime text-brand-obsidian shadow-2xs">
              Live Registry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-brand-obsidian flex-shrink-0" />
            <span>Showing resident records for <strong>{currentPropertyName}</strong></span>
          </p>
        </div>

        {/* Top-Right CTA: + Add Guest */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-obsidian text-white font-bold text-xs sm:text-sm hover:bg-black transition-all shadow-xs hover:shadow hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-brand-lime" />
            <span>+ Add Guest</span>
          </button>
        </div>
      </div>

      {/* 6 Overview Statistics (Scoped to Active Property) */}
      <GuestStats
        stats={stats}
        selectedPropertyName={currentPropertyName}
      />

      {/* Search & Status Filter Pills (No Property Dropdown per user instruction) */}
      <GuestFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        counts={counts}
      />

      {/* Desktop View: Interactive Table (10 records per page) */}
      <div className="hidden lg:block">
        <GuestTable
          guests={paginatedGuests}
          totalCount={filteredGuests.length}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onView={handleOpenDetails}
          onEdit={handleOpenEdit}
          onCheckout={handleOpenCheckout}
          onDelete={handleOpenDelete}
          onAddGuest={handleOpenAdd}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Mobile & Tablet View: Rich Cards (With Pagination) */}
      <div className="lg:hidden space-y-4">
        {filteredGuests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-8 text-center shadow-xs">
            <Users className="w-8 h-8 text-brand-muted mx-auto mb-2" />
            <h4 className="text-sm font-bold text-brand-charcoal">
              No residents found
            </h4>
            <p className="text-xs text-brand-muted mt-1 mb-4">
              Try adjusting your search query or status filters.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 text-xs font-bold bg-brand-obsidian text-white rounded-xl shadow-xs"
            >
              + Add Guest
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {paginatedGuests.map((guest) => (
                <GuestCard
                  key={guest.id}
                  guest={guest}
                  onView={handleOpenDetails}
                  onEdit={handleOpenEdit}
                  onCheckout={handleOpenCheckout}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>

            {/* Mobile Pagination Bar */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl border border-brand-border p-3 flex items-center justify-between text-xs text-brand-muted shadow-xs">
                <span>
                  Page {currentPage} of {totalPages} ({filteredGuests.length} total)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 rounded-lg border border-brand-border bg-[#F8FAFC] disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg border border-brand-border bg-[#F8FAFC] disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Slide-over Guest Details Drawer */}
      <GuestDetailsDrawer
        guest={selectedGuestForDetails}
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        onEdit={handleOpenEdit}
        onCheckout={handleOpenCheckout}
      />

      {/* Add / Edit Guest Form Modal (Automatically Scoped to Active Property) */}
      <GuestFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        mode={formModalMode}
        initialGuest={selectedGuestForEdit}
        activeProperty={selectedProperty}
        rooms={rooms}
        allBeds={allBeds}
      />

      {/* Checkout Confirmation Modal */}
      {guestToCheckout && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-border space-y-4 animate-slideIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-charcoal">
                    Check Out Resident
                  </h3>
                  <p className="text-xs text-brand-muted">
                    {guestToCheckout.name} · Room {guestToCheckout.roomNumber} ({guestToCheckout.bedNumber})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGuestToCheckout(null)}
                className="text-brand-muted hover:text-brand-charcoal p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning if rent is pending */}
            {guestToCheckout.pendingAmount > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-semibold text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Notice: Resident has outstanding rent of ₹
                  {guestToCheckout.pendingAmount.toLocaleString("en-IN")}. Please collect dues before settling deposit.
                </span>
              </div>
            )}

            {/* Escrow Settlement Details */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-brand-border p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">Security Deposit Held:</span>
                <span className="font-black text-indigo-700 text-sm">
                  ₹{guestToCheckout.securityDeposit.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <label className="block text-brand-charcoal font-semibold mb-1">
                  Deductions / Damage Adjustments (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={depositDeductions}
                  onChange={(e) => setDepositDeductions(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white border border-brand-border rounded-xl font-bold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-lime"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-brand-border/60">
                <span className="font-bold text-brand-charcoal">
                  Net Refund to Resident:
                </span>
                <span className="text-base font-black text-emerald-700">
                  ₹
                  {Math.max(
                    0,
                    guestToCheckout.securityDeposit - depositDeductions
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Actual Checkout Date */}
            <div className="text-xs">
              <label className="block text-brand-charcoal font-semibold mb-1">
                Actual Check-out Date
              </label>
              <input
                type="date"
                value={checkoutDate}
                onChange={(e) => setCheckoutDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-brand-border rounded-xl text-xs font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-lime"
              />
            </div>

            {/* Remarks */}
            <div className="text-xs">
              <label className="block text-brand-charcoal font-semibold mb-1">
                Settlement & Inspection Notes
              </label>
              <textarea
                rows={2}
                value={checkoutNotes}
                onChange={(e) => setCheckoutNotes(e.target.value)}
                placeholder="e.g. Keys handed over. Room inspected. Deposit refunded via UPI."
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-brand-border rounded-xl text-xs text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-lime"
              />
            </div>

            <p className="text-[11px] text-brand-muted">
              * Checking out will release Bed {guestToCheckout.bedNumber} back to available inventory and archive the stay record permanently in their history.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setGuestToCheckout(null)}
                className="px-4 py-2 text-xs font-bold bg-[#F8FAFC] hover:bg-black/5 text-brand-charcoal border border-brand-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckout}
                className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-xs"
              >
                Confirm Check Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Resident Confirmation Modal */}
      {guestToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-border space-y-4 animate-slideIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-brand-charcoal">
                    Delete Resident Record
                  </h3>
                  <p className="text-xs text-brand-muted">
                    {guestToDelete.name} ({guestToDelete.stayStatus === "checked_out" ? "Left Guest" : "Active Resident"})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGuestToDelete(null)}
                className="text-brand-muted hover:text-brand-charcoal p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200/80 text-xs text-rose-900 space-y-1.5">
              <p className="font-bold">Are you sure you want to permanently delete this record?</p>
              <p className="text-[11px] text-rose-800/90 leading-relaxed">
                This will completely remove <strong>{guestToDelete.name}</strong> from your PG database. All stay histories, admission logs, and financial records associated with this resident will be deleted.
                {guestToDelete.stayStatus === "active" && (
                  <span className="block mt-1 font-semibold text-rose-950">
                    * Their assigned bed ({guestToDelete.bedNumber}) will be automatically released back to available inventory.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setGuestToDelete(null)}
                className="px-4 py-2 text-xs font-bold bg-[#F8FAFC] hover:bg-black/5 text-brand-charcoal border border-brand-border rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
