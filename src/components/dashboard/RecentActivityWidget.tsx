import {
  ArrowUpRight,
  BanknoteArrowDown,
  CirclePlus,
  PencilLine,
  RotateCw,
  Trash2,
} from "lucide-react";
import type { ComponentType } from "react";
import { ActivityItem } from "../../utils/activity";
import { getRelativeTime } from "../../utils/date";

interface RecentActivityWidgetProps {
  activities: ActivityItem[];
  loading: boolean;
  onViewAll: () => void;
}

type ActivityTone = "restock" | "price" | "update" | "insert" | "delete";

interface ToneMeta {
  label: string;
  icon: ComponentType<{ className?: string }>;
  badgeClass: string;
  iconWrapClass: string;
  iconClass: string;
}

function getActivityTone(activity: ActivityItem): ActivityTone {
  if (activity.action === "RESTOCK") {
    return "restock";
  }

  if (activity.action === "DELETE") {
    return "delete";
  }

  if (activity.action === "INSERT") {
    return "insert";
  }

  if (activity.action === "UPDATE") {
    if (/\bprice\b/i.test(activity.detail)) {
      return "price";
    }

    return "update";
  }

  return "update";
}

const toneMeta: Record<ActivityTone, ToneMeta> = {
  restock: {
    label: "Restock",
    icon: RotateCw,
    badgeClass: "bg-emerald-50 text-emerald-700",
    iconWrapClass: "bg-emerald-50 border-emerald-100",
    iconClass: "text-emerald-600",
  },
  price: {
    label: "Price Change",
    icon: BanknoteArrowDown,
    badgeClass: "bg-amber-50 text-amber-700",
    iconWrapClass: "bg-amber-50 border-amber-100",
    iconClass: "text-amber-600",
  },
  update: {
    label: "Updated",
    icon: PencilLine,
    badgeClass: "bg-blue-50 text-blue-700",
    iconWrapClass: "bg-blue-50 border-blue-100",
    iconClass: "text-blue-600",
  },
  insert: {
    label: "New Item",
    icon: CirclePlus,
    badgeClass: "bg-blue-50 text-blue-700",
    iconWrapClass: "bg-blue-50 border-blue-100",
    iconClass: "text-blue-600",
  },
  delete: {
    label: "Removed",
    icon: Trash2,
    badgeClass: "bg-gray-100 text-gray-600",
    iconWrapClass: "bg-gray-100 border-gray-200",
    iconClass: "text-gray-600",
  },
};

function LoadingRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[40px_1fr_auto] items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3"
        >
          <div className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-44 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-64 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function RecentActivityWidget({
  activities,
  loading,
  onViewAll,
}: RecentActivityWidgetProps) {
  const items = activities.slice(0, 5);

  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.28)] transition-all duration-300 hover:shadow-[0_16px_40px_-18px_rgba(15,23,42,0.32)]">
      <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-7 py-6">
        <div className="space-y-1.5">
          <h2 className="font-sans text-xl font-semibold tracking-tight text-gray-900">
            Recent Activity
          </h2>
          <p className="max-w-md text-sm text-gray-500">
            Live timeline of restocks, edits, and pricing updates across your
            inventory.
          </p>
        </div>

        {activities.length > 0 && (
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition-all duration-200 hover:border-blue-200 hover:text-blue-700"
          >
            View All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </header>

      <div className="px-7 py-6">
        {loading ? (
          <LoadingRows />
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              No recent activity yet
            </p>
            <p className="mt-1 text-xs text-gray-500">
              New restocks and updates will appear here automatically.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((activity) => {
              const tone = getActivityTone(activity);
              const meta = toneMeta[tone];
              const Icon = meta.icon;

              return (
                <li
                  key={`${activity.timestamp}-${activity.itemName}-${activity.action}`}
                  className="group grid grid-cols-[40px_1fr_auto] items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_10px_22px_-18px_rgba(2,6,23,0.9)]"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105 ${meta.iconWrapClass}`}
                  >
                    <Icon className={`h-4 w-4 ${meta.iconClass}`} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {activity.itemName}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p
                      className="mt-1 truncate text-xs text-gray-500"
                      title={activity.detail}
                    >
                      {activity.detail}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-xs font-medium text-gray-400">
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
