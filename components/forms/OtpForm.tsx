"use client";

import { Button } from "@/components/ui/button";
import { OTP_ERROR, USE_MOCK_API, formatMoNumber, smsDeepLink } from "@/lib/otp";
import { useEffect, useState, useSyncExternalStore } from "react";

type OtpFormProps = {
  phoneNumberMasked: string;
  code: string;
  sendToNumber: string;
  expiresAt: number;
  resendAt: number;
  onConfirm: () => Promise<void> | void;
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

export function OtpForm({
  phoneNumberMasked,
  code,
  sendToNumber,
  expiresAt,
  resendAt,
  onConfirm,
  onResend,
  onChangePhone,
  isSubmitting = false,
  isResending = false,
  errorMessage,
  errorCode,
}: OtpFormProps) {
  const [now, setNow] = useState(() => Date.now());
  const isIos = useSyncExternalStore(
    () => () => {},
    () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
    () => false,
  );
  const smsHref = smsDeepLink(sendToNumber, code, isIos);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const expiresInSec = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const resendInSec = Math.max(0, Math.ceil((resendAt - now) / 1000));
  const expired = expiresInSec === 0;
  const locked = errorCode === OTP_ERROR.OTP_LOCKED;
  const notRequested = errorCode === OTP_ERROR.OTP_NOT_REQUESTED;
  const rateLimited = errorCode === OTP_ERROR.OTP_RATE_LIMITED;
  const confirmBlocked = expired || locked || notRequested;
  const resendBlocked = isResending || resendInSec > 0 || rateLimited;
  const sendToDisplay = formatMoNumber(sendToNumber);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (confirmBlocked || isSubmitting) return;
        void onConfirm();
      }}
      className="space-y-4"
    >
      <div>
        <p className="text-sm leading-6 text-navy-600">
          <span className="font-semibold text-navy-900">{phoneNumberMasked}</span>{" "}
          번호 확인입니다. 지금 보내는 문자는 훈련 전화가 아닙니다.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          아래 인증코드를 {sendToDisplay}로 보낸 다음, 전송 완료를 눌러 주세요.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-4">
        <div className="flex items-end justify-between gap-3">
          <p className="text-xs font-medium text-navy-500">보낼 번호</p>
          <p
            className={`text-xs font-medium ${expired ? "text-destructive" : "text-navy-500"}`}
            aria-live="polite"
          >
            {expired
              ? "인증코드가 만료되었습니다. 새 코드를 받아 주세요."
              : `남은 시간 ${formatMmSs(expiresInSec)}`}
          </p>
        </div>
        <p className="mt-1 text-xl font-semibold tracking-wide text-navy-900">
          {sendToDisplay}
        </p>
        <p className="mt-4 text-xs font-medium text-navy-500">인증코드</p>
        <p className="mt-1 text-center text-3xl font-bold tracking-[0.35em] text-navy-900">
          {code}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="secondary" className="w-full">
            <a href={smsHref}>문자 앱 열기</a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => void handleCopyCode()}
          >
            {copied ? "코드를 복사했습니다" : "코드 복사"}
          </Button>
        </div>
      </div>

      {USE_MOCK_API ? (
        <p className="text-xs text-navy-400">
          개발용 목 모드에서는 문자를 보내지 않고 전송 완료를 누르면 됩니다.
        </p>
      ) : null}

      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || confirmBlocked}
      >
        {isSubmitting ? "번호 확인 중..." : "전송 완료"}
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
            ? "새 코드 받는 중..."
            : resendInSec > 0
              ? `${resendInSec}초 후 새 코드`
              : "새 코드 받기"}
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
