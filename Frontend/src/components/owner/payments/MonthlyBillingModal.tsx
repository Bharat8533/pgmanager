"use client";

import React, { useState } from "react";
import { X, CalendarPlus, Building2, Check, AlertCircle, Users } from "lucide-react";
import { Guest } from "@/types/guest";

interface MonthlyBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (billingMonth: string, dueDate: string) => void;
  propertyId: string;
  propertyName: string;
  activeResidents: Guest[];
}

export const MonthlyBillingModal: React.FC<MonthlyBillingModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  propertyId,
  propertyName,
  activeResidents,
}) => {
  const [billingMonth, setBillingMonth] = useState("December 2026");
  const [dueDate, setDueDate] = useState("2026-12-05");

  if (!isOpen) return null;

  const totalExpected = activeResidents.reduce((s, r) => s + r.monthlyRent, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(billingMonth, dueDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111622] rounded-3xl border border-[#E2E5DF] dark:border-[#222E42] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0F2EE] dark:border-[#1E2638] flex items-center justify-between bg-[#FAFAF8] dark:bg-[#0D111A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171A18] dark:bg-[#1E2638] text-[#C6F36B] dark:text-brand-lime border border-transparent dark:border-[#263346] flex items-center justify-center font-black">
              <CalendarPlus className="w-5 h-5 text-[#C6F36B] dark:text-brand-lime" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#171A18] dark:text-white">Generate Monthly Rent Invoices</h3>
              <p className="text-xs text-[#777D78] dark:text-slate-400">
                Batch bill all active residents in {propertyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#777D78] dark:text-slate-400 hover:text-[#171A18] dark:hover:text-white hover:bg-[#F4F5F2] dark:hover:bg-[#151D2A] rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Active property confirmation */}
          <div className="flex items-center gap-2 p-3 bg-[#F4F5F2] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl">
            <Building2 className="w-4 h-4 text-[#171A18] dark:text-brand-lime" />
            <div>
              <span className="font-bold text-[#171A18] dark:text-white block">{propertyName}</span>
              <span className="text-[11px] text-[#777D78] dark:text-slate-400">
                {activeResidents.length} Active Residents eligible for rent billing
              </span>
            </div>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Select Billing Month *
            </label>
            <select
              value={billingMonth}
              onChange={(e) => setBillingMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm font-bold text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime"
            >
              <option value="December 2026" className="dark:bg-[#151D2A]">December 2026</option>
              <option value="January 2027" className="dark:bg-[#151D2A]">January 2027</option>
              <option value="November 2026" className="dark:bg-[#151D2A]">November 2026</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] rounded-xl text-xs sm:text-sm font-semibold text-[#171A18] dark:text-white focus:outline-hidden focus:border-[#171A18] dark:focus:border-brand-lime"
            />
          </div>

          {/* Batch Summary Preview */}
          <div className="p-4 rounded-xl bg-[#FAFAF8] dark:bg-[#151D2A] border border-[#E2E5DF] dark:border-[#263346] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#777D78] dark:text-slate-400">Eligible Residents:</span>
              <strong className="text-[#171A18] dark:text-white font-bold">{activeResidents.length}</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#777D78] dark:text-slate-400">Total Expected Rent:</span>
              <strong className="text-[#171A18] dark:text-brand-lime font-extrabold text-sm">
                ₹{totalExpected.toLocaleString("en-IN")}
              </strong>
            </div>
            <div className="pt-2 border-t border-[#E2E5DF] dark:border-[#1E2638] text-[11px] text-[#777D78] dark:text-slate-400">
              * StayManage automatically checks for duplicates. Any resident already billed for {billingMonth} will not be billed twice.
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-3 border-t border-[#F0F2EE] dark:border-[#1E2638] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#777D78] dark:text-slate-300 hover:text-[#171A18] dark:hover:text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#171A18] dark:bg-brand-lime hover:bg-[#2A2E2B] dark:hover:bg-[#BCE600] text-white dark:text-brand-obsidian rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4 text-[#C6F36B] dark:text-brand-obsidian" />
              <span>Confirm & Generate Invoices</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
