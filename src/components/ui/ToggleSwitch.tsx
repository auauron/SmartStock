import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface ToggleSwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  description?: string;
  wrapperClassName?: string;
}

export function ToggleSwitch({
  className,
  description,
  id,
  label,
  wrapperClassName,
  ...props
}: ToggleSwitchProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        wrapperClassName,
      )}
    >
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description ? (
          <p className="mt-0.5 text-sm text-gray-600">{description}</p>
        ) : null}
      </div>

      <label
        htmlFor={id}
        className="relative inline-flex cursor-pointer items-center"
      >
        <input
          id={id}
          type="checkbox"
          className={cn("peer sr-only", className)}
          {...props}
        />
        <span className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 peer-checked:bg-emerald-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </label>
    </div>
  );
}
