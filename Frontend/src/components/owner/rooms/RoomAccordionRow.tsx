"use client";

import React from "react";
import { Room, RoomStatus, Bed } from "@/types/room";
import { useRoom } from "@/contexts/RoomContext";
import { getRoomAmenityIcon } from "@/components/owner/rooms/RoomCard";
import { cn } from "@/lib/utils";
import {
  BedDouble,
  Users,
  ChevronDown,
  Eye,
  Edit,
  Building2,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Clock,
  ShieldCheck,
  DoorClosed,
  UserCheck,
} from "lucide-react";

interface RoomAccordionRowProps {
  room: Room;
  isOpen: boolean;
  onToggle: () => void;
  onViewDetails: (room: Room) => void;
  onEditRoom: (room: Room) => void;
  onSelectResident?: (residentId: string) => void;
}

export function RoomAccordionRow({
  room,
  isOpen,
  onToggle,
  onViewDetails,
  onEditRoom,
  onSelectResident,
}: RoomAccordionRowProps) {
  const { getBedsByRoomId, getResidentsByRoomId, getRoomFinancialSummary } = useRoom();

  const beds = getBedsByRoomId(room.id);
  const residents = getResidentsByRoomId(room.id);
  const financial = getRoomFinancialSummary(room.id);

  // Status visual configurations
  const getStatusBadge = () => {
    if (room.roomStatus === "under_maintenance") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
          <Wrench className="w-3 h-3 text-rose-600" />
          <span>Under Maintenance</span>
        </span>
      );
    }
    if (room.roomStatus === "fully_reserved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Fully Reserved</span>
        </span>
      );
    }
    if (room.availableBeds > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{room.availableBeds} of {room.totalBeds} Beds Free</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
        <Users className="w-3 h-3 text-slate-600" />
        <span>Fully Occupied ({room.occupiedBeds}/{room.totalBeds})</span>
      </span>
    );
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-[#111622] rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-sm",
        isOpen
          ? "border-brand-obsidian dark:border-brand-lime/50 ring-1 ring-brand-obsidian/10 dark:ring-brand-lime/10"
          : "border-brand-border dark:border-[#222E42] hover:border-brand-border/80 dark:hover:border-[#2E3C52]"
      )}
    >
      {/* =========================================================================
          ACCORDION HEADER ROW (Mobile Optimized 2-line layout / Desktop single row)
          Click anywhere to expand/collapse
          ========================================================================= */}
      <div
        onClick={onToggle}
        className="p-3 sm:px-4 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 cursor-pointer select-none bg-white dark:bg-[#111622] hover:bg-[#F8FAFC]/80 dark:hover:bg-[#151D2A] transition-colors"
      >
        {/* Mobile: Top line / Desktop: Left section */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {/* Room Number Badge */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-brand-obsidian text-white font-black text-xs sm:text-sm shadow-2xs shrink-0">
              <DoorClosed className="w-3.5 h-3.5 text-brand-lime" />
              <span>Room {room.roomNumber}</span>
            </div>

            {/* Sharing Type Pill (Never truncated!) */}
            <span className="font-bold px-2 py-0.5 rounded-md bg-[#F8FAFC] dark:bg-[#151D2A] border border-brand-border dark:border-[#243144] text-brand-charcoal dark:text-slate-200 text-[11px] whitespace-nowrap">
              {room.roomType}
            </span>

            <span className="font-semibold text-brand-muted dark:text-slate-300 hidden sm:inline-block text-xs">
              · {room.floor}
            </span>
          </div>

          {/* Quick Actions (Visible on Mobile Top-Right) */}
          <div className="flex sm:hidden items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(room);
              }}
              className="p-1.5 rounded-lg text-brand-muted dark:text-slate-300 hover:text-brand-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              title="View Full Room Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditRoom(room);
              }}
              className="p-1.5 rounded-lg text-brand-muted dark:text-slate-300 hover:text-brand-charcoal dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              title="Edit Room Specs"
            >
              <Edit className="w-4 h-4" />
            </button>
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-brand-muted dark:text-slate-300 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-obsidian dark:text-brand-lime bg-slate-100 dark:bg-[#1E293B]" : ""
                }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Mobile: Bottom line / Desktop: Center & Right sections */}
        <div className="flex items-center justify-between sm:justify-end gap-3 min-w-0">
          {/* Status Badge */}
          <div className="shrink-0">{getStatusBadge()}</div>

          {/* Monthly Rent on Mobile & Floor */}
          <div className="flex sm:hidden items-center gap-2 text-right">
            <span className="text-[10px] text-brand-muted dark:text-slate-300 font-medium">{room.floor}</span>
            <span className="text-xs font-black text-brand-charcoal dark:text-white">
              ₹{room.defaultMonthlyRent.toLocaleString("en-IN")}/mo
            </span>
          </div>

          {/* Mini Bed Indicator Dots (Desktop) */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-[#F8FAFC] dark:bg-[#151D2A] rounded-lg border border-brand-border/60 dark:border-[#243144]">
            {beds.length > 0 ? (
              beds.map((b) => (
                <span
                  key={b.id}
                  title={`${b.bedNumber}: ${b.status}`}
                  className={`w-2 h-2 rounded-full ${b.status === "available"
                      ? "bg-emerald-500 ring-1 ring-emerald-300"
                      : b.status === "occupied"
                        ? "bg-brand-obsidian"
                        : b.status === "reserved"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                />
              ))
            ) : (
              <span className="text-[10px] text-brand-muted">
                {room.totalBeds} Beds
              </span>
            )}
          </div>

          {/* Monthly Rent (Desktop) */}
          <div className="hidden lg:block text-right">
            <span className="text-xs font-black text-brand-charcoal">
              ₹{room.defaultMonthlyRent.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-brand-muted font-normal">/mo</span>
          </div>

          {/* Quick Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(room);
              }}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-black/5 transition-all"
              title="View Full Room Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditRoom(room);
              }}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-black/5 transition-all"
              title="Edit Room Specs"
            >
              <Edit className="w-4 h-4" />
            </button>

            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-obsidian bg-slate-100" : ""
                }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EXPANDED CONTENT CONTAINER (Split View: Left Image, Right Content)
          ========================================================================= */}
      {isOpen && (
        <div className="border-t border-brand-border/60 dark:border-[#1E2638] bg-[#FAFAFA] dark:bg-[#0D111A] p-4 sm:p-5 animate-slideIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* -------------------------------------------------------------
                LEFT SIDE: ROOM IMAGE & KEY SPECS (~40% on Desktop)
                ------------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-3">
              {/* Room Image */}
              <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-brand-border dark:border-[#222E42] bg-slate-100 dark:bg-[#151D2A] shadow-2xs group">
                <img
                  src={
                    room.image ||
                    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Status Overlay Pill */}
                <div className="absolute top-3 left-3">{getStatusBadge()}</div>

                {/* Base Rent Overlay */}
                <div className="absolute bottom-3 right-3 bg-brand-obsidian/90 dark:bg-[#111622]/95 border dark:border-white/10 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-xs font-black shadow-xs">
                  ₹{room.defaultMonthlyRent.toLocaleString("en-IN")}/mo
                </div>
              </div>

              {/* Room Description */}
              {room.description && (
                <p className="text-xs text-brand-muted dark:text-slate-200 leading-relaxed italic bg-white dark:bg-[#151D2A] p-3 rounded-xl border border-brand-border/60 dark:border-[#222E42]">
                  "{room.description}"
                </p>
              )}

              {/* Amenities Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-brand-muted dark:text-slate-400 tracking-wider">
                  Included Amenities ({room.amenities.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] text-[11px] font-semibold text-brand-charcoal dark:text-slate-200"
                    >
                      {getRoomAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT SIDE: BED ALLOCATION MATRIX & FINANCIALS (~60% on Desktop)
                ------------------------------------------------------------- */}
            <div className="lg:col-span-7 space-y-4">
              {/* Bed Allocation Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-brand-obsidian dark:text-brand-lime" />
                  <h4 className="text-xs sm:text-sm font-extrabold text-brand-charcoal dark:text-white uppercase tracking-wider">
                    Individual Bed Matrix
                  </h4>
                </div>
                <span className="text-xs text-brand-muted dark:text-slate-300 font-semibold">
                  {room.occupiedBeds} of {room.totalBeds} Occupied
                </span>
              </div>

              {/* Beds Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {beds.map((bed) => {
                  const resident = residents.find(
                    (r) => r.bedId === bed.id || r.bedNumber === bed.bedNumber
                  );

                  return (
                    <div
                      key={bed.id}
                      className={`p-3 rounded-xl border transition-all ${bed.status === "available"
                          ? "bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-300"
                          : bed.status === "occupied"
                            ? "bg-white dark:bg-[#151D2A] border-brand-border dark:border-[#263346] hover:border-brand-obsidian/30"
                            : bed.status === "reserved"
                              ? "bg-amber-50/50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
                              : "bg-rose-50/50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-brand-charcoal dark:text-white">
                          Bed {bed.bedNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bed.status === "available"
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                              : bed.status === "occupied"
                                ? "bg-brand-obsidian dark:bg-[#1E283C] text-white"
                                : bed.status === "reserved"
                                  ? "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300"
                                  : "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300"
                            }`}
                        >
                          {bed.status === "available" ? "Free" : bed.status}
                        </span>
                      </div>

                      {/* Resident Name or Free status */}
                      {bed.status === "occupied" && resident ? (
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => onSelectResident && onSelectResident(resident.id)}
                            className="text-xs font-bold text-brand-charcoal dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left flex items-center gap-1 truncate w-full"
                          >
                            <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                            <span className="truncate">{resident.name}</span>
                          </button>
                          <p className="text-[10px] text-brand-muted dark:text-slate-300">
                            Admitted: {resident.admissionDate} · ₹{resident.monthlyRent.toLocaleString("en-IN")}/mo
                          </p>
                        </div>
                      ) : bed.status === "reserved" ? (
                        <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                          Advance Token Received
                        </p>
                      ) : bed.status === "under_maintenance" ? (
                        <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold">
                          Maintenance / Repair
                        </p>
                      ) : (
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                          Ready for immediate walk-in
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Financial Summary Strip for this room */}
              <div className="bg-white dark:bg-[#151D2A] rounded-xl border border-brand-border/80 dark:border-[#263346] p-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                    Rent Billed
                  </span>
                  <span className="text-xs font-black text-brand-charcoal dark:text-white mt-0.5 block">
                    ₹{financial.totalRentBilled.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                    Pending Rent
                  </span>
                  <span
                    className={`text-xs font-black mt-0.5 block ${financial.pendingRent > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"
                      }`}
                  >
                    ₹{financial.pendingRent.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                    Deposits Held
                  </span>
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-400 mt-0.5 block">
                    ₹{financial.securityDepositsHeld.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-2 border-t border-brand-border/60 dark:border-[#1E2638]">
                <button
                  type="button"
                  onClick={() => onViewDetails(room)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-bold bg-white dark:bg-[#151D2A] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-white border border-brand-border dark:border-[#28354A] rounded-xl transition-all shadow-2xs w-full sm:w-auto"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Full Room Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditRoom(room)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-bold bg-brand-obsidian dark:bg-[#1E283C] hover:bg-black dark:hover:bg-[#28354D] border dark:border-white/10 text-white rounded-xl transition-all shadow-2xs w-full sm:w-auto"
                >
                  <Edit className="w-3.5 h-3.5 text-brand-lime" />
                  <span>Edit Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
