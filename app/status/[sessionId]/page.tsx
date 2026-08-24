import type { Metadata } from "next";
import { SessionStatusView } from "@/components/status/SessionStatusView";

export const metadata: Metadata = {
  title: "통화 상태",
  description: "보이스피싱 시뮬레이션 전화의 발신 상태를 확인합니다.",
};

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.14em] text-brand-500 uppercase">
        Training status
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">
        훈련 전화 상태
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-600">
        서버가 알려 주는 상태만 표시합니다. 통화는 휴대전화에서 이루어집니다.
      </p>
      <div className="mt-8">
        <SessionStatusView />
      </div>
    </div>
  );
}
