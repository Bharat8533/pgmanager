"use client";

import React, { useState } from "react";
import {
  Clock,
  AlertTriangle,
  Phone,
  MessageSquare,
  Copy,
  Check,
  Plus,
  Calendar,
  Filter,
} from "lucide-react";
import { RentLedgerItem, OutstandingAgingSummary } from "@/types/payment";

interface PendingDuesTabProps {
  ledger: RentLedgerItem[];
  propertyName: string;
  onRecordPayment: (item: RentLedgerItem) => void;
  onViewDetails: (item: RentLedgerItem) => void;
}

export const PendingDuesTab: React.FC<PendingDuesTabProps> = ({
  ledger,
  propertyName,
  onRecordPayment,
  onViewDetails,
}) => {
  const [filterMode, setFilterMode] = useState<"all" | "due_soon" | "overdue" | "partial">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const now = new Date();
  const pendingItems = ledger.filter((l) => l.pendingAmount > 0);

  // Calculate Aging Breakdown
  const aging: OutstandingAgingSummary = {
    notYetDue: { count: 0, amount: 0 },
    days1to7: { count: 0, amount: 0 },
    days8to15: { count: 0, amount: 0 },
    days16to30: { count: 0, amount: 0 },
    daysAbove30: { count: 0, amount: 0 },
    totalOutstanding: 0,
  };

  pendingItems.forEach((item) => {
    const dueDate = new Date(item.dueDate);
    const diff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    aging.totalOutstanding += item.pendingAmount;

    if (diff <= 0) {
      aging.notYetDue.count++;
      aging.notYetDue.amount += item.pendingAmount;
    } else if (diff <= 7) {
      aging.days1to7.count++;
      aging.days1to7.amount += item.pendingAmount;
    } else if (diff <= 15) {
      aging.days8to15.count++;
      aging.days8to15.amount += item.pendingAmount;
    } else if (diff <= 30) {
      aging.days16to30.count++;
      aging.days16to30.amount += item.pendingAmount;
    } else {
      aging.daysAbove30.count++;
      aging.daysAbove30.amount += item.pendingAmount;
    }
  });

  // Filtered by sub-tab
  const filteredPending = pendingItems.filter((item) => {
    const isDuePassed = new Date(item.dueDate) < now;
    if (filterMode === "due_soon") return !isDuePassed;
    if (filterMode === "overdue") return isDuePassed;
    if (filterMode === "partial") return item.paidAmount > 0;
    return true;
  });

  const handleCopyReminder = (item: RentLedgerItem) => {
    const msg = `Hello ${item.residentName}, this is a gentle reminder that your rent of ₹${item.pendingAmount.toLocaleString("en-IN")} for ${item.billingMonth} is pending at ${propertyName}. Kindly clear the dues at your earliest. Thank you!`;
    navigator.clipboard.writeText(msg);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleWhatsAppChat = (item: RentLedgerItem) => {
    const cleanPhone = item.residentPhone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${item.residentName}, this is a gentle reminder that your rent of ₹${item.pendingAmount.toLocaleString("en-IN")} for ${item.billingMonth} is pending at ${propertyName}. Kindly clear the dues at your earliest. Thank you!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Aging Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl border border-[#E2E5DF] p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#777D78] block">Not Yet Due</span>
          <p className="text-base sm:text-lg font-black text-[#171A18] my-1">
            ₹{aging.notYetDue.amount.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#777D78]">{aging.notYetDue.count} residents</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#FDE68A] p-3.5 shadow-2xs bg-[#FEF3C7]/20">
          <span className="text-[10px] font-bold uppercase text-[#B45309] block">1–7 Days Overdue</span>
          <p className="text-base sm:text-lg font-black text-[#B45309] my-1">
            ₹{aging.days1to7.amount.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#B45309]">{aging.days1to7.count} residents</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#FDBA74] p-3.5 shadow-2xs bg-[#FFF7ED]/30">
          <span className="text-[10px] font-bold uppercase text-[#C2410C] block">8–15 Days Overdue</span>
          <p className="text-base sm:text-lg font-black text-[#C2410C] my-1">
            ₹{aging.days8to15.amount.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#C2410C]">{aging.days8to15.count} residents</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#FCA5A5] p-3.5 shadow-2xs bg-[#FEF2F2]/40">
          <span className="text-[10px] font-bold uppercase text-[#DC2626] block">16–30 Days Overdue</span>
          <p className="text-base sm:text-lg font-black text-[#DC2626] my-1">
            ₹{aging.days16to30.amount.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#DC2626]">{aging.days16to30.count} residents</span>
        </div>

        <div className="bg-white rounded-2xl border border-red-300 p-3.5 shadow-2xs bg-red-50/50 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase text-red-700 block">&gt; 30 Days Overdue</span>
          <p className="text-base sm:text-lg font-black text-red-700 my-1">
            ₹{aging.daysAbove30.amount.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-red-700">{aging.daysAbove30.count} critical</span>
        </div>
      </div>

      {/* Sub-Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2E5DF] shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F5F2] p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === "all" ? "bg-white text-[#171A18] shadow-2xs font-bold" : "text-[#777D78]"
            }`}
          >
            All Pending ({pendingItems.length})
          </button>
          <button
            onClick={() => setFilterMode("overdue")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === "overdue" ? "bg-white text-red-600 shadow-2xs font-bold" : "text-[#777D78]"
            }`}
          >
            Overdue Dues
          </button>
          <button
            onClick={() => setFilterMode("partial")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === "partial" ? "bg-white text-[#B45309] shadow-2xs font-bold" : "text-[#777D78]"
            }`}
          >
            Partially Paid
          </button>
          <button
            onClick={() => setFilterMode("due_soon")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === "due_soon" ? "bg-white text-[#171A18] shadow-2xs font-bold" : "text-[#777D78]"
            }`}
          >
            Due Soon
          </button>
        </div>

        <span className="text-xs font-semibold text-[#777D78]">
          Total Outstanding: <strong className="text-red-600 font-extrabold">₹{aging.totalOutstanding.toLocaleString("en-IN")}</strong>
        </span>
      </div>

      {/* Pending Table & Responsive Mobile Cards */}
      <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-xs overflow-hidden">
        {/* Desktop Table (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F0F2EE] bg-[#FAFAF8] text-[11px] font-bold text-[#777D78] uppercase tracking-wider">
                <th className="py-3.5 px-6">Resident & Room</th>
                <th className="py-3.5 px-4">Billing Month</th>
                <th className="py-3.5 px-4 text-right">Pending Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-center">Aging Status</th>
                <th className="py-3.5 px-6 text-right">Remind & Collect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2EE]">
              {filteredPending.map((item) => {
                const dueDate = new Date(item.dueDate);
                const diff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                const daysOverdue = diff > 0 ? diff : 0;
                const isCopied = copiedId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-[#F9FAF8] transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-extrabold text-[#171A18] text-sm">{item.residentName}</div>
                      <div className="text-[11px] text-[#777D78] flex items-center gap-2 mt-0.5 font-medium">
                        <span className="text-[#171A18]">Room {item.roomNumber} ({item.bedNumber})</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-[#777D78]">
                          <Phone className="w-3 h-3" />
                          {item.residentPhone}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-medium text-[#171A18]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAFAF8] border border-[#E2E5DF]">
                        <Calendar className="w-3 h-3 text-[#777D78]" />
                        {item.billingMonth}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap font-black text-sm text-red-600">
                      ₹{item.pendingAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-medium text-[#777D78]">
                      {item.dueDate}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {daysOverdue > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{daysOverdue} days overdue</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]/50">
                          <Clock className="w-3 h-3" />
                          <span>Due Soon</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Copy reminder button */}
                        <button
                          type="button"
                          onClick={() => handleCopyReminder(item)}
                          className="p-1.5 text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-xl transition-all border border-[#E2E5DF]"
                          title="Copy payment reminder text"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
                        </button>

                        {/* WhatsApp click-to-chat */}
                        <button
                          type="button"
                          onClick={() => handleWhatsAppChat(item)}
                          className="p-1.5 text-[#047857] hover:bg-[#ECFDF5] border border-transparent hover:border-[#A7F3D0] rounded-xl transition-all"
                          title="Open WhatsApp chat with pre-filled reminder"
                        >
                          <MessageSquare className="w-4 h-4 text-[#047857]" />
                        </button>

                        {/* Record Payment */}
                        <button
                          type="button"
                          onClick={() => onRecordPayment(item)}
                          className="px-3 py-1.5 bg-[#C6F36B] hover:bg-[#bbf057] text-[#171A18] rounded-xl text-xs font-black transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          Pay
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (md:hidden) */}
        <div className="md:hidden divide-y divide-[#F0F2EE]">
          {filteredPending.map((item) => {
            const dueDate = new Date(item.dueDate);
            const diff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
            const daysOverdue = diff > 0 ? diff : 0;
            const isCopied = copiedId === item.id;

            return (
              <div key={`pending-mob-${item.id}`} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#171A18]">{item.residentName}</h4>
                    <span className="text-[11px] text-[#777D78]">
                      Room {item.roomNumber} ({item.bedNumber}) • {item.residentPhone}
                    </span>
                  </div>

                  <span className="font-black text-sm text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg">
                    ₹{item.pendingAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#777D78] bg-[#FAFAF8] p-2.5 rounded-xl border border-[#E2E5DF]">
                  <div>
                    <span>Month: <strong className="text-[#171A18]">{item.billingMonth}</strong></span>
                    <span className="mx-1.5">•</span>
                    <span>Due: <strong className="text-[#171A18]">{item.dueDate}</strong></span>
                  </div>
                  <div>
                    {daysOverdue > 0 ? (
                      <span className="text-red-600 font-bold">{daysOverdue}d overdue</span>
                    ) : (
                      <span className="text-green-600 font-bold">Due soon</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyReminder(item)}
                      className="p-2 text-[#777D78] hover:text-[#171A18] bg-[#FAFAF8] rounded-xl border border-[#E2E5DF]"
                      title="Copy reminder"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWhatsAppChat(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] rounded-xl text-xs font-bold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRecordPayment(item)}
                    className="px-4 py-1.5 bg-[#C6F36B] hover:bg-[#bbf057] text-[#171A18] rounded-xl text-xs font-black shadow-2xs"
                  >
                    Record Pay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
