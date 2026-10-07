const PORTAL_ICONS: Record<string, string> = {
  "/favicon.ico": "/portal/favicon.ico",
  "/icon.png": "/portal/favicon.png",
  "/apple-icon.png": "/portal/apple-icon.png",
  "/apple-touch-icon.png": "/portal/apple-icon.png",
};

export const TRAINING_NOTICE_PATH = "/training-notice";

export type PortalRouteDecision = {
  action: "rewrite" | "redirect" | "next";
  pathname: string;
  robots?: boolean;
};

export function isPassthroughPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/v1/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  );
}

function isTrainingLinkPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length >= 2 && segments[0] === "t";
}

export function resolveAppRequest(
  isPortal: boolean,
  pathname: string,
): PortalRouteDecision {
  if (isPortal) {
    const iconPath = PORTAL_ICONS[pathname];
    if (iconPath) {
      return { action: "rewrite", pathname: iconPath, robots: true };
    }
    if (pathname === "/cs" || pathname.startsWith("/cs/")) {
      return {
        action: "redirect",
        pathname: pathname.replace(/^\/cs/, "") || "/",
      };
    }

    // 주소만 알면 사칭 화면을 열 수 있으면 안 되므로, 토큰 없는 경로는 모두 훈련 안내로 보낸다.
    if (isTrainingLinkPath(pathname)) {
      return { action: "rewrite", pathname: `/cs${pathname}`, robots: true };
    }

    if (isPassthroughPath(pathname)) {
      return { action: "next", pathname };
    }

    return { action: "rewrite", pathname: TRAINING_NOTICE_PATH, robots: true };
  }

  if (pathname === "/cs" || pathname.startsWith("/cs/")) {
    return { action: "rewrite", pathname: "/__no-portal" };
  }

  return { action: "next", pathname };
}
