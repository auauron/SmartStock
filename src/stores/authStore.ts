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

const state: AuthState = {
  loading: false,
  error: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(partial: Partial<AuthState>) {
  Object.assign(state, partial);
  emit();
}

function mapAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email first. Check your inbox and spam folder for the verification link.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }

  return message;
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
      setState({ loading: false, error: mapAuthError(error.message) });
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
      setState({ loading: false, error: mapAuthError(error.message) });
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
