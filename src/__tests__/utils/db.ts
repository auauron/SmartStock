import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
const testEmail = process.env.TEST_USER_EMAIL as string;
const testPassword = process.env.TEST_USER_PASSWORD as string;

// Vitest + Vite automatically loads .env.test during tests —
// no dotenv needed.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const testClient = createClient(supabaseUrl, supabaseKey);

// Authenticate so we don't violate RLS policies during testing
const { data, error } = await testClient.auth.signInWithPassword({
  email: testEmail,
  password: testPassword,
});

if (error || !data.user) {
  throw new Error(`Failed to authenticate testClient: ${error?.message || "No user returned"}. Email: ${testEmail}`);
}

export const TEST_USER_ID = data.user.id;
