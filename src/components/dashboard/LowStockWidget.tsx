import { AlertTriangle, ArrowUpRight, PackageX } from "lucide-react";
import type { Inventory } from "../../types";

interface LowStockWidgetProps {
  items: Inventory[];
  loading: boolean;
  onViewAll: () => void;
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[40px_1fr_auto] items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3"
        >
          <div className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-36 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-14 rounded bg-gray-100 animate-pulse ml-auto" />
            <div className="h-3 w-16 rounded bg-gray-100 animate-pulse ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LowStockWidget({
  items,
  loading,
  onViewAll,
}: LowStockWidgetProps) {
  const visibleItems = items.slice(0, 4);

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.28)] transition-all duration-300 hover:shadow-[0_16px_40px_-18px_rgba(15,23,42,0.32)]">
      <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-7 py-6">
        <div className="space-y-1.5">
          <h2 className="font-sans text-xl font-semibold tracking-tight text-gray-900">
            Low Stock Alert
          </h2>
          <p className="max-w-md text-sm text-gray-500">
            Priority items that are below safe stock threshold and need
            restocking.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition-all duration-200 hover:border-emerald-200 hover:text-emerald-700"
          >
            View All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </header>

      <div className="px-7 py-6">
        {loading ? (
          <LoadingRows />
        ) : visibleItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              All stock levels are healthy
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Active alerts will automatically appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visibleItems.map((item) => {
              const severity =
                item.quantity <= item.minStock / 2 ? "critical" : "warning";
              const deficit = Math.max(0, item.minStock - item.quantity);

              return (
                <li
                  key={item.id}
                  className="group grid grid-cols-[40px_1fr_auto] items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_10px_22px_-18px_rgba(2,6,23,0.9)]"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${
                      severity === "critical"
                        ? "border-red-100 bg-red-50"
                        : "border-amber-100 bg-amber-50"
                    }`}
                  >
                    {severity === "critical" ? (
                      <PackageX className="h-4 w-4 text-red-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          severity === "critical"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {severity === "critical" ? "Critical" : "Warning"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {item.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        severity === "critical"
                          ? "text-red-700"
                          : "text-amber-700"
                      }`}
                    >
                      {item.quantity} / {item.minStock}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      Short by {deficit}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
