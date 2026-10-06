const PORTAL_ICONS: Record<string, string> = {
  "/favicon.ico": "/portal/favicon.ico",
  "/icon.png": "/portal/favicon.png",
  "/apple-icon.png": "/portal/apple-icon.png",
  "/apple-touch-icon.png": "/portal/apple-icon.png",
};

/** 토큰 없이 포털 호스트에 들어온 요청이 받는 화면. 가상 포털을 보여 주지 않는다. */
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

/** `/t/<token>`처럼 훈련 링크 토큰이 붙어 있는 주소인지. */
function isTrainingLinkPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length >= 2 && segments[0] === "t";
}

/** 호스트가 포털인지에 따라 rewrite/redirect를 결정한다. */
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

    // 가상 수사기관 포털은 문자로 받은 1회용 훈련 링크로만 열린다. 토큰이 붙지
    // 않은 주소는 루트까지 포함해 모두 훈련 안내로 보낸다 — 주소만 알면 누구나
    // 사칭 화면을 열 수 있는 상태를 남기지 않기 위한 것이다. 링크가 살아 있는지는
    // 훈련 화면이 백엔드에 다시 확인한다(WebTrainingFlow).
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
