"use client";

import { AuthNav } from "@/components/layout/AuthNav";
import { BrandHomeLink } from "@/components/layout/BrandHomeLink";
import { useIntroStore } from "@/lib/stores/intro-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

const footerNav = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/about", label: "서비스소개" },
];

export function SiteHeader() {
  const introActive = useIntroStore((state) => state.active);

  if (introActive) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-primary-light/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-[4.25rem] max-w-5xl items-center justify-between px-5">
        <BrandHomeLink />
        <AuthNav />
      </div>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-light bg-white">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold tracking-tight text-text-primary">
              안심피싱
            </p>
            <nav aria-label="정책 및 소개" className="mt-3">
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-text-secondary sm:justify-start">
                {footerNav.map((item) =>
                  item.href === pathname ? (
                    <li key={item.href}>
                      <span aria-current="page" className="text-text-primary">
                        {item.label}
                      </span>
                    </li>
                  ) : (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-text-primary">
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </div>
          <p className="text-xs font-medium text-text-secondary">
            AI 보이스피싱 실전 대응훈련
          </p>
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs text-text-secondary text-center">
            © {year} 안심피싱. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
