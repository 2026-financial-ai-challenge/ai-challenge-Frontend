import { PortalChrome } from "@/components/portal/PortalChrome";
import { VerifyForm } from "@/components/portal/VerifyForm";
import { portalHref } from "@/lib/portal";
import Link from "next/link";
import { Suspense } from "react";

export default function VerifyPage() {
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
          <span className="text-[#123056]">실명 인증</span>
        </nav>

        <div className="mt-5 border border-[#c5ced9] bg-white p-6 sm:p-8">
          <p className="inline-block bg-[#f4f7fb] px-2 py-1 text-xs font-semibold text-[#123056]">
            회원정보 없음
          </p>
          <h1 className="mt-3 text-2xl font-bold text-[#123056]">실명 인증하기</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#3b4654]">
            회원가입이 되어 있지 않으면 실명 인증 후 사건 열람을 진행할 수
            있습니다. 아래 항목을 입력한 뒤 실명 인증하기를 눌러 주십시오.
          </p>
          <div className="mt-8">
            <Suspense>
              <VerifyForm />
            </Suspense>
          </div>
        </div>
      </div>
    </PortalChrome>
  );
}
