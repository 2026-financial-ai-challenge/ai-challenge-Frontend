"use client";

import {
  ConsentFields,
  consentFieldSchema,
  type ConsentFieldValues,
} from "@/components/forms/ConsentFields";
import { Button } from "@/components/ui/button";
import { useSubmitConsentMutation } from "@/hooks/use-training-queries";
import { ApiError, apiErrorMessage } from "@/lib/errors";
import { hasTrainingConsent, replaceTo, useAuthStore } from "@/lib/stores/auth-store";
import { useSessionStore } from "@/lib/stores/session-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function ConsentForm() {
  const router = useRouter();
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const alreadyConsented = useAuthStore(hasTrainingConsent);
  const markConsented = useAuthStore((state) => state.markConsented);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const consentMutation = useSubmitConsentMutation();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      replaceTo("/login?next=/consent");
    }
  }, [hasHydrated, token]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConsentFieldValues>({
    resolver: zodResolver(consentFieldSchema),
    defaultValues: {
      privacy: false,
      unannouncedTraining: false,
    },
  });

  const privacy = watch("privacy");
  const unannouncedTraining = watch("unannouncedTraining");

  const startTraining = async (values: ConsentFieldValues) => {
    try {
      const { sessionId } = await consentMutation.mutateAsync(values);
      setSessionId(sessionId);
      markConsented();
      router.push(`/status/${sessionId}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuth();
        replaceTo("/login?next=/consent");
      }
    }
  };

  const submitError = apiErrorMessage(
    consentMutation.error,
    consentMutation.isError
      ? "동의 저장에 실패했습니다. 잠시 후 다시 시도해 주세요."
      : undefined,
  );

  if (!hasHydrated || !token) {
    return (
      <p className="text-sm text-text-secondary">로그인 상태를 확인하고 있습니다...</p>
    );
  }

  if (alreadyConsented) {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-text-primary">
          이미 동의하셨습니다. 바로 다음 훈련을 시작할 수 있습니다.
        </p>
        {submitError ? (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}
        <Button
          type="button"
          className="w-full"
          disabled={consentMutation.isPending}
          onClick={() => void startTraining({ privacy: true, unannouncedTraining: true })}
        >
          {consentMutation.isPending ? "훈련 준비 중..." : "훈련 시작하기"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(startTraining)} className="space-y-5">
      <ConsentFields
        privacy={privacy}
        unannouncedTraining={unannouncedTraining}
        onPrivacyChange={(value) =>
          setValue("privacy", value, { shouldValidate: true, shouldTouch: true })
        }
        onUnannouncedChange={(value) =>
          setValue("unannouncedTraining", value, {
            shouldValidate: true,
            shouldTouch: true,
          })
        }
        privacyError={errors.privacy?.message}
        unannouncedError={errors.unannouncedTraining?.message}
      />

      {submitError ? (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={consentMutation.isPending}>
        {consentMutation.isPending ? "훈련 준비 중..." : "동의하고 훈련 시작"}
      </Button>
    </form>
  );
}
