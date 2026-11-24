import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface AlertProps {
  variant?: "success" | "error" | "info";
  title?: string;
  description: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function Alert({ variant = "info", title, description, className, onClose }: AlertProps) {
  const config = {
    success: {
      container: "bg-brand-success/80 border-[#C7E5BE] text-brand-success-text",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />,
    },
    error: {
      container: "bg-brand-error border-[#F8C8C8] text-brand-error-text",
      icon: <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />,
    },
    info: {
      container: "bg-white border-brand-border text-brand-charcoal shadow-sm",
      icon: <Info className="w-4 h-4 text-brand-charcoal flex-shrink-0 mt-0.5" />,
    },
  };

  const current = config[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-lg border text-xs leading-relaxed transition-all",
        current.container,
        className
      )}
    >
      {current.icon}
      <div className="flex-1">
        {title && <h5 className="font-semibold text-xs mb-0.5">{title}</h5>}
        <div className="opacity-95">{description}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-current opacity-70 hover:opacity-100 transition-opacity p-0.5"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
