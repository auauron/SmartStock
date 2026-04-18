import { useState, useRef, useEffect } from "react";
import { MoreVertical, LucideIcon } from "lucide-react";

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-1 w-44 rounded-xl bg-white border border-gray-100 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-100"
          style={{ transformOrigin: 'top right' }}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
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
      )}
    </div>
  );
}
