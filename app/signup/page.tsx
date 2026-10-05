import { SignupForm } from "@/components/forms/SignupForm";
import { AuthPageShell } from "@/components/layout/AuthPageShell";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description: "휴대전화번호를 인증한 뒤 비밀번호로 가입합니다.",
};

export default function SignupPage() {
  return (
    <AuthPageShell
      title="회원가입"
      description="휴대전화번호를 인증한 뒤 비밀번호와 필수 동의를 마치면 계정이 만들어집니다."
    >
      <Card className="p-6">
        <SignupForm />
      </Card>
    </AuthPageShell>
  );
}
