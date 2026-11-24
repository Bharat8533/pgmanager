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
      <div className="bg-white rounded-3xl border border-[#E2E5DF] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0F2EE] flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171A18] text-[#C6F36B] flex items-center justify-center font-black">
              <CalendarPlus className="w-5 h-5 text-[#C6F36B]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#171A18]">Generate Monthly Rent Invoices</h3>
              <p className="text-xs text-[#777D78]">
                Batch bill all active residents in {propertyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#777D78] hover:text-[#171A18] hover:bg-[#F4F5F2] rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Active property confirmation */}
          <div className="flex items-center gap-2 p-3 bg-[#F4F5F2] border border-[#E2E5DF] rounded-xl">
            <Building2 className="w-4 h-4 text-[#171A18]" />
            <div>
              <span className="font-bold text-[#171A18] block">{propertyName}</span>
              <span className="text-[11px] text-[#777D78]">
                {activeResidents.length} Active Residents eligible for rent billing
              </span>
            </div>
          </div>

          {/* Month Selector */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
              Select Billing Month *
            </label>
            <select
              value={billingMonth}
              onChange={(e) => setBillingMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-bold text-[#171A18] focus:outline-hidden focus:border-[#171A18]"
            >
              <option value="December 2026">December 2026</option>
              <option value="January 2027">January 2027</option>
              <option value="November 2026">November 2026</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
              Payment Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-semibold text-[#171A18] focus:outline-hidden focus:border-[#171A18]"
            />
          </div>

          {/* Batch Summary Preview */}
          <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E2E5DF] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#777D78]">Eligible Residents:</span>
              <strong className="text-[#171A18] font-bold">{activeResidents.length}</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#777D78]">Total Expected Rent:</span>
              <strong className="text-[#171A18] font-extrabold text-sm">
                ₹{totalExpected.toLocaleString("en-IN")}
              </strong>
            </div>
            <div className="pt-2 border-t border-[#E2E5DF] text-[11px] text-[#777D78]">
              * StayManage automatically checks for duplicates. Any resident already billed for {billingMonth} will not be billed twice.
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-3 border-t border-[#F0F2EE] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#777D78] hover:text-[#171A18]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#171A18] hover:bg-[#2A2E2B] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-[#C6F36B]" />
              <span>Confirm & Generate Invoices</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
