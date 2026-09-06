import { PORTAL_NAME } from "@/lib/portal";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: PORTAL_NAME },
  description: "등기송달 및 사건 열람",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/portal/favicon.svg", type: "image/svg+xml" },
      { url: "/portal/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/portal/favicon.ico" },
    ],
    apple: { url: "/portal/apple-icon.png", sizes: "180x180" },
  },
};

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
