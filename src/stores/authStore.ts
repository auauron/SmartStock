import { useSyncExternalStore } from "react";
import { supabase } from "../lib/supabaseClient";
import type { SignUpPayload } from "../types";

interface AuthState {
  loading: boolean;
  error: string | null;
}

type AuthStore = {
  getState: () => AuthState;
  subscribe: (listener: () => void) => () => void;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (payload: SignUpPayload) => Promise<boolean>;
};

let state: AuthState = {
  loading: false,
  error: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(partial: Partial<AuthState>) {
  state = { ...state, ...partial };
  emit();
}

/**
 * Maps Supabase Auth errors to user-friendly messages.
 * Uses `code` (stable) as primary signal, falls back to message substring matching.
 * Covers all documented error codes for signUp and signIn.
 * Reference: https://supabase.com/docs/reference/javascript/auth-error-codes
 */
function mapAuthError(error: { message: string; code?: string; status?: number }): string {
  const code = error.code ?? "";
  const msg = error.message.toLowerCase();

  // ── Signup-specific errors ─────────────────────────────────────────────────

  if (code === "user_already_exists" || msg.includes("user already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }

  if (code === "email_exists" || msg.includes("email address is already registered")) {
    return "This email is already in use. Try signing in or use a different email.";
  }

  if (code === "weak_password" || msg.includes("password should be")) {
    return "Your password is too weak. Use at least 8 characters with a mix of letters and numbers.";
  }

  if (code === "validation_failed" || msg.includes("unable to validate email address")) {
    return "The email address you entered is invalid. Please check it and try again.";
  }

  if (code === "email_address_invalid" || msg.includes("email address format is invalid")) {
    return "Please enter a valid email address.";
  }

  if (code === "signup_disabled" || msg.includes("signups not allowed")) {
    return "New account registration is currently disabled. Please contact support.";
  }

  // ── Sign-in-specific errors ────────────────────────────────────────────────

  if (
    code === "invalid_credentials" ||
    msg.includes("invalid login credentials") ||
    msg.includes("invalid email or password")
  ) {
    return "Incorrect email or password. Please try again.";
  }

  if (code === "email_not_confirmed" || msg.includes("email not confirmed")) {
    return "Please verify your email before signing in. Check your inbox (and spam folder) for the confirmation link.";
  }

  if (code === "user_not_found" || msg.includes("user not found")) {
    return "No account found with this email. Please sign up first.";
  }

  if (code === "user_banned" || msg.includes("user is banned")) {
    return "This account has been suspended. Please contact support for help.";
  }

  // ── Session / token errors ─────────────────────────────────────────────────

  if (code === "session_not_found" || msg.includes("session not found")) {
    return "Your session has expired. Please sign in again.";
  }

  if (code === "refresh_token_not_found" || msg.includes("refresh token not found")) {
    return "Your session is invalid. Please sign in again.";
  }

  if (code === "refresh_token_already_used" || msg.includes("token has already been used")) {
    return "Your session token was already used. Please sign in again.";
  }

  if (code === "flow_state_expired" || msg.includes("flow state has expired")) {
    return "Your sign-in link or code has expired. Please request a new one.";
  }

  if (code === "otp_expired" || msg.includes("otp has expired")) {
    return "The verification code has expired. Please request a new one.";
  }

  if (code === "otp_disabled" || msg.includes("otp disabled")) {
    return "One-time password sign-in is not enabled for this application.";
  }

  // ── Rate limiting ──────────────────────────────────────────────────────────

  if (
    code === "over_request_rate_limit" ||
    code === "over_email_send_rate_limit" ||
    code === "over_sms_send_rate_limit" ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    error.status === 429
  ) {
    return "Too many attempts. Please wait a few minutes before trying again.";
  }

  // ── Email / provider errors ────────────────────────────────────────────────

  if (code === "email_provider_disabled" || msg.includes("email provider is not enabled")) {
    return "Email sign-in is currently unavailable. Please try another method.";
  }

  if (code === "phone_provider_disabled" || msg.includes("phone provider is not enabled")) {
    return "Phone sign-in is currently unavailable. Please try another method.";
  }

  if (code === "provider_disabled" || msg.includes("provider is disabled")) {
    return "This sign-in method is currently disabled. Please try another option.";
  }

  if (code === "provider_email_needs_verification" || msg.includes("email needs to be verified")) {
    return "Please verify your email with your sign-in provider before continuing.";
  }

  // ── SSO / SAML errors ─────────────────────────────────────────────────────

  if (code === "sso_provider_not_found" || msg.includes("sso provider not found")) {
    return "The single sign-on provider was not found. Check your email domain.";
  }

  if (code === "saml_assertion_no_email" || msg.includes("saml")) {
    return "Sign-in failed: your SSO provider did not share your email address.";
  }

  // ── MFA errors ────────────────────────────────────────────────────────────

  if (
    code === "mfa_verification_failed" ||
    msg.includes("mfa verification failed")
  ) {
    return "Multi-factor authentication failed. Please check your code and try again.";
  }

  if (code === "mfa_factor_not_found" || msg.includes("mfa factor not found")) {
    return "MFA setup not found. Please set up two-factor authentication first.";
  }

  if (code === "mfa_challenge_expired" || msg.includes("mfa challenge has expired")) {
    return "The MFA challenge expired. Please restart the sign-in process.";
  }

  // ── Network / server errors ────────────────────────────────────────────────

  if (
    error.status === 500 ||
    error.status === 503 ||
    msg.includes("network") ||
    msg.includes("fetch failed") ||
    msg.includes("failed to fetch")
  ) {
    return "A network error occurred. Please check your connection and try again.";
  }

  // ── Generic fallback ───────────────────────────────────────────────────────
  return "Something went wrong. Please try again or contact support if the issue persists.";
}

export const authStore: AuthStore = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  clearError: () => {
    setState({ error: null });
  },
  signIn: async (email, password) => {
    setState({ loading: true, error: null });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState({ loading: false, error: mapAuthError(error) });
      return false;
    }

    setState({ loading: false, error: null });
    return true;
  },
  signUp: async ({ email, password, fullName, businessName }) => {
    setState({ loading: true, error: null });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          business_name: businessName,
        },
      },
    });

    if (error) {
      setState({ loading: false, error: mapAuthError(error) });
      return false;
    }

    setState({ loading: false, error: null });
    return true;
  },
};

export function useAuthStore() {
  const snapshot = useSyncExternalStore(
    authStore.subscribe,
    authStore.getState,
    authStore.getState,
  );

  return {
    ...snapshot,
    signIn: authStore.signIn,
    signUp: authStore.signUp,
    clearError: authStore.clearError,
  };
}
