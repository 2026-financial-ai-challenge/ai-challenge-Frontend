import { isPortalHost } from "@/lib/portal-host";
import { resolveAppRequest } from "@/lib/portal-routing";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const portal = isPortalHost(host);
  const { pathname } = request.nextUrl;
  const decision = resolveAppRequest(portal, pathname);

  if (decision.action === "next") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = decision.pathname;
  const response =
    decision.action === "redirect"
      ? NextResponse.redirect(url)
      : NextResponse.rewrite(url);

  if (decision.robots) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
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
