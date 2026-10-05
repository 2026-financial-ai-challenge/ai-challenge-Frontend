"use client";

import { useRedirectWhenAuthenticated } from "@/hooks/use-auth-redirect";

/**
 * 로그인 상태로 랜딩(`/`)에 들어오면 대시보드로 보낸다.
 * 마케팅 페이지를 서버 컴포넌트로 유지하기 위한 클라이언트 전용 리다이렉트.
 */
export function RedirectIfAuthenticated() {
  useRedirectWhenAuthenticated("/dashboard");
  return null;
}
