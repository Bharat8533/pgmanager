import React, { Suspense } from "react";
import type { Metadata } from "next";
import { OwnerProvider } from "@/contexts/OwnerContext";
import { RoomProvider } from "@/contexts/RoomContext";
import { OwnerSidebar } from "@/components/owner/OwnerSidebar";
import { OwnerNavbar } from "@/components/owner/OwnerNavbar";

export const metadata: Metadata = {
  title: "PG Owner Panel – StayManage",
  description: "StayManage Owner Panel: Manage properties, rooms, beds, tenants, and daily PG operations.",
};

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OwnerProvider>
      <RoomProvider>
        <div className="min-h-screen flex bg-[#F8FAFC] text-brand-charcoal antialiased">
          {/* Left Sidebar (Desktop persistent + Mobile off-canvas drawer) */}
          <Suspense fallback={<div className="hidden lg:block w-60 h-screen bg-brand-obsidian" />}>
            <OwnerSidebar />
          </Suspense>

          {/* Right Main Container */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {/* Top Navbar */}
            <Suspense fallback={<div className="h-14 border-b border-brand-border bg-white" />}>
              <OwnerNavbar />
            </Suspense>

            {/* Main Content Area */}
            <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden min-w-0">
              <div className="max-w-7xl mx-auto w-full min-w-0">
                <Suspense fallback={<div className="p-8 text-center text-xs text-brand-muted">Loading content...</div>}>
                  {children}
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      </RoomProvider>
    </OwnerProvider>
  );
}
