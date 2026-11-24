"use client";

import React from "react";
import { Room } from "@/types/room";
import { RoomCard } from "@/components/rooms/RoomCard";
import { DoorClosed, Plus, RotateCcw, SearchX } from "lucide-react";

interface RoomListProps {
  rooms: Room[];
  onViewDetails: (room: Room) => void;
  onEditRoom: (room: Room) => void;
  onAddRoom: () => void;
  isFiltered: boolean;
  onResetFilters: () => void;
}

export function RoomList({
  rooms,
  onViewDetails,
  onEditRoom,
  onAddRoom,
  isFiltered,
  onResetFilters,
}: RoomListProps) {
  // Empty State: When filter yields zero results
  if (rooms.length === 0 && isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-brand-border/80 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-brand-muted flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-brand-charcoal">
          No rooms found
        </h3>
        <p className="text-xs text-brand-muted max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
          No rooms match your active search or filter selection. Try adjusting or clearing your filters to see all rooms.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-obsidian text-white text-xs font-bold hover:bg-brand-obsidian-hover shadow-xs transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-brand-lime" />
          <span>Clear All Filters</span>
        </button>
      </div>
    );
  }

  // Empty State: When property has zero rooms
  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-brand-border/80 p-8 sm:p-14 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-brand-lime/30 text-brand-obsidian flex items-center justify-center mx-auto mb-3.5 border border-brand-lime/40">
          <DoorClosed className="w-7 h-7 text-brand-obsidian" />
        </div>
        <h3 className="text-lg font-black text-brand-charcoal">
          No rooms added yet.
        </h3>
        <p className="text-xs text-brand-muted max-w-md mx-auto mt-1 mb-6 leading-relaxed">
          Start organizing your PG by adding your first room. Configure sharing capacity, individual bed allocations, amenities, and default pricing.
        </p>
        <button
          type="button"
          onClick={onAddRoom}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-lime text-brand-obsidian font-extrabold text-xs shadow-xs hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Your First Room</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onViewDetails={onViewDetails}
          onEditRoom={onEditRoom}
        />
      ))}
    </div>
  );
}
