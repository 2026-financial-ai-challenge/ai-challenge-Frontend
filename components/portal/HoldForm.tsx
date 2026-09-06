"use client";

import { PortalButton, PortalField, portalInputClass } from "@/components/portal/PortalField";
import { PORTAL_BANKS } from "@/lib/portal";
import { useState, type FormEvent } from "react";

const FAIL_MESSAGE =
  "전자금융망 접속이 원활하지 않습니다. 계좌번호를 다시 확인해 주십시오.";

export function HoldForm() {
  const [bank, setBank] = useState("선택");
  const [account, setAccount] = useState("");
  const [holder, setHolder] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    bank?: string;
    account?: string;
    holder?: string;
  }>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = {
      bank: bank === "선택" ? "거래 은행을 선택해 주십시오." : undefined,
      account: account.replace(/\D/g, "").length >= 8
        ? undefined
        : "계좌번호를 확인해 주십시오.",
      holder: holder.trim() ? undefined : "예금주명을 입력해 주십시오.",
    };
    setFieldErrors(next);
    setError(null);
    if (next.bank || next.account || next.holder) return;

    setPending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    setPending(false);
    setError(FAIL_MESSAGE);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate autoComplete="off">
      <PortalField label="거래 은행" htmlFor="bank" error={fieldErrors.bank}>
        <select
          id="bank"
          name="bank"
          value={bank}
          onChange={(event) => setBank(event.target.value)}
          className={`${portalInputClass(Boolean(fieldErrors.bank))} cursor-pointer`}
          aria-invalid={Boolean(fieldErrors.bank)}
          aria-describedby={fieldErrors.bank ? "bank-error" : undefined}
        >
          {PORTAL_BANKS.map((item) => (
            <option key={item} value={item} disabled={item === "선택"}>
              {item}
            </option>
          ))}
        </select>
      </PortalField>
      <PortalField label="계좌번호" htmlFor="account" error={fieldErrors.account}>
        <input
          id="account"
          name="account-training"
          inputMode="numeric"
          value={account}
          onChange={(event) => setAccount(event.target.value.replace(/[^\d-]/g, ""))}
          className={portalInputClass(Boolean(fieldErrors.account))}
          placeholder="하이픈 없이 입력"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={Boolean(fieldErrors.account)}
          aria-describedby={fieldErrors.account ? "account-error" : undefined}
        />
      </PortalField>
      <PortalField label="예금주" htmlFor="holder" error={fieldErrors.holder}>
        <input
          id="holder"
          name="holder"
          value={holder}
          onChange={(event) => setHolder(event.target.value)}
          className={portalInputClass(Boolean(fieldErrors.holder))}
          autoComplete="off"
          aria-invalid={Boolean(fieldErrors.holder)}
          aria-describedby={fieldErrors.holder ? "holder-error" : undefined}
        />
      </PortalField>

      {error ? (
        <div
          role="alert"
          className="border border-[#f0b4ae] bg-[#fdecea] px-4 py-3 text-sm text-[#8a1f16]"
        >
          <p className="font-semibold">처리 실패</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-[13px]">
            잠시 후 다시 시도하시거나, 상담 중인 담당자 안내에 따라 진행해 주십시오.
          </p>
        </div>
      ) : null}

      <PortalButton pending={pending}>계좌 확인</PortalButton>
    </form>
  );
}
