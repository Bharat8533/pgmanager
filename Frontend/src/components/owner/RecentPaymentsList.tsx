import React from "react";
import { RecentPayment } from "@/types/owner";
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentPaymentsListProps {
  payments: RecentPayment[];
}

export function RecentPaymentsList({ payments }: RecentPaymentsListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" /> Reminder Sent
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-red-600" /> Overdue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-brand-border shadow-2xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-border">
          <div>
            <h3 className="text-sm font-bold text-brand-charcoal">Recent Rent & Payments</h3>
            <p className="text-xs text-brand-muted">Latest monthly collections and tenant dues</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-brand-lime/40 px-2.5 py-0.5 rounded-full border border-[#b4e655]">
            November Cycle
          </span>
        </div>

        {/* Desktop Table View / Mobile Card View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border/80 text-[11px] font-bold text-brand-muted uppercase">
                <th className="pb-2.5 font-bold">Tenant & Room</th>
                <th className="pb-2.5 font-bold">Amount</th>
                <th className="pb-2.5 font-bold hidden sm:table-cell">Date</th>
                <th className="pb-2.5 font-bold hidden md:table-cell">Method</th>
                <th className="pb-2.5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-brand-offwhite/40 transition-colors">
                  <td className="py-2.5">
                    <p className="font-semibold text-brand-charcoal">{p.tenantName}</p>
                    <p className="text-[10px] text-brand-muted">{p.roomNumber}</p>
                  </td>
                  <td className="py-2.5 font-bold text-brand-charcoal">
                    ₹{p.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 text-brand-muted hidden sm:table-cell">
                    {p.date}
                  </td>
                  <td className="py-2.5 text-brand-muted hidden md:table-cell">
                    {p.paymentMode}
                  </td>
                  <td className="py-2.5 text-right">
                    {getStatusBadge(p.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-brand-border flex items-center justify-between text-xs">
        <span className="text-brand-muted font-medium">95.4% monthly collection rate</span>
        <button
          type="button"
          onClick={() => alert("Rent Ledger: Complete ledger module will open in Phase 2.")}
          className="font-semibold text-brand-charcoal hover:underline inline-flex items-center gap-1"
        >
          <span>All Rent Records</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
