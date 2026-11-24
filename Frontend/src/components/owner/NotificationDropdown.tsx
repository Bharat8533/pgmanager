"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOwner } from "@/contexts/OwnerContext";
import {
  Bell,
  CheckCheck,
  CreditCard,
  AlertCircle,
  UserCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationDropdown() {
  const { notifications, unreadNotificationCount, markAsRead, markAllNotificationsAsRead } =
    useOwner();

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-3.5 h-3.5 text-emerald-700" />;
      case "complaint":
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      case "admission":
        return <UserCheck className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-brand-charcoal" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg border border-brand-border bg-white hover:bg-brand-offwhite flex items-center justify-center text-brand-charcoal transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4 text-brand-charcoal" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-obsidian text-brand-lime text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
            {unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-brand-border shadow-xl z-50 p-2 animate-fadeIn">
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-brand-border/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-brand-charcoal">Notifications</h4>
              {unreadNotificationCount > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-lime/40 text-brand-charcoal border border-[#b4e655]">
                  {unreadNotificationCount} New
                </span>
              )}
            </div>

            {unreadNotificationCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="text-[11px] font-medium text-brand-muted hover:text-brand-charcoal flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto py-1 divide-y divide-brand-border/50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-brand-muted">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={cn(
                    "p-3 flex items-start gap-3 cursor-pointer transition-colors rounded-lg",
                    notif.isRead
                      ? "opacity-75 hover:bg-brand-offwhite/50"
                      : "bg-brand-offwhite/80 hover:bg-brand-offwhite"
                  )}
                >
                  <div className="w-7 h-7 rounded-md bg-white border border-brand-border flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={cn(
                          "text-xs font-semibold text-brand-charcoal truncate",
                          !notif.isRead && "font-bold"
                        )}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand-lime flex-shrink-0 ring-1 ring-brand-charcoal/20" />
                      )}
                    </div>
                    <p className="text-[11px] text-brand-muted mt-0.5 leading-snug line-clamp-2">
                      {notif.description}
                    </p>
                    <span className="text-[10px] text-brand-muted/80 block mt-1">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 mt-1 border-t border-brand-border/70 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                alert("All Notifications Center: Full audit feed will open in upcoming release.");
              }}
              className="text-xs font-semibold text-brand-charcoal hover:underline inline-flex items-center gap-1 py-1"
            >
              <span>View All Notifications</span>
              <ExternalLink className="w-3 h-3 text-brand-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
