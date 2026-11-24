import React from "react";
import { Logo } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  BedDouble,
  WalletCards,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";

export function AuthBrandPanel() {
  const capabilities = [
    {
      icon: <Layers className="w-4 h-4 text-brand-charcoal" />,
      title: "Multi-Property Architecture",
      desc: "Manage single or multiple properties across any city from one centralized master dashboard.",
    },
    {
      icon: <BedDouble className="w-4 h-4 text-brand-charcoal" />,
      title: "Dynamic Room & Bed Matrix",
      desc: "Structured inventory mapping for single, double, and triple-sharing rooms with instant availability states.",
    },
  ];

  return (
    <div className="relative hidden lg:flex flex-col justify-between w-full h-full p-10 xl:p-14 bg-brand-offwhite border-r border-brand-border overflow-hidden select-none">
      {/* Background architectural subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Gentle soft aura in the light palette */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] bg-brand-lime/10 rounded-full blur-3xl pointer-events-none" />
      <div>
        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Logo size="md" showTagline />
          <Badge variant="outline" className="text-[11px] font-medium bg-white/80 backdrop-blur-sm shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-lime inline-block mr-1 ring-1 ring-brand-charcoal/20" />
            Multi-Property Management Cloud
          </Badge>
        </div>

        {/* Center Section: Value Proposition & Architectural Capability Cards (NO LIVE DATA) */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          <div className="space-y-4 mb-7">
            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-brand-charcoal leading-[1.18]">
              Your properties.
              <br />
              <span className="text-brand-charcoal">One smarter way to manage.</span>
            </h1>

            <p className="text-sm text-brand-muted leading-relaxed max-w-md">
              PGMaster is a complete operations platform for PG and hostel owners. Manage properties, residents, rent, expenses, and occupancy—all in one place, from anywhere.
            </p>
          </div>

          {/* Operational Flow Strip */}
          <div className="bg-white rounded-xl border border-brand-border p-3 mb-5 shadow-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-2 flex items-center justify-between">
              <span>Unified Workflow Engine</span>
              <span className="text-[10px] text-brand-charcoal bg-brand-lime/40 px-2 py-0.5 rounded border border-[#b4e655] font-semibold">
                End-to-End
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-brand-charcoal">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-charcoal" /> Admission
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-muted" />
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-charcoal" /> Bed Allocation
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-muted" />
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-lime ring-2 ring-brand-charcoal/20" /> Rent & Deposit
              </span>
            </div>
          </div>

          {/* Capability Feature Grid (Zero Fake Numbers / Clean SaaS Capability Showcase) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {capabilities.map((cap, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white border border-brand-border shadow-xs hover:border-[#CCD1C8] hover:shadow-sm transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-offwhite border border-brand-border flex items-center justify-center mb-3">
                  {cap.icon}
                </div>
                <h3 className="text-xs font-bold text-brand-charcoal tracking-tight mb-1">
                  {cap.title}
                </h3>
                <p className="text-[11px] text-brand-muted leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Security & Architecture Badges */}
      <div className="relative z-10 pt-6 border-t border-brand-border/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white border border-brand-border flex items-center justify-center text-brand-charcoal shadow-xs">
            <ShieldCheck className="w-4 h-4 text-brand-charcoal" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-charcoal">
              Engineered for Modern PG & Hostel Operators
            </p>
            <p className="text-[11px] text-brand-muted">
              Built for high-scale multi-property operations anywhere
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="subtle" className="text-[10px] bg-white text-brand-charcoal border-brand-border">
            DPDP Compliant
          </Badge>
          <Badge variant="lime" className="text-[10px]">
            Cloud Native
          </Badge>
        </div>
      </div>
    </div>
  );
}
