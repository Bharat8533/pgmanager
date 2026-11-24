"use client";

import React, { useState } from "react";
import { Room, BookingStatus } from "@/types/room";
import { useRoom } from "@/contexts/RoomContext";
import { getRoomAmenityIcon } from "@/components/rooms/RoomCard";
import {
  X,
  BedDouble,
  Users,
  CheckCircle2,
  Clock,
  Wrench,
  CreditCard,
  ShieldCheck,
  CalendarCheck,
  AlertCircle,
  Eye,
  Edit,
  DoorClosed,
  Search,
  Filter,
  IndianRupee,
  Calendar,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomDetailsDrawerProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onEditRoom: (room: Room) => void;
  onSelectResident: (residentId: string) => void;
}

export function RoomDetailsDrawer({
  room,
  isOpen,
  onClose,
  onEditRoom,
  onSelectResident,
}: RoomDetailsDrawerProps) {
  const {
    getBedsByRoomId,
    getResidentsByRoomId,
    getBookingsByRoomId,
    getPaymentsByRoomId,
    getDepositsByRoomId,
    getRoomFinancialSummary,
  } = useRoom();

  const [activeTab, setActiveTab] = useState<"overview" | "residents" | "bookings" | "payments">("overview");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("all");

  if (!isOpen || !room) return null;

  const beds = getBedsByRoomId(room.id);
  const residents = getResidentsByRoomId(room.id);
  const bookings = getBookingsByRoomId(room.id);
  const payments = getPaymentsByRoomId(room.id);
  const deposits = getDepositsByRoomId(room.id);
  const financial = getRoomFinancialSummary(room.id);

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  const occupancyRate = room.totalBeds > 0 ? Math.round((room.occupiedBeds / room.totalBeds) * 100) : 0;

  // Filtered Bookings for Tab 3
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.residentName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.bedNumber.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesStatus = bookingStatusFilter === "all" || b.status === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Upcoming checkouts in this room
  const upcomingCheckoutResidents = residents.filter((r) => !!r.expectedCheckoutDate);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-white h-screen shadow-2xl flex flex-col justify-between z-10 animate-slideInRight overflow-hidden">
        {/* Top Drawer Header */}
        <div className="bg-brand-obsidian text-white px-5 sm:px-6 py-4 flex-shrink-0 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-brand-lime flex-shrink-0">
              <DoorClosed className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                  Room {room.roomNumber}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-brand-lime text-brand-obsidian text-[10px] font-extrabold uppercase">
                  {room.roomType}
                </span>
              </div>
              <p className="text-xs text-white/60 truncate">
                {room.floor} · {formatINR(room.defaultMonthlyRent)} / bed / month
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditRoom(room)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-brand-lime" />
              <span className="hidden sm:inline">Edit Room</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-slate-50 border-b border-brand-border px-4 sm:px-6 flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap",
              activeTab === "overview"
                ? "border-brand-obsidian text-brand-obsidian"
                : "border-transparent text-brand-muted hover:text-brand-charcoal"
            )}
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("residents")}
            className={cn(
              "py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap",
              activeTab === "residents"
                ? "border-brand-obsidian text-brand-obsidian"
                : "border-transparent text-brand-muted hover:text-brand-charcoal"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Current Residents ({residents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap",
              activeTab === "bookings"
                ? "border-brand-obsidian text-brand-obsidian"
                : "border-transparent text-brand-muted hover:text-brand-charcoal"
            )}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Booking History ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={cn(
              "py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap",
              activeTab === "payments"
                ? "border-brand-obsidian text-brand-obsidian"
                : "border-transparent text-brand-muted hover:text-brand-charcoal"
            )}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments & Deposits</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-brand-charcoal">
          {/* =========================================================================
              TAB 1: OVERVIEW
             ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Room Image & Quick Specs Hero */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-100 overflow-hidden flex flex-col sm:flex-row gap-4 p-3.5">
                {room.image && (
                  <div className="w-full sm:w-48 aspect-16/10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                    <img
                      src={room.image}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-charcoal">
                      Room {room.roomNumber} ({room.roomType})
                    </h3>
                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                      {room.description || "Fully furnished room configured for executive and student accommodation."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-brand-charcoal">
                      {room.floor}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-emerald-700">
                      {formatINR(room.defaultMonthlyRent)} / bed
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                      {occupancyRate}% Occupied
                    </span>
                  </div>
                </div>
              </div>

              {/* Occupancy Summary Metric Cards */}
              <div>
                <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted mb-2">
                  Bed Capacity & Occupancy Matrix
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-white p-3 rounded-xl border border-brand-border">
                    <span className="text-[10px] uppercase font-bold text-brand-muted block">
                      Total Beds
                    </span>
                    <span className="text-lg font-black text-brand-charcoal">
                      {room.totalBeds}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/20">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      Occupied
                    </span>
                    <span className="text-lg font-black text-emerald-700">
                      {room.occupiedBeds}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200 bg-blue-50/20">
                    <span className="text-[10px] uppercase font-bold text-blue-700 block">
                      Available
                    </span>
                    <span className="text-lg font-black text-blue-700">
                      {room.availableBeds}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200 bg-amber-50/20">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">
                      Reserved
                    </span>
                    <span className="text-lg font-black text-amber-700">
                      {room.reservedBeds}
                    </span>
                  </div>
                </div>
              </div>

              {/* Individual Beds Breakdown */}
              <div>
                <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted mb-2">
                  Bed Allocation Roster
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {beds.map((bed) => {
                    const resident = residents.find((r) => r.bedId === bed.id);
                    const booking = bookings.find((b) => b.bedId === bed.id && b.status === "confirmed");

                    const statusPill = {
                      occupied: { label: "Occupied", class: "bg-emerald-50 text-emerald-800 border-emerald-200" },
                      available: { label: "Available", class: "bg-blue-50 text-blue-800 border-blue-200" },
                      reserved: { label: "Reserved", class: "bg-amber-50 text-amber-800 border-amber-200" },
                      under_maintenance: { label: "Maintenance", class: "bg-rose-50 text-rose-800 border-rose-200" },
                      inactive: { label: "Inactive", class: "bg-slate-100 text-slate-700 border-slate-200" },
                    }[bed.status];

                    return (
                      <div
                        key={bed.id}
                        className="bg-white p-3 rounded-xl border border-brand-border flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-brand-charcoal text-xs flex-shrink-0">
                            {bed.bedNumber}
                          </div>
                          <div className="min-w-0">
                            {resident ? (
                              <button
                                type="button"
                                onClick={() => onSelectResident(resident.id)}
                                className="font-bold text-brand-charcoal hover:text-blue-600 transition-colors truncate block text-left"
                              >
                                {resident.name}
                              </button>
                            ) : booking ? (
                              <span className="font-semibold text-amber-800 truncate block">
                                Booked: {booking.residentName}
                              </span>
                            ) : (
                              <span className="font-medium text-brand-muted italic block">
                                Ready for Move-In
                              </span>
                            )}
                            <span className="text-[10px] text-brand-muted">
                              Rent: {formatINR(bed.assignedRent || room.defaultMonthlyRent)}/mo
                            </span>
                          </div>
                        </div>

                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase flex-shrink-0",
                            statusPill?.class
                          )}
                        >
                          {statusPill?.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Snapshot */}
              <div>
                <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted mb-2">
                  Room Financial Position (November Cycle)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-white p-3 rounded-xl border border-brand-border">
                    <span className="text-[10px] uppercase font-bold text-brand-muted block">
                      Total Billed
                    </span>
                    <span className="text-base font-black text-brand-charcoal">
                      {formatINR(financial.totalRentBilled)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/20">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      Rent Collected
                    </span>
                    <span className="text-base font-black text-emerald-700">
                      {formatINR(financial.totalRentCollected)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200 bg-amber-50/20">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">
                      Pending Rent
                    </span>
                    <span className={cn("text-base font-black", financial.pendingRent > 0 ? "text-amber-700" : "text-brand-charcoal")}>
                      {formatINR(financial.pendingRent)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-purple-200 bg-purple-50/20">
                    <span className="text-[10px] uppercase font-bold text-purple-700 block">
                      Security Deposits Held
                    </span>
                    <span className="text-base font-black text-purple-700">
                      {formatINR(financial.securityDepositsHeld)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Amenities */}
              <div>
                <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted mb-2">
                  Configured Room Amenities
                </h4>
                <div className="flex flex-wrap items-center gap-1.5">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700"
                    >
                      {getRoomAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Upcoming Check-outs for this room */}
              {upcomingCheckoutResidents.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-amber-800 mb-2">
                    Upcoming Room Check-out Notice
                  </h4>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clock className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-brand-charcoal truncate">
                          {upcomingCheckoutResidents[0].name} (Bed {upcomingCheckoutResidents[0].bedNumber})
                        </p>
                        <p className="text-[11px] text-amber-900">
                          Notice checkout date: <strong>{upcomingCheckoutResidents[0].expectedCheckoutDate}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectResident(upcomingCheckoutResidents[0].id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs flex-shrink-0"
                    >
                      View Resident
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: CURRENT RESIDENTS
             ========================================================================= */}
          {activeTab === "residents" && (
            <div className="space-y-3">
              {residents.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 p-6">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-brand-charcoal">Nobody is currently living in this room.</p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    All beds in this room are currently available or reserved for upcoming bookings.
                  </p>
                </div>
              ) : (
                residents.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={res.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                        alt={res.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-brand-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-brand-charcoal text-sm truncate">
                          {res.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted mt-0.5">
                          <span className="font-semibold text-brand-charcoal">Bed {res.bedNumber}</span>
                          <span>•</span>
                          <span>{res.phone}</span>
                          <span>•</span>
                          <span>Since {res.livingSince}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-brand-charcoal block">
                          {formatINR(res.monthlyRent)}/mo
                        </span>
                        <span
                          className={cn(
                            "inline-block px-2 py-0.2 rounded-full text-[9px] font-bold uppercase",
                            res.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-amber-50 text-amber-800"
                          )}
                        >
                          {res.paymentStatus === "paid" ? "Rent Paid" : "Rent Due"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectResident(res.id)}
                        className="px-3 py-1.5 rounded-xl border border-brand-border bg-slate-50 hover:bg-slate-100 text-xs font-bold text-brand-charcoal transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: BOOKING HISTORY
             ========================================================================= */}
          {activeTab === "bookings" && (
            <div className="space-y-3.5">
              {/* Filter / Search within bookings */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search by resident name or booking code..."
                    className="w-full h-9 pl-8 pr-3 text-xs bg-slate-50 rounded-xl border border-brand-border focus:outline-none focus:ring-1 focus:ring-brand-obsidian"
                  />
                </div>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="h-9 px-2.5 text-xs bg-slate-50 rounded-xl border border-brand-border text-brand-charcoal font-medium cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="converted">Converted</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 p-6">
                  <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-brand-charcoal">No booking records available for this room.</p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Advance tokens and reservations for this room will appear here.
                  </p>
                </div>
              ) : (
                <div className="border border-brand-border rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-brand-border text-[10px] font-bold uppercase text-brand-muted">
                      <tr>
                        <th className="p-3">Booking Code</th>
                        <th className="p-3">Resident</th>
                        <th className="p-3">Bed</th>
                        <th className="p-3">Check-In Date</th>
                        <th className="p-3">Token Advance</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-mono font-bold text-brand-charcoal">
                            {b.bookingCode}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-brand-charcoal block">{b.residentName}</span>
                            <span className="text-[10px] text-brand-muted">{b.phone}</span>
                          </td>
                          <td className="p-3 font-medium text-brand-muted">
                            Bed {b.bedNumber}
                          </td>
                          <td className="p-3 font-medium text-brand-charcoal">
                            {b.checkInDate}
                          </td>
                          <td className="p-3 font-bold text-emerald-700">
                            {formatINR(b.advanceAmount)}
                          </td>
                          <td className="p-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                                b.status === "confirmed"
                                  ? "bg-emerald-50 text-emerald-800"
                                  : b.status === "converted"
                                  ? "bg-blue-50 text-blue-800"
                                  : b.status === "pending"
                                  ? "bg-amber-50 text-amber-800"
                                  : "bg-rose-50 text-rose-800"
                              )}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 4: PAYMENTS & DEPOSITS
             ========================================================================= */}
          {activeTab === "payments" && (
            <div className="space-y-5">
              {/* Rent Payment History */}
              <div>
                <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted mb-2">
                  Operating Rent Collections
                </h4>
                {payments.length === 0 ? (
                  <p className="text-xs text-brand-muted italic py-3">No rent collection records found.</p>
                ) : (
                  <div className="border border-brand-border rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-brand-border text-[10px] font-bold uppercase text-brand-muted">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">Resident</th>
                          <th className="p-3">Invoice</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Method</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/60">
                            <td className="p-3 font-medium text-brand-charcoal">{p.date}</td>
                            <td className="p-3">
                              <span className="font-bold text-brand-charcoal block">{p.residentName}</span>
                              <span className="text-[10px] text-brand-muted">Bed {p.bedNumber}</span>
                            </td>
                            <td className="p-3 font-mono text-brand-muted">{p.invoiceNumber}</td>
                            <td className="p-3 font-bold text-brand-charcoal">{formatINR(p.amount)}</td>
                            <td className="p-3 text-brand-muted">{p.method || "Direct"}</td>
                            <td className="p-3">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                                  p.status === "completed"
                                    ? "bg-emerald-50 text-emerald-800"
                                    : p.status === "pending"
                                    ? "bg-amber-50 text-amber-800"
                                    : "bg-rose-50 text-rose-800"
                                )}
                              >
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Security Deposits Ledger (STRICTLY ISOLATED FROM RENT REVENUE) */}
              <div className="pt-2 border-t border-brand-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-purple-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                    <span>Security Deposits Held (Separate Escrow Liability)</span>
                  </h4>
                  <span className="text-xs font-black text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                    Total Held: {formatINR(financial.securityDepositsHeld)}
                  </span>
                </div>

                {deposits.length === 0 ? (
                  <p className="text-xs text-brand-muted italic py-3">No security deposits on file for this room.</p>
                ) : (
                  <div className="border border-purple-200/80 rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-purple-50/60 border-b border-purple-200/80 text-[10px] font-bold uppercase text-purple-900">
                        <tr>
                          <th className="p-3">Resident</th>
                          <th className="p-3">Bed</th>
                          <th className="p-3">Received Amount</th>
                          <th className="p-3">Deposit Date</th>
                          <th className="p-3">Adjustments</th>
                          <th className="p-3">Current Balance Held</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100">
                        {deposits.map((d) => (
                          <tr key={d.id} className="hover:bg-purple-50/30">
                            <td className="p-3 font-bold text-brand-charcoal">{d.residentName}</td>
                            <td className="p-3 text-brand-muted">Bed {d.bedNumber}</td>
                            <td className="p-3 font-semibold text-brand-charcoal">{formatINR(d.receivedAmount ?? 0)}</td>
                            <td className="p-3 text-brand-muted">{d.receivedDate}</td>
                            <td className="p-3 text-brand-muted">{formatINR(d.adjustments ?? 0)}</td>
                            <td className="p-3 font-black text-purple-800">{formatINR(d.currentHeld)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-[10px] text-brand-muted italic mt-1.5">
                  Critical compliance: Security deposits are refundable liabilities and are excluded from taxable monthly rent revenue.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-brand-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-lime" />
            <span className="text-xs font-semibold text-brand-muted">
              StayManage Inventory System
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditRoom(room)}
              className="px-4 py-2 rounded-xl bg-brand-obsidian text-white text-xs font-bold hover:bg-brand-obsidian-hover shadow-2xs transition-colors"
            >
              Edit Room Specs
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-brand-border bg-white hover:bg-slate-100 text-xs font-bold text-brand-charcoal transition-colors shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
