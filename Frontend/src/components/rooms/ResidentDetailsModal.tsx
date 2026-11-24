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
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl border border-brand-border shadow-2xl overflow-y-auto z-10 animate-scaleUp no-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-brand-border flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <img
              src={resident.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={resident.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-lime"
            />
            <div>
              <h3 className="text-base font-extrabold text-brand-charcoal">
                {resident.name}
              </h3>
              <p className="text-xs text-brand-muted">
                Room {resident.roomNumber} · Bed {resident.bedNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-brand-charcoal flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-brand-charcoal">
          {/* Status Alert Banner */}
          {resident.expectedCheckoutDate && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Notice Active – Expected Checkout: {resident.expectedCheckoutDate}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                Notice Period
              </span>
            </div>
          )}

          {/* Contact & Personal Information */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
            <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted">
              Personal & Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-muted" />
                <span className="text-brand-muted">Mobile:</span>
                <span className="font-semibold text-brand-charcoal">{resident.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-muted" />
                <span className="text-brand-muted">Email:</span>
                <span className="font-semibold text-brand-charcoal truncate">{resident.email}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Briefcase className="w-3.5 h-3.5 text-brand-muted" />
                <span className="text-brand-muted">Occupation:</span>
                <span className="font-semibold text-brand-charcoal">{resident.workOrCollege || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-brand-muted">Emergency:</span>
                <span className="font-semibold text-brand-charcoal">{resident.emergencyContact}</span>
              </div>
              {resident.address && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-muted" />
                  <span className="text-brand-muted">Permanent Address:</span>
                  <span className="font-semibold text-brand-charcoal">{resident.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stay & Bed Allocation Details */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
            <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted">
              Stay & Room Allocation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[9px] uppercase font-bold text-brand-muted block">
                  Property
                </span>
                <span className="font-bold text-brand-charcoal truncate block">
                  {resident.propertyName || "StayManage"}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[9px] uppercase font-bold text-brand-muted block">
                  Room & Bed
                </span>
                <span className="font-bold text-brand-charcoal block">
                  {resident.roomNumber} ({resident.bedNumber})
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[9px] uppercase font-bold text-brand-muted block">
                  Admission Date
                </span>
                <span className="font-bold text-brand-charcoal block">
                  {resident.admissionDate}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[9px] uppercase font-bold text-brand-muted block">
                  Living Since
                </span>
                <span className="font-bold text-brand-charcoal block">
                  {resident.livingSince}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary & Security Deposit */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-100 p-4 space-y-3">
            <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted flex items-center justify-between">
              <span>Financial Summary & Deposit Ledger</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Rent: {formatINR(resident.monthlyRent)}/mo
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[9px] uppercase font-bold text-brand-muted block">
                  Total Billed
                </span>
                <span className="text-xs font-black text-brand-charcoal">
                  {formatINR(resident.totalRentBilled)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[9px] uppercase font-bold text-emerald-700 block">
                  Collected
                </span>
                <span className="text-xs font-black text-emerald-700">
                  {formatINR(resident.totalRentCollected)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-[9px] uppercase font-bold text-brand-muted block">
                  Pending Due
                </span>
                <span className={cn("text-xs font-black", resident.pendingAmount > 0 ? "text-rose-600" : "text-brand-charcoal")}>
                  {formatINR(resident.pendingAmount)}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-purple-200/70 bg-purple-50/30">
                <span className="text-[9px] uppercase font-bold text-purple-700 block">
                  Deposit Held
                </span>
                <span className="text-xs font-black text-purple-800">
                  {formatINR(resident.securityDeposit)}
                </span>
              </div>
            </div>

            {/* Note on security deposit segregation */}
            <p className="text-[10px] text-brand-muted italic pt-1">
              * Note: Security deposits are held separately in an escrow ledger and are not counted towards rent revenue.
            </p>
          </div>

          {/* Payment History List */}
          <div>
            <h4 className="font-extrabold text-brand-charcoal uppercase text-[10px] tracking-wider text-brand-muted mb-2">
              Payment Transactions
            </h4>
            {residentPayments.length === 0 ? (
              <p className="text-xs text-brand-muted italic">No payment transactions recorded yet.</p>
            ) : (
              <div className="border border-brand-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-brand-border text-[10px] font-bold uppercase text-brand-muted">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Invoice</th>
                      <th className="p-2.5">Amount</th>
                      <th className="p-2.5">Method</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {residentPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60">
                        <td className="p-2.5 font-medium">{p.date}</td>
                        <td className="p-2.5 text-brand-muted font-mono">{p.invoiceNumber}</td>
                        <td className="p-2.5 font-bold text-brand-charcoal">{formatINR(p.amount)}</td>
                        <td className="p-2.5 text-brand-muted">{p.method || "Direct"}</td>
                        <td className="p-2.5">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                              p.status === "completed"
                                ? "bg-emerald-50 text-emerald-800"
                                : p.status === "pending"
                                ? "bg-amber-50 text-amber-800"
                                : "bg-rose-50 text-rose-800"
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
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white px-5 sm:px-6 py-3 border-t border-brand-border flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-obsidian text-white text-xs font-bold hover:bg-brand-obsidian-hover shadow-xs transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
