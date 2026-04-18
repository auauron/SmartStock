import { AuditLog, RestockEntry } from "../types";

export interface ActivityItem {
  itemName: string;
  action: string;
  detail: string;
  timestamp: number;
}

export function transformAuditLogs(logs: AuditLog[]): ActivityItem[] {
  return logs.map((log) => {
    let detailMessage = "Action performed";
    if (log.action === "DELETE") {
      detailMessage = "Removed from inventory";
    } else if (log.action === "INSERT") {
      const quantity = log.changes?.quantity?.to ?? 0;
      detailMessage = `Added ${quantity} units`;
    } else if (log.action === "UPDATE") {
      const entries = Object.entries(log.changes ?? {});
      if (entries.length === 0) {
        detailMessage = "Modified";
      } else {
        detailMessage = entries
          .map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, " $1").toLowerCase();
            return `${label.charAt(0).toUpperCase() + label.slice(1)} updated: ${value.from} → ${value.to}`;
          })
          .join(", ");
      }
    }

    return {
      itemName: log.itemName,
      action: log.action,
      detail: detailMessage,
      timestamp:
        log.createdAt instanceof Date
          ? log.createdAt.getTime()
          : new Date(log.createdAt).getTime(),
    };
  });
}

export function transformRestockLogs(history: RestockEntry[]): ActivityItem[] {
  return history.map((h) => ({
    itemName: h.inventoryName,
    action: "RESTOCK",
    detail: `Added ${h.quantityAdded} units`,
    timestamp: new Date(h.date).getTime(),
  }));
}
