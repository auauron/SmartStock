import {
  Children,
  Fragment,
  type FocusEvent,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import type { LucideIcon } from "lucide-react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

interface DropdownFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  label?: string;
  icon?: LucideIcon;
  wrapperClassName?: string;
  labelClassName?: string;
}

interface DropdownOption {
  value: string;
  label: string;
  disabled: boolean;
}

interface NativeOptionProps {
  value?: string | number;
  children?: ReactNode;
  disabled?: boolean;
}

/** Recursively unwraps React fragments so <option> elements nested inside
 *  <>{...}</> are discovered regardless of nesting depth. */
function flattenOptions(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment) {
      return flattenOptions(
        (child.props as { children?: ReactNode }).children,
      );
    }
    return [child];
  });
}

export function DropdownField({
  children,
  className,
  icon: Icon,
  id,
  label,
  wrapperClassName,
  labelClassName,
  value,
  defaultValue,
  disabled,
  onChange,
  name,
  required,
  onBlur,
  ...props
}: DropdownFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue !== undefined ? String(defaultValue) : "",
  );

  const currentValue = value !== undefined ? String(value) : uncontrolledValue;

  const options = useMemo<DropdownOption[]>(() => {
    return flattenOptions(children).flatMap((child) => {
      if (
        !isValidElement<NativeOptionProps>(child) ||
        child.type !== "option"
      ) {
        return [];
      }

      const optionValue =
        child.props.value !== undefined ? String(child.props.value) : "";
      const optionLabel =
        typeof child.props.children === "string"
          ? child.props.children
          : String(child.props.children ?? "");

      return [
        {
          value: optionValue,
          label: optionLabel,
          disabled: Boolean(child.props.disabled),
        },
      ];
    });
  }, [children]);

  const selectedOption =
    options.find((option) => option.value === currentValue) ?? options[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  const handleSelect = (nextValue: string) => {
    if (value === undefined) {
      setUncontrolledValue(nextValue);
    }

    if (onChange) {
      const syntheticEvent = {
        target: {
          value: nextValue,
          name,
          id,
        },
        currentTarget: {
          value: nextValue,
          name,
          id,
        },
      } as unknown as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }

    setIsOpen(false);
  };

  const handleTriggerBlur = (event: FocusEvent<HTMLButtonElement>) => {
    onBlur?.(event as unknown as FocusEvent<HTMLSelectElement>);
  };

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

      <div className="relative" ref={containerRef}>
        {Icon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        ) : null}

        <button
          id={id}
          type="button"
          onClick={() => {
            if (!disabled) {
              setIsOpen((prev) => !prev);
            }
          }}
          onBlur={handleTriggerBlur}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white py-2.5 text-left text-gray-900 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
            Icon ? "pl-10 pr-10" : "px-3 pr-3",
            className,
          )}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="truncate pr-2">
            {selectedOption?.label ?? "Select"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-gray-500 transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
            )}
            aria-hidden="true"
          />
        </button>

        <input
          tabIndex={-1}
          readOnly
          required={required}
          name={name}
          value={currentValue}
          className="absolute h-0 w-0 overflow-hidden opacity-0"
          aria-hidden="true"
        />

        {isOpen ? (
          <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.45)]">
            <ul role="listbox" className="space-y-1">
              {options.map((option) => {
                const isSelected = option.value === currentValue;

                return (
                  <li key={`${name ?? id ?? "dropdown"}-${option.value}`}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={option.disabled}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                        isSelected
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-gray-700 hover:bg-gray-100",
                        option.disabled
                          ? "cursor-not-allowed opacity-50 hover:bg-transparent"
                          : "cursor-pointer",
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected ? (
                        <Check
                          className="ml-2 h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <select
          id={id ? `${id}-native` : undefined}
          tabIndex={-1}
          className="sr-only"
          value={currentValue}
          onChange={() => {
            // Keeps parity with native select semantics for forms without exposing browser UI.
          }}
          aria-hidden="true"
          disabled={disabled}
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
}
