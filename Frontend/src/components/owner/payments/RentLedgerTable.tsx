"use client";

import React from "react";
import {
  Calendar,
  CreditCard,
  Phone,
  Eye,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { RentLedgerItem, RentLedgerStatus } from "@/types/payment";

interface RentLedgerTableProps {
  ledger: RentLedgerItem[];
  onViewDetails: (item: RentLedgerItem) => void;
  onRecordPaymentForResident: (item: RentLedgerItem) => void;
}

const STATUS_BADGES: Record<RentLedgerStatus, { label: string; bg: string; text: string; icon: any }> = {
  paid: {
    label: "Paid in Full",
    bg: "bg-[#DCFCE7] border-[#86EFAC]/60",
    text: "text-[#15803D]",
    icon: CheckCircle2,
  },
  partial: {
    label: "Partially Paid",
    bg: "bg-[#FEF3C7] border-[#FDE68A]/60",
    text: "text-[#B45309]",
    icon: Clock,
  },
  pending: {
    label: "Pending",
    bg: "bg-[#F4F5F2] border-[#E2E5DF]",
    text: "text-[#171A18]",
    icon: Clock,
  },
  overdue: {
    label: "Overdue",
    bg: "bg-[#FEE2E2] border-[#FCA5A5]/60",
    text: "text-[#B91C1C]",
    icon: AlertTriangle,
  },
};

export const RentLedgerTable: React.FC<RentLedgerTableProps> = ({
  ledger,
  onViewDetails,
  onRecordPaymentForResident,
}) => {
  if (ledger.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-[#E2E5DF] p-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4F5F2] text-[#777D78] flex items-center justify-center mb-3">
          <AlertCircle className="w-7 h-7 text-[#777D78]" />
        </div>
        <h3 className="text-base font-bold text-[#171A18] mb-1">No Ledger Records Found</h3>
        <p className="text-xs text-[#777D78] max-w-sm mx-auto mb-4">
          No records match your active filters or search terms. Try resetting filters to view all records.
        </p>
      </div>
    );
  }

  const handleWhatsAppReminder = (item: RentLedgerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = item.residentPhone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hello ${item.residentName}, gentle reminder that your PG rent of ₹${item.pendingAmount.toLocaleString("en-IN")} for ${item.billingMonth} is pending (Due: ${item.dueDate}). Kindly clear the balance at your earliest convenience. Thank you!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-xs overflow-hidden">
      {/* Desktop & Tablet Table (md+) - Clean 7-column layout with zero forced horizontal scroll */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0F2EE] bg-[#FAFAF8] text-[11px] font-bold text-[#777D78] uppercase tracking-wider">
              <th className="py-3.5 px-5">Resident & Room</th>
              <th className="py-3.5 px-4">Billing Cycle</th>
              <th className="py-3.5 px-4 text-right">Rent Billed</th>
              <th className="py-3.5 px-4 text-right">Paid</th>
              <th className="py-3.5 px-4 text-right">Pending Due</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2EE] text-xs">
            {ledger.map((item) => {
              const badge = STATUS_BADGES[item.paymentStatus] || STATUS_BADGES.pending;
              const StatusIcon = badge.icon;

              return (
                <tr
                  key={item.id}
                  onClick={() => onViewDetails(item)}
                  className="hover:bg-[#F9FAF8] transition-colors cursor-pointer group"
                >
                  {/* Column 1: Resident & Room Composite */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#171A18] text-[#C6F36B] font-extrabold flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                        {item.residentName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-[#171A18] text-sm group-hover:text-[#171A18] transition-colors truncate">
                          {item.residentName}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#777D78] mt-0.5">
                          <span className="font-semibold text-[#171A18]">
                            Room {item.roomNumber} ({item.bedNumber})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-[#777D78]">
                            <Phone className="w-3 h-3 text-[#777D78]" />
                            {item.residentPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Billing Month & Due Date Composite */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FAFAF8] border border-[#E2E5DF] text-[#171A18]">
                      <Calendar className="w-3 h-3 text-[#777D78]" />
                      <span>{item.billingMonth}</span>
                    </span>
                    <span className="text-[11px] text-[#777D78] block mt-1 font-medium">
                      Due: {item.dueDate}
                    </span>
                  </td>

                  {/* Column 3: Rent Billed */}
                  <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-[#171A18]">
                    ₹{item.rentAmount.toLocaleString("en-IN")}
                  </td>

                  {/* Column 4: Paid Amount */}
                  <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-[#15803D]">
                    ₹{item.paidAmount.toLocaleString("en-IN")}
                  </td>

                  {/* Column 5: Pending Amount */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    {item.pendingAmount > 0 ? (
                      <span className="font-black text-[#B91C1C]">
                        ₹{item.pendingAmount.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-[#15803D] font-bold">₹0</span>
                    )}
                  </td>

                  {/* Column 6: Status Badge */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </td>

                  {/* Column 7: Actions */}
                  <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {item.pendingAmount > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={() => onRecordPaymentForResident(item)}
                            className="px-3 py-1.5 rounded-xl bg-[#C6F36B] hover:bg-[#bbf057] text-[#171A18] text-xs font-extrabold flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                            title="Record payment against this invoice"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Pay</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleWhatsAppReminder(item, e)}
                            className="p-1.5 text-[#047857] hover:bg-[#ECFDF5] border border-transparent hover:border-[#A7F3D0] rounded-xl transition-all"
                            title="Send WhatsApp payment reminder"
                          >
                            <MessageSquare className="w-4 h-4 text-[#047857]" />
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => onViewDetails(item)}
                        className="p-1.5 text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-xl transition-all"
                        title="View Audit Ledger & Payment History"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (md:hidden) */}
      <div className="md:hidden divide-y divide-[#F0F2EE]">
        {ledger.map((item) => {
          const badge = STATUS_BADGES[item.paymentStatus] || STATUS_BADGES.pending;
          const StatusIcon = badge.icon;

          return (
            <div
              key={`mob-${item.id}`}
              onClick={() => onViewDetails(item)}
              className="p-4 space-y-3 cursor-pointer hover:bg-[#F9FAF8] transition-colors"
            >
              {/* Card Header: Resident & Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#171A18] text-[#C6F36B] font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                    {item.residentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#171A18]">{item.residentName}</h4>
                    <span className="text-[11px] text-[#777D78] font-medium">
                      Room {item.roomNumber} ({item.bedNumber}) • {item.residentPhone}
                    </span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  <span>{badge.label}</span>
                </span>
              </div>

              {/* Financial Breakdown Micro-Strip */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#FAFAF8] rounded-xl border border-[#E2E5DF] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#777D78] uppercase font-bold block">Billed</span>
                  <span className="font-bold text-[#171A18]">₹{item.rentAmount.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#777D78] uppercase font-bold block">Paid</span>
                  <span className="font-bold text-[#15803D]">₹{item.paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#777D78] uppercase font-bold block">Pending</span>
                  <span className={`font-black ${item.pendingAmount > 0 ? "text-[#B91C1C]" : "text-[#15803D]"}`}>
                    ₹{item.pendingAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Footer info & Pay button */}
              <div
                className="flex items-center justify-between text-xs pt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[11px] text-[#777D78]">
                  <span>Due: <strong className="text-[#171A18]">{item.dueDate}</strong></span>
                  <span className="mx-1">•</span>
                  <span>{item.billingMonth}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.pendingAmount > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => handleWhatsAppReminder(item, e)}
                        className="p-1.5 text-[#047857] hover:bg-[#ECFDF5] rounded-lg transition-colors"
                        title="WhatsApp reminder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRecordPaymentForResident(item)}
                        className="px-3 py-1.5 bg-[#C6F36B] hover:bg-[#bbf057] text-[#171A18] font-black rounded-xl text-xs flex items-center gap-1 shadow-2xs active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pay</span>
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onViewDetails(item)}
                    className="p-1.5 text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
