"use client";

import React from "react";
import { UpcomingCheckoutItem } from "@/types/room";
import {
  CalendarClock,
  Clock,
  User,
  ArrowRight,
  AlertCircle,
  DoorClosed,
} from "lucide-react";

interface UpcomingCheckoutsProps {
  items: UpcomingCheckoutItem[];
  onSelectResident: (residentId: string) => void;
}

export function UpcomingCheckouts({ items, onSelectResident }: UpcomingCheckoutsProps) {
  if (items.length === 0) {
    return null; // When empty, don't show an intrusive banner
  }

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  return (
    <div className="bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-white rounded-2xl border border-amber-200/80 p-3.5 sm:p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center flex-shrink-0">
            <CalendarClock className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
              <span>Upcoming Resident Check-outs</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-black">
                {items.length}
              </span>
            </h4>
            <p className="text-[11px] text-brand-muted">
              Active move-out notices requiring inspection, pending dues settlement, and bed preparation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {items.map(({ resident, room, daysRemaining }) => (
          <div
            key={resident.id}
            onClick={() => onSelectResident(resident.id)}
            className="bg-white rounded-xl border border-amber-200/60 p-2.5 flex items-center justify-between gap-3 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={resident.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                alt={resident.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-brand-border flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-charcoal truncate group-hover:text-blue-600 transition-colors">
                  {resident.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-brand-muted">
                  <span className="flex items-center gap-0.5">
                    <DoorClosed className="w-2.5 h-2.5 text-brand-muted" />
                    Room {room.roomNumber} ({resident.bedNumber})
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-amber-700 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {resident.expectedCheckoutDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                In {daysRemaining} days
              </span>
              {resident.pendingAmount > 0 ? (
                <p className="text-[10px] font-bold text-rose-600 mt-0.5 flex items-center justify-end gap-0.5">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Due: {formatINR(resident.pendingAmount)}
                </p>
              ) : (
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  Rent Clear
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
