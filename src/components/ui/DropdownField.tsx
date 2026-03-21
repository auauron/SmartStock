import type { ReactNode, SelectHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

interface DropdownFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  label?: string;
  icon?: LucideIcon;
  wrapperClassName?: string;
  labelClassName?: string;
}

export function DropdownField({
  children,
  className,
  icon: Icon,
  id,
  label,
  wrapperClassName,
  labelClassName,
  ...props
}: DropdownFieldProps) {
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

        <select
          id={id}
          className={cn(
            "block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 text-gray-900 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
            Icon ? "pl-10 pr-10" : "px-3 pr-10",
            className,
          )}
          {...props}
        >
          {children}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
