import { useOutletContext } from "react-router-dom";
import { LayoutOutletContext } from "../types";
import { useInventory } from "../hooks/useProducts";
import { useMemo } from "react";
import { AlertTriangle, Loader2, Package, PhilippinePeso, RefreshCw } from "lucide-react";
import { StatsCard } from "../components/ui/StatsCard";
import { useRestocks } from "../hooks/useRestocks";
import { getRelativeTime } from "../utils/date";

export function Dashboard() {
  const { profile } = useOutletContext<LayoutOutletContext>();
  const { products, loading, error, clearError } = useInventory();
  const { history, loading: restockLoading } = useRestocks();

  const { stats, lowStockItems, recentActivity } = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.quantity < p.minStock);
    const value = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const restockLogs = history.map(h => ({
      product: h.productName,
      action: "Restocked",
      detail: `+${h.quantityAdded} units`,
      timestamp: new Date(h.date).getTime()
    }))

    const newProductLogs = products
    .filter(p => p.createdAt)
    .map(p => ({
      product: p.name,
      action: "New Product",
      detail:  `${p.quantity} units`,
      timestamp: new Date(p.createdAt!).getTime()
    }))

    const updatedProductLogs = products
      .filter(p => p.updatedAt && p.updatedAt !== p.createdAt)
      .map(p => ({
        product: p.name,
        action: 'Updated',
        detail: 'Details modified',
        timestamp: new Date(p.updatedAt!).getTime()
      }))

    const allActivity = [...restockLogs, ...newProductLogs, ...updatedProductLogs]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)

    const statsData = [
      {
        title: "Total Products",
        value: totalProducts.toString(),
        subtitle: "Active items in inventory",
        icon: Package,
        iconBgColor: 'bg-blue-100',
        iconColor: 'text-blue-700',
      },
      {
        title: "Low Stock Items",
        value: lowStock.length.toString(),
        subtitle: "Products need restocking",
        icon: AlertTriangle,
        iconBgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-700'
      },
      {
        title: 'Recently Restocked',
        value: history.length > 0 ? history[0].quantityAdded.toString() : '0',
        subtitle: 'Latest restock quantity',
        icon: RefreshCw,
        iconBgColor: 'bg-emerald-100',
        iconColor: 'text-emerald-700',
      },
      {
        title: 'Total Inventory Value',
        value: new Intl.NumberFormat('en-Ph', {style: 'currency', currency: 'PHP'}).format(value),
        subtitle:  'Current stock value',
        icon: PhilippinePeso,
        iconBgColor: 'bg-purple-100',
        iconColor: 'text-purple-700'
      },
    ];
    return { stats: statsData, lowStockItems: lowStock, recentActivity: allActivity };
  }, [products, history]);

  const firstName = profile.fullName.trim().split(/\s+/)[0] || "there";

  if (loading || restockLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button onClick={clearError} className="absolute top-0 bottom-0 right-0 px-4 py-3">
            Dismiss
          </button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {profile.businessName ? `${profile.businessName} Dashboard` : "Dashboard"}
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {firstName}! Here's what's happening with your inventory.
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
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            <p className="text-sm text-gray-600">Items that need restocking soon</p>
          </div>
          <div className="p-6">
            {lowStockItems.length === 0 ? (
              <p className="text-gray-500 text-sm">All stock levels are healthy! 🎉</p>
            ) : (
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
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
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-500">Latest updates to your inventory</p>
            </div>
            <div className="p-6 space-y-4">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{act.product}</p>
                    <span className="text-xs font-semibold py-0.5 text-gray-400">
                      {act.action}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{act.detail}</p>
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
  )
}