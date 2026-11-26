"use client";

import React, { useState } from "react";
import { Room } from "@/types/room";
import { RoomAccordionRow } from "@/components/owner/rooms/RoomAccordionRow";
import {
  Layers,
  ChevronDown,
  ChevronUp,
  SearchX,
  RotateCcw,
  DoorClosed,
  Plus,
  Building,
} from "lucide-react";

interface RoomAccordionListProps {
  rooms: Room[];
  availableFloors: string[];
  activeFloorFilter: string;
  onSelectFloorFilter: (floor: string) => void;
  onViewDetails: (room: Room) => void;
  onEditRoom: (room: Room) => void;
  onAddRoom: () => void;
  onSelectResident?: (residentId: string) => void;
  isFiltered: boolean;
  onResetFilters: () => void;
}

function getFloorRank(f: string): number {
  const lower = f.toLowerCase();
  if (lower.includes("basement") || lower.includes("b-")) return -2;
  if (lower.includes("lower ground") || lower.includes("lg")) return -1;
  if (lower.includes("ground") || lower.includes("g-") || lower.includes("g0")) return 0;
  const numMatch = f.match(/\d+/);
  if (numMatch) return parseInt(numMatch[0], 10);
  if (lower.includes("terrace") || lower.includes("rooftop") || lower.includes("penthouse")) return 999;
  return 500;
}

export function RoomAccordionList({
  rooms,
  availableFloors,
  activeFloorFilter,
  onSelectFloorFilter,
  onViewDetails,
  onEditRoom,
  onAddRoom,
  onSelectResident,
  isFiltered,
  onResetFilters,
}: RoomAccordionListProps) {
  // Set of currently expanded room IDs (first room expanded by default for discoverability)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (rooms.length > 0) {
      initial.add(rooms[0].id);
    }
    return initial;
  });

  const toggleRoom = (roomId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        next.delete(roomId);
      } else {
        next.add(roomId);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(rooms.map((r) => r.id)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const isAllExpanded = rooms.length > 0 && expandedIds.size === rooms.length;

  // Empty state: Filter yields zero
  if (rooms.length === 0 && isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-brand-border/80 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-brand-muted flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-brand-charcoal">
          No rooms match your filter
        </h3>
        <p className="text-xs text-brand-muted max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
          Try clearing or adjusting your search query, sharing type, or floor selection.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-obsidian text-white text-xs font-bold hover:bg-black shadow-xs transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-brand-lime" />
          <span>Clear All Filters</span>
        </button>
      </div>
    );
  }

  // Empty state: Zero rooms added
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

  // Group rooms by floor when "all" floors is selected for clean scanning
  const floorGroups = React.useMemo(() => {
    const groups: { floor: string; rooms: Room[] }[] = [];
    const floorMap = new Map<string, Room[]>();

    rooms.forEach((r) => {
      const fl = r.floor || "General";
      if (!floorMap.has(fl)) {
        floorMap.set(fl, []);
      }
      floorMap.get(fl)!.push(r);
    });

    floorMap.forEach((roomList, floorName) => {
      groups.push({ floor: floorName, rooms: roomList });
    });

    groups.sort((a, b) => {
      const rankA = getFloorRank(a.floor);
      const rankB = getFloorRank(b.floor);
      if (rankA !== rankB) return rankA - rankB;
      return a.floor.localeCompare(b.floor, undefined, { numeric: true });
    });

    return groups;
  }, [rooms]);

  return (
    <div className="space-y-4">
      {/* =========================================================================
          TOOLBAR: FLOOR QUICK-JUMP TABS & EXPAND/COLLAPSE CONTROLS
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-brand-border/80 shadow-2xs">
        {/* Floor Quick-Jump Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => onSelectFloorFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeFloorFilter === "all"
                ? "bg-brand-obsidian text-brand-lime shadow-xs"
                : "bg-[#F8FAFC] text-brand-charcoal hover:bg-slate-100 border border-brand-border"
              }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>All Floors ({rooms.length})</span>
          </button>

          {availableFloors.map((fl) => {
            const count = rooms.filter((r) => r.floor === fl).length;
            const freeBeds = rooms
              .filter((r) => r.floor === fl)
              .reduce((sum, r) => sum + r.availableBeds, 0);

            return (
              <button
                key={fl}
                type="button"
                onClick={() => onSelectFloorFilter(fl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeFloorFilter === fl
                    ? "bg-brand-obsidian text-brand-lime shadow-xs"
                    : "bg-[#F8FAFC] text-brand-charcoal hover:bg-slate-100 border border-brand-border"
                  }`}
              >
                <span>{fl}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${activeFloorFilter === fl
                      ? "bg-brand-lime text-brand-obsidian"
                      : "bg-slate-200 text-slate-700"
                    }`}
                >
                  {count}
                </span>
                {freeBeds > 0 && (
                  <span className="text-[10px] text-emerald-600 font-extrabold hidden md:inline-block">
                    ({freeBeds} free)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Expand / Collapse All Control */}
        <div className="flex items-center justify-end gap-2 flex-shrink-0">
          <span className="text-xs text-brand-muted font-medium hidden md:inline-block">
            {rooms.length} rooms listed
          </span>
          <button
            type="button"
            onClick={isAllExpanded ? handleCollapseAll : handleExpandAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 text-brand-charcoal text-xs font-bold border border-brand-border transition-all shadow-2xs"
          >
            {isAllExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-brand-muted" />
                <span>Collapse All</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
                <span>Expand All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          ACCORDION ROOM ROWS
          When activeFloorFilter is "all", display organized with floor headers!
          ========================================================================= */}
      {activeFloorFilter === "all" ? (
        <div className="space-y-6">
          {floorGroups.map((group) => {
            const floorFreeBeds = group.rooms.reduce((s, r) => s + r.availableBeds, 0);
            const floorTotalBeds = group.rooms.reduce((s, r) => s + r.totalBeds, 0);

            return (
              <div key={group.floor} className="space-y-2.5">
                {/* Floor Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 px-1 sm:px-2 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-obsidian shrink-0" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-brand-charcoal">
                      {group.floor}
                    </h3>
                    <span className="text-xs text-brand-muted font-semibold">
                      ({group.rooms.length} Rooms · {floorTotalBeds} Total Beds)
                    </span>
                  </div>

                  {floorFreeBeds > 0 ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 self-start sm:self-auto">
                      {floorFreeBeds} Beds Available on {group.floor}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-brand-muted self-start sm:self-auto">
                      All Beds Occupied
                    </span>
                  )}
                </div>

                {/* Rooms Accordion rows for this floor */}
                <div className="space-y-2.5">
                  {group.rooms.map((room) => (
                    <RoomAccordionRow
                      key={room.id}
                      room={room}
                      isOpen={expandedIds.has(room.id)}
                      onToggle={() => toggleRoom(room.id)}
                      onViewDetails={onViewDetails}
                      onEditRoom={onEditRoom}
                      onSelectResident={onSelectResident}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Floor filtered view */
        <div className="space-y-2.5">
          {rooms.map((room) => (
            <RoomAccordionRow
              key={room.id}
              room={room}
              isOpen={expandedIds.has(room.id)}
              onToggle={() => toggleRoom(room.id)}
              onViewDetails={onViewDetails}
              onEditRoom={onEditRoom}
              onSelectResident={onSelectResident}
            />
          ))}
        </div>
      )}
    </div>
  );
}
