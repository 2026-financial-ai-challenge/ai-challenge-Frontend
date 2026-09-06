import { isPortalHost } from "@/lib/portal-host";
import { NextResponse, type NextRequest } from "next/server";

const PORTAL_PAGES = new Set(["", "inquiry", "verify", "hold", "notice"]);

const PORTAL_ICONS: Record<string, string> = {
  "/favicon.ico": "/portal/favicon.ico",
  "/icon.png": "/portal/favicon.png",
  "/apple-icon.png": "/portal/apple-icon.png",
  "/apple-touch-icon.png": "/portal/apple-icon.png",
};

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const portal = isPortalHost(host);
  const { pathname } = request.nextUrl;

  if (portal) {
    const iconPath = PORTAL_ICONS[pathname];
    if (iconPath) {
      const url = request.nextUrl.clone();
      url.pathname = iconPath;
      const response = NextResponse.rewrite(url);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }
    if (pathname === "/cs" || pathname.startsWith("/cs/")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/cs/, "") || "/";
      return NextResponse.redirect(url);
    }

    const page = pathname.split("/").filter(Boolean)[0] ?? "";
    if (pathname === "/" || PORTAL_PAGES.has(page)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname === "/" ? "/cs" : `/cs${pathname}`;
      const response = NextResponse.rewrite(url);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    if (!isPassthrough(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/cs/notice";
      const response = NextResponse.rewrite(url);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    return NextResponse.next();
  }

  if (pathname === "/cs" || pathname.startsWith("/cs/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/__no-portal";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

function isPassthrough(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\..*).*)",
    "/favicon.ico",
    "/icon.png",
    "/apple-icon.png",
    "/apple-touch-icon.png",
  ],
};
