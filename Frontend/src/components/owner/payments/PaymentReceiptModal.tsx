"use client";

import React from "react";
import { X, Printer, Download, MessageSquare, Check, ShieldCheck } from "lucide-react";
import { PaymentRecord } from "@/types/payment";

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  ownerBusinessName?: string;
  ownerPhone?: string;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  ownerBusinessName = "StayManage Hospitality & PG Networks",
  ownerPhone = "+91 98765 00000",
}) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const cleanPhone = payment.residentPhone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Dear ${payment.residentName}, your payment of ₹${payment.amount.toLocaleString("en-IN")} (${payment.paymentType} for ${payment.billingMonth}) has been recorded at ${payment.propertyName}. Receipt ID: ${payment.id}. Thank you!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E2E5DF] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Action Bar */}
        <div className="px-6 py-4 border-b border-[#F0F2EE] flex items-center justify-between bg-[#FAFAF8] print:hidden">
          <span className="text-xs font-bold text-[#171A18] uppercase tracking-wider">
            Official Payment Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A18] text-white rounded-xl text-xs font-bold hover:bg-[#2A2E2B] transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#C6F36B]" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] rounded-xl text-xs font-bold hover:bg-[#bbf7d0] transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#777D78] hover:text-[#171A18] rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 space-y-6 overflow-y-auto text-xs bg-white text-[#171A18] print:p-0">
          {/* Header */}
          <div className="border-b border-[#E2E5DF] pb-5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-lg text-[#171A18] tracking-tight">StayManage</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C6F36B] text-[#171A18]">
                  VERIFIED
                </span>
              </div>
              <p className="font-extrabold text-sm text-[#171A18]">{payment.propertyName}</p>
              <p className="text-[11px] text-[#777D78]">{ownerBusinessName} • Ph: {ownerPhone}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#777D78] block">Receipt #</span>
              <span className="font-mono font-black text-sm text-[#171A18]">{payment.id}</span>
              <span className="text-[11px] text-[#777D78] block mt-1">Date: {payment.paymentDate}</span>
            </div>
          </div>

          {/* Resident Details Box */}
          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E2E5DF] grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#777D78] block">Received From:</span>
              <span className="font-extrabold text-sm text-[#171A18] block mt-0.5">{payment.residentName}</span>
              <span className="text-[11px] text-[#777D78]">{payment.residentPhone}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#777D78] block">Stay Assignment:</span>
              <span className="font-bold text-[#171A18] block mt-0.5">Room {payment.roomNumber} ({payment.bedNumber})</span>
              <span className="text-[11px] text-[#777D78]">{payment.propertyName}</span>
            </div>
          </div>

          {/* Payment Particulars */}
          <div className="border border-[#E2E5DF] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#F0F2EE] text-[10px] font-bold text-[#777D78] uppercase">
                  <th className="p-3">Description / Purpose</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Transaction Reference</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 font-bold text-[#171A18]">
                    {payment.paymentType} – {payment.billingMonth}
                  </td>
                  <td className="p-3 text-[#171A18] font-medium">{payment.paymentMethod}</td>
                  <td className="p-3 font-mono text-[11px] text-[#777D78]">
                    {payment.transactionReference || "Cash / In-Person"}
                  </td>
                  <td className="p-3 text-right font-black text-sm text-[#171A18]">
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Allocation Breakdown if multiple months */}
          {payment.allocations && payment.allocations.length > 0 && (
            <div className="p-3 bg-[#F4F5F2] rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#777D78] block">Allocated Towards:</span>
              {payment.allocations.map((a) => (
                <div key={a.billingMonth} className="flex justify-between text-[#171A18]">
                  <span>Month: {a.billingMonth}</span>
                  <span className="font-bold">₹{a.amountAllocated.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total & Seal */}
          <div className="pt-4 border-t border-[#E2E5DF] flex justify-between items-end">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#15803D]">
                <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                <span>Payment Verified & Cleared</span>
              </div>
              <p className="text-[10px] text-[#777D78]">
                This receipt confirms the recorded payment. Not a tax invoice.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#777D78] block">Total Amount Received</span>
              <span className="font-black text-2xl text-[#171A18] block tracking-tight">
                ₹{payment.amount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAFAF8] border-t border-[#F0F2EE] flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#171A18] text-white rounded-xl text-xs font-bold hover:bg-[#2A2E2B]"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
