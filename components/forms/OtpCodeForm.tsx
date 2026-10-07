"use client";

import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isOtpConfirmBlocked, OTP_CODE_LENGTH, OTP_ERROR } from "@/lib/otp";
import { useEffect, useState } from "react";

type OtpCodeFormProps = {
  phoneNumberMasked: string;
  expiresAt: number;
  resendAt: number;
  onConfirm: (code: string) => Promise<void> | void;
  onResend: () => Promise<void> | void;
  onChangePhone: () => void;
  isSubmitting?: boolean;
  isResending?: boolean;
  errorMessage?: string | null;
  errorCode?: string | null;
};

function formatMmSs(totalSec: number) {
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function useCountdowns(expiresAt: number, resendAt: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return {
    expiresInSec: Math.max(0, Math.ceil((expiresAt - now) / 1000)),
    resendInSec: Math.max(0, Math.ceil((resendAt - now) / 1000)),
  };
}

export function OtpCodeForm({
  phoneNumberMasked,
  expiresAt,
  resendAt,
  onConfirm,
  onResend,
  onChangePhone,
  isSubmitting = false,
  isResending = false,
  errorMessage,
  errorCode,
}: OtpCodeFormProps) {
  const [code, setCode] = useState("");
  const { expiresInSec, resendInSec } = useCountdowns(expiresAt, resendAt);

  const expired = expiresInSec === 0;
  const confirmBlocked = isOtpConfirmBlocked({
    expired,
    codeLength: code.length,
    errorCode,
  });
  const resendBlocked =
    isResending || resendInSec > 0 || errorCode === OTP_ERROR.OTP_RATE_LIMITED;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (confirmBlocked || isSubmitting) return;
        void onConfirm(code);
      }}
      className="space-y-4"
    >
      <div>
        <p className="text-base leading-6 text-text-primary">
          <span className="font-semibold text-text-primary">
            {phoneNumberMasked}로
          </span>{" "}
          인증번호를 보냈습니다.
        </p>
        <p className="mt-1 text-base text-text-secondary">
          문자에 있는 6자리 번호를 입력해 주세요. 지금 오는 문자는 훈련 전화가
          아닙니다.
        </p>
      </div>

      <div>
        <div className="flex items-end justify-between gap-3">
          <Label htmlFor="otpCode" className="text-text-primary">
            인증번호
          </Label>
          <p
            className={`text-xs font-medium ${expired ? "text-destructive" : "text-text-secondary"}`}
            aria-live="polite"
          >
            {expired
              ? "인증번호가 만료되었습니다. 새 번호를 받아 주세요."
              : `남은 시간 ${formatMmSs(expiresInSec)}`}
          </p>
        </div>
        <Input
          id="otpCode"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={OTP_CODE_LENGTH}
          placeholder="000000"
          className="mt-3 text-center text-2xl font-bold tracking-[0.35em]"
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, OTP_CODE_LENGTH))
          }
          aria-invalid={errorMessage ? "true" : "false"}
        />
      </div>

      <FormError message={errorMessage} />

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || confirmBlocked}
      >
        {isSubmitting ? "확인 중..." : "인증하기"}
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={resendBlocked}
          onClick={() => void onResend()}
        >
          {isResending
            ? "새 번호 보내는 중..."
            : resendInSec > 0
              ? `${resendInSec}초 후 다시 받기`
              : "다시 받기"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onChangePhone}
        >
          번호 변경
        </Button>
      </div>
    </form>
  );
}
