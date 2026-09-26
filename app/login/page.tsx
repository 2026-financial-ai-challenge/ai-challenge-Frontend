import { LoginForm } from "@/components/forms/LoginForm";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "로그인",
  description: "가입한 휴대전화번호와 비밀번호로 로그인합니다.",
};

function LoginFormSkeleton() {
  return (
    <div className="animate-pulse space-y-4" role="status">
      <span className="sr-only">로그인 화면을 준비하고 있습니다...</span>
      <div className="space-y-2">
        <div className="h-[1.125rem] w-24 rounded bg-primary-light" />
        <div className="h-4 w-56 rounded bg-primary-light" />
        <div className="h-11 w-full rounded-lg bg-primary-light" />
      </div>
      <div className="space-y-2">
        <div className="h-[1.125rem] w-16 rounded bg-primary-light" />
        <div className="h-11 w-full rounded-lg bg-primary-light" />
      </div>
      <div className="h-10 w-full rounded-lg bg-primary-light" />
      <div className="mx-auto h-4 w-40 rounded bg-primary-light" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-12 sm:py-16 sm:min-h-[75vh]">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        로그인
      </h1>
      <p className="mt-3 text-base leading-6 text-text-primary">
        가입할 때 인증한 휴대전화번호와 비밀번호로 로그인합니다.
      </p>
      <Card className="mt-8 p-6">
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
