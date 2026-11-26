"use client";

import React from "react";
import { Resident } from "@/types/room";
import { useRoom } from "@/contexts/RoomContext";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Building2,
  BedDouble,
  Briefcase,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResidentDetailsModalProps {
  residentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResidentDetailsModal({
  residentId,
  isOpen,
  onClose,
}: ResidentDetailsModalProps) {
  const { allResidents, allPayments, allDeposits } = useRoom();

  if (!isOpen || !residentId) return null;

  const resident = allResidents.find((r) => r.id === residentId);
  if (!resident) return null;

  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  const residentPayments = allPayments.filter((p) => p.residentId === resident.id);
  const residentDeposits = allDeposits.filter((d) => d.residentId === resident.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#111622] rounded-3xl border border-brand-border dark:border-[#222E42] shadow-2xl overflow-y-auto z-10 animate-scaleUp no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-[#111622]/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-brand-border dark:border-[#1E2638] flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <img
              src={resident.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={resident.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-lime"
            />
            <div>
              <h3 className="text-base font-extrabold text-brand-charcoal dark:text-white">
                {resident.name}
              </h3>
              <p className="text-xs text-brand-muted dark:text-slate-400">
                Room {resident.roomNumber} · Bed {resident.bedNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1E2638] hover:bg-slate-200 dark:hover:bg-[#253248] text-brand-charcoal dark:text-white flex items-center justify-center transition-colors shadow-2xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-brand-charcoal dark:text-slate-200">
          {/* Status Alert Banner */}
          {resident.expectedCheckoutDate && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center justify-between shadow-2xs">
              <span className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Notice Active – Expected Checkout: {resident.expectedCheckoutDate}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-[10px] font-black uppercase border border-amber-300 dark:border-amber-500/40">
                Notice Period
              </span>
            </div>
          )}

          {/* Contact & Personal Information */}
          <div className="bg-slate-50/70 dark:bg-[#151D2A] rounded-2xl border border-slate-100 dark:border-[#263346] p-4 space-y-3 shadow-2xs">
            <h4 className="font-extrabold text-brand-charcoal dark:text-white uppercase text-[10px] tracking-wider text-brand-muted dark:text-slate-400">
              Personal & Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
                <span className="text-brand-muted dark:text-slate-400">Mobile:</span>
                <span className="font-semibold text-brand-charcoal dark:text-white">{resident.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
                <span className="text-brand-muted dark:text-slate-400">Email:</span>
                <span className="font-semibold text-brand-charcoal dark:text-white truncate">{resident.email}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Briefcase className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
                <span className="text-brand-muted dark:text-slate-400">Occupation:</span>
                <span className="font-semibold text-brand-charcoal dark:text-white">{resident.workOrCollege || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-brand-muted dark:text-slate-400">Emergency:</span>
                <span className="font-semibold text-brand-charcoal dark:text-white">{resident.emergencyContact}</span>
              </div>
              {resident.address && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-muted dark:text-slate-400" />
                  <span className="text-brand-muted dark:text-slate-400">Permanent Address:</span>
                  <span className="font-semibold text-brand-charcoal dark:text-white">{resident.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stay & Bed Allocation Details */}
          <div className="bg-slate-50/70 dark:bg-[#151D2A] rounded-2xl border border-slate-100 dark:border-[#263346] p-4 space-y-3 shadow-2xs">
            <h4 className="font-extrabold text-brand-charcoal dark:text-white uppercase text-[10px] tracking-wider text-brand-muted dark:text-slate-400">
              Stay & Room Allocation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white dark:bg-[#111622] p-2.5 rounded-xl border border-slate-200/70 dark:border-[#263346] shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                  Property
                </span>
                <span className="font-bold text-brand-charcoal dark:text-white truncate block">
                  {resident.propertyName || "StayManage"}
                </span>
              </div>
              <div className="bg-white dark:bg-[#111622] p-2.5 rounded-xl border border-slate-200/70 dark:border-[#263346] shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                  Room & Bed
                </span>
                <span className="font-bold text-brand-charcoal dark:text-white block">
                  {resident.roomNumber} ({resident.bedNumber})
                </span>
              </div>
              <div className="bg-white dark:bg-[#111622] p-2.5 rounded-xl border border-slate-200/70 dark:border-[#263346] shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                  Admission Date
                </span>
                <span className="font-bold text-brand-charcoal dark:text-white block">
                  {resident.admissionDate}
                </span>
              </div>
              <div className="bg-white dark:bg-[#111622] p-2.5 rounded-xl border border-slate-200/70 dark:border-[#263346] shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                  Living Since
                </span>
                <span className="font-bold text-brand-charcoal dark:text-white block">
                  {resident.livingSince}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary & Security Deposit */}
          <div className="bg-slate-50/70 dark:bg-[#151D2A] rounded-2xl border border-slate-100 dark:border-[#263346] p-4 space-y-3 shadow-2xs">
            <h4 className="font-extrabold text-brand-charcoal dark:text-white uppercase text-[10px] tracking-wider text-brand-muted dark:text-slate-400 flex items-center justify-between">
              <span>Financial Summary & Deposit Ledger</span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                Rent: {formatINR(resident.monthlyRent)}/mo
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-white dark:bg-[#111622] p-2.5 rounded-xl border border-slate-200/70 dark:border-[#263346] shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                  Total Billed
                </span>
                <span className="text-xs font-black text-brand-charcoal dark:text-white">
                  {formatINR(resident.totalRentBilled)}
                </span>
              </div>
              <div className="bg-white dark:bg-[#111622] p-2.5 rounded-xl border border-slate-200/70 dark:border-[#263346] shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                  Collected
                </span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                  {formatINR(resident.totalRentCollected)}
                </span>
              </div>
              <div className="bg-white dark:bg-[#111622] p-2.5 rounded-xl border border-slate-200/70 dark:border-[#263346] shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-brand-muted dark:text-slate-400 block">
                  Pending Due
                </span>
                <span className={cn("text-xs font-black", resident.pendingAmount > 0 ? "text-rose-600 dark:text-rose-400" : "text-brand-charcoal dark:text-white")}>
                  {formatINR(resident.pendingAmount)}
                </span>
              </div>
              <div className="bg-white dark:bg-[#111622] p-2.5 rounded-xl border border-purple-200/70 dark:border-purple-500/30 bg-purple-50/30 dark:bg-purple-500/10 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-purple-700 dark:text-purple-400 block">
                  Deposit Held
                </span>
                <span className="text-xs font-black text-purple-800 dark:text-purple-300">
                  {formatINR(resident.securityDeposit)}
                </span>
              </div>
            </div>

            {/* Note on security deposit segregation */}
            <p className="text-[10px] text-brand-muted dark:text-slate-400 italic pt-1">
              * Note: Security deposits are held separately in an escrow ledger and are not counted towards rent revenue.
            </p>
          </div>

          {/* Payment History List */}
          <div>
            <h4 className="font-extrabold text-brand-charcoal dark:text-white uppercase text-[10px] tracking-wider text-brand-muted dark:text-slate-400 mb-2">
              Payment Transactions
            </h4>
            {residentPayments.length === 0 ? (
              <p className="text-xs text-brand-muted dark:text-slate-400 italic">No payment transactions recorded yet.</p>
            ) : (
              <div className="border border-brand-border dark:border-[#263346] rounded-xl overflow-hidden shadow-2xs bg-white dark:bg-[#151D2A]">
                <div className="overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead className="bg-slate-50 dark:bg-[#111622] border-b border-brand-border dark:border-[#1E2638] text-[10px] font-bold uppercase text-brand-muted dark:text-slate-400">
                      <tr>
                        <th className="p-2.5 whitespace-nowrap">Date</th>
                        <th className="p-2.5 whitespace-nowrap">Invoice</th>
                        <th className="p-2.5 whitespace-nowrap text-right">Amount</th>
                        <th className="p-2.5 whitespace-nowrap">Method</th>
                        <th className="p-2.5 whitespace-nowrap text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638]">
                      {residentPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-[#1E2638]/50 transition-colors">
                          <td className="p-2.5 font-medium text-brand-charcoal dark:text-slate-200 whitespace-nowrap">{p.date}</td>
                          <td className="p-2.5 text-brand-muted dark:text-slate-400 font-mono whitespace-nowrap">{p.invoiceNumber}</td>
                          <td className="p-2.5 font-bold text-brand-charcoal dark:text-white whitespace-nowrap text-right">{formatINR(p.amount)}</td>
                          <td className="p-2.5 text-brand-muted dark:text-slate-400 whitespace-nowrap">{p.method || "Direct"}</td>
                          <td className="p-2.5 whitespace-nowrap text-center">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                                p.status === "completed"
                                  ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                                  : p.status === "pending"
                                  ? "bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
                                  : "bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30"
                              )}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-[#111622] px-5 sm:px-6 py-3 border-t border-brand-border dark:border-[#1E2638] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-obsidian dark:bg-brand-lime dark:text-brand-obsidian text-white text-xs font-bold hover:bg-brand-obsidian-hover dark:hover:bg-[#c9ef3b] shadow-xs transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
