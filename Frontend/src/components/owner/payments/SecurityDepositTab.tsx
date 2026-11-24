"use client";

import React from "react";
import {
  ShieldCheck,
  Phone,
  RotateCcw,
  Sliders,
  AlertCircle,
} from "lucide-react";
import { ResidentDepositRecord } from "@/types/payment";

interface SecurityDepositTabProps {
  deposits: ResidentDepositRecord[];
  onOpenAdjustmentModal: (
    resident: ResidentDepositRecord,
    mode: "refund" | "adjustment"
  ) => void;
}

export const SecurityDepositTab: React.FC<SecurityDepositTabProps> = ({
  deposits,
  onOpenAdjustmentModal,
}) => {
  const totalHeld = deposits.reduce((acc, d) => acc + d.currentBalance, 0);
  const totalReceived = deposits.reduce((acc, d) => acc + d.depositReceived, 0);
  const totalAdjusted = deposits.reduce((acc, d) => acc + d.adjustments, 0);
  const totalRefunded = deposits.reduce((acc, d) => acc + d.refunds, 0);

  if (deposits.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-[#E2E5DF] p-8 shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center mb-3">
          <ShieldCheck className="w-7 h-7 text-[#5B21B6]" />
        </div>
        <h3 className="text-base font-bold text-[#171A18] mb-1">No Security Deposits Recorded</h3>
        <p className="text-xs text-[#777D78] max-w-sm mx-auto">
          Security deposits collected during resident onboarding will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 4 Deposit Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-[#DDD6FE] p-4 shadow-2xs bg-[#EDE9FE]/20">
          <span className="text-[10px] font-bold uppercase text-[#5B21B6] tracking-wider block">
            Net Deposit Liability
          </span>
          <p className="text-lg sm:text-xl font-black text-[#5B21B6] my-1">
            ₹{totalHeld.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#5B21B6] font-semibold">{deposits.length} Active Residents</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E5DF] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#777D78] tracking-wider block">
            Total Received
          </span>
          <p className="text-lg sm:text-xl font-black text-[#171A18] my-1">
            ₹{totalReceived.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#777D78]">Gross collected</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#FDE68A] p-4 shadow-2xs bg-[#FEF3C7]/20">
          <span className="text-[10px] font-bold uppercase text-[#B45309] tracking-wider block">
            Adjusted against Rent/Damage
          </span>
          <p className="text-lg sm:text-xl font-black text-[#B45309] my-1">
            ₹{totalAdjusted.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#B45309]">Deducted</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E5DF] p-4 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-[#777D78] tracking-wider block">
            Total Refunded
          </span>
          <p className="text-lg sm:text-xl font-black text-[#171A18] my-1">
            ₹{totalRefunded.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#777D78]">Upon check-out</span>
        </div>
      </div>

      {/* Deposit Ledger Table & Responsive Mobile Cards */}
      <div className="bg-white rounded-2xl border border-[#E2E5DF] shadow-xs overflow-hidden">
        {/* Desktop Table (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#F0F2EE] bg-[#FAFAF8] text-[11px] font-bold text-[#777D78] uppercase tracking-wider">
                <th className="py-3.5 px-6">Resident & Room</th>
                <th className="py-3.5 px-4">Date Received</th>
                <th className="py-3.5 px-4 text-right">Original Deposit</th>
                <th className="py-3.5 px-4 text-right">Adjustments</th>
                <th className="py-3.5 px-4 text-right">Refunded</th>
                <th className="py-3.5 px-4 text-right">Current Balance</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2EE]">
              {deposits.map((item) => (
                <tr key={item.residentId} className="hover:bg-[#F9FAF8] transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-extrabold text-[#171A18] text-sm">{item.residentName}</div>
                    <div className="text-[11px] text-[#777D78] flex items-center gap-2 mt-0.5 font-medium">
                      <span className="text-[#171A18]">Room {item.roomNumber} ({item.bedNumber})</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-[#777D78]">
                        <Phone className="w-3 h-3" />
                        {item.residentPhone}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap font-medium text-[#777D78]">
                    {item.dateReceived}
                  </td>

                  <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-[#171A18]">
                    ₹{item.depositReceived.toLocaleString("en-IN")}
                  </td>

                  <td className="py-4 px-4 text-right whitespace-nowrap text-[#B45309] font-medium">
                    {item.adjustments > 0 ? `-₹${item.adjustments.toLocaleString("en-IN")}` : "₹0"}
                  </td>

                  <td className="py-4 px-4 text-right whitespace-nowrap text-[#777D78] font-medium">
                    {item.refunds > 0 ? `-₹${item.refunds.toLocaleString("en-IN")}` : "₹0"}
                  </td>

                  <td className="py-4 px-4 text-right whitespace-nowrap font-black text-sm text-[#15803D]">
                    ₹{item.currentBalance.toLocaleString("en-IN")}
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenAdjustmentModal(item, "adjustment")}
                        className="px-3 py-1.5 text-xs font-bold text-[#B45309] hover:bg-[#FEF3C7] rounded-xl border border-[#FDE68A] transition-all cursor-pointer"
                      >
                        Adjust
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenAdjustmentModal(item, "refund")}
                        className="px-3 py-1.5 text-xs font-bold text-[#171A18] hover:bg-[#E2E5DF] rounded-xl border border-[#CCD0C8] transition-all cursor-pointer"
                      >
                        Refund
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (md:hidden) */}
        <div className="md:hidden divide-y divide-[#F0F2EE]">
          {deposits.map((item) => (
            <div key={`dep-mob-${item.residentId}`} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-[#171A18]">{item.residentName}</h4>
                  <span className="text-[11px] text-[#777D78]">
                    Room {item.roomNumber} ({item.bedNumber}) • {item.residentPhone}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#777D78] uppercase font-bold block">Balance</span>
                  <span className="font-black text-sm text-[#15803D]">
                    ₹{item.currentBalance.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#FAFAF8] rounded-xl border border-[#E2E5DF] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#777D78] block">Received</span>
                  <span className="font-bold text-[#171A18]">₹{item.depositReceived.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#777D78] block">Adjusted</span>
                  <span className="font-bold text-[#B45309]">{item.adjustments > 0 ? `₹${item.adjustments.toLocaleString("en-IN")}` : "₹0"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#777D78] block">Refunded</span>
                  <span className="font-bold text-[#777D78]">{item.refunds > 0 ? `₹${item.refunds.toLocaleString("en-IN")}` : "₹0"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#777D78]">Received: {item.dateReceived}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenAdjustmentModal(item, "adjustment")}
                    className="px-3 py-1.5 text-xs font-bold text-[#B45309] bg-[#FEF3C7] rounded-xl border border-[#FDE68A]"
                  >
                    Adjust
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAdjustmentModal(item, "refund")}
                    className="px-3 py-1.5 text-xs font-bold text-[#171A18] bg-[#F4F5F2] rounded-xl border border-[#CCD0C8]"
                  >
                    Refund
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
