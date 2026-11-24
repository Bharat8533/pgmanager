"use client";

import React from "react";
import Link from "next/link";
import {
  UserPlus,
  CalendarCheck,
  Building2,
  CreditCard,
  BarChart3,
  Sparkles,
} from "lucide-react";

export function QuickActionsBar() {
  const actions = [
    {
      title: "Add Tenant",
      description: "Admit resident & verify KYC",
      href: "/owner/tenants",
      icon: <UserPlus className="w-4 h-4 text-blue-600" />,
      bg: "hover:border-blue-300 hover:bg-blue-50/40",
    },
    {
      title: "Add Booking",
      description: "Reserve room & token deposit",
      href: "/owner/bookings",
      icon: <CalendarCheck className="w-4 h-4 text-purple-600" />,
      bg: "hover:border-purple-300 hover:bg-purple-50/40",
    },
    {
      title: "Add Property",
      description: "Onboard new branch or building",
      href: "/owner/properties",
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
      bg: "hover:border-emerald-300 hover:bg-emerald-50/40",
    },
    {
      title: "Record Payment",
      description: "Log offline cash or bank wire",
      href: "/owner/payments",
      icon: <CreditCard className="w-4 h-4 text-amber-600" />,
      bg: "hover:border-amber-300 hover:bg-amber-50/40",
    },
    {
      title: "View Reports",
      description: "Revenue, P&L & audit logs",
      href: "/owner/reports",
      icon: <BarChart3 className="w-4 h-4 text-indigo-600" />,
      bg: "hover:border-indigo-300 hover:bg-indigo-50/40",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-brand-border/80 p-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-brand-charcoal">
            Quick Operational Actions
          </h3>
        </div>
        <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
          One-Click Shortcuts
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {actions.map((act) => (
          <Link
            key={act.title}
            href={act.href}
            className={`p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 transition-all group flex flex-col justify-between ${act.bg} shadow-2xs`}
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-2 shadow-2xs group-hover:scale-105 transition-transform">
              {act.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-brand-charcoal group-hover:text-blue-600 transition-colors">
                {act.title}
              </p>
              <p className="text-[10px] text-brand-muted truncate mt-0.5">
                {act.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
