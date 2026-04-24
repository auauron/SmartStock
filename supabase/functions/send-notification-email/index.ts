// @ts-nocheck

import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend";

interface NotificationEmailItem {
  id: string;
  type: "low_stock" | "restock";
  title: string;
  message: string;
  time: string;
  link?: string;
}

interface NotificationEmailPayload {
  notifications: NotificationEmailItem[];
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(
  payload: NotificationEmailPayload,
  recipientName: string,
) {
  const items = payload.notifications
    .map((notification) => {
      const linkHtml = notification.link
        ? `<p style="margin:12px 0 0;"><a href="${escapeHtml(notification.link)}" style="color:#047857;text-decoration:none;font-weight:600;">Open in Smart Stock</a></p>`
        : "";

      return `
        <li style="margin:0 0 16px;padding:16px;border:1px solid #d1fae5;border-radius:14px;background:#f9fffc;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#047857;">${escapeHtml(notification.type.replace("_", " "))}</p>
          <h2 style="margin:0 0 8px;font-size:18px;line-height:1.3;color:#111827;">${escapeHtml(notification.title)}</h2>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">${escapeHtml(notification.message)}</p>
          <p style="margin:10px 0 0;font-size:12px;color:#6b7280;">${escapeHtml(new Date(notification.time).toLocaleString())}</p>
          ${linkHtml}
        </li>
      `;
    })
    .join("");

  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f3f4f6;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="padding:28px 28px 20px;background:linear-gradient(135deg,#065f46,#10b981);color:#ffffff;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.9;">Smart Stock</p>
          <h1 style="margin:0;font-size:26px;line-height:1.2;">You have new notifications</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;opacity:.95;">Hi ${escapeHtml(recipientName || "there")}, Smart Stock detected ${payload.notifications.length} new alert${payload.notifications.length === 1 ? "" : "s"}.</p>
        </div>
        <div style="padding:28px;">
          <ul style="list-style:none;padding:0;margin:0;">${items}</ul>
        </div>
      </div>
    </div>
  `;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendFrom = Deno.env.get("RESEND_FROM_EMAIL");

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({ error: "Supabase is not configured." }),
      {
        status: 500,
        headers: jsonHeaders,
      },
    );
  }

  if (!resendApiKey || !resendFrom) {
    return new Response(
      JSON.stringify({ error: "Resend is not configured." }),
      {
        status: 500,
        headers: jsonHeaders,
      },
    );
  }

  const authHeader = req.headers.get("Authorization");
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });

  const resend = new Resend(resendApiKey);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  if (!user.email_confirmed_at) {
    return new Response(
      JSON.stringify({
        error:
          "Please confirm your email address before notifications can be sent.",
      }),
      {
        status: 403,
        headers: jsonHeaders,
      },
    );
  }

  const body = (await req
    .json()
    .catch(() => null)) as NotificationEmailPayload | null;
  if (!body?.notifications?.length) {
    return new Response(
      JSON.stringify({ error: "No notifications to send." }),
      {
        status: 400,
        headers: jsonHeaders,
      },
    );
  }

  if (!user.email) {
    return new Response(
      JSON.stringify({ error: "No email address found for this account." }),
      {
        status: 400,
        headers: jsonHeaders,
      },
    );
  }

  const subject =
    body.notifications.length === 1
      ? `Smart Stock: ${body.notifications[0].title}`
      : `Smart Stock: ${body.notifications.length} new notifications`;

  const { error: resendError } = await resend.emails.send({
    from: resendFrom,
    to: [user.email],
    subject,
    html: buildEmailHtml(
      body,
      String(user.user_metadata?.full_name ?? user.email),
    ),
  });

  if (resendError) {
    return new Response(
      JSON.stringify({ error: resendError.message || "Failed to send email." }),
      {
        status: 502,
        headers: jsonHeaders,
      },
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: jsonHeaders,
  });
});
