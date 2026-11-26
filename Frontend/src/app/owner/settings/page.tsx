"use client";

import React from "react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import {
  Sun,
  Moon,
  Laptop,
  Check,
  Sparkles,
  Palette,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeOption {
  id: Theme;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  renderPreview: (isActive: boolean) => React.ReactNode;
}

export default function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const themeOptions: ThemeOption[] = [
    {
      id: "light",
      title: "Light Mode",
      badge: "Classic",
      description: "A clean, bright interface for daytime use.",
      icon: Sun,
      renderPreview: (isActive) => (
        <div className="w-full h-32 rounded-xl bg-[#F4F5F2] p-2.5 flex flex-col justify-between border border-[#E2E5DF] overflow-hidden relative select-none">
          {/* Mini Window Frame */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E5DF]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="h-2 w-16 rounded-full bg-[#E2E5DF]" />
          </div>

          {/* Mini Layout Mockup */}
          <div className="flex gap-2 flex-1 pt-1.5">
            {/* Mini Sidebar */}
            <div className="w-8 rounded-lg bg-[#111315] p-1 flex flex-col gap-1 items-center justify-start">
              <div className="w-4 h-4 rounded bg-[#C6F36B]/20 border border-[#C6F36B]/40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#C6F36B]" />
              </div>
              <div className="w-4 h-1.5 rounded-full bg-white/20 mt-1" />
              <div className="w-4 h-1.5 rounded-full bg-white/20" />
              <div className="w-4 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Mini Cards */}
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex gap-1.5">
                <div className="flex-1 rounded-lg bg-white p-1.5 border border-[#E2E5DF] shadow-2xs">
                  <div className="w-8 h-1.5 rounded-full bg-slate-300 mb-1" />
                  <div className="w-12 h-2.5 rounded bg-[#171A18]" />
                </div>
                <div className="flex-1 rounded-lg bg-white p-1.5 border border-[#E2E5DF] shadow-2xs">
                  <div className="w-7 h-1.5 rounded-full bg-slate-300 mb-1" />
                  <div className="w-10 h-2.5 rounded bg-emerald-600" />
                </div>
              </div>

              {/* Mini Table Rows */}
              <div className="flex-1 rounded-lg bg-white p-1.5 border border-[#E2E5DF] flex flex-col justify-around">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-1.5 rounded bg-slate-200" />
                  <div className="w-6 h-1.5 rounded bg-[#C6F36B] border border-black/10" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-12 h-1.5 rounded bg-slate-200" />
                  <div className="w-5 h-1.5 rounded bg-slate-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Accent Tag */}
          <div className="absolute top-2 right-2">
            <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-600 flex items-center justify-center">
              <Sun className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "dark",
      title: "Dark Mode",
      badge: "High Contrast",
      description: "A comfortable dark interface for low-light environments.",
      icon: Moon,
      renderPreview: (isActive) => (
        <div className="w-full h-32 rounded-xl bg-[#0A0D12] p-2.5 flex flex-col justify-between border border-[#202736] overflow-hidden relative select-none">
          {/* Mini Window Frame */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#202736]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-500/70" />
              <div className="w-2 h-2 rounded-full bg-amber-500/70" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
            </div>
            <div className="h-2 w-16 rounded-full bg-[#202736]" />
          </div>

          {/* Mini Layout Mockup */}
          <div className="flex gap-2 flex-1 pt-1.5">
            {/* Mini Sidebar */}
            <div className="w-8 rounded-lg bg-[#080A0D] p-1 flex flex-col gap-1 items-center justify-start border border-white/5">
              <div className="w-4 h-4 rounded bg-[#C6F36B]/20 border border-[#C6F36B]/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#C6F36B]" />
              </div>
              <div className="w-4 h-1.5 rounded-full bg-white/20 mt-1" />
              <div className="w-4 h-1.5 rounded-full bg-white/20" />
              <div className="w-4 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Mini Cards */}
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex gap-1.5">
                <div className="flex-1 rounded-lg bg-[#131720] p-1.5 border border-[#202736]">
                  <div className="w-8 h-1.5 rounded-full bg-slate-600 mb-1" />
                  <div className="w-12 h-2.5 rounded bg-slate-100" />
                </div>
                <div className="flex-1 rounded-lg bg-[#131720] p-1.5 border border-[#202736]">
                  <div className="w-7 h-1.5 rounded-full bg-slate-600 mb-1" />
                  <div className="w-10 h-2.5 rounded bg-[#C6F36B]" />
                </div>
              </div>

              {/* Mini Table Rows */}
              <div className="flex-1 rounded-lg bg-[#131720] p-1.5 border border-[#202736] flex flex-col justify-around">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-1.5 rounded bg-slate-700" />
                  <div className="w-6 h-1.5 rounded bg-[#C6F36B]" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-12 h-1.5 rounded bg-slate-700" />
                  <div className="w-5 h-1.5 rounded bg-slate-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Accent Tag */}
          <div className="absolute top-2 right-2">
            <span className="w-4 h-4 rounded-full bg-[#C6F36B]/20 text-[#C6F36B] flex items-center justify-center">
              <Moon className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "system",
      title: "System Default",
      badge: "Adaptive",
      description: "Automatically follows your device's appearance preference.",
      icon: Laptop,
      renderPreview: (isActive) => (
        <div className="w-full h-32 rounded-xl p-2.5 flex flex-col justify-between border border-[#E2E5DF] overflow-hidden relative select-none bg-gradient-to-r from-[#F4F5F2] via-[#E2E5DF] to-[#0A0D12]">
          {/* Mini Window Frame */}
          <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="h-2 w-16 rounded-full bg-black/10" />
          </div>

          {/* Split Diagonal View */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-xs shadow-md border border-white/40 flex items-center justify-center text-brand-charcoal">
              <Laptop className="w-6 h-6 text-brand-charcoal" />
            </div>
            <div className="absolute bottom-1 text-[9px] font-bold text-brand-charcoal/70 bg-white/70 px-2 py-0.5 rounded-full">
              Syncs with OS
            </div>
          </div>

          {/* Active Accent Tag */}
          <div className="absolute top-2 right-2">
            <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-600 flex items-center justify-center">
              <Laptop className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight">
              Settings
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-brand-lime text-brand-charcoal">
              v2.1
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5 font-medium">
            Customize your PG Master experience.
          </p>
        </div>

        {/* Current Theme Pill Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-brand-border shadow-2xs self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-brand-muted">
            Active Mode:
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-charcoal">
            {resolvedTheme === "dark" ? (
              <>
                <Moon className="w-3.5 h-3.5 text-brand-lime" />
                Dark {theme === "system" ? "(System)" : ""}
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Light {theme === "system" ? "(System)" : ""}
              </>
            )}
          </span>
        </div>
      </div>

      {/* 2. Appearance Section Card */}
      <div className="rounded-2xl bg-white border border-brand-border shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-brand-border bg-slate-100/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-obsidian text-brand-lime flex items-center justify-center shrink-0 shadow-2xs">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-brand-charcoal">
                  Appearance
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                  Choose how PG Master looks on your device.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Real-time Sync</span>
            </div>
          </div>
        </div>

        {/* Theme Selection Grid */}
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {themeOptions.map((option) => {
              const isSelected = theme === option.id;
              const Icon = option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    "group text-left rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 flex flex-col justify-between relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2",
                    isSelected
                      ? "border-brand-obsidian bg-slate-50/70 shadow-sm"
                      : "border-brand-border hover:border-slate-300 hover:bg-slate-50/40 bg-white"
                  )}
                  aria-pressed={isSelected}
                >
                  {/* Top: Illustration Preview */}
                  <div className="mb-4 w-full">
                    {option.renderPreview(isSelected)}
                  </div>

                  {/* Middle: Title & Badge */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isSelected ? "text-brand-charcoal" : "text-brand-muted"
                          )}
                        />
                        <h3 className="text-sm sm:text-base font-bold text-brand-charcoal">
                          {option.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-brand-muted border border-brand-border">
                        {option.badge}
                      </span>
                    </div>

                    <p className="text-xs text-brand-muted leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  {/* Bottom: Selection Radio Indicator */}
                  <div
                    className={cn(
                      "w-full pt-3 border-t flex items-center justify-between transition-colors",
                      isSelected ? "border-brand-border" : "border-slate-100"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold transition-colors",
                        isSelected
                          ? "text-brand-charcoal"
                          : "text-brand-muted group-hover:text-brand-charcoal"
                      )}
                    >
                      {isSelected ? "Active Theme" : "Select Theme"}
                    </span>

                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-brand-obsidian text-brand-lime shadow-xs scale-105"
                          : "border-2 border-slate-300 group-hover:border-slate-400"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
