"use client";

import React from "react";
import {
  FileText,
  Paperclip,
  Edit2,
  Trash2,
  Building2,
  CreditCard,
  Calendar,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Expense } from "@/types/expense";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onViewReceipt: (expense: Expense) => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  onEdit,
  onDelete,
  onViewReceipt,
}) => {
  if (expenses.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-[#E2E5DF] p-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F4F5F2] text-[#777D78] flex items-center justify-center mb-3">
          <AlertCircle className="w-7 h-7 text-[#777D78]" />
        </div>
        <h3 className="text-base font-bold text-[#171A18] mb-1">No Expenses Found</h3>
        <p className="text-xs text-[#777D78] max-w-sm mx-auto mb-4">
          No records match your selected filters. Try adjusting your date range, property, or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-xs overflow-hidden">
      {/* Desktop & Tablet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0F2EE] bg-[#FAFAF8] text-[11px] font-bold text-[#777D78] uppercase tracking-wider">
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-4">Title & Details</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4 text-right">Amount (₹)</th>
              <th className="py-3.5 px-4 text-center">Receipt</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2EE] text-xs">
            {expenses.map((expense) => {
              return (
                <tr
                  key={expense.id}
                  className="hover:bg-[#F9FAF8] transition-colors group"
                >
                  {/* Date */}
                  <td className="py-4 px-6 font-medium text-[#171A18] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#777D78]" />
                      <span>{expense.date}</span>
                    </div>
                  </td>

                  {/* Title & Remark */}
                  <td className="py-4 px-4 max-w-[320px]">
                    <div className="font-bold text-[#171A18] truncate" title={expense.title}>
                      {expense.title}
                    </div>
                    {expense.remark && (
                      <p className="text-[11px] text-[#777D78] truncate mt-0.5" title={expense.remark}>
                        {expense.remark}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F4F5F2] text-[#171A18] border border-[#E2E5DF]">
                      {expense.category}
                    </span>
                  </td>

                  {/* Payment Mode */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-[#171A18] font-medium">
                      <CreditCard className="w-3.5 h-3.5 text-[#777D78]" />
                      <span>{expense.paymentMode}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <span className="font-extrabold text-[#171A18] text-sm tracking-tight">
                      ₹{expense.amount.toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Receipt */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {expense.attachment ? (
                      <button
                        type="button"
                        onClick={() => onViewReceipt(expense)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#F4F5F2] hover:bg-[#E2E5DF] text-[#171A18] text-[11px] font-semibold transition-all cursor-pointer"
                        title="View attached bill receipt"
                      >
                        <Paperclip className="w-3 h-3 text-[#171A18]" />
                        <span>View</span>
                      </button>
                    ) : (
                      <span className="text-[#CCD0C8] text-[11px] font-medium">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {expense.attachment && (
                        <button
                          type="button"
                          onClick={() => onViewReceipt(expense)}
                          className="p-1.5 text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-lg transition-all"
                          title="View Receipt"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="p-1.5 text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-lg transition-all"
                        title="Edit Expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense)}
                        className="p-1.5 text-[#777D78] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
