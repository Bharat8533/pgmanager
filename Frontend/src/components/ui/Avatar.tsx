import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  isOnline?: boolean;
}

export function Avatar({
  initials,
  name,
  size = "md",
  className,
  isOnline = false,
}: AvatarProps) {
  const sizeStyles = {
    sm: "w-8 h-8 text-xs font-semibold",
    md: "w-9 h-9 text-sm font-semibold",
    lg: "w-11 h-11 text-base font-bold",
  };

  return (
    <div className="relative inline-flex select-none">
      <div
        title={name}
        className={cn(
          "rounded-full bg-brand-obsidian text-white flex items-center justify-center tracking-tight shadow-xs border border-brand-border/60 transition-transform",
          sizeStyles[size],
          className
        )}
      >
        <span>{initials}</span>
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-lime border-2 border-white ring-1 ring-black/10" />
      )}
    </div>
  );
}
