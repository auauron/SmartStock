import { useOutletContext } from "react-router-dom";
import { LayoutOutletContext } from "../types";
import { useInventory } from "../hooks/useInventory";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Package,
  PhilippinePeso,
  RefreshCw,
} from "lucide-react";
import { StatsCard } from "../components/ui/StatsCard";
import { useRestocks } from "../hooks/useRestocks";
import { getRelativeTime } from "../utils/date";
import { useAuditLogs } from "../hooks/useAuditLog";
import { transformAuditLogs, transformRestockLogs } from "../utils/activity";
import { ActivityModal } from "../components/dashboard/ActivityModal";


export function Dashboard() {
  const { profile } = useOutletContext<LayoutOutletContext>();
  const { inventory, loading: inventoryLoading, error, clearError } = useInventory();
  const { history, loading: restockLoading } = useRestocks();
  const { logs, loading: logsLoading } = useAuditLogs();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const { stats, lowStockItems, recentActivity, allActivity } = useMemo(() => {
    const totalProducts = inventory.length;
    const lowStock = inventory.filter((p) => p.quantity < p.minStock);
    const value = inventory.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const auditItems = transformAuditLogs(logs);
    const restockItems = transformRestockLogs(history);

    const allUnifiedActivity = [...restockItems, ...auditItems]
      .sort((a, b) => b.timestamp - a.timestamp);

    const statsData = [
      {
        title: "Total Inventory",
        value: totalProducts.toString(),
        subtitle: "Active items in system",
        icon: Package,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-700",
      },
      {
        title: "Stock Alerts",
        value: lowStock.length.toString(),
        subtitle: "Items below minimum level",
        icon: AlertTriangle,
        iconBgColor: "bg-yellow-100",
        iconColor: "text-yellow-700",
      },
      {
        title: "Latest Intake",
        value: history.length > 0 ? history[0].quantityAdded.toString() : "0",
        subtitle: "Most recent restock quantity",
        icon: RefreshCw,
        iconBgColor: "bg-emerald-100",
        iconColor: "text-emerald-700",
      },
      {
        title: "Inventory Value",
        value: new Intl.NumberFormat("en-Ph", {
          style: "currency",
          currency: "PHP",
        }).format(value),
        subtitle: "Current valuation of stock",
        icon: PhilippinePeso,
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-700",
      },
    ];

    return {
      stats: statsData,
      lowStockItems: lowStock,
      recentActivity: allUnifiedActivity.slice(0, 4),
      allActivity: allUnifiedActivity,
    };
  }, [inventory, history, logs]);

  const firstName = profile.fullName.trim().split(/\s+/)[0] || "there";

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        <span className="block sm:inline">{error}</span>
        <button
          onClick={clearError}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {profile.businessName
            ? `${profile.businessName} Dashboard`
            : "Dashboard"}
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {firstName}! Here's what's happening with your
          inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard {...stats[0]} loading={inventoryLoading} />
        <StatsCard {...stats[1]} loading={inventoryLoading} />
        <StatsCard {...stats[2]} loading={restockLoading} />
        <StatsCard {...stats[3]} loading={inventoryLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Alert
            </h2>
            <p className="text-sm text-gray-600">
              Items that need restocking soon
            </p>
          </div>
          <div className="p-6">
            {inventoryLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : lowStockItems.length === 0 ? (
              <p className="text-gray-500 text-sm">
                All stock levels are healthy! 🎉
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-700">
                        {item.quantity} / {item.minStock}
                      </p>
                      <p className="text-xs text-gray-400">current / min</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <p className="text-sm text-gray-500">
                Latest updates to your inventory
              </p>
            </div>
            {allActivity.length > 0 && (
              <button
                onClick={() => setIsActivityModalOpen(true)}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-md hover:bg-emerald-50 border border-transparent hover:border-emerald-100"
              >
                View All
              </button>
            )}
          </div>
          <div className="p-6 space-y-4">
            {logsLoading || restockLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
                  </div>
                </div>
              ))
            ) : recentActivity.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
            recentActivity.map((act) => (
              <div
                key={`${act.timestamp}-${act.itemName}-${act.action}`}
                className="flex justify-between items-center border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{act.itemName}</p>
                  <span
                    className={`text-[10px] font-bold py-0.5 px-2 rounded tracking-wider ${
                      act.action === "INSERT"
                        ? "bg-green-100 text-green-700"
                        : act.action === "DELETE"
                          ? "bg-red-100 text-red-700"
                          : act.action === "UPDATE"
                            ? "bg-blue-100 text-blue-700"
                            : act.action === "RESTOCK"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {act.action === "INSERT" ? "ITEM ADDED" : 
                     act.action === "UPDATE" ? "MODIFIED" :
                     act.action === "DELETE" ? "REMOVED" :
                     act.action === "RESTOCK" ? "STOCK INTAKE" :
                     act.action}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {act.detail}
                  </p>
                  <p className="text-xs text-gray-400">
                    {getRelativeTime(act.timestamp)}
                  </p>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activities={allActivity}
      />
    </div>
  );
}
