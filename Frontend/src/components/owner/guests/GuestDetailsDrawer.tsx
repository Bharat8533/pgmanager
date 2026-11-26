"use client";

import React, { useState } from "react";
import { Guest } from "@/types/guest";
import {
  X,
  Phone,
  Mail,
  Building2,
  BedDouble,
  Calendar,
  Clock,
  ShieldCheck,
  CreditCard,
  User,
  MapPin,
  Briefcase,
  AlertCircle,
  History,
  FileText,
  Edit,
  LogOut,
  CheckCircle2,
  Receipt,
  UserCheck,
} from "lucide-react";

interface GuestDetailsDrawerProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (guest: Guest) => void;
  onCheckout: (guest: Guest) => void;
}

type TabType = "personal" | "stay" | "financial" | "history";

export function GuestDetailsDrawer({
  guest,
  isOpen,
  onClose,
  onEdit,
  onCheckout,
}: GuestDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  if (!isOpen || !guest) return null;

  const getRentBadge = (status: Guest["rentStatus"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            Paid (No Dues)
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
            Pending ₹{guest.pendingAmount.toLocaleString("en-IN")}
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 animate-pulse" />
            Overdue ₹{guest.pendingAmount.toLocaleString("en-IN")}
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            Partial Paid (₹{guest.pendingAmount.toLocaleString("en-IN")} due)
          </span>
        );
    }
  };

  const getStayBadge = (status: Guest["stayStatus"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
            Currently Living
          </span>
        );
      case "upcoming":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40">
            Upcoming Move-In
          </span>
        );
      case "checked_out":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-black bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            Checked Out
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-xl bg-white dark:bg-[#111622] shadow-2xl flex flex-col justify-between border-l border-brand-border dark:border-[#222E42] animate-slideIn">
          {/* Top Header */}
          <div className="p-5 border-b border-brand-border dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0D111A]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-obsidian dark:bg-[#1E2638] text-brand-lime border border-transparent dark:border-[#263346] flex items-center justify-center font-black text-base shadow-xs flex-shrink-0">
                  {guest.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-brand-charcoal dark:text-white">
                      {guest.name}
                    </h3>
                    {guest.gender && (
                      <span className="text-xs text-brand-muted dark:text-slate-400 font-bold">
                        ({guest.gender})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted dark:text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
                      {guest.phone}
                    </span>
                    {guest.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
                        {guest.email}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStayBadge(guest.stayStatus)}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white dark:bg-[#151D2A] border border-brand-border dark:border-[#263346] text-brand-charcoal dark:text-slate-200">
                      {guest.propertyName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white dark:bg-[#151D2A] hover:bg-gray-100 dark:hover:bg-[#1E293B] text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white border border-brand-border dark:border-[#263346] flex items-center justify-center transition-all shadow-2xs"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-5 border-b border-brand-border/60 dark:border-[#1E2638] -mb-5 pb-0">
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === "personal"
                  ? "border-brand-obsidian dark:border-brand-lime text-brand-obsidian dark:text-brand-lime font-black"
                  : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white"
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("stay")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === "stay"
                  ? "border-brand-obsidian dark:border-brand-lime text-brand-obsidian dark:text-brand-lime font-black"
                  : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white"
                  }`}
              >
                <BedDouble className="w-3.5 h-3.5" />
                <span>Stay & Room</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("financial")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === "financial"
                  ? "border-brand-obsidian dark:border-brand-lime text-brand-obsidian dark:text-brand-lime font-black"
                  : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white"
                  }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Financials</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === "history"
                  ? "border-brand-obsidian dark:border-brand-lime text-brand-obsidian dark:text-brand-lime font-black"
                  : "border-transparent text-brand-muted dark:text-slate-400 hover:text-brand-charcoal dark:hover:text-white"
                  }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Stay History ({guest.stayHistory?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* TAB 1: PERSONAL DETAILS */}
            {activeTab === "personal" && (
              <div className="space-y-4">
                <div className="bg-[#F8FAFC] dark:bg-[#151D2A] rounded-2xl border border-brand-border dark:border-[#263346] p-4 space-y-3 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">
                    Contact & Identification
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Full Name</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">{guest.name}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Mobile Number</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">{guest.phone}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Email Address</p>
                      <p className="font-bold text-brand-charcoal dark:text-white truncate">
                        {guest.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Government ID (Aadhaar)</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">
                        {guest.aadhaarMasked || "•••• •••• 8291"}
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Gender / DOB</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">
                        {guest.gender || "Male"} · {guest.dateOfBirth || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Work / College</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">
                        {guest.workOrCollege || "Corporate Professional"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="bg-[#F8FAFC] dark:bg-[#151D2A] rounded-2xl border border-brand-border dark:border-[#263346] p-4 space-y-2 text-xs shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-obsidian dark:text-brand-lime" />
                    <span>Permanent Address</span>
                  </h4>
                  <p className="font-medium text-brand-charcoal dark:text-slate-200">
                    {guest.permanentAddress || "Civil Lines, Sector 14"}
                  </p>
                  <p className="text-brand-muted dark:text-slate-400 text-[11px]">
                    City: <span className="font-semibold text-brand-charcoal dark:text-white">{guest.city || "New Delhi"}</span> · State: <span className="font-semibold text-brand-charcoal dark:text-white">{guest.state || "Delhi"}</span>
                  </p>
                </div>

                {/* Emergency Contact */}
                <div className="bg-amber-50/60 dark:bg-[#151D2A] rounded-2xl border border-amber-200/80 dark:border-amber-500/30 p-4 space-y-2 text-xs shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                    <span>Emergency Contact</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <p className="text-amber-800 dark:text-slate-400 text-[11px]">Contact Person</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">
                        {guest.emergencyContactName} ({guest.emergencyRelationship})
                      </p>
                    </div>
                    <div>
                      <p className="text-amber-800 dark:text-slate-400 text-[11px]">Emergency Phone</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">
                        {guest.emergencyContactNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STAY & ROOM DETAILS */}
            {activeTab === "stay" && (
              <div className="space-y-4">
                <div className="bg-[#F8FAFC] dark:bg-[#151D2A] rounded-2xl border border-brand-border dark:border-[#263346] p-4 space-y-3 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">
                    Current Bed Allocation
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Assigned Property</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">{guest.propertyName}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Room Number</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">Room {guest.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Bed Number</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded font-black bg-brand-lime text-brand-obsidian dark:bg-brand-lime/15 dark:text-brand-lime dark:border dark:border-brand-lime/30">
                        Bed {guest.bedNumber}
                      </span>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Admission Date</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">{guest.admissionDate}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Stay Duration</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">{guest.livingSince}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Notice / Expected Checkout</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">
                        {guest.expectedCheckoutDate || "No notice served"}
                      </p>
                    </div>
                  </div>
                </div>

                {guest.actualCheckoutDate && (
                  <div className="bg-gray-100 dark:bg-[#151D2A] rounded-2xl border border-gray-300 dark:border-[#263346] p-4 text-xs space-y-1 shadow-2xs">
                    <p className="font-bold text-gray-800 dark:text-white">Actual Check-out Recorded</p>
                    <p className="text-gray-600 dark:text-slate-400">
                      Guest completed checkout on {guest.actualCheckoutDate}. Bed {guest.bedNumber} was released back to available inventory.
                    </p>
                  </div>
                )}

                {/* Special Preferences & Rules */}
                <div className="bg-white dark:bg-[#151D2A] rounded-2xl border border-brand-border dark:border-[#263346] p-4 space-y-2 text-xs shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-obsidian dark:text-brand-lime" />
                    <span>Special Notes & Rules</span>
                  </h4>
                  <p className="text-brand-charcoal dark:text-slate-300 font-medium">
                    {guest.specialNotes || "No special requests recorded. Follows standard PG rules."}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: FINANCIAL DETAILS */}
            {activeTab === "financial" && (
              <div className="space-y-4">
                {/* Rent Status Card */}
                <div className="bg-[#F8FAFC] dark:bg-[#151D2A] rounded-2xl border border-brand-border dark:border-[#263346] p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">
                      Rent Ledger
                    </span>
                    <div>{getRentBadge(guest.rentStatus)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Agreed Monthly Rent</p>
                      <p className="text-lg font-black text-brand-charcoal dark:text-white">
                        ₹{guest.monthlyRent.toLocaleString("en-IN")}/mo
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Outstanding Dues</p>
                      <p
                        className={`text-lg font-black ${guest.pendingAmount > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"
                          }`}
                      >
                        ₹{guest.pendingAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Total Rent Billed (Till Date)</p>
                      <p className="font-bold text-brand-charcoal dark:text-white">
                        ₹{guest.totalRentBilled.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-muted dark:text-slate-400 text-[11px]">Total Rent Collected</p>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400">
                        ₹{guest.totalRentCollected.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Deposit Escrow (Strictly separated from rent revenue!) */}
                <div className="bg-indigo-50/60 dark:bg-[#151D2A] rounded-2xl border border-indigo-200/80 dark:border-purple-500/30 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-purple-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-700 dark:text-purple-400" />
                      <span>Security Deposit (Refundable Escrow)</span>
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-purple-500/15 text-indigo-800 dark:text-purple-300 border border-transparent dark:border-purple-500/30">
                      Escrow Liability
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <p className="text-indigo-800 dark:text-slate-400 text-[11px]">Original Deposit Held</p>
                      <p className="text-base font-black text-indigo-950 dark:text-white">
                        ₹{guest.securityDeposit.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-indigo-800 dark:text-slate-400 text-[11px]">Current Escrow Balance</p>
                      <p className="text-base font-black text-indigo-700 dark:text-purple-300">
                        ₹{guest.depositBalance.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-indigo-800 dark:text-slate-400 text-[11px]">Deductions / Damages</p>
                      <p className="font-bold text-brand-charcoal dark:text-slate-200">
                        ₹{guest.depositAdjustments.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-indigo-800 dark:text-slate-400 text-[11px]">Refunded on Checkout</p>
                      <p className="font-bold text-emerald-800 dark:text-emerald-400">
                        ₹{guest.depositRefunded.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-indigo-900/70 dark:text-slate-400 italic border-t border-indigo-200/60 dark:border-[#1E2638] pt-2">
                    * Security deposits are held in refundable escrow liability and never counted towards operational monthly rent revenue.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: STAY HISTORY */}
            {activeTab === "history" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted dark:text-slate-400">
                  Chronological Stay Records
                </h4>

                {guest.stayHistory && guest.stayHistory.length > 0 ? (
                  <div className="space-y-2.5">
                    {guest.stayHistory.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-[#F8FAFC] dark:bg-[#151D2A] rounded-2xl border border-brand-border dark:border-[#263346] p-4 text-xs space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-charcoal dark:text-white text-sm">
                            {item.propertyName}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                            {item.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-muted dark:text-slate-400">
                          <div>
                            Room & Bed:{" "}
                            <span className="font-semibold text-brand-charcoal dark:text-white">
                              Room {item.roomNumber} ({item.bedNumber})
                            </span>
                          </div>
                          <div>
                            Rent:{" "}
                            <span className="font-semibold text-brand-charcoal dark:text-white">
                              ₹{item.monthlyRent.toLocaleString("en-IN")}/mo
                            </span>
                          </div>
                          <div>
                            Admitted:{" "}
                            <span className="font-semibold text-brand-charcoal dark:text-white">
                              {item.admissionDate}
                            </span>
                          </div>
                          <div>
                            Check-out:{" "}
                            <span className="font-semibold text-brand-charcoal dark:text-white">
                              {item.checkoutDate}
                            </span>
                          </div>
                        </div>

                        {item.notes && (
                          <p className="text-[11px] text-brand-muted/90 dark:text-slate-400 italic pt-1 border-t border-brand-border/40 dark:border-[#1E2638]">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-brand-muted dark:text-slate-400 italic">
                    No previous stay history recorded for this guest.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t border-brand-border dark:border-[#1E2638] bg-[#F8FAFC] dark:bg-[#0D111A] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-white dark:bg-[#151D2A] hover:bg-gray-100 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-white border border-brand-border dark:border-[#263346] rounded-xl transition-all shadow-2xs"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(guest);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white dark:bg-[#151D2A] hover:bg-gray-100 dark:hover:bg-[#1E293B] text-brand-charcoal dark:text-white border border-brand-border dark:border-[#263346] rounded-xl transition-all shadow-2xs"
              >
                <Edit className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
                <span>Edit Details</span>
              </button>

              {guest.stayStatus === "active" && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCheckout(guest);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Check Out Guest</span>
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

