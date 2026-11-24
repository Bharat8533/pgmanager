import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthBrandPanel } from "@/components/brand/AuthBrandPanel";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Logo } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Create Account – PGMaster Cloud",
  description: "Get started with PGMaster. Manage multiple PG properties, rooms, beds, and automated rent collections.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-brand-offwhite">
      {/* Left Column: Brand Showcase (Desktop) */}
      <section className="hidden lg:block lg:col-span-5 xl:col-span-6 h-full">
        <AuthBrandPanel />
      </section>

      {/* Right Column: Authentication Form */}
      <section className="flex-1 lg:col-span-7 xl:col-span-6 flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-12 xl:p-16 bg-white overflow-y-auto">
        {/* Mobile Top Navigation */}
        <div>
          <header className="lg:hidden flex items-center justify-between pb-6 mb-4 border-b border-brand-border">
            <Logo size="sm" showTagline />
            <Link
              href="/login"
              className="text-xs font-semibold text-brand-charcoal hover:underline"
            >
              Sign in →
            </Link>
          </header>

          {/* Desktop Top Switcher Pill */}
          <div className="hidden lg:flex items-center justify-end mb-6">
            <span className="text-xs text-brand-muted mr-2">Already have a PGMaster account?</span>
            <Link
              href="/login"
              className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand-border bg-brand-offwhite text-brand-charcoal hover:bg-[#EBEEE8] hover:border-brand-charcoal/30 transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Center Form Container */}
          <div className="my-auto py-4">
            <SignUpForm />
          </div>
        </div>

        {/* Mobile Bottom Footer */}
        <footer className="lg:hidden pt-8 mt-4 border-t border-brand-border text-center">
          <p className="text-[11px] text-brand-muted">
            Engineered for modern PG, hostel, and co-living operators everywhere.
          </p>
        </footer>
      </section>
    </main>
  );
}
