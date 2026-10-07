"use client";

import { PortalButton, PortalField, portalInputClass } from "@/components/portal/PortalField";
import { portalHref } from "@/lib/portal";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function InquiryForm({
  onSubmitted,
  caseNoLinked = false,
}: {
  onSubmitted?: () => void;
  caseNoLinked?: boolean;
}) {
  const router = useRouter();
  const [caseNo, setCaseNo] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ caseNo?: string; name?: string }>({});

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCase = caseNo.trim();
    const trimmedName = name.trim();
    const next = {
      caseNo: caseNoLinked || trimmedCase ? undefined : "사건번호를 입력해 주십시오.",
      name: trimmedName ? undefined : "성명을 입력해 주십시오.",
    };
    setErrors(next);
    if (next.caseNo || next.name) return;
    if (onSubmitted) {
      onSubmitted();
      return;
    }

    const params = new URLSearchParams({
      caseNo: trimmedCase,
      name: trimmedName,
    });
    router.push(`${portalHref("/verify")}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {caseNoLinked ? (
        <div className="border border-[#d7dee7] bg-[#f4f7fb] px-4 py-3 text-sm">
          <p className="font-semibold text-[#1a2433]">사건번호</p>
          <p className="mt-1 text-[#3b4654]">
            문자 안내 링크에 연결된 사건으로 조회합니다.
          </p>
        </div>
      ) : (
        <PortalField
          label="사건번호"
          htmlFor="caseNo"
          hint="등기 서류 또는 상담 안내의 사건번호를 입력합니다."
          error={errors.caseNo}
        >
          <input
            id="caseNo"
            name="caseNo"
            value={caseNo}
            onChange={(event) => setCaseNo(event.target.value)}
            className={portalInputClass(Boolean(errors.caseNo))}
            placeholder="예: 2023-조사-1842"
            autoComplete="off"
            aria-invalid={Boolean(errors.caseNo)}
            aria-describedby={errors.caseNo ? "caseNo-error" : undefined}
          />
        </PortalField>
      )}
      <PortalField label="성명" htmlFor="partyName" error={errors.name}>
        <input
          id="partyName"
          name="partyName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={portalInputClass(Boolean(errors.name))}
          placeholder="실명과 동일하게 입력"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "partyName-error" : undefined}
        />
      </PortalField>
      <PortalButton>조회하기</PortalButton>
    </form>
  );
}
