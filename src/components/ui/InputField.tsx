import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  startAdornment?: ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
}

export function InputField({
  className,
  icon: Icon,
  id,
  label,
  startAdornment,
  wrapperClassName,
  labelClassName,
  ...props
}: InputFieldProps) {
  const hasLeadingVisual = Boolean(Icon || startAdornment);

  return (
    <div className={wrapperClassName}>
      {label ? (
        <label
          htmlFor={id}
          className={cn(
            "mb-1.5 block text-sm font-medium text-gray-700",
            labelClassName,
          )}
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        {Icon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        ) : null}
        {startAdornment ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            {startAdornment}
          </div>
        ) : null}

        <input
          id={id}
          className={cn(
            "block w-full rounded-lg border border-gray-300 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
            hasLeadingVisual ? "pl-10 pr-3" : "px-3",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}
