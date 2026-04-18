import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";

export interface ActionMenuItem {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "danger" | "default";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  ariaLabel?: string;
}

export function ActionMenu({ items, ariaLabel = "Action menu" }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        top: `${rect.bottom + window.scrollY + 4}px`,
        right: `${document.documentElement.clientWidth - rect.right - window.scrollX}px`,
      });
    }
  }, [isOpen]);

  const menu = isOpen ? (
    <div
      ref={menuRef}
      className="absolute w-44 rounded-xl bg-white border border-gray-100 shadow-xl z-[9999] overflow-hidden animate-in fade-in zoom-in duration-100"
      style={{ ...menuStyle, transformOrigin: "top right" }}
    >
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              item.onClick();
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
              item.variant === "danger"
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <item.icon className="w-4 h-4 opacity-70" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && createPortal(menu, document.body)}
    </div>
  );
}
