import { Modal } from "../ui/Modal";
import {
  BanknoteArrowDown,
  CirclePlus,
  PencilLine,
  RotateCw,
  Trash2,
} from "lucide-react";
import { ActivityItem } from "../../utils/activity";
import { getRelativeTime } from "../../utils/date";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityItem[];
}

type ActivityTone = "restock" | "price" | "update" | "insert" | "delete";

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

export function ActivityModal({
  isOpen,
  onClose,
  activities,
}: ActivityModalProps) {
  const sortedActivities = [...activities].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  const restockCount = sortedActivities.filter(
    (activity) => getActivityTone(activity) === "restock",
  ).length;
  const priceCount = sortedActivities.filter(
    (activity) => getActivityTone(activity) === "price",
  ).length;
  const updateCount = sortedActivities.filter((activity) => {
    const tone = getActivityTone(activity);
    return tone === "update" || tone === "insert";
  }).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All Activities"
      panelClassName="max-w-3xl"
    >
      <div className="max-h-[70vh] overflow-y-auto p-6 space-y-5">
        {sortedActivities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">
              No recent activity yet
            </p>
            <p className="mt-1 text-xs text-gray-500">
              New restocks and inventory updates will appear here automatically.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Total Activities
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                  {sortedActivities.length}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-500">
                  Restocks
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-emerald-700">
                  {restockCount}
                </p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-500">
                  Price Changes
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-amber-700">
                  {priceCount}
                </p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-500">
                  Updates
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-blue-700">
                  {updateCount}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sortedActivities.map((activity) => {
                const tone = getActivityTone(activity);

                const meta =
                  tone === "restock"
                    ? {
                        label: "Restock",
                        icon: RotateCw,
                        badgeClass: "bg-emerald-50 text-emerald-700",
                        iconWrapClass: "border-emerald-100 bg-emerald-50",
                        iconClass: "text-emerald-600",
                      }
                    : tone === "price"
                      ? {
                          label: "Price Change",
                          icon: BanknoteArrowDown,
                          badgeClass: "bg-amber-50 text-amber-700",
                          iconWrapClass: "border-amber-100 bg-amber-50",
                          iconClass: "text-amber-600",
                        }
                      : tone === "delete"
                        ? {
                            label: "Removed",
                            icon: Trash2,
                            badgeClass: "bg-gray-100 text-gray-600",
                            iconWrapClass: "border-gray-200 bg-gray-100",
                            iconClass: "text-gray-600",
                          }
                        : tone === "insert"
                          ? {
                              label: "New Item",
                              icon: CirclePlus,
                              badgeClass: "bg-blue-50 text-blue-700",
                              iconWrapClass: "border-blue-100 bg-blue-50",
                              iconClass: "text-blue-600",
                            }
                          : {
                              label: "Updated",
                              icon: PencilLine,
                              badgeClass: "bg-blue-50 text-blue-700",
                              iconWrapClass: "border-blue-100 bg-blue-50",
                              iconClass: "text-blue-600",
                            };

                const Icon = meta.icon;

                return (
                  <div
                    key={`${activity.timestamp}-${activity.itemName}-${activity.action}`}
                    className="group grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_10px_22px_-18px_rgba(2,6,23,0.9)] sm:grid-cols-[40px_1fr_auto] sm:items-center sm:gap-4"
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

                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-400">
                        {getRelativeTime(activity.timestamp)}
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
