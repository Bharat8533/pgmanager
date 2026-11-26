"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useOwner } from "@/contexts/OwnerContext";
import { useRoom } from "@/contexts/RoomContext";
import { Room, RoomFiltersState } from "@/types/room";
import { RoomStats } from "@/components/owner/rooms/RoomStats";
import { UpcomingCheckouts } from "@/components/owner/rooms/UpcomingCheckouts";
import { RoomFilters } from "@/components/owner/rooms/RoomFilters";
import { RoomList } from "@/components/owner/rooms/RoomList";
import { RoomAccordionList } from "@/components/owner/rooms/RoomAccordionList";
import { RoomFormModal } from "@/components/owner/rooms/RoomFormModal";
import { RoomDetailsDrawer } from "@/components/owner/rooms/RoomDetailsDrawer";
import { ResidentDetailsModal } from "@/components/owner/rooms/ResidentDetailsModal";
import {
  BedDouble,
  Plus,
  Building2,
  Check,
  ChevronRight,
  ArrowLeft,
  LayoutGrid,
  List,
  Sparkles,
} from "lucide-react";

interface RoomsViewProps {
  showBackToProperties?: boolean;
}

function sortFloorsNaturally(floors: string[]): string[] {
  const getFloorRank = (f: string): number => {
    const lower = f.toLowerCase();
    if (lower.includes("basement") || lower.includes("b-")) return -2;
    if (lower.includes("lower ground") || lower.includes("lg")) return -1;
    if (lower.includes("ground") || lower.includes("g-") || lower.includes("g0")) return 0;
    const numMatch = f.match(/\d+/);
    if (numMatch) return parseInt(numMatch[0], 10);
    if (lower.includes("terrace") || lower.includes("rooftop") || lower.includes("penthouse")) return 999;
    return 500;
  };

  return [...floors].sort((a, b) => {
    const rankA = getFloorRank(a);
    const rankB = getFloorRank(b);
    if (rankA !== rankB) return rankA - rankB;
    return a.localeCompare(b, undefined, { numeric: true });
  });
}

