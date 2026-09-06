import { CaseDocument } from "@/components/portal/CaseDocument";
import { HoldForm } from "@/components/portal/HoldForm";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { portalHref } from "@/lib/portal";
import Link from "next/link";
import { Suspense } from "react";

export default function HoldPage() {
  return (
    <PortalChrome active="나의 사건 조회">
      <div className="mx-auto max-w-[760px] px-4 py-8">
        <nav className="text-xs text-[#5b6777]">
          <Link href={portalHref()} className="hover:underline">
            홈
          </Link>
          <span aria-hidden> · </span>
          <Link href={portalHref("/inquiry")} className="hover:underline">
            나의 사건 조회
          </Link>
          <span aria-hidden> · </span>
          <span className="text-[#123056]">열람 문서</span>
        </nav>

        <h1 className="mt-5 text-2xl font-bold text-[#123056]">나의 사건 조회</h1>
        <p className="mt-2 text-sm text-[#5b6777]">
          문서 확인 후 아래로 내려 보전 대상 계좌를 입력해 주십시오.
        </p>

        <div className="mt-6">
          <Suspense>
            <CaseDocument />
          </Suspense>
        </div>

        <section className="mt-10 border border-[#c5ced9] bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#123056]">보전 대상 계좌 확인</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#3b4654]">
            명의 도용 여부와 보전 대상 자산을 확인하기 위해 거래 계좌를
            입력합니다. 확인이 끝나야 서류 원문을 열람할 수 있습니다.
          </p>
          <div className="mt-6">
            <HoldForm />
          </div>
        </section>
      </div>
    </PortalChrome>
  );
}
