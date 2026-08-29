"use client";

import { OtpCodeForm } from "@/components/forms/OtpCodeForm";
import { PasswordForm } from "@/components/forms/PasswordForm";
import { PhoneForm } from "@/components/forms/PhoneForm";
import {
  useRequestSignupOtpMutation,
  useSignupMutation,
  useVerifySignupOtpMutation,
} from "@/hooks/use-training-queries";
import { ApiError, apiErrorMessage } from "@/lib/errors";
import { hasLocalConsent, replaceTo, useAuthStore } from "@/lib/stores/auth-store";
import type { RequestSignupOtpResponse } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type OtpTicket = {
  phoneNumber: string;
  phoneNumberMasked: string;
  expiresAt: number;
  resendAt: number;
  nonce: number;
};

type VerifiedTicket = {
  phoneNumber: string;
  verificationToken: string;
  expiresAt: number;
};

export function SignupForm() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const alreadyConsented = useAuthStore(hasLocalConsent);
  const requestOtpMutation = useRequestSignupOtpMutation();
  const verifyOtpMutation = useVerifySignupOtpMutation();
  const signupMutation = useSignupMutation();
  const [enteredPhone, setEnteredPhone] = useState("");
  const [otpTicket, setOtpTicket] = useState<OtpTicket | null>(null);
  const [verified, setVerified] = useState<VerifiedTicket | null>(null);
  const [errorNonce, setErrorNonce] = useState(0);

  useEffect(() => {
    if (hasHydrated && token) {
      replaceTo(alreadyConsented ? "/dashboard" : "/consent");
    }
  }, [alreadyConsented, hasHydrated, token]);

  const applyOtpResponse = (
    phoneNumber: string,
    response: RequestSignupOtpResponse,
  ) => {
    const now = Date.now();
    setVerified(null);
    setOtpTicket({
      phoneNumber,
      phoneNumberMasked: response.phoneNumberMasked,
      expiresAt: now + response.expiresInSec * 1000,
      resendAt: now + response.resendAvailableInSec * 1000,
      nonce: now,
    });
  };

  const handleRequestOtp = async (phoneNumber: string) => {
    try {
      verifyOtpMutation.reset();
      signupMutation.reset();
      setEnteredPhone(phoneNumber);
      const response = await requestOtpMutation.mutateAsync({ phoneNumber });
      applyOtpResponse(phoneNumber, response);
    } catch {
      setErrorNonce((value) => value + 1);
    }
  };

  const handleResend = async () => {
    if (!otpTicket) return;
    await handleRequestOtp(otpTicket.phoneNumber);
  };

  const handleConfirmOtp = async (code: string) => {
    if (!otpTicket) return;
    try {
      const response = await verifyOtpMutation.mutateAsync({
        phoneNumber: otpTicket.phoneNumber,
        code,
      });
      setVerified({
        phoneNumber: otpTicket.phoneNumber,
        verificationToken: response.verificationToken,
        expiresAt: Date.now() + response.expiresInSec * 1000,
      });
    } catch {
      setErrorNonce((value) => value + 1);
    }
  };

  const handleCreateAccount = async (password: string) => {
    if (!verified) return;
    try {
      const auth = await signupMutation.mutateAsync({
        verificationToken: verified.verificationToken,
        password,
      });
      setAuth(auth.accessToken, auth.participant);
      router.push("/consent");
    } catch {
      setErrorNonce((value) => value + 1);
    }
  };

  const handleChangePhone = () => {
    requestOtpMutation.reset();
    verifyOtpMutation.reset();
    signupMutation.reset();
    setOtpTicket(null);
    setVerified(null);
  };

  if (!hasHydrated || token) {
    return (
      <p className="text-sm text-text-secondary">로그인 상태를 확인하고 있습니다...</p>
    );
  }

  if (verified) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-text-primary">
          전화번호 인증이 끝났습니다. 로그인에 사용할 비밀번호를 정해 주세요.
        </p>
        <PasswordForm
          key={errorNonce}
          onSubmit={handleCreateAccount}
          isSubmitting={signupMutation.isPending}
          errorMessage={apiErrorMessage(signupMutation.error)}
        />
        <button
          type="button"
          className="w-full text-sm font-medium text-text-secondary underline-offset-2 hover:underline"
          onClick={handleChangePhone}
        >
          번호 변경
        </button>
      </div>
    );
  }

  if (otpTicket) {
    const requestError = apiErrorMessage(requestOtpMutation.error);
    const verifyError = apiErrorMessage(verifyOtpMutation.error);
    const error =
      requestOtpMutation.isError && requestError
        ? requestOtpMutation.error
        : verifyOtpMutation.isError
          ? verifyOtpMutation.error
          : null;
    const errorCode = error instanceof ApiError ? error.code : undefined;

    return (
      <OtpCodeForm
        key={`${otpTicket.nonce}-${errorNonce}`}
        phoneNumberMasked={otpTicket.phoneNumberMasked}
        expiresAt={otpTicket.expiresAt}
        resendAt={otpTicket.resendAt}
        onConfirm={handleConfirmOtp}
        onResend={handleResend}
        onChangePhone={handleChangePhone}
        isSubmitting={verifyOtpMutation.isPending}
        isResending={requestOtpMutation.isPending}
        errorMessage={requestError ?? verifyError}
        errorCode={errorCode}
      />
    );
  }

  return (
    <div className="space-y-4">
      <PhoneForm
        defaultPhoneNumber={enteredPhone}
        onSubmit={handleRequestOtp}
        isSubmitting={requestOtpMutation.isPending}
        errorMessage={apiErrorMessage(requestOtpMutation.error)}
        description="이 번호로 인증번호를 보냅니다. 받은 6자리를 확인한 뒤 비밀번호를 정하면 가입이 완료됩니다."
        submitLabel="인증번호 받기"
        submittingLabel="인증번호 보내는 중..."
      />
      <p className="text-center text-sm text-text-secondary">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="font-medium text-primary">
          로그인
        </Link>
      </p>
    </div>
  );
}
