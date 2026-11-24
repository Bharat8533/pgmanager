import React from "react";
import Link from "next/link";
import { Building2, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-white rounded-2xl border border-brand-border p-8 shadow-sm space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-brand-obsidian text-brand-lime flex items-center justify-center mx-auto shadow-xs">
          <Building2 className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-brand-muted tracking-widest uppercase">
            Error 404 • Page Not Found
          </span>
          <h2 className="text-2xl font-extrabold text-brand-charcoal tracking-tight">
            Looking for a Room?
          </h2>
          <p className="text-xs text-brand-muted leading-relaxed">
            The page or module you are looking for doesn&apos;t exist, or has been relocated in the PGMaster platform.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/owner/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-obsidian text-white text-xs font-semibold hover:bg-brand-obsidian-hover transition-colors shadow-xs"
          >
            <Home className="w-4 h-4 text-brand-lime" />
            <span>Go to Owner Dashboard</span>
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-brand-border text-xs font-semibold text-brand-charcoal hover:bg-brand-offwhite transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
