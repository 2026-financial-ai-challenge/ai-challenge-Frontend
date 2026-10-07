"use client";

import { useRedirectWhenAuthenticated } from "@/hooks/use-auth-redirect";

export function RedirectIfAuthenticated() {
  useRedirectWhenAuthenticated("/dashboard");
  return null;
}
