"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
}

export function Tooltip({
  content,
  children,
  side = "right",
  disabled = false,
  className,
  containerClassName,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (side === "right") {
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
      });
    } else if (side === "left") {
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.left - 10,
      });
    } else if (side === "top") {
      setCoords({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    } else if (side === "bottom") {
      setCoords({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleMouseEnter = () => {
    updateCoords();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Close tooltip when scrolling to avoid floating detached tooltips
  useEffect(() => {
    if (!isVisible) return;
    const handleScrollOrResize = () => {
      setIsVisible(false);
    };
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex justify-center", containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {mounted &&
        isVisible &&
        coords &&
        !disabled &&
        content &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform:
                side === "right"
                  ? "translate(0, -50%)"
                  : side === "left"
                    ? "translate(-100%, -50%)"
                    : side === "top"
                      ? "translate(-50%, -100%)"
                      : "translate(-50%, 0)",
            }}
            className={cn(
              "z-[9999] px-3 py-1.5 text-xs font-bold text-white bg-[#111315] rounded-xl shadow-2xl pointer-events-none whitespace-nowrap select-none border border-white/20 animate-fadeIn flex items-center gap-2",
              className
            )}
          >
            {content}
            {side === "right" && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#111315] border-l border-b border-white/20 rotate-45" />
            )}
            {side === "left" && (
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#111315] border-r border-t border-white/20 rotate-45" />
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
