"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOwner } from "@/contexts/OwnerContext";
import { Avatar } from "@/components/ui/Avatar";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Building,
} from "lucide-react";

export function ProfileDropdown() {
  const router = useRouter();
  const { ownerProfile } = useOwner();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    // Simulate session teardown and navigate to login screen
    router.push("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 p-1 pl-1 sm:pl-1.5 pr-1.5 sm:pr-2 shrink-0 rounded-xl border border-brand-border bg-white hover:bg-brand-offwhite transition-all shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian active:scale-95"
        aria-label="Owner account menu"
        aria-expanded={isOpen}
      >
        <Avatar
          initials={ownerProfile.initials}
          name={ownerProfile.name}
          size="sm"
          isOnline
        />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-brand-charcoal leading-tight">
            {ownerProfile.name}
          </span>
          <span className="text-[10px] text-brand-muted leading-tight">
            PG Owner
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-brand-muted ml-0.5 group-hover:text-brand-charcoal transition-transform" />
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 sm:hidden animate-fadeIn"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed left-3 right-3 top-16 max-w-xs mx-auto z-50 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mx-0 sm:mt-2 sm:w-64 sm:max-w-none rounded-2xl bg-white border border-brand-border shadow-2xl p-1.5 animate-fadeIn">
          {/* User details header */}
          <div className="p-2.5 pb-3 border-b border-brand-border/70">
            <p className="text-xs font-bold text-brand-charcoal">{ownerProfile.name}</p>
            <p className="text-[11px] text-brand-muted truncate">{ownerProfile.email}</p>
            <div className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded bg-brand-offwhite text-[10px] text-brand-charcoal font-medium border border-brand-border/70">
              <Building className="w-3 h-3 text-brand-muted" />
              <span className="truncate">{ownerProfile.businessName}</span>
            </div>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/owner/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-brand-charcoal rounded-lg hover:bg-brand-offwhite transition-colors"
            >
              <User className="w-4 h-4 text-brand-muted" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/owner/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-brand-charcoal rounded-lg hover:bg-brand-offwhite transition-colors"
            >
              <Settings className="w-4 h-4 text-brand-muted" />
              <span>Account Settings</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                alert("Help & Support: PGMaster 24/7 dedicated owner helpline is active at support@pgmaster.in");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-brand-charcoal rounded-lg hover:bg-brand-offwhite transition-colors text-left"
            >
              <HelpCircle className="w-4 h-4 text-brand-muted" />
              <span>Help & Support</span>
            </button>
          </div>

          {/* Logout */}
          <div className="pt-1 mt-1 border-t border-brand-border/70">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 rounded-lg hover:bg-red-50/70 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Log out</span>
            </button>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
