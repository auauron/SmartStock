import { ActivityItem } from "../../utils/activity";
import { getRelativeTime } from "../../utils/date";


interface RecentActivityListProps {
    activities: ActivityItem[],
    loading: boolean,
    onViewAll: () => void
}

export function RecentActivityList({
    activities,
    loading,
    onViewAll,
}: RecentActivityListProps) {
    return (
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
            {activities.length > 0 && (
              <button
                onClick={onViewAll}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-md hover:bg-emerald-50 border border-transparent hover:border-emerald-100"
              >
                View All
              </button>
            )}
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b pb-2 last:border-0"
                >
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
            ) : activities.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              activities.map((act) => (
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
                      {act.action === "INSERT"
                        ? "NEW ITEM"
                        : act.action === "UPDATE"
                          ? "UPDATED"
                          : act.action === "DELETE"
                            ? "REMOVED"
                            : act.action === "RESTOCK"
                              ? "RESTOCKED"
                              : act.action}
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
              ))
            )}
          </div>
        </div>
    )
}