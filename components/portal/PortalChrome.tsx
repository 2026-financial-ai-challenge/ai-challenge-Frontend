import { PortalMark } from "@/components/portal/PortalMark";
import {
  PORTAL_AGENCY,
  PORTAL_NAME,
  PORTAL_NAME_EN,
  portalHref,
} from "@/lib/portal";
import Link from "next/link";

const nav = [
  { href: portalHref("/notice"), label: "민원안내" },
  { href: "/#online-minwon", label: "온라인민원" },
  { href: portalHref("/inquiry"), label: "나의 사건 조회" },
  { href: portalHref("/notice"), label: "정보공개" },
  { href: portalHref("/notice"), label: "알림마당" },
];

export function PortalChrome({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  return (
    <div className="portal-root min-h-screen bg-[#e8eef4] text-[#1a2433]">
      <div className="bg-[#0b2a4a] text-[12px] text-white/80">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-1.5">
          <p>{PORTAL_AGENCY} 지정 열람창구</p>
          <p className="hidden sm:block">본인 확인 후 등기송달 사건을 열람할 수 있습니다</p>
        </div>
      </div>

      <header className="bg-[#123056] text-white">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-4">
          <Link
            href={portalHref()}
            className="flex min-h-11 items-center gap-3 text-white"
          >
            <PortalMark className="h-12 w-12 shrink-0" />
            <span className="leading-tight">
              <span className="block text-lg font-bold tracking-tight sm:text-xl">
                {PORTAL_NAME}
              </span>
              <span className="mt-0.5 block text-[11px] font-normal tracking-wide text-white/70">
                {PORTAL_NAME_EN}
              </span>
            </span>
          </Link>
          <Link
            href={portalHref("/verify")}
            className="inline-flex min-h-11 items-center border border-white/40 px-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            본인인증
          </Link>
        </div>
      </header>

      <nav aria-label="주요 메뉴" className="bg-[#1b3f6d]">
        <ul className="mx-auto flex max-w-[1080px] overflow-x-auto">
          {nav.map((item) => {
            const isActive = active === item.label;
            return (
              <li key={item.label} className="shrink-0">
                <Link
                  href={item.href}
                  className={`inline-flex min-h-12 items-center px-4 text-sm font-semibold sm:px-6 ${
                    isActive
                      ? "bg-[#0f2b4d] text-white"
                      : "text-white/85 hover:bg-[#16406e] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div id="main">{children}</div>

      <footer className="mt-12 border-t border-[#c5d0dc] bg-[#123056] text-white">
        <div className="mx-auto max-w-[1080px] px-4 py-8 text-[12px] leading-relaxed text-white/75">
          <p className="text-sm font-semibold text-white">{PORTAL_NAME}</p>
          <p className="mt-2">
            {PORTAL_AGENCY} 사건 열람 · 등기송달 본인확인 창구
          </p>
          <p className="mt-4">입력 정보는 열람 처리 외 목적으로 사용하지 않습니다.</p>
        </div>
      </footer>
    </div>
  );
}
