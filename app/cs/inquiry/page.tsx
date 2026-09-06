import { InquiryForm } from "@/components/portal/InquiryForm";
import { PortalChrome } from "@/components/portal/PortalChrome";
import { portalHref } from "@/lib/portal";
import Link from "next/link";

export default function InquiryPage() {
  return (
    <PortalChrome active="나의 사건 조회">
      <div className="mx-auto max-w-[760px] px-4 py-8">
        <nav className="text-xs text-[#5b6777]">
          <Link href={portalHref()} className="hover:underline">
            홈
          </Link>
          <span aria-hidden> · </span>
          <span>온라인민원</span>
          <span aria-hidden> · </span>
          <span className="text-[#123056]">나의 사건 조회</span>
        </nav>

        <div className="mt-5 border-[3px] border-white bg-white p-6 shadow-sm ring-1 ring-[#d7dee7] sm:p-8">
          <p className="text-xs font-semibold tracking-wide text-[#5b6777]">
            온라인민원
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#123056]">나의 사건 조회</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#3b4654]">
            사건번호와 성명을 입력하면 열람 가능 여부를 안내합니다. 회원가입이
            되어 있지 않으면 다음 단계에서 실명 인증이 필요합니다.
          </p>
          <div className="mt-8">
            <InquiryForm />
          </div>
        </div>
      </div>
    </PortalChrome>
  );
}
