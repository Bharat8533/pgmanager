"use client";

import React from "react";
import Link from "next/link";
import { RecentTransactionRecord } from "@/data/transactionsData";
import {
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertOctagon,
  ArrowDownLeft,
  Smartphone,
  Banknote,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentTransactionsTableProps {
  transactions: RecentTransactionRecord[];
}

export function RecentTransactionsTable({
  transactions,
}: RecentTransactionsTableProps) {
  const formatINR = (val: number) => "₹" + val.toLocaleString("en-IN");

  const getStatusBadge = (status: RecentTransactionRecord["status"]) => {
    switch (status) {
      case "successful":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Successful</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pending Clearance</span>
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/70 px-2 py-0.5 rounded-full">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            <span>Failed</span>
          </span>
        );
    }
  };

  const getPaymentMethodIcon = (method: RecentTransactionRecord["paymentMethod"]) => {
    switch (method) {
      case "UPI":
        return <Smartphone className="w-3.5 h-3.5 text-blue-600" />;
      case "Cash":
        return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
      case "Bank Transfer":
        return <Building className="w-3.5 h-3.5 text-indigo-600" />;
      case "Card":
        return <CreditCard className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  const getTypeBadge = (type: RecentTransactionRecord["transactionType"]) => {
    if (type === "Security Deposit") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60">
          Security Deposit (Liab)
        </span>
      );
    }
    if (type === "Monthly Rent") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          Monthly Rent
        </span>
      );
    }
    if (type === "Booking Advance") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
          Booking Token
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
        {type}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 shadow-xs flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-3.5 flex items-center justify-between gap-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-brand-charcoal tracking-tight">
              Recent Transactions & Ledger Inflows
            </h3>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            Real-time payments received, receipts generated, and gateway clearances
          </p>
        </div>

        <Link
          href="/owner/payments"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group"
        >
          <span>View All Transactions</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] uppercase font-bold text-brand-muted tracking-wider">
              <th className="py-2.5 px-4">Transaction ID</th>
              <th className="py-2.5 px-4">Tenant & Room</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4 text-right">Amount</th>
              <th className="py-2.5 px-4">Payment Method</th>
              <th className="py-2.5 px-4">Timestamp</th>
              <th className="py-2.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-brand-muted">
                  No transactions recorded for the selected property.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Transaction ID */}
                  <td className="py-3 px-4 font-mono font-bold text-brand-charcoal text-[11px] whitespace-nowrap">
                    {tx.transactionId}
                  </td>

                  {/* Tenant */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-brand-charcoal font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                        {tx.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-brand-charcoal truncate">
                          {tx.tenantName}
                        </p>
                        <p className="text-[10px] text-brand-muted truncate">
                          {tx.roomNumber} • {tx.propertyName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getTypeBadge(tx.transactionType)}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-black text-brand-charcoal whitespace-nowrap">
                    {formatINR(tx.amount)}
                  </td>

                  {/* Method */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-brand-charcoal font-medium">
                      {getPaymentMethodIcon(tx.paymentMethod)}
                      <span>{tx.paymentMethod}</span>
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-4 text-brand-muted whitespace-nowrap text-[11px]">
                    {tx.transactionDate}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-[11px] text-brand-muted">
        <span>Instant UPI settlements active via banking webhook</span>
        <span className="font-semibold text-emerald-700">
          98.4% automated reconciliation rate
        </span>
      </div>
    </div>
  );
}
