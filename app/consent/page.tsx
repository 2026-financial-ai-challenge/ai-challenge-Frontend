import { ConsentForm } from "@/components/forms/ConsentForm";
import { AuthPageShell } from "@/components/layout/AuthPageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "동의",
  description:
    "개인정보 수집·이용 및 불시 보이스피싱 훈련 전화 수신에 동의합니다.",
};

export default function ConsentPage() {
  return (
    <AuthPageShell
      title="훈련 참여 동의"
      description="가입할 때 개인정보 수집과 불시 훈련 전화 수신에 동의합니다. 이미 가입한 계정은 이 화면에서 한 번만 보완하면 됩니다."
    >
      <ConsentForm />
    </AuthPageShell>
  );
}
