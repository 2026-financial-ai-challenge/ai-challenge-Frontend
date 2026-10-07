"use client";

import { OtpCodeForm } from "@/components/forms/OtpCodeForm";
import { PhoneForm } from "@/components/forms/PhoneForm";
import { SignupAccountForm } from "@/components/forms/SignupAccountForm";
import { useRedirectWhenAuthenticated } from "@/hooks/use-auth-redirect";
import {
  useRequestSignupOtpMutation,
  useSignupMutation,
  useVerifySignupOtpMutation,
} from "@/hooks/use-training-queries";
import { ApiError, apiErrorMessage } from "@/lib/errors";
import { hasTrainingConsent, useAuthStore } from "@/lib/stores/auth-store";
import type { RequestSignupOtpResponse } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OTP_REQUEST_FAILED =
  "인증번호 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.";
const OTP_VERIFY_FAILED =
  "인증번호 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.";

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
};

export function SignupForm() {
  const router = useRouter();
  const alreadyConsented = useAuthStore(hasTrainingConsent);
  const setAuth = useAuthStore((state) => state.setAuth);
  const redirecting = useRedirectWhenAuthenticated(
    alreadyConsented ? "/dashboard" : "/consent",
  );

  const requestOtpMutation = useRequestSignupOtpMutation();
  const verifyOtpMutation = useVerifySignupOtpMutation();
  const signupMutation = useSignupMutation();

  const [enteredPhone, setEnteredPhone] = useState("");
  const [otpTicket, setOtpTicket] = useState<OtpTicket | null>(null);
  const [verified, setVerified] = useState<VerifiedTicket | null>(null);
  const [errorNonce, setErrorNonce] = useState(0);

  const bumpErrorNonce = () => setErrorNonce((value) => value + 1);

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
    verifyOtpMutation.reset();
    signupMutation.reset();
    setEnteredPhone(phoneNumber);
    try {
      applyOtpResponse(
        phoneNumber,
        await requestOtpMutation.mutateAsync({ phoneNumber }),
      );
    } catch {
      bumpErrorNonce();
    }
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
      });
    } catch {
      bumpErrorNonce();
    }
  };

  const handleCreateAccount = async (values: {
    password: string;
    privacy: boolean;
    unannouncedTraining: boolean;
  }) => {
    if (!verified) return;
    try {
      const auth = await signupMutation.mutateAsync({
        ...values,
        verificationToken: verified.verificationToken,
      });
      setAuth(auth.accessToken, auth.participant, auth.expiresInSec);
      router.push("/dashboard");
    } catch {
      bumpErrorNonce();
    }
  };

  const handleChangePhone = () => {
    requestOtpMutation.reset();
    verifyOtpMutation.reset();
    signupMutation.reset();
    setOtpTicket(null);
    setVerified(null);
  };

  if (redirecting) return null;

  if (verified) {
    return (
      <div className="space-y-4">
        <p className="text-base leading-6 text-text-primary">
          전화번호 인증이 끝났습니다. 비밀번호를 정하고, 훈련에 필요한 동의에
          체크하면 가입이 완료됩니다.
        </p>
        <SignupAccountForm
          key={errorNonce}
          onSubmit={handleCreateAccount}
          isSubmitting={signupMutation.isPending}
          errorMessage={apiErrorMessage(
            signupMutation.error,
            "가입 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
          )}
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
    const failure = requestOtpMutation.isError
      ? { error: requestOtpMutation.error, fallback: OTP_REQUEST_FAILED }
      : verifyOtpMutation.isError
        ? { error: verifyOtpMutation.error, fallback: OTP_VERIFY_FAILED }
        : null;

    return (
      <OtpCodeForm
        key={`${otpTicket.nonce}-${errorNonce}`}
        phoneNumberMasked={otpTicket.phoneNumberMasked}
        expiresAt={otpTicket.expiresAt}
        resendAt={otpTicket.resendAt}
        onConfirm={handleConfirmOtp}
        onResend={() => handleRequestOtp(otpTicket.phoneNumber)}
        onChangePhone={handleChangePhone}
        isSubmitting={verifyOtpMutation.isPending}
        isResending={requestOtpMutation.isPending}
        errorMessage={
          failure ? apiErrorMessage(failure.error, failure.fallback) : null
        }
        errorCode={
          failure?.error instanceof ApiError ? failure.error.code : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <PhoneForm
        defaultPhoneNumber={enteredPhone}
        onSubmit={handleRequestOtp}
        isSubmitting={requestOtpMutation.isPending}
        errorMessage={apiErrorMessage(
          requestOtpMutation.error,
          requestOtpMutation.isError ? OTP_REQUEST_FAILED : undefined,
        )}
        description="이 번호로 인증번호를 보냅니다. 받은 6자리를 확인한 뒤 비밀번호와 동의 절차를 마치면 가입이 완료됩니다."
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
