"use client";

import { PORTAL_AGENCY, PORTAL_TEAM } from "@/lib/portal";
import { useSearchParams } from "next/navigation";

export function CaseDocument() {
  const searchParams = useSearchParams();
  const caseNo = searchParams.get("caseNo") || "2023-조사-1842";
  const name = searchParams.get("name") || "열람 대상자";

  return (
    <section className="border border-[#c5ced9] bg-white">
      <div className="border-b border-[#c5ced9] bg-[#f4f7fb] px-5 py-3">
        <h2 className="text-base font-bold text-[#123056]">사건 열람 문서</h2>
      </div>
      <div className="px-5 py-6">
        <p className="text-center text-lg font-bold tracking-wide text-[#123056]">
          {PORTAL_AGENCY} {PORTAL_TEAM}
        </p>
        <p className="mt-1 text-center text-sm text-[#5b6777]">등기송달 관련 명의 확인 건</p>

        <dl className="mt-6 grid grid-cols-[7.5rem_1fr] gap-y-3 border-y border-[#d7dee7] py-4 text-sm">
          <dt className="text-[#5b6777]">사건번호</dt>
          <dd className="font-semibold">{caseNo}</dd>
          <dt className="text-[#5b6777]">사건명</dt>
          <dd>2023 조사 · 등기송달 본인확인</dd>
          <dt className="text-[#5b6777]">대상자</dt>
          <dd>{name}</dd>
          <dt className="text-[#5b6777]">담당부서</dt>
          <dd>
            {PORTAL_AGENCY} {PORTAL_TEAM}
          </dd>
          <dt className="text-[#5b6777]">진행상태</dt>
          <dd>열람 대기 · 보전 대상 계좌 확인 필요</dd>
        </dl>

        <p className="mt-5 text-sm leading-relaxed text-[#3b4654]">
          관련 내용 전달을 위해 본인 열람이 확인되어야 합니다. 아래 보전 대상
          계좌를 확인한 뒤에만 서류 원문을 열람할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
