"use client";

import { CredentialsForm } from "@/components/forms/CredentialsForm";
import { useLoginMutation } from "@/hooks/use-training-queries";
import { apiErrorMessage } from "@/lib/errors";
import { replaceTo, safeNextPath, useAuthStore } from "@/lib/stores/auth-store";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const loginMutation = useLoginMutation();
  const nextPath = safeNextPath(searchParams.get("next"));

  useEffect(() => {
    if (hasHydrated && token) {
      replaceTo(nextPath);
    }
  }, [hasHydrated, nextPath, token]);

  const handleSubmit = async (phoneNumber: string, password: string) => {
    try {
      const auth = await loginMutation.mutateAsync({ phoneNumber, password });
      setAuth(auth.accessToken, auth.participant);
      router.push(nextPath);
    } catch {
      // error is read from mutation state
    }
  };

  if (!hasHydrated || token) {
    return (
      <p className="text-sm text-text-secondary">로그인 상태를 확인하고 있습니다...</p>
    );
  }

  return (
    <div className="space-y-4">
      <CredentialsForm
        onSubmit={handleSubmit}
        isSubmitting={loginMutation.isPending}
        errorMessage={apiErrorMessage(loginMutation.error)}
        submitLabel="로그인"
        submittingLabel="로그인 중..."
        phoneDescription="가입할 때 인증한 휴대전화번호로 로그인합니다."
        passwordAutoComplete="current-password"
      />
      <p className="text-center text-sm text-text-secondary">
        처음이신가요?{" "}
        <Link href="/signup" className="font-medium text-primary">
          회원가입
        </Link>
      </p>
    </div>
  );
}
