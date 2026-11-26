"use client";

import React, { useState } from "react";
import { Room, RoomStatus } from "@/types/room";
import { useRoom } from "@/contexts/RoomContext";
import {
  BedDouble,
  Users,
  CheckCircle2,
  Clock,
  Wrench,
  MoreVertical,
  Eye,
  Edit,
  Sparkles,
  Wifi,
  Wind,
  Bath,
  Tv,
  Refrigerator,
  Flame,
  Shirt,
  BookOpen,
  Fan,
  Building,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function getRoomAmenityIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("air") || lower.includes("ac")) return <Wind className="w-3 h-3 text-cyan-600" />;
  if (lower.includes("bath")) return <Bath className="w-3 h-3 text-blue-600" />;
  if (lower.includes("balcony")) return <Building className="w-3 h-3 text-emerald-600" />;
  if (lower.includes("wardrobe")) return <Shirt className="w-3 h-3 text-purple-600" />;
  if (lower.includes("study") || lower.includes("table")) return <BookOpen className="w-3 h-3 text-amber-600" />;
  if (lower.includes("fan")) return <Fan className="w-3 h-3 text-teal-600" />;
  if (lower.includes("fridge") || lower.includes("refrigerator")) return <Refrigerator className="w-3 h-3 text-indigo-600" />;
  if (lower.includes("tv")) return <Tv className="w-3 h-3 text-rose-600" />;
  if (lower.includes("wi-fi") || lower.includes("wifi")) return <Wifi className="w-3 h-3 text-blue-600" />;
  if (lower.includes("geyser")) return <Flame className="w-3 h-3 text-orange-600" />;
  return <Sparkles className="w-3 h-3 text-brand-muted" />;
}

interface RoomCardProps {
  room: Room;
  onViewDetails: (room: Room) => void;
  onEditRoom: (room: Room) => void;
}

