import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const testEmail = process.env.TEST_USER_EMAIL!;
const testPassword = process.env.TEST_USER_PASSWORD!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY for E2E DB seeding.",
  );
}

if (!testEmail || !testPassword) {
  throw new Error(
    "Missing TEST_USER_EMAIL or TEST_USER_PASSWORD for E2E DB seeding.",
  );
}

let seededClient: SupabaseClient | null = null;
let seededUserId: string | null = null;

async function getAuthedSeedClient(): Promise<{
  client: SupabaseClient;
  userId: string;
}> {
  if (seededClient && seededUserId) {
    return { client: seededClient, userId: seededUserId };
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await client.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (error || !data.user) {
    throw new Error(
      `Failed to authenticate seed client: ${error?.message ?? "No user returned"}`,
    );
  }

  seededClient = client;
  seededUserId = data.user.id;

  return { client, userId: data.user.id };
}

export async function seedInventoryItem(
  name: string,
  category = "Electronics",
) {
  const { client, userId } = await getAuthedSeedClient();

  const { data, error } = await client
    .from("inventories")
    .insert({
      user_id: userId,
      name,
      category,
      price: 100,
      quantity: 5,
      min_stock: 2,
    })
    .select("id, name")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to seed inventory item: ${error?.message ?? "Insert returned no data"}`,
    );
  }

  return data as { id: string; name: string };
}

export async function seedRestockEntry(
  inventoryId: string,
  quantityAdded: number,
  notes = "",
) {
  const { client, userId } = await getAuthedSeedClient();

  const { data, error } = await client
    .from("restocks")
    .insert({
      inventory_id: inventoryId,
      user_id: userId,
      quantity_added: quantityAdded,
      notes,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to seed restock entry: ${error?.message ?? "Insert returned no data"}`,
    );
  }

  return data as { id: string };
}

// export async function clearDatabase() {
//   const { client, userId } = await getAuthedSeedClient();

//   // 1. Clear audit logs
//   const { error: auditError } = await client
//     .from("audit_logs")
//     .delete()
//     .eq("user_id", userId);

//   if (auditError) {
//     console.error(`Warning: Failed to clear audit_logs: ${auditError.message}`);
//   }

//   // 2. Clear restocks (must be before inventories due to FK)
//   const { error: restockError } = await client
//     .from("restocks")
//     .delete()
//     .eq("user_id", userId);

//   if (restockError) {
//     throw new Error(`Failed to clear restocks: ${restockError.message}`);
//   }

//   // 3. Clear inventories
//   const { error: inventoryError } = await client
//     .from("inventories")
//     .delete()
//     .eq("user_id", userId);

//   if (inventoryError) {
//     throw new Error(`Failed to clear inventories: ${inventoryError.message}`);
//   }
// }

export async function deleteRestocksForInventory(inventoryId: string) {
  const { client } = await getAuthedSeedClient();

  const { error } = await client
    .from("restocks")
    .delete()
    .eq("inventory_id", inventoryId);

  if (error) {
    throw new Error(`Failed to clean seeded restock entries: ${error.message}`);
  }
}

export async function deleteInventoryItem(id: string) {
  const { client } = await getAuthedSeedClient();

  const { error } = await client.from("inventories").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to clean seeded inventory item: ${error.message}`);
  }
}
