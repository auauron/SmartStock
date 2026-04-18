import { useOutletContext } from "react-router-dom";
import { AuditLog, LayoutOutletContext, RestockEntry } from "../types";
import { useInventory } from "../hooks/useInventory";
import { useMemo } from "react";
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
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";

interface ActivityItem {
  product: string;
  action: string;
  detail: string;
  timestamp: number;
}

function transformAuditLogs(logs: AuditLog[]): ActivityItem[] {
  return logs.map((log) => {
    let detailMessage = "Action performed";
    if (log.action === "DELETE") {
      detailMessage = "Item removed from system";
    } else if (log.action === "INSERT") {
      const quantity = log.changes?.quantity?.to ?? 0;
      detailMessage = `+${quantity} units`;
    } else if (log.action === "UPDATE") {
      detailMessage = Object.entries(log.changes ?? {})
        .map(([key, value]) => {
          const label = key.replace(/([A-Z])/g, " $1").toLowerCase();
          return `${label}: ${value.from} → ${value.to}`;
        })
        .join(", ");
    }

    return {
      product: log.itemName,
      action: log.action,
      detail: detailMessage,
      timestamp:
        log.createdAt instanceof Date
          ? log.createdAt.getTime()
          : new Date(log.createdAt).getTime(),
    };
  });
}

function transformRestockLogs(history: RestockEntry[]): ActivityItem[] {
  return history.map((h) => ({
    product: h.inventoryName,
    action: "RESTOCK",
    detail: `+${h.quantityAdded} units`,
    timestamp: new Date(h.date).getTime(),
  }));
}

export function Dashboard() {
  const { profile } = useOutletContext<LayoutOutletContext>();
  const { inventory, loading: inventoryLoading, error, clearError } = useInventory();
  const { history, loading: restockLoading } = useRestocks();
  const { logs, loading: logsLoading } = useAuditLogs();

  const isLoading = inventoryLoading || restockLoading || logsLoading;

  const { stats, lowStockItems, recentActivity } = useMemo(() => {
    const totalProducts = inventory.length;
    const lowStock = inventory.filter((p) => p.quantity < p.minStock);
    const value = inventory.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const auditItems = transformAuditLogs(logs);
    const restockItems = transformRestockLogs(history);

    const allActivity = [...restockItems, ...auditItems]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    const statsData = [
      {
        title: "Total Products",
        value: totalProducts.toString(),
        subtitle: "Active items in inventory",
        icon: Package,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-700",
      },
      {
        title: "Low Stock Items",
        value: lowStock.length.toString(),
        subtitle: "Products need restocking",
        icon: AlertTriangle,
        iconBgColor: "bg-yellow-100",
        iconColor: "text-yellow-700",
      },
      {
        title: "Recently Restocked",
        value: history.length > 0 ? history[0].quantityAdded.toString() : "0",
        subtitle: "Latest restock quantity",
        icon: RefreshCw,
        iconBgColor: "bg-emerald-100",
        iconColor: "text-emerald-700",
      },
      {
        title: "Total Inventory Value",
        value: new Intl.NumberFormat("en-Ph", {
          style: "currency",
          currency: "PHP",
        }).format(value),
        subtitle: "Current stock value",
        icon: PhilippinePeso,
        iconBgColor: "bg-purple-100",
        iconColor: "text-purple-700",
      },
    ];

    return {
      stats: statsData,
      lowStockItems: lowStock,
      recentActivity: allActivity,
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

  if (isLoading) {
    return <DashboardSkeleton />;
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
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
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
            {lowStockItems.length === 0 ? (
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
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <p className="text-sm text-gray-500">
              Latest updates to your inventory
            </p>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map((act) => (
              <div
                key={`${act.timestamp}-${act.product}-${act.action}`}
                className="flex justify-between items-center border-b pb-2 last:border-0"
              >
                <div>
                  <p className="font-medium">{act.product}</p>
                  <span
                    className={`text-xs font-semibold py-0.5 px-2 rounded ${
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
                    {act.action === "INSERT" ? "NEW ITEM" : act.action}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
