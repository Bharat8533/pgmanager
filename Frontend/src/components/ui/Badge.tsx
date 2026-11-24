import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "lime" | "outline" | "subtle" | "dark";
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = "subtle", className, dot = false }: BadgeProps) {
  const variantStyles = {
    lime: "bg-brand-lime text-brand-charcoal border border-[#b4e655] font-semibold",
    outline: "bg-white text-brand-charcoal border border-brand-border font-medium",
    subtle: "bg-brand-offwhite text-brand-charcoal border border-brand-border/80 font-medium",
    dark: "bg-brand-obsidian text-white border border-brand-obsidian font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-brand-lime ring-1 ring-brand-charcoal/10" />}
      {children}
    </span>
  );
}
