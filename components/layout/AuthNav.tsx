"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthNav() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const participant = useAuthStore((state) => state.participant);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  if (!hasHydrated) {
    return <div className="h-9 w-24" aria-hidden />;
  }

  if (token && participant) {
    return (
      <div className="flex items-center gap-2">
        <p className="hidden text-xs text-text-secondary sm:block">
          {participant.phoneNumberMasked}
        </p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            clearAuth();
            router.push("/");
          }}
        >
          로그아웃
        </Button>
        <Button asChild size="sm">
          <Link href="/dashboard">대시보드</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="ghost">
        <Link href="/login">로그인</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/signup">회원가입</Link>
      </Button>
    </div>
  );
}
