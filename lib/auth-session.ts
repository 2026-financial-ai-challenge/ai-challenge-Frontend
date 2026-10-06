import {
  isTokenExpired,
  replaceTo,
  safeNextPath,
  useAuthStore,
} from "@/lib/stores/auth-store";

const PUBLIC_AUTH_PATHS = new Set([
  "/v1/auth/login",
  "/v1/auth/signup",
  "/v1/auth/signup/otp",
  "/v1/auth/signup/verify",
]);

export function isPublicAuthPath(path: string): boolean {
  return PUBLIC_AUTH_PATHS.has(path);
}

/** 만료된 토큰을 지운다. 지웠으면 true. */
export function expireAuthIfNeeded(): boolean {
  const { token, expiresAt, clearAuth } = useAuthStore.getState();
  if (token && isTokenExpired(expiresAt)) {
    clearAuth();
    return true;
  }
  return false;
}

/**
 * 보호된 API의 401 또는 만료된 토큰. 로그인 화면에서는 루프를 만들지 않는다.
 */
export function handleUnauthorized(currentPath?: string) {
  if (typeof window === "undefined") return;

  useAuthStore.getState().clearAuth();

  const here = window.location.pathname;
  if (here === "/login") return;

  const next = safeNextPath(currentPath ?? here);
  replaceTo(`/login?next=${next}`);
}