export function RoomsView({ showBackToProperties = false }: RoomsViewProps) {
  const { selectedProperty } = useOwner();
  const {
    propertyRooms,
    stats,
    upcomingCheckouts,
    getResidentsByRoomId,
  } = useRoom();

  // View Mode: "accordion" (expandable dropdown list, recommended for 30+ rooms) vs "grid" (visual cards)
  const [viewMode, setViewMode] = useState<"accordion" | "grid">("accordion");

  // Modals & Drawers state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<Room | null>(null);
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<RoomFiltersState>({
    searchQuery: "",
    roomType: "all",
    roomStatus: "all",
    floor: "all",
    sortBy: "room_asc",
  });

  const handleFilterChange = (updated: Partial<RoomFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      roomType: "all",
      roomStatus: "all",
      floor: "all",
      sortBy: "room_asc",
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Derive unique floors available in this property
  const availableFloors = useMemo(() => {
    const floorsSet = new Set<string>();
    propertyRooms.forEach((r) => {
      if (r.floor) floorsSet.add(r.floor);
    });
    return sortFloorsNaturally(Array.from(floorsSet));
  }, [propertyRooms]);

  // Filter and Sort rooms
  const filteredRooms = useMemo(() => {
    let result = propertyRooms.filter((room) => {
      // 1. Search Query (room number, floor, room type, or resident name)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesRoomNumber = room.roomNumber.toLowerCase().includes(query);
        const matchesFloor = room.floor.toLowerCase().includes(query);
        const matchesType = room.roomType.toLowerCase().includes(query);

        // Check if any resident living in this room matches
        const roomResidents = getResidentsByRoomId(room.id);
        const matchesResident = roomResidents.some((res) =>
          res.name.toLowerCase().includes(query)
        );

        if (!matchesRoomNumber && !matchesFloor && !matchesType && !matchesResident) {
          return false;
        }
      }

      // 2. Room Type Filter
      if (filters.roomType !== "all" && room.roomType !== filters.roomType) {
        return false;
      }

      // 3. Room Status Filter
      if (filters.roomStatus !== "all" && room.roomStatus !== filters.roomStatus) {
        return false;
      }

      // 4. Floor Filter
      if (filters.floor !== "all" && room.floor !== filters.floor) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === "room_asc") {
        return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
      }
      if (filters.sortBy === "room_desc") {
        return b.roomNumber.localeCompare(a.roomNumber, undefined, { numeric: true });
      }
      if (filters.sortBy === "occupancy_high") {
        const rateA = a.totalBeds > 0 ? a.occupiedBeds / a.totalBeds : 0;
        const rateB = b.totalBeds > 0 ? b.occupiedBeds / b.totalBeds : 0;
        return rateB - rateA;
      }
      if (filters.sortBy === "occupancy_low") {
        const rateA = a.totalBeds > 0 ? a.occupiedBeds / a.totalBeds : 0;
        const rateB = b.totalBeds > 0 ? b.occupiedBeds / b.totalBeds : 0;
        return rateA - rateB;
      }
      if (filters.sortBy === "beds_high") {
        return b.totalBeds - a.totalBeds;
      }
      if (filters.sortBy === "beds_low") {
        return a.totalBeds - b.totalBeds;
      }
      return 0;
    });

    return result;
  }, [propertyRooms, filters, getResidentsByRoomId]);

  const isFiltered =
    filters.searchQuery !== "" ||
    filters.roomType !== "all" ||
    filters.roomStatus !== "all" ||
    filters.floor !== "all" ||
    filters.sortBy !== "room_asc";

  return (
    <div className="space-y-6 sm:space-y-7 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-obsidian text-white px-4 py-3 rounded-2xl shadow-2xl border border-brand-lime/30 flex items-center gap-2.5 animate-scaleUp">
          <div className="w-5 h-5 rounded-full bg-brand-lime flex items-center justify-center text-brand-obsidian flex-shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Optional Back to Properties banner */}
      {showBackToProperties && (
        <div className="flex items-center justify-between pb-1">
          <Link
            href="/owner/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-charcoal transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to All Properties</span>
          </Link>
        </div>
      )}

      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-brand-border text-[11px] font-bold text-brand-charcoal shadow-2xs">
              <Building2 className="w-3 h-3 text-blue-600" />
              <span>{selectedProperty?.name || "StayManage Residency"}</span>
            </span>

            <span className="text-brand-muted text-xs">•</span>

            <span className="text-xs font-semibold text-brand-muted">
              {selectedProperty?.locality}, {selectedProperty?.city}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
            Rooms Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-2xl leading-relaxed">
            Manage rooms, configure bed allocations, track occupancy, and monitor walk-in availability.
          </p>
        </div>

        {/* Primary Action: + Add Room Button */}
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setRoomToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-lime hover:bg-brand-lime-hover text-brand-obsidian font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-sm active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Room</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          OVERVIEW STATISTICS SECTION
          ========================================================================= */}
      <RoomStats stats={stats} />

      {/* =========================================================================
          UPCOMING RESIDENT CHECK-OUTS WIDGET
          ========================================================================= */}
      <UpcomingCheckouts
        items={upcomingCheckouts}
        onSelectResident={(id) => setSelectedResidentId(id)}
      />

      {/* =========================================================================
          SEARCH & FILTERS
          ========================================================================= */}
      <RoomFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        availableFloors={availableFloors}
        totalCount={propertyRooms.length}
        filteredCount={filteredRooms.length}
      />

      {/* =========================================================================
          VIEW MODE TOGGLE BAR (Dropdown/Accordion List vs Visual Grid Cards)
          ========================================================================= */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-xs font-bold text-brand-charcoal uppercase tracking-wider truncate">
            Room Inventory ({filteredRooms.length})
          </span>
          <span className="text-[11px] text-brand-muted hidden md:inline-block">
            · Click any room row to expand details
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-white border border-brand-border rounded-xl shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("accordion")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "accordion"
                ? "bg-brand-obsidian text-brand-lime shadow-xs"
                : "text-brand-muted hover:text-brand-charcoal"
              }`}
            title="Expandable Dropdown List View (Optimized for 20-50+ rooms)"
          >
            <List className="w-3.5 h-3.5" />
            <span>List<span className="hidden sm:inline"> & Dropdown</span></span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "grid"
                ? "bg-brand-obsidian text-brand-lime shadow-xs"
                : "text-brand-muted hover:text-brand-charcoal"
              }`}
            title="Visual Grid Cards View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid<span className="hidden sm:inline"> Cards</span></span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ROOM INVENTORY DISPLAY (ACCORDION OR GRID)
          ========================================================================= */}
      {viewMode === "accordion" ? (
        <RoomAccordionList
          rooms={filteredRooms}
          availableFloors={availableFloors}
          activeFloorFilter={filters.floor}
          onSelectFloorFilter={(fl) => handleFilterChange({ floor: fl })}
          onViewDetails={(room) => setSelectedRoomForDetails(room)}
          onEditRoom={(room) => {
            setRoomToEdit(room);
            setIsAddModalOpen(true);
          }}
          onAddRoom={() => {
            setRoomToEdit(null);
            setIsAddModalOpen(true);
          }}
          onSelectResident={(id) => setSelectedResidentId(id)}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <RoomList
          rooms={filteredRooms}
          onViewDetails={(room) => setSelectedRoomForDetails(room)}
          onEditRoom={(room) => {
            setRoomToEdit(room);
            setIsAddModalOpen(true);
          }}
          onAddRoom={() => {
            setRoomToEdit(null);
            setIsAddModalOpen(true);
          }}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* =========================================================================
          ADD / EDIT ROOM MODAL (Reusable)
          ========================================================================= */}
      <RoomFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setRoomToEdit(null);
        }}
        roomToEdit={roomToEdit}
        onSuccessToast={showToast}
      />

      {/* =========================================================================
          ROOM DETAILS DRAWER
          ========================================================================= */}
      <RoomDetailsDrawer
        room={selectedRoomForDetails}
        isOpen={!!selectedRoomForDetails}
        onClose={() => setSelectedRoomForDetails(null)}
        onEditRoom={(room) => {
          setSelectedRoomForDetails(null);
          setRoomToEdit(room);
          setIsAddModalOpen(true);
        }}
        onSelectResident={(residentId) => {
          setSelectedResidentId(residentId);
        }}
      />

      {/* =========================================================================
          RESIDENT DETAILS MODAL
          ========================================================================= */}
      <ResidentDetailsModal
        residentId={selectedResidentId}
        isOpen={!!selectedResidentId}
        onClose={() => setSelectedResidentId(null)}
      />
    </div>
  );
}
