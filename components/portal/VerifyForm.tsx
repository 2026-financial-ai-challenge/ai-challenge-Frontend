"use client";

import { PortalButton, PortalField, portalInputClass } from "@/components/portal/PortalField";
import { portalHref } from "@/lib/portal";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState(searchParams.get("name") ?? "");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; birth?: string }>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = {
      name: name.trim() ? undefined : "성명을 입력해 주십시오.",
      birth: birth ? undefined : "생년월일을 입력해 주십시오.",
    };
    setErrors(next);
    if (next.name || next.birth) return;

    setPending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    const params = new URLSearchParams({
      caseNo: searchParams.get("caseNo") ?? "2023-조사-1842",
      name: name.trim(),
    });
    router.push(`${portalHref("/hold")}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <PortalField label="성명" htmlFor="verifyName" error={errors.name}>
        <input
          id="verifyName"
          name="verifyName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={portalInputClass(Boolean(errors.name))}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "verifyName-error" : undefined}
        />
      </PortalField>
      <PortalField
        label="생년월일"
        htmlFor="verifyBirth"
        hint="주민등록번호는 요구하지 않습니다."
        error={errors.birth}
      >
        <input
          id="verifyBirth"
          name="verifyBirth"
          type="date"
          value={birth}
          onChange={(event) => setBirth(event.target.value)}
          className={portalInputClass(Boolean(errors.birth))}
          aria-invalid={Boolean(errors.birth)}
          aria-describedby={errors.birth ? "verifyBirth-error" : undefined}
        />
      </PortalField>
      <PortalField
        label="휴대전화번호"
        htmlFor="verifyPhone"
        hint="선택 사항입니다."
      >
        <input
          id="verifyPhone"
          name="verifyPhone"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className={portalInputClass()}
          placeholder="010-0000-0000"
          autoComplete="tel"
        />
      </PortalField>
      <PortalButton pending={pending}>실명 인증하기</PortalButton>
    </form>
  );
}
