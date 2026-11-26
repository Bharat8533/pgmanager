"use client";

import React from "react";
import { X, Download, FileText, ExternalLink, Calendar, Building2, Tag } from "lucide-react";
import { Expense } from "@/types/expense";

interface ExpenseReceiptModalProps {
  isOpen: boolean;
  expense: Expense | null;
  onClose: () => void;
}

export const ExpenseReceiptModal: React.FC<ExpenseReceiptModalProps> = ({
  isOpen,
  expense,
  onClose,
}) => {
  if (!isOpen || !expense || !expense.attachment) return null;

  const { attachment } = expense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111622] rounded-3xl border border-[#E2E5DF] dark:border-[#222E42] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#F0F2EE] dark:border-[#1E2638] flex items-center justify-between bg-[#FAFAF8] dark:bg-[#0D111A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#171A18] dark:bg-[#151D2A] text-[#C6F36B] dark:text-brand-lime border border-transparent dark:border-[#263346] flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171A18] dark:text-white">Expense Bill / Receipt</h3>
              <p className="text-[11px] text-[#777D78] dark:text-slate-400">{expense.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 space-y-4">
          {/* Metadata pill row */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAFAF8] dark:bg-[#151D2A] p-3 rounded-xl border border-[#E2E5DF] dark:border-[#263346]">
            <div>
              <span className="text-[#777D78] dark:text-slate-400 block text-[10px] uppercase font-bold">Amount</span>
              <span className="font-extrabold text-[#171A18] dark:text-white text-sm">
                ₹{expense.amount.toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <span className="text-[#777D78] dark:text-slate-400 block text-[10px] uppercase font-bold">Date</span>
              <span className="font-semibold text-[#171A18] dark:text-white">{expense.date}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#E2E5DF]/60 dark:border-[#263346] flex items-center justify-between">
              <span className="text-[#777D78] dark:text-slate-400 font-medium">{expense.propertyName}</span>
              <span className="text-[#171A18] dark:text-brand-lime font-bold">{expense.category}</span>
            </div>
          </div>

          {/* Receipt Mock Graphic / Document Card */}
          <div className="border border-[#CCD0C8] dark:border-[#263346] rounded-2xl p-6 bg-linear-to-b from-white to-[#F9FAF8] dark:from-[#151D2A] dark:to-[#111622] text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#C6F36B]/20 dark:bg-brand-lime/20 text-[#171A18] dark:text-brand-lime flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7 text-[#171A18] dark:text-brand-lime" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#171A18] dark:text-white">{attachment.name}</p>
              {attachment.size && (
                <p className="text-xs text-[#777D78] dark:text-slate-400">{attachment.size} • Verified Attached File</p>
              )}
            </div>
            <p className="text-xs text-[#777D78] dark:text-slate-400 max-w-xs mx-auto">
              Receipt proof stored securely. In production, this renders the uploaded invoice PDF or high-resolution camera scan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAFAF8] dark:bg-[#0D111A] border-t border-[#F0F2EE] dark:border-[#1E2638] flex items-center justify-between">
          <span className="text-xs text-[#777D78] dark:text-slate-400">Ref ID: {expense.id}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
            <a
              href={attachment.url}
              download={attachment.name}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#171A18] dark:bg-brand-lime hover:bg-[#2A2E2B] dark:hover:bg-[#BCE600] text-white dark:text-brand-obsidian rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C6F36B] dark:text-brand-obsidian" />
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
