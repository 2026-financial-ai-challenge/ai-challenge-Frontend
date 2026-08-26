"use client";

import { OtpForm } from "@/components/forms/OtpForm";
import { PhoneForm } from "@/components/forms/PhoneForm";
import {
  useRequestPhoneOtpMutation,
  useVerifyPhoneMutation,
} from "@/hooks/use-training-queries";
import { ApiError, apiErrorMessage } from "@/lib/errors";
import { OTP_ERROR } from "@/lib/otp";
import { useSessionStore } from "@/lib/stores/session-store";
import type { RequestOtpResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type OtpTicket = {
  phoneNumber: string;
  phoneNumberMasked: string;
  code: string;
  sendToNumber: string;
  expiresAt: number;
  resendAt: number;
  nonce: number;
};

export function RegisterForm() {
  const router = useRouter();
  const sessionId = useSessionStore((state) => state.sessionId);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const requestOtpMutation = useRequestPhoneOtpMutation();
  const verifyMutation = useVerifyPhoneMutation();
  const [enteredPhone, setEnteredPhone] = useState("");
  const [otpTicket, setOtpTicket] = useState<OtpTicket | null>(null);
  const [errorNonce, setErrorNonce] = useState(0);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!sessionId) {
      router.replace("/consent");
    }
  }, [hasHydrated, router, sessionId]);

  if (!hasHydrated || !sessionId) {
    return (
      <p className="text-sm text-text-secondary">
        동의 정보를 확인하고 있습니다...
      </p>
    );
  }

  const handleSessionMissing = (error: unknown) => {
    if (error instanceof ApiError && error.code === OTP_ERROR.SESSION_NOT_FOUND) {
      setSessionId(null);
      router.replace("/consent");
      return true;
    }
    return false;
  };

  const applyOtpResponse = (phoneNumber: string, response: RequestOtpResponse) => {
    const now = Date.now();
    setOtpTicket({
      phoneNumber,
      phoneNumberMasked: response.phoneNumberMasked,
      code: response.code,
      sendToNumber: response.sendToNumber,
      expiresAt: now + response.expiresInSec * 1000,
      resendAt: now + response.resendAvailableInSec * 1000,
      nonce: now,
    });
  };

  const handleRequestOtp = async (phoneNumber: string) => {
    try {
      verifyMutation.reset();
      setEnteredPhone(phoneNumber);
      const response = await requestOtpMutation.mutateAsync({
        sessionId,
        phoneNumber,
      });
      applyOtpResponse(phoneNumber, response);
    } catch (error) {
      setErrorNonce((value) => value + 1);
      handleSessionMissing(error);
    }
  };

  const handleResend = async () => {
    if (!otpTicket) return;
    await handleRequestOtp(otpTicket.phoneNumber);
  };

  const handleConfirm = async () => {
    if (!otpTicket) return;
    try {
      const { session } = await verifyMutation.mutateAsync({
        sessionId,
        phoneNumber: otpTicket.phoneNumber,
        code: otpTicket.code,
      });
      if (!session.phoneNumberMasked || !session.callStatus) {
        return;
      }
      setSessionId(session.id);
      router.push(`/status/${session.id}`);
    } catch (error) {
      setErrorNonce((value) => value + 1);
      handleSessionMissing(error);
    }
  };

  const handleChangePhone = () => {
    requestOtpMutation.reset();
    verifyMutation.reset();
    setOtpTicket(null);
  };

  if (otpTicket) {
    const requestError = apiErrorMessage(requestOtpMutation.error);
    const verifyError = apiErrorMessage(verifyMutation.error);
    const error =
      requestOtpMutation.isError && requestError
        ? requestOtpMutation.error
        : verifyMutation.isError
          ? verifyMutation.error
          : null;
    const errorCode = error instanceof ApiError ? error.code : undefined;

    return (
      <OtpForm
        key={`${otpTicket.nonce}-${errorNonce}`}
        phoneNumberMasked={otpTicket.phoneNumberMasked}
        code={otpTicket.code}
        sendToNumber={otpTicket.sendToNumber}
        expiresAt={otpTicket.expiresAt}
        resendAt={otpTicket.resendAt}
        onConfirm={handleConfirm}
        onResend={handleResend}
        onChangePhone={handleChangePhone}
        isSubmitting={verifyMutation.isPending}
        isResending={requestOtpMutation.isPending}
        errorMessage={requestError ?? verifyError}
        errorCode={errorCode}
      />
    );
  }

  return (
    <PhoneForm
      defaultPhoneNumber={enteredPhone}
      onSubmit={handleRequestOtp}
      isSubmitting={requestOtpMutation.isPending}
      errorMessage={apiErrorMessage(requestOtpMutation.error)}
    />
  );
}
