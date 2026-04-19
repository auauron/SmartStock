import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Package,
  PhilippinePeso,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { cn } from "../../lib/cn";

const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes shimmer {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }
  
  .animate-slideInUp {
    animation: slideInUp 0.4s ease-out forwards;
  }
  
  .animate-slideInDown {
    animation: slideInDown 0.4s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out forwards;
  }
  
  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }
  
  .metric-item-0 { animation-delay: 0ms; }
  .metric-item-1 { animation-delay: 60ms; }
  .metric-item-2 { animation-delay: 120ms; }
`;

interface ShowcaseSnapshot {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  hook: string;
  insight: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  metrics: Array<{
    label: string;
    value: string;
    toneClass?: string;
  }>;
}

const ROTATION_INTERVAL_MS = 5200;
const TRANSITION_DURATION_MS = 320;

const snapshots: ShowcaseSnapshot[] = [
  {
    id: "inventory-overview",
    badge: "Dashboard Preview",
    title: "Live Inventory Summary",
    subtitle: "See all key metrics at a glance.",
    hook: "Know exactly what's in stock and what needs attention.",
    insight:
      "Dashboard shows total items, healthy stock, and items needing restock in real-time.",
    icon: Package,
    iconBgClass: "bg-blue-50",
    iconColorClass: "text-blue-600",
    metrics: [
      { label: "Total Products", value: "142", toneClass: "text-gray-900" },
      { label: "In Stock", value: "118", toneClass: "text-emerald-700" },
      { label: "Low Stock", value: "24", toneClass: "text-amber-700" },
    ],
  },
  {
    id: "stock-alerts",
    badge: "Inventory Alerts",
    title: "Low Stock Detection",
    subtitle: "Automatic alerts keep you ahead.",
    hook: "Never run out of stock again with minimum level alerts.",
    insight:
      "Products below their minimum threshold are flagged immediately on your dashboard.",
    icon: AlertTriangle,
    iconBgClass: "bg-amber-50",
    iconColorClass: "text-amber-600",
    metrics: [
      { label: "Critical", value: "3", toneClass: "text-red-700" },
      { label: "Warning", value: "12", toneClass: "text-amber-700" },
      { label: "Safe", value: "125", toneClass: "text-emerald-700" },
    ],
  },
  {
    id: "restock-intelligence",
    badge: "Restock Tracking",
    title: "Weekly Restock History",
    subtitle: "Track all restocking activity.",
    hook: "Review restocking patterns to plan better.",
    insight:
      "Weekly trends show how much you're restocking and how patterns compare over time.",
    icon: RefreshCw,
    iconBgClass: "bg-emerald-50",
    iconColorClass: "text-emerald-600",
    metrics: [
      { label: "This Week", value: "156 units", toneClass: "text-gray-900" },
      { label: "Trend", value: "+12%", toneClass: "text-emerald-700" },
      { label: "Avg/Day", value: "22 units", toneClass: "text-blue-700" },
    ],
  },
  {
    id: "inventory-value",
    badge: "Smart Analytics",
    title: "Inventory Valuation",
    subtitle: "Understand your stock value.",
    hook: "See exactly how much capital is tied up in inventory.",
    insight: "Analytics show category breakdown and inventory value trends.",
    icon: PhilippinePeso,
    iconBgClass: "bg-violet-50",
    iconColorClass: "text-violet-600",
    metrics: [
      {
        label: "Total Value",
        value: "PHP 125,450",
        toneClass: "text-gray-900",
      },
      {
        label: "Top Category",
        value: "Foods",
        toneClass: "text-emerald-700",
      },
      {
        label: "Change (7 Days)",
        value: "+2.3%",
        toneClass: "text-emerald-700",
      },
    ],
  },
];

export function SignupDashboardShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let swapTimer: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      swapTimer = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % snapshots.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION_MS);
    }, ROTATION_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      if (swapTimer) {
        clearTimeout(swapTimer);
      }
    };
  }, []);

  const activeSnapshot = useMemo(() => snapshots[activeIndex], [activeIndex]);

  const Icon = activeSnapshot.icon;

  return (
    <div className="relative hidden min-h-screen overflow-hidden lg:flex lg:flex-col lg:justify-center lg:px-14 xl:px-20">
      <style>{animationStyles}</style>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 via-sky-100/40 to-white" />
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.32)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-sky-200/35 blur-3xl" />

      <div className="relative z-10 max-w-xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          <TrendingUp className="h-3.5 w-3.5" />
          Smart Stock Preview
        </p>
        <h2 className="mt-5 text-4xl font-semibold leading-tight text-gray-900 xl:text-5xl">
          Build inventory confidence from day one.
        </h2>

        <div
          className={cn(
            "mt-10 rounded-2xl border border-white/80 bg-white/88 p-6 shadow-[0_20px_50px_-28px_rgba(17,24,39,0.65)] backdrop-blur-md transition-all duration-300",
            isTransitioning
              ? "translate-y-3 scale-[0.985] opacity-0"
              : "translate-y-0 scale-100 opacity-100",
          )}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div
              className={cn(
                "animate-slideInDown",
                !isTransitioning && "opacity-100",
              )}
            >
              <p className="inline-flex rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                {activeSnapshot.badge}
              </p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                {activeSnapshot.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeSnapshot.subtitle}
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl p-3 transition-transform duration-500 hover:scale-110 animate-scaleIn",
                activeSnapshot.iconBgClass,
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 animate-shimmer",
                  activeSnapshot.iconColorClass,
                )}
              />
            </div>
          </div>

          <div className="space-y-3">
            {activeSnapshot.metrics.map((metric, index) => (
              <div
                key={metric.label}
                className={cn(
                  "flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2 transition-all hover:border-emerald-200 hover:shadow-md hover:scale-[1.02] cursor-default",
                  "animate-slideInUp",
                  `metric-item-${index}`,
                  !isTransitioning && "opacity-100",
                )}
              >
                <span className="text-sm text-gray-500">{metric.label}</span>
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    metric.toneClass,
                  )}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          <p
            className={cn(
              "mt-5 text-sm font-medium text-gray-700 animate-slideInUp",
              !isTransitioning && "opacity-100",
            )}
            style={{ animationDelay: "180ms" }}
          >
            {activeSnapshot.hook}
          </p>
          <p
            className={cn(
              "mt-1 text-xs leading-relaxed text-gray-500 animate-slideInUp",
              !isTransitioning && "opacity-100",
            )}
            style={{ animationDelay: "240ms" }}
          >
            {activeSnapshot.insight}
          </p>

          <div className="mt-5 flex items-center gap-2">
            {snapshots.map((snapshot, index) => (
              <button
                key={snapshot.id}
                type="button"
                aria-label={`Show preview ${index + 1}`}
                onClick={() => {
                  setIsTransitioning(false);
                  setActiveIndex(index);
                }}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300 hover:scale-125",
                  index === activeIndex
                    ? "w-8 bg-emerald-600 shadow-md"
                    : "w-2.5 bg-emerald-200 hover:bg-emerald-300",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
