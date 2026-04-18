import { Modal } from "../ui/Modal";
import { ActivityItem } from "../../utils/activity";
import { getRelativeTime } from "../../utils/date";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityItem[];
}

export function ActivityModal({ isOpen, onClose, activities }: ActivityModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="All Activities"
    >
      <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No activities found</p>
        ) : (
          activities.map((act) => (
            <div
              key={`${act.timestamp}-${act.itemName}-${act.action}`}
              className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex-1 pr-4">
                <p className="font-semibold text-gray-900">{act.itemName}</p>
                <div className="mt-1">
                  <span
                    className={`text-[10px] font-bold py-0.5 px-2 rounded tracking-wider uppercase ${
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
                    {act.action === "INSERT" ? "NEW ITEM" : 
                     act.action === "UPDATE" ? "UPDATED" :
                     act.action === "DELETE" ? "REMOVED" :
                     act.action === "RESTOCK" ? "RESTOCKED" :
                     act.action}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2" title={act.detail}>
                  {act.detail}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400 font-medium">
                  {getRelativeTime(act.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
