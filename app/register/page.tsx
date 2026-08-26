import { BrandImage } from "@/components/brand/BrandImage";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "휴대전화번호를 인증하고 회원가입합니다.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      <BrandImage name="phone" alt="" className="h-16 w-16" />
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">
        회원가입
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-600">
        휴대전화번호 인증을 완료한 뒤 로그인에 사용할 비밀번호를 설정합니다.
      </p>
      <Card className="mt-8 p-6">
        <RegisterForm />
      </Card>
    </div>
  );
}
