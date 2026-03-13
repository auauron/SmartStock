import type { ReactNode, SelectHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  label?: string;
  icon?: LucideIcon;
  wrapperClassName?: string;
  labelClassName?: string;
}

export function SelectField({
  children,
  className,
  icon: Icon,
  id,
  label,
  wrapperClassName,
  labelClassName,
  ...props
}: SelectFieldProps) {
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
            "block w-full rounded-lg border border-gray-300 bg-white py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
            Icon ? "pl-10 pr-4" : "px-3",
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
}
