"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Expense } from "@/types/expense";

interface DeleteExpenseDialogProps {
  isOpen: boolean;
  expense: Expense | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteExpenseDialog: React.FC<DeleteExpenseDialogProps> = ({
  isOpen,
  expense,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111622] rounded-3xl border border-[#E2E5DF] dark:border-[#222E42] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 text-center border-b border-[#F0F2EE] dark:border-[#1E2638] dark:bg-[#0D111A]">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-rose-500/20 text-red-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#171A18] dark:text-white mb-1">
            Delete Expense Record?
          </h3>
          <p className="text-xs text-[#777D78] dark:text-slate-400">
            This action cannot be undone. The expense will be permanently removed from your accounting ledger.
          </p>
        </div>

        {/* Expense Info Card */}
        <div className="p-6 bg-[#FAFAF8] dark:bg-[#151D2A] space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#777D78] dark:text-slate-400">Expense Title:</span>
            <span className="font-bold text-[#171A18] dark:text-white max-w-[200px] truncate">{expense.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#777D78] dark:text-slate-400">Category:</span>
            <span className="font-semibold text-[#171A18] dark:text-slate-200">{expense.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#777D78] dark:text-slate-400">Property / Scope:</span>
            <span className="font-medium text-[#171A18] dark:text-slate-200">{expense.propertyName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#777D78] dark:text-slate-400">Date:</span>
            <span className="font-medium text-[#171A18] dark:text-slate-200">{expense.date}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#E2E5DF] dark:border-[#263346]">
            <span className="text-[#777D78] dark:text-slate-400 font-bold">Amount:</span>
            <span className="font-extrabold text-sm text-red-600 dark:text-rose-400">
              ₹{expense.amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white dark:bg-[#0D111A] flex items-center justify-end gap-3 border-t border-[#F0F2EE] dark:border-[#1E2638]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#1E293B] rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
