import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "안심피싱 보이스피싱 대응훈련 서비스 이용약관입니다.",
};

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. 목적",
    body: [
      "이 약관은 안심피싱(이하 '서비스')이 제공하는 보이스피싱 대응훈련 서비스의 이용 조건과 절차, 이용자와 서비스의 권리·의무를 정합니다.",
    ],
  },
  {
    title: "2. 서비스의 성격",
    body: [
      "서비스는 실제 보이스피싱 상황을 재현한 모의 전화 훈련을 제공합니다. 서비스가 발신하는 훈련 전화와 안내 문자는 실제 수사기관·금융기관의 업무와 무관하며, 금전 이체나 개인정보 입력을 실제로 요구하지 않습니다.",
      "불시 훈련은 사전 예고 없이 발신될 수 있으며, 발신 시점과 시간대는 훈련 효과를 위해 공개하지 않습니다.",
    ],
  },
  {
    title: "3. 이용자의 의무",
    body: [
      "이용자는 본인의 휴대전화번호로만 가입할 수 있으며, 인증 절차에서 타인의 번호를 도용해서는 안 됩니다.",
      "이용자는 비밀번호를 안전하게 관리할 책임이 있으며, 계정을 통해 이루어진 행위에 대한 책임을 집니다.",
    ],
  },
  {
    title: "4. 서비스의 변경 및 중단",
    body: [
      "서비스는 운영상 필요에 따라 훈련 내용, 리포트 항목, 발신 절차를 변경할 수 있습니다.",
      "시스템 점검, 통신 장애 등 불가피한 사유로 서비스 제공이 일시 중단될 수 있습니다.",
    ],
  },
  {
    title: "5. 면책",
    body: [
      "서비스는 실제 보이스피싱 수법을 학습용으로 재현한 것으로, 실전 상황에서의 대응 결과를 보장하지 않습니다.",
      "이용자가 인증번호·비밀번호 등 계정 정보를 스스로 노출하여 발생한 손해에 대해서는 서비스가 책임지지 않습니다.",
    ],
  },
  {
    title: "6. 약관의 변경",
    body: [
      "약관이 변경되는 경우 변경 사항을 이 페이지에 반영하고, 시행일 전에 서비스 화면을 통해 안내합니다.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        이용약관
      </h1>
      <p className="mt-3 text-base leading-6 text-text-secondary">
        시행일: 2026년 9월 26일
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-bold text-text-primary">
              {section.title}
            </h2>
            <div className="mt-2 space-y-2">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-text-primary"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
