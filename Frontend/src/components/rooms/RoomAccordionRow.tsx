"use client";

import React from "react";
import { Room, RoomStatus, Bed } from "@/types/room";
import { useRoom } from "@/contexts/RoomContext";
import { getRoomAmenityIcon } from "@/components/rooms/RoomCard";
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
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-sm ${
        isOpen
          ? "border-brand-obsidian ring-1 ring-brand-obsidian/10"
          : "border-brand-border hover:border-brand-border/80"
      }`}
    >
      {/* =========================================================================
          ACCORDION HEADER ROW (Mobile Optimized 2-line layout / Desktop single row)
          Click anywhere to expand/collapse
          ========================================================================= */}
      <div
        onClick={onToggle}
        className="p-3 sm:px-4 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 cursor-pointer select-none bg-white hover:bg-[#F8FAFC]/80 transition-colors"
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
            <span className="font-bold px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-brand-border text-brand-charcoal text-[11px] whitespace-nowrap">
              {room.roomType}
            </span>

            <span className="font-semibold text-brand-muted hidden sm:inline-block text-xs">
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
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-black/5"
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
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal hover:bg-black/5"
              title="Edit Room Specs"
            >
              <Edit className="w-4 h-4" />
            </button>
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-brand-muted transition-transform duration-200 ${
                isOpen ? "rotate-180 text-brand-obsidian bg-slate-100" : ""
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
            <span className="text-[10px] text-brand-muted font-medium">{room.floor}</span>
            <span className="text-xs font-black text-brand-charcoal">
              ₹{room.defaultMonthlyRent.toLocaleString("en-IN")}/mo
            </span>
          </div>

          {/* Mini Bed Indicator Dots (Desktop) */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-[#F8FAFC] rounded-lg border border-brand-border/60">
            {beds.length > 0 ? (
              beds.map((b) => (
                <span
                  key={b.id}
                  title={`${b.bedNumber}: ${b.status}`}
                  className={`w-2 h-2 rounded-full ${
                    b.status === "available"
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
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted transition-transform duration-200 ${
                isOpen ? "rotate-180 text-brand-obsidian bg-slate-100" : ""
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
        <div className="border-t border-brand-border/60 bg-[#FAFAFA] p-4 sm:p-5 animate-slideIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* -------------------------------------------------------------
                LEFT SIDE: ROOM IMAGE & KEY SPECS (~40% on Desktop)
                ------------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-3">
              {/* Room Image */}
              <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-brand-border bg-slate-100 shadow-2xs group">
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
                <div className="absolute bottom-3 right-3 bg-brand-obsidian/90 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-xs font-black shadow-xs">
                  ₹{room.defaultMonthlyRent.toLocaleString("en-IN")}/mo
                </div>
              </div>

              {/* Room Description */}
              {room.description && (
                <p className="text-xs text-brand-muted leading-relaxed italic bg-white p-3 rounded-xl border border-brand-border/60">
                  "{room.description}"
                </p>
              )}

              {/* Amenities Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                  Included Amenities ({room.amenities.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-brand-border text-[11px] font-semibold text-brand-charcoal"
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
                  <BedDouble className="w-4 h-4 text-brand-obsidian" />
                  <h4 className="text-xs sm:text-sm font-extrabold text-brand-charcoal uppercase tracking-wider">
                    Individual Bed Matrix
                  </h4>
                </div>
                <span className="text-xs text-brand-muted font-semibold">
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
                      className={`p-3 rounded-xl border transition-all ${
                        bed.status === "available"
                          ? "bg-emerald-50/50 border-emerald-200 hover:border-emerald-300"
                          : bed.status === "occupied"
                          ? "bg-white border-brand-border hover:border-brand-obsidian/30"
                          : bed.status === "reserved"
                          ? "bg-amber-50/50 border-amber-200"
                          : "bg-rose-50/50 border-rose-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-brand-charcoal">
                          Bed {bed.bedNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            bed.status === "available"
                              ? "bg-emerald-100 text-emerald-800"
                              : bed.status === "occupied"
                              ? "bg-brand-obsidian text-white"
                              : bed.status === "reserved"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
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
                            className="text-xs font-bold text-brand-charcoal hover:text-blue-600 transition-colors text-left flex items-center gap-1 truncate w-full"
                          >
                            <UserCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{resident.name}</span>
                          </button>
                          <p className="text-[10px] text-brand-muted">
                            Admitted: {resident.admissionDate} · ₹{resident.monthlyRent.toLocaleString("en-IN")}/mo
                          </p>
                        </div>
                      ) : bed.status === "reserved" ? (
                        <p className="text-xs text-amber-800 font-semibold">
                          Advance Token Received
                        </p>
                      ) : bed.status === "under_maintenance" ? (
                        <p className="text-xs text-rose-700 font-semibold">
                          Maintenance / Repair
                        </p>
                      ) : (
                        <p className="text-xs text-emerald-700 font-semibold">
                          Ready for immediate walk-in
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Financial Summary Strip for this room */}
              <div className="bg-white rounded-xl border border-brand-border p-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">
                    Rent Billed
                  </span>
                  <span className="text-xs font-black text-brand-charcoal mt-0.5 block">
                    ₹{financial.totalRentBilled.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">
                    Pending Rent
                  </span>
                  <span
                    className={`text-xs font-black mt-0.5 block ${
                      financial.pendingRent > 0 ? "text-rose-600" : "text-emerald-700"
                    }`}
                  >
                    ₹{financial.pendingRent.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-muted block">
                    Deposits Held
                  </span>
                  <span className="text-xs font-black text-indigo-700 mt-0.5 block">
                    ₹{financial.securityDepositsHeld.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-2 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => onViewDetails(room)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-bold bg-white hover:bg-slate-50 text-brand-charcoal border border-brand-border rounded-xl transition-all shadow-2xs w-full sm:w-auto"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Full Room Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditRoom(room)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 text-xs font-bold bg-brand-obsidian hover:bg-black text-white rounded-xl transition-all shadow-2xs w-full sm:w-auto"
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
