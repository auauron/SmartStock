import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

export async function teardown() {
  dotenv.config({ path: ".env.test" });

  const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY as string;
  const testEmail = process.env.TEST_USER_EMAIL as string;
  const testPassword = process.env.TEST_USER_PASSWORD as string;

  if (!supabaseUrl || !supabaseKey) {
    return;
  }

  const testClient = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await testClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (error || !data.user) {
    console.error("Global Teardown Auth Failed:", error);
    return;
  }

  await testClient.from("restocks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await testClient.from("inventories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await testClient.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");


  console.log("Integration test database cleared successfully, yaaayyy!\n");
}
