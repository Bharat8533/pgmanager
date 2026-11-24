import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showTagline?: boolean;
}

export function Logo({ className, size = "md", href = "/login", showTagline = false }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      {/* Abstract geometric building/property icon */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-brand-obsidian text-white shadow-sm transition-transform duration-200 group-hover:scale-[1.02]",
          iconSizes[size]
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          {/* Main architectural building frame */}
          <rect
            x="3.5"
            y="5"
            width="17"
            height="15.5"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          {/* Internal room partitioning lines */}
          <line x1="3.5" y1="12" x2="20.5" y2="12" stroke="currentColor" strokeWidth="1.6" strokeDasharray="1 1" />
          <line x1="12" y1="5" x2="12" y2="20.5" stroke="currentColor" strokeWidth="1.6" />
          {/* Neon lime active room highlight */}
          <rect
            x="5.5"
            y="7"
            width="4.5"
            height="3.5"
            rx="0.75"
            fill="#C6F36B"
            className="transition-opacity group-hover:opacity-90"
          />
          {/* Entrance doorway */}
          <path
            d="M10 20.5V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20.5"
            stroke="#C6F36B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={cn("font-bold text-brand-charcoal", textSizes[size])}>
            PG<span className="font-semibold text-brand-charcoal">Master</span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-lime ml-1 ring-2 ring-brand-charcoal/10" />
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase font-medium text-brand-muted -mt-0.5">
            PG Management Cloud
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
