import { PortalChrome } from "@/components/portal/PortalChrome";
import { portalHref } from "@/lib/portal";
import Link from "next/link";

export default function NoticePage() {
  return (
    <PortalChrome>
      <div className="mx-auto max-w-[760px] px-4 py-16">
        <h1 className="text-2xl font-bold text-[#123056]">열람 대상 사건이 있습니다</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#3b4654]">
          현재 접속하신 민원 메뉴는 진행 중인 등기송달 건이 있는 경우 나의 사건
          조회에서만 이용할 수 있습니다.
        </p>
        <Link
          href={portalHref("/inquiry")}
          className="mt-8 inline-flex min-h-11 items-center bg-[#123056] px-5 text-sm font-semibold text-white hover:bg-[#0d2442]"
        >
          나의 사건 조회
        </Link>
      </div>
    </PortalChrome>
  );
}
