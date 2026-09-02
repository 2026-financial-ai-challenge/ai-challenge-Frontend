"use client";

import { BrandImage } from "@/components/brand/BrandImage";
import { useAuthStore } from "@/lib/stores/auth-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BrandHomeLink() {
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const href = hasHydrated && token ? "/dashboard" : "/";
  const isCurrent = pathname === href;

  return (
    <Link
      href={href}
      className="flex items-center gap-2"
      aria-current={isCurrent ? "page" : undefined}
      onClick={(event) => {
        if (isCurrent) {
          event.preventDefault();
        }
      }}
    >
      <BrandImage
        name="wordmark"
        alt="안심피싱"
        className="h-9 w-auto sm:h-10"
        priority
      />
    </Link>
  );
}
