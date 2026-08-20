"use client";

import { PhoneForm } from "@/components/forms/PhoneForm";
import { ApiError } from "@/lib/errors";
import { useSessionStore } from "@/lib/stores/session-store";
import { useRegisterPhoneMutation } from "@/hooks/use-training-queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RegisterForm() {
  const router = useRouter();
  const sessionId = useSessionStore((state) => state.sessionId);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const registerMutation = useRegisterPhoneMutation();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!sessionId) {
      router.replace("/consent");
    }
  }, [hasHydrated, router, sessionId]);

  if (!hasHydrated || !sessionId) {
    return (
      <p className="text-sm text-muted-foreground">
        동의 정보를 확인하고 있습니다...
      </p>
    );
  }

  const handleSubmit = async (phoneNumber: string) => {
    try {
      const { session } = await registerMutation.mutateAsync({
        sessionId,
        phoneNumber,
      });
      setSessionId(session.id);
      router.push(`/status/${session.id}`);
    } catch {
      // error is read from mutation state
    }
  };

  const errorMessage =
    registerMutation.error instanceof ApiError
      ? registerMutation.error.message
      : registerMutation.isError
        ? "번호 등록에 실패했습니다. 잠시 후 다시 시도해 주세요."
        : null;

  return (
    <PhoneForm
      onSubmit={handleSubmit}
      isSubmitting={registerMutation.isPending}
      errorMessage={errorMessage}
    />
  );
}
