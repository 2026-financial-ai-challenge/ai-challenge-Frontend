import { BrandImage } from "@/components/brand/BrandImage";
import { AuthNav } from "@/components/layout/AuthNav";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-primary-light/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-[4.25rem] max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <BrandImage
            name="wordmark"
            alt="안심피싱"
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>
        <AuthNav />
      </div>
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-light bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
      <p />
      <p className="text-xs text-text-secondary">© {year} 안심피싱</p>
      </div>
    </footer>
  );
}
