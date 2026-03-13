import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

interface CheckboxFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: ReactNode;
  align?: "start" | "center";
  wrapperClassName?: string;
  labelClassName?: string;
}

export function CheckboxField({
  align = "center",
  className,
  id,
  label,
  wrapperClassName,
  labelClassName,
  ...props
}: CheckboxFieldProps) {
  return (
    <div
      className={cn(
        "flex gap-2",
        align === "start" ? "items-start" : "items-center",
        wrapperClassName,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500",
          align === "start" && "mt-0.5",
          className,
        )}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn("block text-sm text-gray-700", labelClassName)}
      >
        {label}
      </label>
    </div>
  );
}
