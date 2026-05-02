import { supabase } from "../lib/supabaseClient";

type GetUserResult = Awaited<ReturnType<typeof supabase.auth.getUser>>;

let pendingUserRequest: Promise<GetUserResult> | null = null;

export function getCurrentUser() {
  pendingUserRequest ??= supabase.auth.getUser().finally(() => {
    pendingUserRequest = null;
  });

  return pendingUserRequest;
}
