import { supabase } from "../lib/supabaseClient";
import type {
  CreateRestockInput,
  RestockEntry,
  RestockProductOption,
} from "../types";

interface ProductRow {
  id: string;
  name: string;
  quantity: number;
  user_id: string;
}

interface RestockRow {
  id: string;
  quantity_added: number;
  notes: string | null;
  restocked_at: string;
  products: { name: string } | { name: string }[] | null;
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
  const userId = await requireUserId();

  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("id, name, quantity, user_id")
    .eq("id", input.productId)
    .eq("user_id", userId)
    .single();

  if (productError) {
    throw new Error(productError.message);
  }

  const product = productData as ProductRow;
  const nextQuantity = product.quantity + input.quantityAdded;

  const { error: updateError } = await supabase
    .from("products")
    .update({ quantity: nextQuantity })
    .eq("id", product.id)
    .eq("user_id", userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const trimmedNotes = input.notes.trim();
  const { data: restockData, error: insertError } = await supabase
    .from("restocks")
    .insert({
      product_id: product.id,
      user_id: userId,
      quantity_added: input.quantityAdded,
      notes: trimmedNotes.length > 0 ? trimmedNotes : null,
    })
    .select("id, quantity_added, notes, restocked_at")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return {
    id: restockData.id,
    productName: product.name,
    quantityAdded: restockData.quantity_added,
    date: restockData.restocked_at,
    notes: restockData.notes ?? "",
  };
}
