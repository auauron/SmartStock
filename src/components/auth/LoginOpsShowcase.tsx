import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  Siren,
  Sparkles,
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
  
  .animate-slideInUp {
    animation: slideInUp 0.4s ease-out forwards;
  }
  
  .animate-slideInDown {
    animation: slideInDown 0.4s ease-out forwards;
  }
  
  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out forwards;
  }
  
  .metric-item-0 { animation-delay: 0ms; }
  .metric-item-1 { animation-delay: 60ms; }
  .activity-item-0 { animation-delay: 120ms; }
  .activity-item-1 { animation-delay: 180ms; }
  .action-item-0 { animation-delay: 240ms; }
  .action-item-1 { animation-delay: 300ms; }
  .action-item-2 { animation-delay: 360ms; }
`;

interface OperationSnapshot {
  id: string;
  title: string;
  subtitle: string;
  metrics: Array<{
    label: string;
    value: string;
    color: string;
  }>;
  activities: Array<{
    title: string;
    detail: string;
    time: string;
    tone: string;
    dot: string;
  }>;
}

const ROTATION_INTERVAL_MS = 5200;
const TRANSITION_DURATION_MS = 320;

const snapshots: OperationSnapshot[] = [
  {
    id: "dashboard-overview",
    title: "Dashboard Overview",
    subtitle: "All your metrics in one view",
    metrics: [
      { label: "Total Inventory", value: "1,245", color: "text-emerald-700" },
      { label: "Stock Alerts", value: "12", color: "text-amber-600" },
    ],
    activities: [
      {
        title: "Low stock alert",
        detail: "Item quantity fell below minimum",
        time: "Just now",
        tone: "text-amber-700",
        dot: "bg-amber-500",
      },
      {
        title: "Restock recorded",
        detail: "New stock added to inventory",
        time: "5 mins ago",
        tone: "text-emerald-700",
        dot: "bg-emerald-500",
      },
    ],
  },
  {
    id: "inventory-management",
    title: "Inventory Management",
    subtitle: "Organize and track products",
    metrics: [
      { label: "Items Tracked", value: "1,245", color: "text-emerald-700" },
      { label: "Inventory Value", value: "₱145.2K", color: "text-gray-900" },
    ],
    activities: [
      {
        title: "Stock adjusted",
        detail: "Quantity manually updated by admin",
        time: "2 mins ago",
        tone: "text-emerald-700",
        dot: "bg-emerald-500",
      },
      {
        title: "Item deleted",
        detail: "Obsolete item removed from catalog",
        time: "18 mins ago",
        tone: "text-gray-700",
        dot: "bg-gray-500",
      },
    ],
  },
  {
    id: "restock-history",
    title: "Restock History",
    subtitle: "Track all restocking activity",
    metrics: [
      { label: "Weekly Restocks", value: "340", color: "text-emerald-700" },
      { label: "Trend", value: "+12%", color: "text-emerald-600" },
    ],
    activities: [
      {
        title: "Restock recorded",
        detail: "78 units added to inventory",
        time: "4 mins ago",
        tone: "text-emerald-700",
        dot: "bg-emerald-500",
      },
      {
        title: "Restock logged",
        detail: "Multiple products restocked together",
        time: "35 mins ago",
        tone: "text-gray-700",
        dot: "bg-gray-500",
      },
    ],
  },
  {
    id: "smart-analytics",
    title: "Smart Analytics",
    subtitle: "Insights and trends",
    metrics: [
      { label: "Total Value", value: "₱145.2K", color: "text-gray-900" },
      { label: "Top Category", value: "Foods", color: "text-emerald-700" },
    ],
    activities: [
      {
        title: "Item added",
        detail: "New product listed in catalog",
        time: "30 mins ago",
        tone: "text-emerald-700",
        dot: "bg-emerald-500",
      },
      {
        title: "Stock adjusted",
        detail: "Audit correction completed",
        time: "1 hour ago",
        tone: "text-gray-700",
        dot: "bg-gray-500",
      },
    ],
  },
];

export function LoginOpsShowcase() {
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

  return (
    <div className="relative hidden min-h-screen lg:flex lg:items-center lg:justify-center p-2">
      <style>{animationStyles}</style>

      <div className="absolute inset-4 lg:inset-6 rounded-[2rem] overflow-hidden bg-linear-to-br from-emerald-100/55 via-white to-sky-100/45">
        <div className="absolute inset-0 opacity-24 [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.32)_1px,transparent_0)] [background-size:22px_22px]" />
        <div className="absolute right-8 top-20 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute left-8 bottom-14 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute -left-18 top-1/3 h-72 w-72 rounded-full bg-emerald-100/35 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[28rem] xl:max-w-lg">
        <h2 className="mb-6 text-3xl font-semibold leading-tight text-gray-900 xl:text-4xl">
          Pick up where your inventory left off.
        </h2>

        <div
          className={cn(
            "rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-[0_24px_45px_-28px_rgba(17,24,39,0.45)] backdrop-blur transition-all duration-300",
            isTransitioning
              ? "translate-y-3 scale-[0.985] opacity-0"
              : "translate-y-0 scale-100 opacity-100",
          )}
        >
          <div className="flex items-center justify-between gap-4 animate-slideInDown">
            <div>
              <h3 className="mt-1 xl:mt-1.5 text-lg xl:text-xl font-semibold text-gray-900">
                {activeSnapshot.title}
              </h3>
              <p className="text-[11px] xl:text-xs text-gray-500 mt-0.5">
                {activeSnapshot.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-1 xl:px-2.5 xl:py-1.5 text-[10px] xl:text-xs font-semibold text-emerald-700 animate-scaleIn">
              <span className="relative flex h-2 xl:h-2.5 w-2 xl:w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 xl:h-2.5 w-2 xl:w-2.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </div>
          </div>

          <div className="mt-4 xl:mt-5 grid grid-cols-2 gap-2 xl:gap-3">
            {activeSnapshot.metrics.map((metric, index) => (
              <div
                key={metric.label}
                className={cn(
                  "animate-slideInUp metric-item-" + index,
                  "rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2 xl:px-3 xl:py-2.5 transition-all hover:border-emerald-200 hover:shadow-md hover:scale-[1.02]",
                )}
              >
                <p className="text-[10px] xl:text-[11px] uppercase tracking-wide text-gray-500">
                  {metric.label}
                </p>
                <p
                  className={cn(
                    "mt-0.5 xl:mt-1 text-lg xl:text-xl font-bold",
                    metric.color,
                  )}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 xl:mt-5 space-y-2 xl:space-y-3">
            {activeSnapshot.activities.map((activity, index) => (
              <div
                key={activity.title}
                className={cn(
                  "animate-slideInUp activity-item-" + index,
                  "flex items-start gap-2.5 xl:gap-3 rounded-lg border border-gray-100 bg-white px-2.5 py-2 xl:px-3 xl:py-2.5 transition-all hover:border-emerald-200 hover:shadow-md",
                )}
              >
                <span
                  className={`mt-1 h-2 xl:h-2.5 w-2 xl:w-2.5 rounded-full flex-shrink-0 ${activity.dot}`}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs xl:text-sm font-semibold ${activity.tone}`}
                  >
                    {activity.title}
                  </p>
                  <p className="text-[10px] xl:text-xs text-gray-500 truncate">
                    {activity.detail}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] xl:text-[11px] text-gray-400 whitespace-nowrap">
                  <Clock3 className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
                  {activity.time}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 xl:mt-5 grid grid-cols-3 gap-1.5 xl:gap-2">
            <div className="animate-slideInUp action-item-0 inline-flex items-center justify-center gap-1 rounded-md bg-emerald-50 px-2 py-1 xl:py-1.5 text-[10px] xl:text-[11px] font-semibold text-emerald-700 transition-all hover:scale-105 hover:shadow-sm">
              <TrendingUp className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
              Trends
            </div>
            <div className="animate-slideInUp action-item-1 inline-flex items-center justify-center gap-1 rounded-md bg-gray-100 px-2 py-1 xl:py-1.5 text-[10px] xl:text-[11px] font-semibold text-gray-700 transition-all hover:scale-105 hover:shadow-sm">
              <Sparkles className="h-3 w-3 xl:h-3.5 xl:w-3.5"></Sparkles>
              Insights
            </div>
            <div className="animate-slideInUp action-item-2 inline-flex items-center justify-center gap-1 rounded-md bg-amber-50 px-2 py-1 xl:py-1.5 text-[10px] xl:text-[11px] font-semibold text-amber-700 transition-all hover:scale-105 hover:shadow-sm">
              <Siren className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
              Alerts
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            {snapshots.map((snapshot, index) => (
              <button
                key={snapshot.id}
                type="button"
                aria-label={`Show ${snapshot.title}`}
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
