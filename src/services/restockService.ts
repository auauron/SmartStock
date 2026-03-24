import { supabase } from "../lib/supabaseClient";
import type {
  CreateRestockInput,
  RestockEntry,
  RestockProductOption,
} from "../types";

interface RestockRow {
  id: string;
  quantity_added: number;
  notes: string | null;
  restocked_at: string;
  products: { name: string } | { name: string }[] | null;
}

interface CreateRestockRpcRow {
  id: string;
  product_name: string;
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

function getJoinedProductName(
  joined: RestockRow["products"],
  fallback = "Unknown Product",
): string {
  if (!joined) return fallback;
  if (Array.isArray(joined)) {
    return joined[0]?.name ?? fallback;
  }
  return joined.name;
}

export async function getRestockProducts(): Promise<RestockProductOption[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
  })) as RestockProductOption[];
}

export async function getRestockHistory(): Promise<RestockEntry[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("restocks")
    .select("id, quantity_added, notes, restocked_at, products(name)")
    .eq("user_id", userId)
    .order("restocked_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RestockRow[]).map((row) => ({
    id: row.id,
    productName: getJoinedProductName(row.products),
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
    p_product_id: input.productId,
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
    productName: restockData.product_name,
    quantityAdded: restockData.quantity_added,
    date: restockData.restocked_at,
    notes: restockData.notes ?? "",
  };
}
