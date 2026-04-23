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
import { StatsCard, StatsCardProps } from "../components/ui/StatsCard";
import { useRestocks } from "../hooks/useRestocks";
import { useAuditLogs } from "../hooks/useAuditLog";
import { transformAuditLogs, transformRestockLogs } from "../utils/activity";
import { ActivityModal } from "../components/dashboard/ActivityModal";
import { SmartAnalytics } from "../components/dashboard/SmartAnalytics";
import { LowStockModal } from "../components/dashboard/LowStockModal";
import { RecentActivityWidget } from "../components/dashboard/RecentActivityWidget";
import { LowStockWidget } from "../components/dashboard/LowStockWidget";

export function Dashboard() {
  const { profile } = useOutletContext<LayoutOutletContext>();
  const {
    inventory,
    loading: inventoryLoading,
    error,
    clearError,
  } = useInventory();
  const { history, loading: restockLoading } = useRestocks();
  const { logs, loading: logsLoading } = useAuditLogs();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);

  const { stats, lowStockItems, recentActivity, allActivity } = useMemo(() => {
    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * msInDay;
    const fourteenDaysAgo = now - 14 * msInDay;

    const totalProducts = inventory.length;
    const lowStock = inventory.filter((p) => p.quantity < p.minStock);
    const value = inventory.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Calculate restock trends
    const thisWeekRestocks = history.filter(
      (h) => new Date(h.date).getTime() >= sevenDaysAgo,
    );
    const lastWeekRestocks = history.filter((h) => {
      const time = new Date(h.date).getTime();
      return time >= fourteenDaysAgo && time < sevenDaysAgo;
    });

    const thisWeekTotal = thisWeekRestocks.reduce(
      (sum, h) => sum + h.quantityAdded,
      0,
    );
    const lastWeekTotal = lastWeekRestocks.reduce(
      (sum, h) => sum + h.quantityAdded,
      0,
    );

    const restockTrend =
      lastWeekTotal === 0
        ? "—"
        : Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);

    // Calculate inventory item growth
    const newItemsThisWeek = inventory.filter(
      (p) => p.createdAt && new Date(p.createdAt).getTime() >= sevenDaysAgo,
    ).length;
    const itemGrowthTrend =
      totalProducts === 0
        ? 0
        : Math.round((newItemsThisWeek / (totalProducts || 1)) * 100);

    const auditItems = transformAuditLogs(logs);
    const restockItems = transformRestockLogs(history);

    const allUnifiedActivity = [...restockItems, ...auditItems].sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    const statsData: StatsCardProps[] = [
      {
        title: "Total Inventory",
        value: totalProducts.toString(),
        subtitle: "Items currently tracked",
        icon: Package,
        iconBgColor: "bg-blue-50",
        iconColor: "text-blue-600",
        trend: {
          value: itemGrowthTrend,
          label: "vs last week",
          direction: itemGrowthTrend > 0 ? "up" : "neutral",
        },
      },
      {
        title: "Stock Alerts",
        value: lowStock.length.toString(),
        subtitle: "Items below minimum",
        icon: AlertTriangle,
        iconBgColor: "bg-amber-50",
        iconColor: "text-amber-600",
        actionDisabled: lowStock.length === 0,
      },
      {
        title: "Weekly Restocks",
        value: thisWeekTotal.toString(),
        subtitle: "Units added this week",
        icon: RefreshCw,
        iconBgColor: "bg-emerald-50",
        iconColor: "text-emerald-600",
        trend: {
          value: restockTrend === "—" ? "—" : Math.abs(restockTrend as number),
          label: "vs last week",
          direction:
            restockTrend === "—"
              ? "neutral"
              : (restockTrend as number) > 0
                ? "up"
                : (restockTrend as number) < 0
                  ? "down"
                  : "neutral",
        },
      },
      {
        title: "Inventory Value",
        value: new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(value),
        subtitle: "Total stock valuation",
        icon: PhilippinePeso,
        iconBgColor: "bg-purple-50",
        iconColor: "text-purple-600",
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
        <p className="text-gray-600 -mt-4">
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

      <SmartAnalytics
        inventory={inventory}
        history={history}
        loading={inventoryLoading || restockLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockWidget
          items={lowStockItems}
          loading={inventoryLoading}
          onViewAll={() => setIsLowStockModalOpen(true)}
        />

        <RecentActivityWidget
          activities={recentActivity}
          loading={logsLoading || restockLoading}
          onViewAll={() => setIsActivityModalOpen(true)}
        />
      </div>

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        activities={allActivity}
      />

      <LowStockModal
        isOpen={isLowStockModalOpen}
        onClose={() => setIsLowStockModalOpen(false)}
        items={lowStockItems}
      />
    </div>
  );
}
