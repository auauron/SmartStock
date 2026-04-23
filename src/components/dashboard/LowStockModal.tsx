import { Modal } from "../ui/Modal";
import { AlertTriangle, PackageX } from "lucide-react";
import type { Inventory } from "../../types";

interface LowStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Inventory[];
}

export function LowStockModal({ isOpen, onClose, items }: LowStockModalProps) {
  const sortedItems = [...items].sort((a, b) => {
    const deficitA = a.minStock - a.quantity;
    const deficitB = b.minStock - b.quantity;
    return deficitB - deficitA;
  });

  const criticalCount = sortedItems.filter(
    (item) => item.quantity <= item.minStock / 2,
  ).length;
  const warningCount = sortedItems.length - criticalCount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All Low Stock Items"
      panelClassName="max-w-3xl"
    >
      <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
        {sortedItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              All stock levels are healthy
            </p>
            <p className="mt-1 text-xs text-gray-500">
              New low-stock alerts will appear here automatically.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Total Alerts
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                  {sortedItems.length}
                </p>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-500">
                  Critical
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-red-700">
                  {criticalCount}
                </p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-500">
                  Warning
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-amber-700">
                  {warningCount}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sortedItems.map((item) => {
                const severity =
                  item.quantity <= item.minStock / 2 ? "critical" : "warning";
                const deficit = Math.max(0, item.minStock - item.quantity);
                const stockProgress = Math.min(
                  100,
                  Math.round(
                    (item.quantity / Math.max(1, item.minStock)) * 100,
                  ),
                );

                return (
                  <div
                    key={item.id}
                    className="group grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_10px_22px_-18px_rgba(2,6,23,0.9)] sm:grid-cols-[40px_1fr_auto] sm:items-center sm:gap-4"
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

                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-1.5 w-full max-w-50 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${
                              severity === "critical"
                                ? "bg-red-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${stockProgress}%` }}
                          />
                        </div>
                        <p className="text-[11px] font-medium text-gray-400">
                          {stockProgress}%
                        </p>
                      </div>
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
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
