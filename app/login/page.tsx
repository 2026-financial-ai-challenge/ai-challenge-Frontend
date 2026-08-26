import { LoginForm } from "@/components/forms/LoginForm";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "로그인",
  description: "가입한 휴대전화번호와 비밀번호로 로그인합니다.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        로그인
      </h1>
      <p className="mt-3 text-sm leading-6 text-text-primary">
        가입할 때 인증한 휴대전화번호와 비밀번호로 로그인합니다.
      </p>
      <Card className="mt-8 p-6">
        <Suspense
          fallback={
            <p className="text-sm text-text-secondary">로그인 화면을 준비하고 있습니다...</p>
          }
        >
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
