import { supabase } from "../lib/supabaseClient";
import {
  CreateRestockRpcRow,
  RestockFactory,
  RestockRow,
} from "../factories/restockFactory";
import type {
  CreateRestockInput,
  RestockEntry,
  RestockInventoryOption,
} from "../types";

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
    .select(
      "id, inventory_id, quantity_added, notes, restocked_at, inventories(name)",
    )
    .eq("user_id", userId)
    .order("restocked_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as unknown as RestockRow[]).map((row) =>
    RestockFactory.createFromHistoryRow(row),
  );
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

  return RestockFactory.createFromRpcRow(restockData);
}
