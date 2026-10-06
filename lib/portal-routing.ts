const PORTAL_PAGES = new Set(["", "inquiry", "verify", "hold", "notice"]);

const PORTAL_ICONS: Record<string, string> = {
  "/favicon.ico": "/portal/favicon.ico",
  "/icon.png": "/portal/favicon.png",
  "/apple-icon.png": "/portal/apple-icon.png",
  "/apple-touch-icon.png": "/portal/apple-icon.png",
};

export type PortalRouteDecision = {
  action: "rewrite" | "redirect" | "next";
  pathname: string;
  robots?: boolean;
};

export function isPassthroughPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  );
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

    const page = pathname.split("/").filter(Boolean)[0] ?? "";
    if (pathname === "/" || PORTAL_PAGES.has(page)) {
      return {
        action: "rewrite",
        pathname: pathname === "/" ? "/cs" : `/cs${pathname}`,
        robots: true,
      };
    }

    if (!isPassthroughPath(pathname)) {
      return { action: "rewrite", pathname: "/cs/notice", robots: true };
    }

    return { action: "next", pathname };
  }

  if (pathname === "/cs" || pathname.startsWith("/cs/")) {
    return { action: "rewrite", pathname: "/__no-portal" };
  }

  return { action: "next", pathname };
}