export function RoomCard({ room, onViewDetails, onEditRoom }: RoomCardProps) {
  const { getRoomFinancialSummary, toggleRoomStatus } = useRoom();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState<RoomStatus | null>(null);

  const financial = getRoomFinancialSummary(room.id);
  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  // Room status visual config
  const statusConfig: Record<RoomStatus, { label: string; badgeClass: string; dotClass: string }> = {
    fully_occupied: {
      label: "Fully Occupied",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      dotClass: "bg-emerald-500",
    },
    partially_occupied: {
      label: "Partially Occupied",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
      dotClass: "bg-blue-500",
    },
    available: {
      label: "Available",
      badgeClass: "bg-teal-50 text-teal-800 border-teal-200",
      dotClass: "bg-teal-500",
    },
    fully_reserved: {
      label: "Fully Reserved",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
      dotClass: "bg-amber-500",
    },
    under_maintenance: {
      label: "Maintenance",
      badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
      dotClass: "bg-rose-500",
    },
    inactive: {
      label: "Inactive",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
      dotClass: "bg-slate-400",
    },
  };

  const status = statusConfig[room.roomStatus] || statusConfig.available;

  const visibleAmenities = room.amenities.slice(0, 3);
  const remainingAmenities = Math.max(0, room.amenities.length - 3);

  // Segmented occupancy calculation
  const occupiedPct = room.totalBeds > 0 ? (room.occupiedBeds / room.totalBeds) * 100 : 0;
  const reservedPct = room.totalBeds > 0 ? (room.reservedBeds / room.totalBeds) * 100 : 0;
  const maintenancePct = room.totalBeds > 0 ? (room.maintenanceBeds / room.totalBeds) * 100 : 0;
  const availablePct = room.totalBeds > 0 ? (room.availableBeds / room.totalBeds) * 100 : 0;

  const handleStatusChange = (newStatus: RoomStatus) => {
    toggleRoomStatus(room.id, newStatus);
    setConfirmStatusModal(null);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-brand-border/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
        <div>
          {/* Card Image Header */}
          <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
            {room.image ? (
              <img
                src={room.image}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-1.5">
                <BedDouble className="w-8 h-8 text-slate-300" />
                <span className="text-[10px] font-semibold">No Image Uploaded</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 pointer-events-none" />

            {/* Top Left: Room Number & Floor Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-obsidian/90 text-brand-lime font-black text-xs tracking-wider backdrop-blur-xs shadow-xs">
                Room {room.roomNumber}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/85 text-brand-charcoal font-bold text-[10px] backdrop-blur-xs shadow-xs">
                {room.floor}
              </span>
            </div>

            {/* Top Right: Status Badge & Dropdown Menu */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs backdrop-blur-md",
                  status.badgeClass
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", status.dotClass)} />
                {status.label}
              </span>

              {/* Action Dropdown Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors backdrop-blur-xs"
                  aria-label="More actions"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-brand-border py-1.5 z-40 text-left animate-scaleUp">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onViewDetails(room);
                        }}
                        className="w-full px-3 py-1.5 text-xs text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onEditRoom(room);
                        }}
                        className="w-full px-3 py-1.5 text-xs text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <Edit className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Edit Room</span>
                      </button>

                      <div className="h-px bg-slate-100 my-1" />

                      <p className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-muted">
                        Set Status:
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setConfirmStatusModal("under_maintenance");
                        }}
                        className="w-full px-3 py-1 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-600" />
                        <span>Maintenance</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setConfirmStatusModal("available");
                        }}
                        className="w-full px-3 py-1 text-xs text-teal-700 hover:bg-teal-50 flex items-center gap-2 font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Mark Available</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Floating Price Pill */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white drop-shadow-sm">
              <span className="text-xs font-semibold tracking-tight text-white/90">
                {room.roomType}
              </span>
              <span className="text-xs font-black text-brand-lime">
                {formatINR(room.defaultMonthlyRent)}{" "}
                <span className="text-[10px] font-normal text-white/80">/ bed</span>
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-3.5 sm:p-4 space-y-3">
            {/* Bed Occupancy Matrix Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-charcoal flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-brand-muted" />
                  <span>{room.totalBeds} Beds Total</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700">
                  {room.occupiedBeds} Occupied · {room.availableBeds} Available
                </span>
              </div>

              {/* Segmented Bed Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                {occupiedPct > 0 && (
                  <div
                    style={{ width: `${occupiedPct}%` }}
                    className="h-full bg-emerald-500 transition-all duration-300"
                    title={`Occupied: ${room.occupiedBeds} beds`}
                  />
                )}
                {reservedPct > 0 && (
                  <div
                    style={{ width: `${reservedPct}%` }}
                    className="h-full bg-amber-400 transition-all duration-300"
                    title={`Reserved: ${room.reservedBeds} beds`}
                  />
                )}
                {maintenancePct > 0 && (
                  <div
                    style={{ width: `${maintenancePct}%` }}
                    className="h-full bg-rose-400 transition-all duration-300"
                    title={`Maintenance: ${room.maintenanceBeds} beds`}
                  />
                )}
                {availablePct > 0 && (
                  <div
                    style={{ width: `${availablePct}%` }}
                    className="h-full bg-blue-300 transition-all duration-300"
                    title={`Available: ${room.availableBeds} beds`}
                  />
                )}
              </div>

              {/* Legend Summary */}
              <div className="flex items-center justify-between text-[10px] text-brand-muted pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{room.occupiedBeds} Living</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>{room.availableBeds} Open</span>
                </span>
                {room.reservedBeds > 0 && (
                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{room.reservedBeds} Booked</span>
                  </span>
                )}
                {room.maintenanceBeds > 0 && (
                  <span className="flex items-center gap-1 text-rose-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{room.maintenanceBeds} Maint.</span>
                  </span>
                )}
              </div>
            </div>

            {/* Room Amenities Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {visibleAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 text-[10px] font-medium text-slate-700"
                >
                  {getRoomAmenityIcon(amenity)}
                  <span className="truncate max-w-[90px]">{amenity}</span>
                </span>
              ))}

              {remainingAmenities > 0 && (
                <span
                  onClick={() => onViewDetails(room)}
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200/70 text-[10px] font-bold text-brand-muted hover:text-brand-charcoal cursor-pointer transition-colors"
                >
                  +{remainingAmenities} more
                </span>
              )}
            </div>

            {/* Room Financial Overview Row */}
            <div className="pt-2 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">
                    Collected
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {formatINR(financial.totalRentCollected)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">
                    Pending
                  </span>
                  <span className={cn("text-xs font-extrabold", financial.pendingRent > 0 ? "text-amber-700" : "text-brand-charcoal")}>
                    {formatINR(financial.pendingRent)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">
                    Deposits
                  </span>
                  <span className="text-xs font-extrabold text-purple-700">
                    {formatINR(financial.securityDepositsHeld)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(room)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-xs font-bold text-brand-charcoal shadow-2xs transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => onEditRoom(room)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-brand-obsidian text-white text-xs font-bold hover:bg-brand-obsidian-hover shadow-2xs transition-all"
          >
            <Edit className="w-3.5 h-3.5 text-brand-lime" />
            <span>Edit Room</span>
          </button>
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {confirmStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-brand-border p-5 max-w-sm w-full shadow-2xl animate-scaleUp">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-brand-charcoal">
                Change Room Status?
              </h3>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed mb-4">
              Are you sure you want to change <strong>Room {room.roomNumber}</strong> status to{" "}
              <span className="font-bold uppercase text-brand-charcoal">
                {confirmStatusModal.replace("_", " ")}
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmStatusModal(null)}
                className="px-3 py-1.5 text-xs font-semibold text-brand-muted hover:text-brand-charcoal rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(confirmStatusModal)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-brand-obsidian hover:bg-brand-obsidian-hover rounded-xl shadow-xs"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
