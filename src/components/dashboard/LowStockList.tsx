import { Inventory } from "../../types";

interface LowStockListProps {
    items: Inventory[];
    loading: boolean;
    onViewAll: () => void;
}

export function LowStockList({
    items, 
    loading,
    onViewAll,
}: LowStockListProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Alert
              </h2>
              <p className="text-sm text-gray-600">
                Items that need restocking soon
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={onViewAll}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-md hover:bg-emerald-50 border border-transparent hover:border-emerald-100"
              >
                View All
              </button>
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
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
            ) : items.length === 0 ? (
              <p className="text-gray-500 text-sm">
                All stock levels are healthy! 🎉
              </p>
            ) : (
              <div className="space-y-4">
                {items.slice(0, 4).map((item) => (
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
    )
}