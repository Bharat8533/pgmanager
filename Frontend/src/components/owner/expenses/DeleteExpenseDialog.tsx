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
      <div className="bg-white rounded-3xl border border-[#E2E5DF] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 text-center border-b border-[#F0F2EE]">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#171A18] mb-1">
            Delete Expense Record?
          </h3>
          <p className="text-xs text-[#777D78]">
            This action cannot be undone. The expense will be permanently removed from your accounting ledger.
          </p>
        </div>

        {/* Expense Info Card */}
        <div className="p-6 bg-[#FAFAF8] space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#777D78]">Expense Title:</span>
            <span className="font-bold text-[#171A18] max-w-[200px] truncate">{expense.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#777D78]">Category:</span>
            <span className="font-semibold text-[#171A18]">{expense.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#777D78]">Property / Scope:</span>
            <span className="font-medium text-[#171A18]">{expense.propertyName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#777D78]">Date:</span>
            <span className="font-medium text-[#171A18]">{expense.date}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#E2E5DF]">
            <span className="text-[#777D78] font-bold">Amount:</span>
            <span className="font-extrabold text-sm text-red-600">
              ₹{expense.amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white flex items-center justify-end gap-3 border-t border-[#F0F2EE]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-xl transition-all"
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
