"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** 전화번호는 회원가입에서 인증합니다. 세션별 번호 등록 API는 없습니다. */
export function RegisterForm() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/signup");
  }, [router]);

  return (
    <p className="text-sm text-text-secondary">
      회원가입 화면으로 이동합니다...
    </p>
  );
}
