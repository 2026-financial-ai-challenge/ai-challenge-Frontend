"use client";

import { Button } from "@/components/ui/button";
import { useSubmitConsentMutation } from "@/hooks/use-training-queries";
import { apiErrorMessage } from "@/lib/errors";
import { hasLocalConsent, useAuthStore } from "@/lib/stores/auth-store";
import { useSessionStore } from "@/lib/stores/session-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StartTrainingActionProps = {
  size?: "sm" | "lg";
  label?: string;
};

export function StartTrainingAction({
  size = "lg",
  label = "훈련 시작하기",
}: StartTrainingActionProps) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const alreadyConsented = useAuthStore(hasLocalConsent);
  const markConsented = useAuthStore((state) => state.markConsented);
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const startMutation = useSubmitConsentMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!hasHydrated) {
    return <div className={size === "sm" ? "h-9 w-20" : "h-11 w-32"} aria-hidden />;
  }

  if (!token) {
    return (
      <Button asChild size={size}>
        <Link href="/login?next=/consent">{label}</Link>
      </Button>
    );
  }

  if (!alreadyConsented) {
    return (
      <Button asChild size={size}>
        <Link href="/consent">{label}</Link>
      </Button>
    );
  }

  const handleStart = async () => {
    setErrorMessage(null);
    try {
      const { sessionId } = await startMutation.mutateAsync({
        privacy: true,
        unannouncedTraining: true,
      });
      markConsented();
      setSessionId(sessionId);
      router.push(`/status/${sessionId}`);
    } catch (error) {
      setErrorMessage(
        apiErrorMessage(error, "훈련을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요."),
      );
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        type="button"
        size={size}
        onClick={() => void handleStart()}
        disabled={startMutation.isPending}
      >
        {startMutation.isPending ? "훈련 준비 중..." : label}
      </Button>
      {size === "lg" && errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export function StartTrainingButton() {
  return <StartTrainingAction />;
}
