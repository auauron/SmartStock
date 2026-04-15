import { createClient } from "@supabase/supabase-js";

// Vitest + Vite automatically loads .env.test during tests —
// no dotenv needed.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const testClient = createClient(supabaseUrl, supabaseKey);

export const clearDatabase = async () => {
  const { error: restockError } = await testClient
    .from("restocks")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (restockError) {
    throw new Error(`Failed to clear restocks: ${restockError.message}`);
  }

  const { error: productError } = await testClient
    .from("inventories")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (productError) {
    throw new Error(`Failed to clear inventories: ${productError.message}`);
  }
};
