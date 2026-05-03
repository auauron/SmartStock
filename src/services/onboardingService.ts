import { supabase } from "../lib/supabaseClient";
import { getCurrentUser } from "./currentUser";

export type OnboardingStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "skipped";

export interface UserOnboarding {
  userId: string;
  status: OnboardingStatus;
  role: string;
  firstGoal: string;
  startedAt: string;
  completedAt: string;
  skippedAt: string;
  firstItemAddedAt: string;
}

interface UserOnboardingRow {
  user_id: string;
  status: OnboardingStatus;
  role: string | null;
  first_goal: string | null;
  started_at: string | null;
  completed_at: string | null;
  skipped_at: string | null;
  first_item_added_at: string | null;
}

function fromRow(row: UserOnboardingRow): UserOnboarding {
  return {
    userId: row.user_id,
    status: row.status,
    role: row.role ?? "",
    firstGoal: row.first_goal ?? "",
    startedAt: row.started_at ?? "",
    completedAt: row.completed_at ?? "",
    skippedAt: row.skipped_at ?? "",
    firstItemAddedAt: row.first_item_added_at ?? "",
  };
}

async function getUserId() {
  const {
    data: { user },
    error,
  } = await getCurrentUser();

  if (error) throw error;
  if (!user) throw new Error("You must be signed in to access onboarding.");

  return user.id;
}

export async function createOnboardingForUser(userId: string) {
  const { error } = await supabase.from("user_onboarding").upsert(
    {
      user_id: userId,
      status: "not_started",
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}

export async function getOnboarding() {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from("user_onboarding")
    .select(
      "user_id,status,role,first_goal,started_at,completed_at,skipped_at,first_item_added_at",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data ? fromRow(data as UserOnboardingRow) : null;
}

export async function startOnboarding(role: string, firstGoal: string) {
  const userId = await getUserId();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("user_onboarding")
    .upsert(
      {
        user_id: userId,
        status: "in_progress",
        role,
        first_goal: firstGoal,
        started_at: now,
        completed_at: null,
        skipped_at: null,
      },
      { onConflict: "user_id" },
    )
    .select(
      "user_id,status,role,first_goal,started_at,completed_at,skipped_at,first_item_added_at",
    )
    .single();

  if (error) throw error;

  return fromRow(data as UserOnboardingRow);
}

export async function markFirstItemAdded() {
  const userId = await getUserId();

  const { error } = await supabase
    .from("user_onboarding")
    .update({
      first_item_added_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) throw error;
}

export async function updateOnboardingStatus(
  status: Extract<OnboardingStatus, "completed" | "skipped">,
) {
  const userId = await getUserId();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("user_onboarding")
    .update({
      status,
      completed_at: status === "completed" ? now : null,
      skipped_at: status === "skipped" ? now : null,
    })
    .eq("user_id", userId);

  if (error) throw error;
}
