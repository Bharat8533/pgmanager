"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOwner } from "@/contexts/OwnerContext";
import { OWNER_NAVIGATION } from "@/constants/navigation";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  LayoutDashboard,
  Building2,
  Users,
  BedDouble,
  CalendarCheck,
  CreditCard,
  Wallet,
  AlertCircle,
  UserCheck,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4 flex-shrink-0" />,
  Building2: <Building2 className="w-4 h-4 flex-shrink-0" />,
  Users: <Users className="w-4 h-4 flex-shrink-0" />,
  BedDouble: <BedDouble className="w-4 h-4 flex-shrink-0" />,
  CalendarCheck: <CalendarCheck className="w-4 h-4 flex-shrink-0" />,
  CreditCard: <CreditCard className="w-4 h-4 flex-shrink-0" />,
  Wallet: <Wallet className="w-4 h-4 flex-shrink-0" />,
  AlertCircle: <AlertCircle className="w-4 h-4 flex-shrink-0" />,
  UserCheck: <UserCheck className="w-4 h-4 flex-shrink-0" />,
  BarChart3: <BarChart3 className="w-4 h-4 flex-shrink-0" />,
  Settings: <Settings className="w-4 h-4 flex-shrink-0" />,
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface NavListProps {
  isMobile?: boolean;
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

function NavList({ isMobile = false, isCollapsed = false, onItemClick }: NavListProps) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const isInitialMount = React.useRef(true);

  const effectivePath = pendingHref || pathname;

  const activeItemIndex = React.useMemo(() => {
    return OWNER_NAVIGATION.findIndex((item) => {
      if (item.href === "/owner/dashboard") {
        return effectivePath === "/owner/dashboard" || effectivePath === "/owner";
      }
      return effectivePath === item.href || effectivePath.startsWith(item.href + "/");
    });
  }, [effectivePath]);

  const initialTop = React.useMemo(() => {
    return activeItemIndex >= 0 ? 14 + activeItemIndex * 48 : 14;
  }, [activeItemIndex]);

  const [indicator, setIndicator] = React.useState<{
    top: number;
    height: number;
    ready: boolean;
  }>({
    top: initialTop,
    height: 44,
    ready: activeItemIndex >= 0,
  });

  // Clear pending state when navigation completes
  React.useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const updatePosition = React.useCallback(() => {
    if (activeItemIndex === -1) {
      setIndicator((prev) => ({ ...prev, ready: false }));
      return;
    }
    const activeEl = itemRefs.current[activeItemIndex];
    if (activeEl) {
      setIndicator({
        top: activeEl.offsetTop,
        height: activeEl.offsetHeight,
        ready: true,
      });
    }
  }, [activeItemIndex]);

  useIsomorphicLayoutEffect(() => {
    updatePosition();

    if (isInitialMount.current) {
      const frame = requestAnimationFrame(() => {
        isInitialMount.current = false;
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [updatePosition, isCollapsed]);

  React.useEffect(() => {
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  return (
    <nav
      ref={navRef}
      className="relative flex flex-col gap-1 py-3.5 w-full select-none"
    >
      {/* =========================================================================
          SLIDING ACTIVE TAB CUTOUT
          - Moves vertically with silky-smooth cubic-bezier transition
          - Top and bottom concave curves slide seamlessly with it
          - In light mode: matches main content area (#F8FAFC)
          - In dark mode: pure white (#FFFFFF) for high contrast as requested
          ========================================================================= */}
      <div
        className={cn(
          "absolute right-0 top-0 w-[calc(100%-14px)] bg-[#F8FAFC] dark:bg-white sidebar-active-tab rounded-l-2xl shadow-xs pointer-events-none z-0",
          indicator.ready ? "opacity-100" : "opacity-0"
        )}
        style={{
          transform: `translate3d(0, ${indicator.top}px, 0)`,
          height: `${indicator.height}px`,
          transition: isInitialMount.current
            ? "none"
            : "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), width 300ms cubic-bezier(0.16, 1, 0.3, 1), height 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease",
        }}
      >
        {/* Top concave cutout curve */}
        <div className="absolute -top-3.5 right-0 w-3.5 h-3.5 pointer-events-none z-10">
          <svg
            viewBox="0 0 14 14"
            className="w-3.5 h-3.5 text-[#F8FAFC] dark:text-white sidebar-active-tab-curve"
            fill="currentColor"
          >
            <path d="M 14 0 L 14 14 L 0 14 A 14 14 0 0 0 14 0 Z" />
          </svg>
        </div>

        {/* Bottom concave cutout curve */}
        <div className="absolute -bottom-3.5 right-0 w-3.5 h-3.5 pointer-events-none z-10">
          <svg
            viewBox="0 0 14 14"
            className="w-3.5 h-3.5 text-[#F8FAFC] dark:text-white sidebar-active-tab-curve"
            fill="currentColor"
          >
            <path d="M 14 14 L 14 0 L 0 0 A 14 14 0 0 1 14 14 Z" />
          </svg>
        </div>
      </div>

      {/* Navigation Items */}
      {OWNER_NAVIGATION.map((item, index) => {
        const isActive = index === activeItemIndex;
        const icon = ICON_MAP[item.iconName] || <LayoutDashboard className="w-4 h-4 flex-shrink-0" />;

        if (isCollapsed && !isMobile) {
          return (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="w-full flex justify-end relative z-10"
            >
              <Tooltip
                content={
                  <div className="flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-brand-lime text-brand-obsidian shadow-2xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                }
                side="right"
                containerClassName="w-full flex justify-end"
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    setPendingHref(item.href);
                    if (onItemClick) onItemClick();
                  }}
                  className={cn(
                    "relative w-[calc(100%-14px)] h-11 ml-auto mr-0 rounded-l-2xl flex items-center justify-center pr-3.5 transition-colors duration-200 select-none group",
                    isActive
                      ? "text-brand-obsidian font-bold sidebar-active-item"
                      : "text-white/70 hover:text-white hover:bg-white/10 font-medium"
                  )}
                >
                  <div
                    className={cn(
                      "relative flex items-center justify-center flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-brand-obsidian" : "text-white/70 group-hover:text-white"
                    )}
                  >
                    {icon}

                    {/* Collapsed badge notification dot anchored cleanly to icon */}
                    {item.badge && (
                      <span
                        className={cn(
                          "absolute -top-1 -right-1 w-2 h-2 rounded-full ring-1.5 ring-brand-obsidian transition-colors",
                          isActive ? "bg-brand-obsidian" : "bg-brand-lime"
                        )}
                      />
                    )}
                  </div>
                </Link>
              </Tooltip>
            </div>
          );
        }

        return (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="w-full flex justify-end relative z-10"
          >
            <Link
              href={item.href}
              onClick={() => {
                setPendingHref(item.href);
                if (onItemClick) onItemClick();
              }}
              className={cn(
                "relative w-[calc(100%-14px)] h-11 ml-auto mr-0 rounded-l-2xl pl-3.5 pr-2.5 flex items-center transition-colors duration-200 select-none group",
                isActive
                  ? "text-brand-obsidian font-bold sidebar-active-item"
                  : "text-white/70 hover:text-white hover:bg-white/10 font-medium"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-brand-obsidian" : "text-white/70 group-hover:text-white"
                )}
              >
                {icon}
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0 ml-3 pr-1">
                <span
                  className={cn(
                    "text-xs tracking-tight truncate",
                    isActive ? "text-brand-obsidian font-bold" : "text-white/80 group-hover:text-white font-medium"
                  )}
                >
                  {item.label}
                </span>

                {item.badge ? (
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1.5 flex-shrink-0 shadow-2xs transition-colors duration-200",
                      isActive
                        ? "bg-brand-obsidian text-brand-lime"
                        : "bg-brand-lime text-brand-obsidian"
                    )}
                  >
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-lime ring-2 ring-brand-obsidian/20 ml-auto mr-1 animate-fadeIn" />
                ) : null}
              </div>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

export function OwnerSidebar() {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    closeMobileSidebar,
    selectedProperty,
  } = useOwner();

  return (
    <>
      {/* =========================================================================
          1. DESKTOP / TABLET OBSIDIAN SIDEBAR
          - Sidebar toggle button lives INSIDE the sidebar top header!
          - Sliding active cutout tab glides smoothly with curved SVG cutouts!
          ========================================================================= */}
      <aside
        className={cn(
          "hidden lg:flex flex-col justify-between bg-brand-obsidian text-white h-screen sticky top-0 transition-all duration-300 z-30 select-none overflow-hidden",
          isSidebarCollapsed ? "w-20" : "w-60"
        )}
      >
        {/* Top Header Section with Toggle Button INSIDE Sidebar Top */}
        <div className="flex-shrink-0 border-b border-white/10">
          <div
            className={cn(
              "h-14 flex items-center px-3.5 transition-all",
              isSidebarCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {isSidebarCollapsed ? (
              /* When Collapsed: Single prominent toggle button to expand */
              <Tooltip content="Expand sidebar" side="right">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen className="w-5 h-5 text-brand-lime" />
                </button>
              </Tooltip>
            ) : (
              /* When Expanded: Logo, Title, and Collapse Button INSIDE Sidebar Top */
              <>
                <Link
                  href="/owner/dashboard"
                  className="flex items-center gap-2.5 focus:outline-none group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white text-brand-obsidian flex items-center justify-center shadow-xs flex-shrink-0 transition-transform group-hover:scale-105">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-brand-obsidian"
                    >
                      <rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="currentColor" strokeWidth="2" />
                      <line x1="3.5" y1="12" x2="20.5" y2="12" stroke="currentColor" strokeWidth="1.6" strokeDasharray="1 1" />
                      <line x1="12" y1="5" x2="12" y2="20.5" stroke="currentColor" strokeWidth="1.6" />
                      <rect x="5.5" y="7" width="4.5" height="3.5" rx="0.75" fill="#C6F36B" />
                      <path d="M10 20.5V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20.5" stroke="#C6F36B" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center">
                      <span className="text-sm font-extrabold text-white tracking-tight">
                        PG<span className="text-white/90">Master</span>
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-lime ml-1 ring-1 ring-white/20" />
                    </div>
                    <span className="text-[9px] text-white/50 font-bold tracking-wider uppercase -mt-0.5">
                      Owner Panel
                    </span>
                  </div>
                </Link>

                {/* Collapse button inside sidebar top */}
                <Tooltip content="Collapse sidebar" side="bottom">
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime"
                    aria-label="Collapse sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </Tooltip>
              </>
            )}
          </div>

          {/* Quick Subtitle / Tagline Pill (when expanded) */}
          {!isSidebarCollapsed && (
            <div className="px-3.5 pt-2 pb-2">
              <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[10px] font-bold text-white/70 uppercase tracking-wider">
                <span>Your PG. Your Control.</span>
                <Sparkles className="w-3 h-3 text-brand-lime" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links Area (flex-1 min-h-0 with no-scrollbar) */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-0 no-scrollbar">
          <NavList isMobile={false} isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="flex-shrink-0 p-3 border-t border-white/10 bg-brand-obsidian">
          {isSidebarCollapsed ? (
            <div className="flex justify-center w-full">
              <Tooltip
                content={`Active: ${selectedProperty?.name || "None"}`}
                side="right"
                containerClassName="w-full flex justify-center"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-brand-lime shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
              </Tooltip>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-lime/20 border border-brand-lime/30 text-brand-lime flex items-center justify-center flex-shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] uppercase font-bold text-white/40 tracking-wider">
                  Active Property
                </p>
                <p className="text-xs font-bold text-white truncate">
                  {selectedProperty ? selectedProperty.name : "None Selected"}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE OFF-CANVAS SIDEBAR DRAWER (Responsive)
          ========================================================================= */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />

          {/* Slide-over Drawer */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-brand-obsidian text-white flex flex-col justify-between shadow-2xl z-50 border-r border-white/10 animate-slideIn">
            <div>
              {/* Mobile Drawer Header */}
              <div className="h-14 flex items-center justify-between border-b border-white/10 px-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white text-brand-obsidian flex items-center justify-center shadow-xs">
                    <Building2 className="w-4 h-4 text-brand-obsidian" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">PGMaster</h3>
                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider -mt-0.5">
                      PG Owner Panel
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMobileSidebar}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Tagline */}
              <div className="px-5 pt-3 pb-1">
                <div className="px-3 py-1.5 rounded-xl bg-white/5 text-[11px] font-bold text-white/80 flex items-center justify-between border border-white/10">
                  <span>Your PG. Your Control.</span>
                  <Sparkles className="w-3.5 h-3.5 text-brand-lime" />
                </div>
              </div>

              {/* Navigation Items */}
              <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-0 no-scrollbar">
                <NavList
                  isMobile={true}
                  isCollapsed={false}
                  onItemClick={closeMobileSidebar}
                />
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 border-t border-white/10 bg-white/5 text-center">
              <p className="text-[11px] text-white/50 font-medium">
                © 2026 PGMaster Technologies Inc.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
