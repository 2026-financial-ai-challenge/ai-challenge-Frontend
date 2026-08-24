import { BrandImage } from "@/components/brand/BrandImage";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "전화번호 등록",
  description: "훈련 전화를 받을 휴대전화번호를 등록합니다.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      <BrandImage name="phone" alt="" className="h-16 w-16" />
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">
        휴대전화번호 등록
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-600">
        이 폰에서 인증코드를 보내 번호를 확인한 뒤에만 등록됩니다. 불시 보이스피싱 훈련의 발신 시점은 따로 안내하지
        않습니다.
      </p>
      <Card className="mt-8 p-6">
        <RegisterForm />
      </Card>
    </div>
  );
}
