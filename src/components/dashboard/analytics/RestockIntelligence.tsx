import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Pagination } from "../../ui/Pagination";
import type { Inventory, RestockEntry } from "../../../types";

interface RestockIntelligenceProps {
  inventory: Inventory[];
  history: RestockEntry[];
  loading: boolean;
}

interface ItemForecast {
  item: Inventory;
  dailyConsumptionRate: number;
  daysUntilStockout: number;
  suggestedQty: number;
  urgency: "critical" | "warning" | "healthy";
}

const URGENCY_STYLES = {
  critical: "bg-red-50 text-red-700 border border-red-100",
  warning: "bg-amber-50 text-amber-700 border border-amber-100",
  healthy: "bg-emerald-50 text-emerald-700 border border-emerald-100",
} as const;

const URGENCY_LABELS = {
  critical: "Critical",
  warning: "Warning",
  healthy: "Healthy",
} as const;

const BAR_COLORS = {
  critical: "bg-red-500",
  warning: "bg-amber-500",
  healthy: "bg-emerald-500",
} as const;

export function RestockIntelligence({
  inventory,
  history,
  loading,
}: RestockIntelligenceProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const forecasts = useMemo(() => {
    if (!inventory.length) return [];

    const now = Date.now();
    const msPerDay = 86_400_000;

    const results: ItemForecast[] = inventory.map((item) => {
      // Map by ID, fallback to name for legacy entries without inventoryId
      const itemRestocks = history.filter((h) => h.inventoryId === item.id || (!h.inventoryId && h.inventoryName === item.name));

      let dailyRestockRate: number;

      if (itemRestocks.length > 0) {
        const totalRestocked = itemRestocks.reduce(
          (sum, h) => sum + h.quantityAdded,
          0,
        );
        const earliest = Math.min(
          ...itemRestocks.map((h) => new Date(h.date).getTime()),
        );
        const daysSinceFirst = Math.max(
          1,
          Math.floor((now - earliest) / msPerDay),
        );
        dailyRestockRate = totalRestocked / daysSinceFirst;
      } else {
        dailyRestockRate = item.minStock / 30;
      }

      const surplus = item.quantity - item.minStock;
      // Note: this assumes future restocking cadence equals historical restocking (not true demand-driven consumption)
      const daysUntilStockout =
        surplus <= 0
          ? 0
          : dailyRestockRate > 0
            ? Math.floor(surplus / dailyRestockRate)
            : 999;

      // Target 2× minStock as a comfortable buffer level
      const targetLevel = item.minStock * 2;
      const suggestedQty = Math.max(0, targetLevel - item.quantity);

      // Urgency based purely on current quantity vs minStock
      let urgency: ItemForecast["urgency"];
      if (item.quantity <= item.minStock) {
        urgency = "critical";
      } else if (item.quantity <= item.minStock * 1.5) {
        urgency = "warning";
      } else {
        urgency = "healthy";
      }

      return {
        item,
        dailyConsumptionRate: dailyRestockRate,
        daysUntilStockout,
        suggestedQty,
        urgency,
      };
    });

    const urgencyOrder = { critical: 0, warning: 1, healthy: 2 };
    results.sort((a, b) => {
      const o = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      if (o !== 0) return o;
      return a.daysUntilStockout - b.daysUntilStockout;
    });

    // Return all items that need attention (critical or warning)
    return results.filter((f) => f.urgency !== "healthy");
  }, [inventory, history]);

  const criticalCount = forecasts.filter(
    (f) => f.urgency === "critical",
  ).length;
  const warningCount = forecasts.filter((f) => f.urgency === "warning").length;

  const totalPages = Math.ceil(forecasts.length / ITEMS_PER_PAGE);
  const currentItems = forecasts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Clamp current page if totalPages shrinks below it
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Clickable header — always visible */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors rounded-lg"
      >
        <div className="text-left">
          <h3 className="text-base font-semibold text-gray-900">
            Restock Intelligence
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Data-driven restocking recommendations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Summary badges when collapsed */}
          {!isExpanded && (criticalCount > 0 || warningCount > 0) && (
            <div className="flex items-center gap-1.5">
              {criticalCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-red-50 text-red-700 border border-red-100">
                  {criticalCount} Critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
                  {warningCount} Warning
                </span>
              )}
            </div>
          )}

          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-[800px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-6 pb-6 pt-2 border-t border-gray-100">
          {inventory.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              Add inventory items to generate recommendations
            </p>
          ) : forecasts.every((f) => f.urgency === "healthy") ? (
            <p className="text-gray-500 text-sm text-center py-8">
              All inventory levels are optimal! 🎉
            </p>
          ) : (
            <div className="space-y-3">
              <div className="hidden md:grid md:grid-cols-[2fr_2fr_120px_120px_104px] gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-[60px] text-center">Status</span>
                  <span>Item</span>
                </div>
                <span className="text-center">Stock Level</span>
                <span className="text-center">Days Left</span>
                <span className="text-center">Suggested</span>
                <span className="ml-10">Action</span>
              </div>

              {currentItems.map((f) => {
                const barWidth = Math.min(
                  100,
                  Math.round(
                    (f.item.quantity / Math.max(1, f.item.minStock * 2)) * 100,
                  ),
                );

                return (
                  <div
                    key={f.item.id}
                    className="grid grid-cols-1 md:grid-cols-[2fr_2fr_120px_120px_104px] gap-4 items-center py-3 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    {/* Item info */}
                    <div className="flex items-center gap-2">
                      <div className="w-[60px] flex justify-center">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${URGENCY_STYLES[f.urgency]}`}
                        >
                          {URGENCY_LABELS[f.urgency]}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {f.item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {f.item.category}
                        </p>
                      </div>
                    </div>

                    {/* Stock level bar */}
                    <div className="flex items-center justify-center gap-3 mx-auto w-full max-w-[200px] px-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${BAR_COLORS[f.urgency]}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap min-w-[32px] text-right">
                        {f.item.quantity}/{f.item.minStock}
                      </span>
                    </div>

                    {/* Days left */}
                    <p
                      className={`text-sm font-medium text-center ${
                        f.urgency === "critical"
                          ? "text-red-700"
                          : f.urgency === "warning"
                            ? "text-amber-700"
                            : "text-gray-600"
                      }`}
                    >
                      {f.daysUntilStockout === 999
                        ? "—"
                        : f.daysUntilStockout === 0
                          ? "Now"
                          : `${f.daysUntilStockout}d`}
                    </p>

                    {/* Suggested qty */}
                    <p className="text-sm font-medium text-gray-900 text-center">
                      {f.suggestedQty > 0 ? `+${f.suggestedQty}` : "—"}
                    </p>

                    {/* Action */}
                    <button
                      onClick={() => navigate("/restock")}
                      className="inline-flex items-center justify-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-1.5 hover:bg-emerald-100 transition-colors cursor-pointer md:ml-auto"
                    >
                      Restock
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {totalPages > 1 && (
                <div className="pt-4 border-t border-gray-100 mt-4 mb-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
