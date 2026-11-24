import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, checked, defaultChecked, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [internalChecked, setInternalChecked] = React.useState<boolean>(
      checked !== undefined ? checked : defaultChecked || false
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setInternalChecked(e.target.checked);
      }
      onChange?.(e);
    };

    return (
      <div className="flex flex-col space-y-1">
        <label htmlFor={inputId} className="flex items-start gap-2.5 cursor-pointer select-none group">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              id={inputId}
              ref={ref}
              checked={internalChecked}
              onChange={handleChange}
              className="sr-only peer"
              {...props}
            />
            <div
              className={cn(
                "w-4 h-4 rounded border transition-colors flex items-center justify-center",
                "border-brand-border bg-white group-hover:border-brand-charcoal/50",
                "peer-checked:bg-brand-obsidian peer-checked:border-brand-obsidian peer-checked:text-brand-lime",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-obsidian/20",
                error && "border-red-400 bg-red-50/20",
                className
              )}
            >
              <Check className={cn("w-3 h-3 text-brand-lime stroke-[3] transition-transform", internalChecked ? "scale-100" : "scale-0")} />
            </div>
          </div>
          {label && (
            <div className="text-xs text-brand-charcoal leading-tight">
              {label}
              {description && <p className="text-[11px] text-brand-muted mt-0.5">{description}</p>}
            </div>
          )}
        </label>
        {error && <p className="text-xs text-red-600 font-medium ml-6">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
