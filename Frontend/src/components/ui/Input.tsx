import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  leftPaddingClass?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftAddon,
      rightAddon,
      leftPaddingClass,
      id,
      required,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : generatedId);

    return (
      <div className={cn("w-full space-y-1.5", containerClassName)}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="block text-xs font-semibold tracking-wide text-brand-charcoal uppercase"
            >
              {label}
              {required && <span className="text-red-500 ml-1 font-bold">*</span>}
            </label>
          </div>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-0 pl-3.5 flex items-center pointer-events-none text-brand-muted z-10">
              {leftAddon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            required={required}
            aria-invalid={Boolean(error)}
            className={cn(
              "w-full h-11 px-3.5 text-sm bg-brand-input text-brand-charcoal border rounded-lg transition-all duration-150",
              "placeholder:text-brand-muted/70",
              "focus:outline-none focus:ring-2 focus:ring-brand-obsidian/15 focus:border-brand-obsidian",
              error
                ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-200"
                : "border-brand-border hover:border-[#CCD1C8]",
              leftAddon ? (leftPaddingClass || "pl-11") : "",
              rightAddon ? "pr-11" : "",
              className
            )}
            {...props}
          />

          {rightAddon && (
            <div className="absolute right-0 pr-3.5 flex items-center">
              {rightAddon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-red-600 font-medium flex items-center gap-1 animate-fadeIn">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-brand-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
