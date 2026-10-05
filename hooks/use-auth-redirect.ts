"use client";

import { useEffect } from "react";
import { replaceTo, useAuthStore } from "@/lib/stores/auth-store";

/**
 * 로그인 상태로 비로그인 전용 화면(랜딩·로그인·회원가입)에 들어오면 `destination`으로 보낸다.
 * true를 반환하면 리다이렉트 중이라는 뜻이므로 본문을 그리지 않는다.
 */
export function useRedirectWhenAuthenticated(destination: string): boolean {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const redirecting = hasHydrated && Boolean(token);

  useEffect(() => {
    if (redirecting) replaceTo(destination);
  }, [destination, redirecting]);

  return redirecting;
}

/**
 * 로그인이 필요한 화면에서 비로그인 상태면 로그인으로 보낸다.
 * false를 반환하면 아직 복원 중이거나 리다이렉트 중이다.
 */
export function useRequireAuth(next: string): boolean {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (hasHydrated && !token) {
      replaceTo(`/login?next=${next}`);
    }
  }, [hasHydrated, next, token]);

  return hasHydrated && Boolean(token);
}
