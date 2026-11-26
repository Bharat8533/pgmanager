"use client";

import React from "react";
import Link from "next/link";
import {
  UserPlus,
  CalendarCheck,
  Building2,
  CreditCard,
  Receipt,
  Sparkles,
} from "lucide-react";

export function QuickActionsBar() {
  const actions = [
    {
      title: "Add Tenant",
      description: "Admit resident & verify KYC",
      href: "/owner/tenants",
      icon: <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      bg: "hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-500/50 dark:hover:bg-blue-950/30",
    },
    {
      title: "Add Booking",
      description: "Reserve room & token deposit",
      href: "/owner/bookings",
      icon: <CalendarCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      bg: "hover:border-purple-300 hover:bg-purple-50/40 dark:hover:border-purple-500/50 dark:hover:bg-purple-950/30",
    },
    {
      title: "Add Property",
      description: "Onboard new branch or building",
      href: "/owner/properties",
      icon: <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      bg: "hover:border-emerald-300 hover:bg-emerald-50/40 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-950/30",
    },
    {
      title: "Record Payment",
      description: "Log offline cash or bank wire",
      href: "/owner/payments",
      icon: <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      bg: "hover:border-amber-300 hover:bg-amber-50/40 dark:hover:border-amber-500/50 dark:hover:bg-amber-950/30",
    },
    {
      title: "Record Expense",
      description: "Log utility, repair & staff bill",
      href: "/owner/expenses",
      icon: <Receipt className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      bg: "hover:border-rose-300 hover:bg-rose-50/40 dark:hover:border-rose-500/50 dark:hover:bg-rose-950/30",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900/20 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3  dark:border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-brand-charcoal dark:text-white">
            Quick Operational Actions
          </h3>
        </div>
        <span className="text-[10px] uppercase font-bold text-brand-muted dark:text-slate-400 tracking-wider">
          One-Click Shortcuts
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {actions.map((act, index) => (
          <Link
            key={act.title}
            href={act.href}
            className={`p-3 rounded-xl border border-slate-200/70 dark:border-[#242D3D] bg-slate-50/50 dark:bg-[#161D27] transition-all group flex flex-col justify-between ${act.bg} shadow-2xs ${
              index === 4 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#0E121A] border border-slate-200 dark:border-[#242D3D] flex items-center justify-center mb-2 shadow-2xs group-hover:scale-105 transition-transform">
              {act.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-brand-charcoal dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                {act.title}
              </p>
              <p className="text-[10px] text-brand-muted dark:text-slate-400 truncate mt-0.5">
                {act.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
