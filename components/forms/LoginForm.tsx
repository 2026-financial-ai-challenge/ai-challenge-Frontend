"use client";

import { CredentialsForm } from "@/components/forms/CredentialsForm";
import { useRedirectWhenAuthenticated } from "@/hooks/use-auth-redirect";
import { useLoginMutation } from "@/hooks/use-training-queries";
import { apiErrorMessage } from "@/lib/errors";
import { postLoginPath, safeNextPath, useAuthStore } from "@/lib/stores/auth-store";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasConsented = useAuthStore(
    (state) => state.participant?.hasConsented === true,
  );
  const setAuth = useAuthStore((state) => state.setAuth);
  const loginMutation = useLoginMutation();
  const nextPath = safeNextPath(searchParams.get("next"));
  const redirecting = useRedirectWhenAuthenticated(
    postLoginPath(hasConsented, nextPath),
  );

  const handleSubmit = async (phoneNumber: string, password: string) => {
    try {
      const auth = await loginMutation.mutateAsync({ phoneNumber, password });
      setAuth(auth.accessToken, auth.participant, auth.expiresInSec);
      router.push(postLoginPath(auth.participant.hasConsented, nextPath));
    } catch {
    }
  };

  if (redirecting) return null;

  return (
    <div className="space-y-4">
      <CredentialsForm
        onSubmit={handleSubmit}
        isSubmitting={loginMutation.isPending}
        errorMessage={apiErrorMessage(
          loginMutation.error,
          loginMutation.isError
            ? "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요."
            : undefined,
        )}
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
