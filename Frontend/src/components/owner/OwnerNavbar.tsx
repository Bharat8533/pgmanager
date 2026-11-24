"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOwner } from "@/contexts/OwnerContext";
import { getOwnerPageMetadata } from "@/constants/navigation";
import { PropertySwitcher } from "@/components/owner/PropertySwitcher";
import { NotificationDropdown } from "@/components/owner/NotificationDropdown";
import { ProfileDropdown } from "@/components/owner/ProfileDropdown";
import { Menu, ChevronRight } from "lucide-react";

export function OwnerNavbar() {
  const pathname = usePathname();
  const { openMobileSidebar } = useOwner();

  const metadata = getOwnerPageMetadata(pathname);

  return (
    <header className="h-14 sticky top-0 z-20 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-4 sm:px-6 transition-all select-none">
      {/* Left Section: Only Meta Link Title / Breadcrumb as requested (Toggle button moved to sidebar) */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile Hamburger Button (< lg) */}
        <button
          type="button"
          onClick={openMobileSidebar}
          className="lg:hidden w-8 h-8 rounded-lg border border-brand-border flex items-center justify-center text-brand-charcoal hover:bg-white transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Clean Meta Link Title & Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-muted truncate">
          <Link
            href="/owner/dashboard"
            className="text-brand-muted/80 hover:text-brand-charcoal transition-colors font-medium"
          >
            Owner Panel
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-brand-muted/40 flex-shrink-0" />
          <span className="font-bold text-brand-charcoal tracking-tight truncate">
            {metadata.title}
          </span>
        </nav>
      </div>

      {/* Right Section: Owner Controls (Property Switcher, Notifications, Profile) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Multi-Property Switcher */}
        <PropertySwitcher />

        {/* Vertical Divider */}
        <div className="h-5 w-px bg-brand-border hidden sm:block" />

        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* Owner Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
