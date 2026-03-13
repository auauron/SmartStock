import { useOutletContext } from "react-router";
import { Package, AlertTriangle, RefreshCw, DollarSign } from "lucide-react";
import { StatsCard } from "../components/ui/StatsCard";
import type { LayoutOutletContext } from "../components/Layout";

export function Dashboard() {
  const { profile } = useOutletContext<LayoutOutletContext>();

  const firstName = profile.fullName.trim().split(/\s+/)[0] || "there";

  const stats = [
    {
      title: "Total Products",
      value: "1,248",
      subtitle: "Active items in inventory",
      icon: Package,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      title: "Low Stock Items",
      value: "23",
      subtitle: "Products need restocking",
      icon: AlertTriangle,
      iconBgColor: "bg-yellow-100",
      iconColor: "text-yellow-700",
    },
    {
      title: "Recently Restocked",
      value: "145",
      subtitle: "In the last 7 days",
      icon: RefreshCw,
      iconBgColor: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
    {
      title: "Total Inventory Value",
      value: "$124,500",
      subtitle: "Current stock value",
      icon: DollarSign,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-700",
    },
  ];

  const lowStockItems = [
    {
      name: "Wireless Mouse",
      category: "Electronics",
      quantity: 8,
      minStock: 20,
    },
    { name: "Office Chair", category: "Furniture", quantity: 3, minStock: 10 },
    { name: "USB Cable", category: "Electronics", quantity: 15, minStock: 50 },
    { name: "Notebook", category: "Stationery", quantity: 12, minStock: 30 },
    { name: "Desk Lamp", category: "Furniture", quantity: 5, minStock: 15 },
  ];

  const recentActivity = [
    {
      product: "Laptop Stand",
      action: "Restocked",
      quantity: "+50 units",
      time: "2 hours ago",
    },
    {
      product: "Mechanical Keyboard",
      action: "New Product",
      quantity: "100 units",
      time: "5 hours ago",
    },
    {
      product: 'Monitor 24"',
      action: "Restocked",
      quantity: "+25 units",
      time: "1 day ago",
    },
    {
      product: "Webcam HD",
      action: "Updated",
      quantity: "Price changed",
      time: "1 day ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back {firstName}! Here's what's happening with your inventory.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Low Stock Items & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Alert
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Items that need restocking soon
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div
                  key={index}
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
                    <p className="text-xs text-gray-500">current / min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Latest updates to your inventory
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.product}
                    </p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.quantity}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
