"use client";

import React, { useState } from "react";
import { X, ShieldAlert, Check, IndianRupee } from "lucide-react";
import { ResidentDepositRecord } from "@/types/payment";

interface DepositAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: ResidentDepositRecord | null;
  mode: "refund" | "adjustment";
  onSubmit: (amount: number, reason: string) => void;
}

export const DepositAdjustmentModal: React.FC<DepositAdjustmentModalProps> = ({
  isOpen,
  onClose,
  resident,
  mode,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !resident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!amount || isNaN(numAmt) || numAmt <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (numAmt > resident.currentBalance) {
      setError(`Cannot ${mode} more than available balance (₹${resident.currentBalance.toLocaleString("en-IN")}).`);
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason or note.");
      return;
    }

    onSubmit(numAmt, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#E2E5DF] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-[#F0F2EE] flex items-center justify-between bg-[#FAFAF8]">
          <h3 className="text-base font-extrabold text-[#171A18]">
            {mode === "refund" ? "Record Deposit Refund" : "Record Deposit Adjustment"}
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 text-[#777D78] hover:text-[#171A18]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-[#FAFAF8] border border-[#E2E5DF]">
            <span className="text-[10px] uppercase font-bold text-[#777D78] block">Resident</span>
            <span className="font-extrabold text-sm text-[#171A18] block mt-0.5">{resident.residentName}</span>
            <span className="text-[#15803D] font-bold block mt-1">
              Available Balance: ₹{resident.currentBalance.toLocaleString("en-IN")}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
              {mode === "refund" ? "Refund Amount (₹)" : "Adjustment Deduction (₹)"} *
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777D78]" />
              <input
                type="number"
                min="1"
                max={resident.currentBalance}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                placeholder="e.g. 5000"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs sm:text-sm font-bold text-[#171A18] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
              Reason / Remarks *
            </label>
            <input
              type="text"
              placeholder={
                mode === "refund"
                  ? "e.g. Move-out full security refund transferred via IMPS..."
                  : "e.g. Wall repaint damage, broken table repair deduction..."
              }
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              className="w-full p-2.5 bg-[#FAFAF8] border border-[#E2E5DF] rounded-xl text-xs text-[#171A18] focus:outline-hidden"
            />
          </div>

          {error && <p className="text-red-500 font-medium text-[11px]">{error}</p>}

          <div className="pt-3 border-t border-[#F0F2EE] flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-[#777D78]">
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#171A18] text-white rounded-xl font-bold shadow-xs flex items-center gap-2 hover:bg-[#2A2E2B]"
            >
              <Check className="w-4 h-4 text-[#C6F36B]" />
              <span>Confirm {mode === "refund" ? "Refund" : "Adjustment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
