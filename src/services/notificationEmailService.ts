import { supabase } from "../lib/supabaseClient";
import type { NotificationEmailItem, NotificationEmailPayload } from "../types";

function getNotificationEmailFunctionUrl() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is not configured.");
  }

  return `${supabaseUrl.replace(/\/$/, "")}/functions/v1/send-notification-email`;
}

export async function sendNotificationEmail(
  notifications: NotificationEmailItem[],
): Promise<void> {
  if (notifications.length === 0) {
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You must be signed in to send notification emails.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in to send notification emails.");
  }

  if (!user.email) {
    throw new Error("Your account does not have a verified email address.");
  }

  const payload: NotificationEmailPayload = {
    notifications,
  };

  const response = await fetch(getNotificationEmailFunctionUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to send notification email.");
  }
}
