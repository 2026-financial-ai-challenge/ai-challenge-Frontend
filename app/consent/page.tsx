import { BrandImage } from "@/components/brand/BrandImage";
import { ConsentForm } from "@/components/forms/ConsentForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "동의",
  description:
    "개인정보 수집·이용 및 불시 보이스피싱 훈련 전화 수신에 동의합니다.",
};

export default function ConsentPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      <BrandImage name="mascot" alt="" className="h-16 w-16" />
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">
        훈련 참여 동의
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-600">
        휴대전화번호 수집과 불시 보이스피싱 훈련 전화 수신에 대한 동의가 필요합니다.
        두 항목 모두 동의해야 다음 단계로 진행할 수 있습니다.
      </p>
      <div className="mt-8">
        <ConsentForm />
      </div>
    </div>
  );
}
