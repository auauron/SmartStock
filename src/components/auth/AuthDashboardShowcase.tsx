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
    title: "Inventory Health Pulse",
    subtitle: "Your stock position updates in one glance.",
    hook: "Never guess what is running low before peak hours.",
    insight:
      "Low-stock items are prioritized so your next action is always obvious.",
    icon: Package,
    iconBgClass: "bg-blue-50",
    iconColorClass: "text-blue-600",
    metrics: [
      { label: "Total Inventory", value: "142", toneClass: "text-gray-900" },
      { label: "Healthy Items", value: "118", toneClass: "text-emerald-700" },
      { label: "Attention Needed", value: "24", toneClass: "text-amber-700" },
    ],
  },
  {
    id: "stock-alerts",
    badge: "Low Stock Alert",
    title: "Critical Items Surface First",
    subtitle: "Prioritize shelves that can run out soon.",
    hook: "Restock the right products before they hurt sales.",
    insight:
      "Alert chips map directly to critical and warning inventory levels.",
    icon: AlertTriangle,
    iconBgClass: "bg-amber-50",
    iconColorClass: "text-amber-600",
    metrics: [
      { label: "Critical", value: "5", toneClass: "text-red-700" },
      { label: "Warning", value: "12", toneClass: "text-amber-700" },
      { label: "Safe", value: "125", toneClass: "text-emerald-700" },
    ],
  },
  {
    id: "restock-intelligence",
    badge: "Restock Intelligence",
    title: "Weekly Restock Momentum",
    subtitle: "See movement trends and keep supply balanced.",
    hook: "Track restock rhythm so your shelves stay ready.",
    insight:
      "Trend direction compares this week against last week automatically.",
    icon: RefreshCw,
    iconBgClass: "bg-emerald-50",
    iconColorClass: "text-emerald-600",
    metrics: [
      { label: "This Week", value: "84 units", toneClass: "text-gray-900" },
      { label: "Trend", value: "+18%", toneClass: "text-emerald-700" },
      { label: "Forecast", value: "Stable", toneClass: "text-blue-700" },
    ],
  },
  {
    id: "inventory-value",
    badge: "Value Tracking",
    title: "Total Inventory Value",
    subtitle: "Understand stock value without opening reports.",
    hook: "Know where your capital sits in real inventory.",
    insight: "Value snapshots help you restock smarter across top categories.",
    icon: PhilippinePeso,
    iconBgClass: "bg-violet-50",
    iconColorClass: "text-violet-600",
    metrics: [
      {
        label: "Current Value",
        value: "PHP 245,400",
        toneClass: "text-gray-900",
      },
      {
        label: "Top Category",
        value: "Beverages",
        toneClass: "text-emerald-700",
      },
      { label: "7 Day Change", value: "+6.4%", toneClass: "text-emerald-700" },
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
            <div>
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
            <div className={cn("rounded-xl p-3", activeSnapshot.iconBgClass)}>
              <Icon className={cn("h-6 w-6", activeSnapshot.iconColorClass)} />
            </div>
          </div>

          <div className="space-y-3">
            {activeSnapshot.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2"
              >
                <span className="text-sm text-gray-500">{metric.label}</span>
                <span className={cn("text-sm font-semibold", metric.toneClass)}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm font-medium text-gray-700">
            {activeSnapshot.hook}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
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
                  "h-2.5 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-8 bg-emerald-600"
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
