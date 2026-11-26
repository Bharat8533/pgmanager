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
      <div className="bg-white dark:bg-[#111622] rounded-3xl border border-[#E2E5DF] dark:border-[#222E42] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Top Action Bar */}
        <div className="px-6 py-4 border-b border-[#F0F2EE] dark:border-[#1E2638] flex items-center justify-between bg-[#FAFAF8] dark:bg-[#0D111A] print:hidden">
          <span className="text-xs font-bold text-[#171A18] dark:text-white uppercase tracking-wider">
            Official Payment Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A18] dark:bg-[#151D2A] text-white rounded-xl text-xs font-bold hover:bg-[#2A2E2B] dark:hover:bg-[#1E293B] border border-transparent dark:border-[#263346] transition-all shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#C6F36B] dark:text-brand-lime" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] dark:bg-emerald-500/15 text-[#15803D] dark:text-emerald-300 border border-[#86EFAC] dark:border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-[#bbf7d0] dark:hover:bg-emerald-500/25 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 space-y-6 overflow-y-auto text-xs bg-white dark:bg-[#151D2A] text-[#171A18] dark:text-white print:bg-white print:text-black print:p-0">
          {/* Header */}
          <div className="border-b border-[#E2E5DF] dark:border-[#263346] pb-5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-lg text-[#171A18] dark:text-white tracking-tight">StayManage</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C6F36B] dark:bg-brand-lime text-[#171A18] dark:text-brand-obsidian">
                  VERIFIED
                </span>
              </div>
              <p className="font-extrabold text-sm text-[#171A18] dark:text-white">{payment.propertyName}</p>
              <p className="text-[11px] text-[#777D78] dark:text-slate-400">{ownerBusinessName} • Ph: {ownerPhone}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#777D78] dark:text-slate-400 block">Receipt #</span>
              <span className="font-mono font-black text-sm text-[#171A18] dark:text-white">{payment.id}</span>
              <span className="text-[11px] text-[#777D78] dark:text-slate-400 block mt-1">Date: {payment.paymentDate}</span>
            </div>
          </div>

          {/* Resident Details Box */}
          <div className="p-4 rounded-xl bg-[#FAFAF8] dark:bg-[#111622] border border-[#E2E5DF] dark:border-[#263346] grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#777D78] dark:text-slate-400 block">Received From:</span>
              <span className="font-extrabold text-sm text-[#171A18] dark:text-white block mt-0.5">{payment.residentName}</span>
              <span className="text-[11px] text-[#777D78] dark:text-slate-400">{payment.residentPhone}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#777D78] dark:text-slate-400 block">Stay Assignment:</span>
              <span className="font-bold text-[#171A18] dark:text-white block mt-0.5">Room {payment.roomNumber} ({payment.bedNumber})</span>
              <span className="text-[11px] text-[#777D78] dark:text-slate-400">{payment.propertyName}</span>
            </div>
          </div>

          {/* Payment Particulars */}
          <div className="border border-[#E2E5DF] dark:border-[#263346] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAFAF8] dark:bg-[#111622] border-b border-[#F0F2EE] dark:border-[#1E2638] text-[10px] font-bold text-[#777D78] dark:text-slate-400 uppercase">
                  <th className="p-3">Description / Purpose</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Transaction Reference</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 font-bold text-[#171A18] dark:text-white">
                    {payment.paymentType} – {payment.billingMonth}
                  </td>
                  <td className="p-3 text-[#171A18] dark:text-slate-200 font-medium">{payment.paymentMethod}</td>
                  <td className="p-3 font-mono text-[11px] text-[#777D78] dark:text-slate-400">
                    {payment.transactionReference || "Cash / In-Person"}
                  </td>
                  <td className="p-3 text-right font-black text-sm text-[#171A18] dark:text-white">
                    ₹{payment.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Allocation Breakdown if multiple months */}
          {payment.allocations && payment.allocations.length > 0 && (
            <div className="p-3 bg-[#F4F5F2] dark:bg-[#111622] border border-transparent dark:border-[#263346] rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#777D78] dark:text-slate-400 block">Allocated Towards:</span>
              {payment.allocations.map((a) => (
                <div key={a.billingMonth} className="flex justify-between text-[#171A18] dark:text-slate-200">
                  <span>Month: {a.billingMonth}</span>
                  <span className="font-bold dark:text-white">₹{a.amountAllocated.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total & Seal */}
          <div className="pt-4 border-t border-[#E2E5DF] dark:border-[#263346] flex justify-between items-end">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#15803D] dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-[#15803D] dark:text-emerald-400" />
                <span>Payment Verified & Cleared</span>
              </div>
              <p className="text-[10px] text-[#777D78] dark:text-slate-400">
                This receipt confirms the recorded payment. Not a tax invoice.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#777D78] dark:text-slate-400 block">Total Amount Received</span>
              <span className="font-black text-2xl text-[#171A18] dark:text-white block tracking-tight">
                ₹{payment.amount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAFAF8] dark:bg-[#0D111A] border-t border-[#F0F2EE] dark:border-[#1E2638] flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#171A18] dark:bg-[#151D2A] text-white rounded-xl text-xs font-bold hover:bg-[#2A2E2B] dark:hover:bg-[#1E293B] border border-transparent dark:border-[#263346] cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
