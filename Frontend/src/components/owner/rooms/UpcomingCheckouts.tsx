"use client";

import React, { useState, useRef, useEffect } from "react";
import { UpcomingCheckoutItem } from "@/types/room";
import {
  CalendarClock,
  Clock,
  DoorClosed,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Columns,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UpcomingCheckoutsProps {
  items: UpcomingCheckoutItem[];
  onSelectResident: (residentId: string) => void;
}

export function UpcomingCheckouts({ items, onSelectResident }: UpcomingCheckoutsProps) {
  // Minimize / Collapse entire banner to a 1-line ticker if user wants maximum space
  const [isCollapsed, setIsCollapsed] = useState(false);

  // View mode: "carousel" (1 compact row with horizontal scrolling) vs "grid" (expanded multi-row)
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");

  // Horizontal scroll container reference & scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [items, viewMode, isCollapsed]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScrollability, 350);
  };

  if (items.length === 0) {
    return null;
  }

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");
  const earliestItem = items[0];

  // =========================================================================
  // 1. COLLAPSED NOTIFICATION TICKER VIEW
  // =========================================================================
  if (isCollapsed) {
    return (
      <div className="bg-amber-50/70 dark:bg-[#111622] rounded-2xl border border-amber-200/80 dark:border-amber-500/30 px-4 py-2.5 shadow-2xs flex items-center justify-between gap-3 transition-all animate-fadeIn">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <CalendarClock className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2 min-w-0 text-xs">
            <span className="font-bold text-brand-charcoal dark:text-white truncate">
              Upcoming Resident Check-outs
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-200/80 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-[10px] font-black flex-shrink-0">
              {items.length}
            </span>
            {earliestItem && (
              <span className="text-brand-muted dark:text-slate-300 hidden md:inline truncate">
                • Earliest: <strong className="text-brand-charcoal dark:text-white">{earliestItem.resident.name}</strong> (Room {earliestItem.room.roomNumber}) in {earliestItem.daysRemaining} days
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-500/15 hover:bg-amber-200/80 dark:hover:bg-amber-500/25 rounded-lg transition-colors flex-shrink-0"
        >
          <span>Expand</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // =========================================================================
  // 2. EXPANDED VIEW WITH COMPACT CAROUSEL OR GRID
  // =========================================================================
  return (
    <div className="bg-amber-50/60 dark:bg-[#111622] rounded-2xl border border-amber-200/80 dark:border-amber-500/30 p-3.5 sm:p-4 shadow-2xs transition-all animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-amber-200/60 dark:border-[#1E2638]">
        {/* Left: Icon, Title & Subtitle */}
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-brand-charcoal dark:text-white tracking-tight">
                Upcoming Resident Check-outs
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-[10px] font-black border border-amber-300/80 dark:border-amber-500/40">
                {items.length} {items.length === 1 ? "Notice" : "Notices"}
              </span>
            </div>
            <p className="text-[11px] text-brand-muted dark:text-slate-300 mt-0.5 line-clamp-1">
              Active move-out notices requiring room inspection, security deposit settlement, and bed handover.
            </p>
          </div>
        </div>

        {/* Right Actions: Carousel Nav, View Toggle & Collapse Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          {/* Carousel Left / Right Arrows (Only when items exceed 3 and in carousel mode) */}
          {viewMode === "carousel" && items.length > 3 && (
            <div className="flex items-center gap-1 mr-1">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="w-7 h-7 rounded-lg bg-white dark:bg-[#151D2A] border border-amber-200 dark:border-[#263346] text-brand-charcoal dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-[#1E293B] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="w-7 h-7 rounded-lg bg-white dark:bg-[#151D2A] border border-amber-200 dark:border-[#263346] text-brand-charcoal dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-[#1E293B] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-2xs"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Toggle between Compact Carousel & View All Grid */}
          {items.length > 3 && (
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "carousel" ? "grid" : "carousel")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-200/80 dark:border-[#263346] bg-white dark:bg-[#151D2A] text-brand-charcoal dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-[#1E293B] text-xs font-bold transition-colors shadow-2xs"
            >
              {viewMode === "carousel" ? (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>View All ({items.length})</span>
                </>
              ) : (
                <>
                  <Columns className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Compact View</span>
                </>
              )}
            </button>
          )}

          {/* Minimize / Collapse Entire Banner */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            title="Minimize Check-outs Banner"
            aria-label="Minimize check-outs"
            className="w-7 h-7 rounded-lg bg-white dark:bg-[#151D2A] border border-amber-200/80 dark:border-[#263346] text-brand-muted dark:text-slate-300 hover:text-brand-charcoal dark:hover:text-white hover:bg-amber-50 dark:hover:bg-[#1E293B] flex items-center justify-center transition-colors shadow-2xs"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards Display: Carousel (Default) or Grid (View All) */}
      <div className="pt-3">
        {viewMode === "carousel" ? (
          /* Horizontal Single-Row Carousel: Never pushes the page down! */
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-1"
          >
            {items.map(({ resident, room, daysRemaining }) => (
              <div
                key={resident.id}
                onClick={() => onSelectResident(resident.id)}
                className="w-full sm:w-[320px] lg:w-[350px] flex-shrink-0 snap-start bg-white dark:bg-[#151D2A] rounded-xl border border-amber-200/70 dark:border-[#263346] p-3 flex items-center justify-between gap-3 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={resident.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                    alt={resident.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-[#2C384C] flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand-charcoal dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {resident.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-muted dark:text-slate-300 mt-0.5">
                      <span className="flex items-center gap-0.5 truncate">
                        <DoorClosed className="w-2.5 h-2.5 text-brand-muted dark:text-slate-400 flex-shrink-0" />
                        <span>Room {room.roomNumber} ({resident.bedNumber})</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-0.5 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                        <span>{resident.expectedCheckoutDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold border border-amber-200 dark:border-amber-500/30">
                    In {daysRemaining} days
                  </span>
                  {resident.pendingAmount > 0 ? (
                    <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center justify-end gap-0.5">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>Due: {formatINR(resident.pendingAmount)}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center justify-end gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>Rent Clear</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Multi-Row Grid: Available when user clicks "View All" */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fadeIn">
            {items.map(({ resident, room, daysRemaining }) => (
              <div
                key={resident.id}
                onClick={() => onSelectResident(resident.id)}
                className="bg-white dark:bg-[#151D2A] rounded-xl border border-amber-200/70 dark:border-[#263346] p-3 flex items-center justify-between gap-3 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={resident.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"}
                    alt={resident.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-[#2C384C] flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brand-charcoal dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {resident.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-muted dark:text-slate-300 mt-0.5">
                      <span className="flex items-center gap-0.5 truncate">
                        <DoorClosed className="w-2.5 h-2.5 text-brand-muted dark:text-slate-400 flex-shrink-0" />
                        <span>Room {room.roomNumber} ({resident.bedNumber})</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-0.5 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                        <span>{resident.expectedCheckoutDate}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold border border-amber-200 dark:border-amber-500/30">
                    In {daysRemaining} days
                  </span>
                  {resident.pendingAmount > 0 ? (
                    <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center justify-end gap-0.5">
                      <AlertCircle className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>Due: {formatINR(resident.pendingAmount)}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center justify-end gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0" />
                      <span>Rent Clear</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
