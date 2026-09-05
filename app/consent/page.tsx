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
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        훈련 참여 동의
      </h1>
      <p className="mt-3 text-sm leading-6 text-text-primary">
        가입한 번호로 훈련 전화를 걸기 위해, 개인정보 수집과 불시 보이스피싱 훈련
        전화 수신에 대한 동의가 필요합니다. 처음 훈련할 때 한 번만 동의하면 됩니다.
      </p>
      <div className="mt-8">
        <ConsentForm />
      </div>
    </div>
  );
}
