"use client";

import { PortalButton, PortalField, portalInputClass } from "@/components/portal/PortalField";
import { portalHref } from "@/lib/portal";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function InquiryForm() {
  const router = useRouter();
  const [caseNo, setCaseNo] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ caseNo?: string; name?: string }>({});

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCase = caseNo.trim();
    const trimmedName = name.trim();
    const next = {
      caseNo: trimmedCase ? undefined : "사건번호를 입력해 주십시오.",
      name: trimmedName ? undefined : "성명을 입력해 주십시오.",
    };
    setErrors(next);
    if (next.caseNo || next.name) return;

    const params = new URLSearchParams({
      caseNo: trimmedCase,
      name: trimmedName,
    });
    router.push(`${portalHref("/verify")}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
