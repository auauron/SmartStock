import { supabase } from "../lib/supabaseClient";
import type {
  CreateRestockInput,
  RestockEntry,
  RestockInventoryOption,
} from "../types";

interface RestockRow {
  id: string;
  inventory_id: string;
  quantity_added: number;
  notes: string | null;
  restocked_at: string;
  inventories: { name: string } | { name: string }[] | null;
}

interface CreateRestockRpcRow {
  id: string;
  inventory_id: string;
  inventory_name: string;
  quantity_added: number;
  notes: string;
  restocked_at: string;
}

async function requireUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in to manage restocks.");
  }

  return user.id;
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

export async function getRestockInventory(): Promise<RestockInventoryOption[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("inventories")
    .select("id, name")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
  })) as RestockInventoryOption[];
}

export async function getRestockHistory(): Promise<RestockEntry[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("restocks")
    .select("id, inventory_id, quantity_added, notes, restocked_at, inventories(name)")
    .eq("user_id", userId)
    .order("restocked_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as RestockRow[]).map((row) => ({
    id: row.id,
    inventoryId: row.inventory_id,
    inventoryName: getJoinedInventoryName(row.inventories),
    quantityAdded: row.quantity_added,
    date: row.restocked_at,
    notes: row.notes ?? "",
  }));
}

export async function createRestock(
  input: CreateRestockInput,
): Promise<RestockEntry> {
  await requireUserId();

  const { data, error } = await supabase.rpc("create_restock_transaction", {
    p_inventory_id: input.inventoryId,
    p_quantity_added: input.quantityAdded,
    p_notes: input.notes,
  });

  if (error) {
    throw new Error(error.message);
  }

  const restockData = (data as CreateRestockRpcRow[] | null)?.[0];
  if (!restockData) {
    throw new Error("Failed to create restock entry.");
  }

  return {
    id: restockData.id,
    inventoryId: restockData.inventory_id,
    inventoryName: restockData.inventory_name,
    quantityAdded: restockData.quantity_added,
    date: restockData.restocked_at,
    notes: restockData.notes ?? "",
  };
}
