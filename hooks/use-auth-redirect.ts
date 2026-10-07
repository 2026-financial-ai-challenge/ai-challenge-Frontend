"use client";

import { useEffect } from "react";
import {
  isTokenExpired,
  replaceTo,
  selectIsAuthenticated,
  useAuthStore,
} from "@/lib/stores/auth-store";

export function useRedirectWhenAuthenticated(destination: string): boolean {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const authenticated = selectIsAuthenticated({ token, expiresAt });
  const redirecting = hasHydrated && authenticated;

  useEffect(() => {
    if (!hasHydrated) return;
    if (token && isTokenExpired(expiresAt)) {
      clearAuth();
      return;
    }
    if (authenticated) replaceTo(destination);
  }, [authenticated, clearAuth, destination, expiresAt, hasHydrated, token]);

  return redirecting;
}

export function useRequireAuth(next: string): boolean {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const authenticated = selectIsAuthenticated({ token, expiresAt });

  useEffect(() => {
    if (!hasHydrated) return;
    if (token && isTokenExpired(expiresAt)) {
      clearAuth();
    }
    if (!authenticated) {
      replaceTo(`/login?next=${next}`);
    }
  }, [authenticated, clearAuth, expiresAt, hasHydrated, next, token]);

  return hasHydrated && authenticated;
}
