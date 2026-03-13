import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
  labelClassName?: string;
}

export function TextAreaField({
  className,
  id,
  label,
  wrapperClassName,
  labelClassName,
  ...props
}: TextAreaFieldProps) {
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

      <textarea
        id={id}
        className={cn(
          "block w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
          className,
        )}
        {...props}
      />
    </div>
  );
}
