"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  CreditCard,
  RotateCcw,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { RentLedgerItem, PaymentRecord } from "@/types/payment";

interface PaymentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ledgerItem: RentLedgerItem | null;
  residentPayments: PaymentRecord[];
  allResidentLedgers: RentLedgerItem[];
  depositAmount: number;
  onOpenRecordPayment: (item: RentLedgerItem) => void;
  onOpenReceipt: (payment: PaymentRecord) => void;
  onReversePayment: (paymentId: string) => void;
}

export const PaymentDetailsDrawer: React.FC<PaymentDetailsDrawerProps> = ({
  isOpen,
  onClose,
  ledgerItem,
  residentPayments,
  allResidentLedgers,
  depositAmount,
  onOpenRecordPayment,
  onOpenReceipt,
  onReversePayment,
}) => {
  const [reversingPaymentId, setReversingPaymentId] = useState<string | null>(null);
  const [reversalReason, setReversalReason] = useState("");

  if (!isOpen || !ledgerItem) return null;

  const totalBilled = allResidentLedgers.reduce((s, i) => s + i.rentAmount, 0);
  const totalPaid = allResidentLedgers.reduce((s, i) => s + i.paidAmount, 0);
  const totalPending = allResidentLedgers.reduce((s, i) => s + i.pendingAmount, 0);

  const handleConfirmReversal = (paymentId: string) => {
    if (!reversalReason.trim()) {
      alert("Please enter a mandatory reversal reason.");
      return;
    }
    onReversePayment(paymentId);
    setReversingPaymentId(null);
    setReversalReason("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-[#E2E5DF] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#F0F2EE] bg-[#FAFAF8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#171A18] text-[#C6F36B] font-black flex items-center justify-center text-sm">
              {ledgerItem.residentName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#171A18]">{ledgerItem.residentName}</h3>
              <p className="text-xs text-[#777D78]">
                Room {ledgerItem.roomNumber} ({ledgerItem.bedNumber}) • {ledgerItem.propertyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Financial Overview Cards for this Resident */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-[#FAFAF8] rounded-xl border border-[#E2E5DF]">
              <span className="text-[10px] uppercase font-bold text-[#777D78] block">Total Billed</span>
              <span className="font-extrabold text-sm text-[#171A18] mt-1 block">
                ₹{totalBilled.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-3 bg-[#DCFCE7]/50 rounded-xl border border-[#86EFAC]/50">
              <span className="text-[10px] uppercase font-bold text-[#15803D] block">Total Collected</span>
              <span className="font-extrabold text-sm text-[#15803D] mt-1 block">
                ₹{totalPaid.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-3 bg-[#FEE2E2]/50 rounded-xl border border-[#FCA5A5]/50">
              <span className="text-[10px] uppercase font-bold text-[#B91C1C] block">Total Pending</span>
              <span className="font-extrabold text-sm text-[#B91C1C] mt-1 block">
                ₹{totalPending.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-3 bg-[#EDE9FE]/50 rounded-xl border border-[#DDD6FE]">
              <span className="text-[10px] uppercase font-bold text-[#5B21B6] block">Deposit Held</span>
              <span className="font-extrabold text-sm text-[#5B21B6] mt-1 block">
                ₹{depositAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Quick Pay CTA if pending */}
          {totalPending > 0 && (
            <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-[#92400E] block">Outstanding Balance: ₹{totalPending.toLocaleString("en-IN")}</span>
                <span className="text-[11px] text-[#B45309]">Rent is due for {ledgerItem.billingMonth}</span>
              </div>
              <button
                type="button"
                onClick={() => onOpenRecordPayment(ledgerItem)}
                className="px-3.5 py-1.5 bg-[#171A18] hover:bg-[#2A2E2B] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-[#C6F36B]" />
                <span>Record Payment</span>
              </button>
            </div>
          )}

          {/* Billing Invoices Ledger History */}
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#171A18] mb-2.5">
              Monthly Rent Billing History
            </h4>
            <div className="border border-[#E2E5DF] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAFAF8] border-b border-[#F0F2EE] text-[10px] font-bold text-[#777D78] uppercase">
                    <th className="p-2.5">Billing Month</th>
                    <th className="p-2.5 text-right">Billed</th>
                    <th className="p-2.5 text-right">Paid</th>
                    <th className="p-2.5 text-right">Pending</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F2EE]">
                  {allResidentLedgers.map((l) => (
                    <tr key={l.id} className="hover:bg-[#FAFAF8]">
                      <td className="p-2.5 font-bold text-[#171A18]">{l.billingMonth}</td>
                      <td className="p-2.5 text-right font-medium">₹{l.rentAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2.5 text-right text-[#15803D] font-bold">₹{l.paidAmount.toLocaleString("en-IN")}</td>
                      <td className="p-2.5 text-right text-[#B91C1C] font-bold">
                        {l.pendingAmount > 0 ? `₹${l.pendingAmount.toLocaleString("en-IN")}` : "₹0"}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#F4F5F2] text-[#171A18]">
                          {l.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Transactions Received */}
          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#171A18] mb-2.5">
              Payment Receipts & Audit Trail
            </h4>

            {residentPayments.length === 0 ? (
              <p className="text-xs text-[#777D78] p-4 text-center border border-[#E2E5DF] rounded-xl bg-[#FAFAF8]">
                No payment transactions recorded yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {residentPayments.map((p) => {
                  const isReversed = p.status === "reversed";
                  const isConfirming = reversingPaymentId === p.id;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isReversed
                          ? "bg-red-50/50 border-red-200 opacity-75"
                          : "bg-white border-[#E2E5DF] shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#171A18]">{p.id}</span>
                          <span className="text-[11px] text-[#777D78]">({p.paymentDate})</span>
                          {isReversed && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-100 text-red-700">
                              Reversed
                            </span>
                          )}
                        </div>
                        <span className="font-black text-sm text-[#171A18]">
                          ₹{p.amount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#777D78]">
                        <span>
                          {p.paymentMethod} • {p.paymentType} ({p.billingMonth})
                        </span>
                        {p.transactionReference && (
                          <span className="font-mono text-[10px]">{p.transactionReference}</span>
                        )}
                      </div>

                      {/* Reversal Audit Notes if Reversed */}
                      {isReversed && p.reversalReason && (
                        <p className="text-[11px] text-red-600 font-medium mt-1.5 pt-1.5 border-t border-red-200">
                          <strong>Cancellation Reason:</strong> {p.reversalReason}
                        </p>
                      )}

                      {/* Action buttons */}
                      {!isReversed && !isConfirming && (
                        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-[#F0F2EE]">
                          <button
                            type="button"
                            onClick={() => onOpenReceipt(p)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#171A18] hover:underline"
                          >
                            <Receipt className="w-3 h-3 text-[#171A18]" />
                            <span>View Receipt</span>
                          </button>
                          <span className="text-[#CCD0C8]">|</span>
                          <button
                            type="button"
                            onClick={() => setReversingPaymentId(p.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:underline"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Cancel / Reverse</span>
                          </button>
                        </div>
                      )}

                      {/* Reversal Confirmation Box */}
                      {isConfirming && (
                        <div className="mt-2 pt-2 border-t border-red-200 p-2.5 bg-red-50 rounded-lg space-y-2">
                          <p className="text-[11px] font-bold text-red-700">
                            Confirm Payment Reversal?
                          </p>
                          <input
                            type="text"
                            placeholder="Mandatory cancellation reason (e.g. Bounced cheque, Wrong entry)..."
                            value={reversalReason}
                            onChange={(e) => setReversalReason(e.target.value)}
                            className="w-full p-2 bg-white border border-red-300 rounded-lg text-xs text-[#171A18] focus:outline-hidden"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReversingPaymentId(null);
                                setReversalReason("");
                              }}
                              className="px-2.5 py-1 text-xs text-[#777D78] hover:text-[#171A18]"
                            >
                              Abort
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmReversal(p.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-red-700"
                            >
                              Confirm Reversal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
