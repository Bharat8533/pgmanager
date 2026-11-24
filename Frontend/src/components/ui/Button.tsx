import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]",
  {
    variants: {
      variant: {
        // High-contrast primary neon lime button with deep charcoal text and crisp border
        primary:
          "bg-brand-lime text-brand-charcoal hover:bg-brand-lime-hover border border-[#B3E550] shadow-sm font-semibold hover:shadow",
        // Obsidian button with crisp white text
        obsidian:
          "bg-brand-obsidian text-white hover:bg-brand-obsidian-hover shadow-sm border border-brand-obsidian",
        // Minimal subtle outline button
        outline:
          "bg-white text-brand-charcoal border border-brand-border hover:bg-brand-offwhite hover:border-[#CCD1C8]",
        // Soft button for secondary actions
        secondary:
          "bg-[#ECEEE9] text-brand-charcoal hover:bg-[#E3E6DF]",
        // Clean ghost button
        ghost:
          "text-brand-charcoal hover:bg-brand-offwhite hover:text-brand-charcoal",
        // Text link style
        link:
          "text-brand-charcoal underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-md",
        md: "h-11 px-4 text-sm rounded-lg",
        lg: "h-12 px-6 text-base rounded-lg",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      fullWidth,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 inline-flex items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 inline-flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
