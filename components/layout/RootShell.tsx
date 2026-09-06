"use client";

import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";

export function RootShell({
  children,
  isPortal,
}: {
  children: React.ReactNode;
  isPortal: boolean;
}) {
  if (isPortal) {
    return children;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div id="main" className="flex-1">
        {children}
      </div>
      <SiteFooter />
    </div>
  );
}
