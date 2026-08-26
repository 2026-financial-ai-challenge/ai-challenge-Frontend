import { SignupForm } from "@/components/forms/SignupForm";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "휴대전화번호를 인증한 뒤 비밀번호로 가입합니다.",
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        회원가입
      </h1>
      <p className="mt-3 text-sm leading-6 text-text-primary">
        휴대전화번호를 인증한 뒤 비밀번호를 정하면 계정이 만들어집니다. 훈련
        시작 전에 동의 절차가 한 번 있습니다.
      </p>
      <Card className="mt-8 p-6">
        <SignupForm />
      </Card>
    </div>
  );
}
