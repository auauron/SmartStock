import type { RestockEntry } from "../types";

export interface RestockRow {
  id: string;
  inventory_id: string;
  quantity_added: number;
  notes: string | null;
  restocked_at: string;
  inventories: { name: string } | { name: string }[] | null;
}

export interface CreateRestockRpcRow {
  id: string;
  inventory_id: string;
  inventory_name: string;
  quantity_added: number;
  notes: string | null;
  restocked_at: string;
}

function getJoinedInventoryName(
  joined: RestockRow["inventories"],
  fallback = "Unknown Item",
): string {
  if (!joined) return fallback;
  if (Array.isArray(joined)) {
    return joined[0]?.name ?? fallback;
  }
  return joined.name;
}

export class RestockFactory {
  static createFromHistoryRow(row: RestockRow): RestockEntry {
    return {
      id: row.id,
      inventoryId: row.inventory_id,
      inventoryName: getJoinedInventoryName(row.inventories),
      quantityAdded: row.quantity_added,
      date: row.restocked_at,
      notes: row.notes ?? "",
    };
  }

  static createFromRpcRow(row: CreateRestockRpcRow): RestockEntry {
    return {
      id: row.id,
      inventoryId: row.inventory_id,
      inventoryName: row.inventory_name,
      quantityAdded: row.quantity_added,
      date: row.restocked_at,
      notes: row.notes ?? "",
    };
  }
}
