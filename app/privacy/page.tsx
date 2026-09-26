import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "안심피싱이 수집하는 개인정보 항목과 처리 방침을 안내합니다.",
};

const sections: { title: string; body: string[] | { term: string; desc: string }[] }[] = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: [
      { term: "수집 항목", desc: "휴대전화번호" },
      {
        term: "수집 방법",
        desc: "회원가입 시 본인이 입력하고, 문자로 받은 인증번호로 확인합니다.",
      },
    ],
  },
  {
    title: "2. 수집 및 이용 목적",
    body: [
      "본인 확인 및 계정 생성",
      "보이스피싱 대응훈련 전화 발신",
      "훈련 결과(리포트) 안내",
    ],
  },
  {
    title: "3. 보유 및 이용 기간",
    body: [
      "훈련 종료 후 30일간 보관하며, 기간이 지나면 지체 없이 파기합니다.",
      "이용자가 동의를 철회하거나 탈퇴를 요청하는 경우에도 동일하게 파기합니다.",
    ],
  },
  {
    title: "4. 브라우저에 저장하는 정보",
    body: [
      "로그인 상태를 유지하기 위해 접속 토큰과 진행 중인 훈련 회차 정보를 이용자 브라우저(로컬 스토리지)에 저장합니다. 이 정보는 로그아웃하면 삭제됩니다.",
    ],
  },
  {
    title: "5. 제3자 제공",
    body: [
      "수집한 개인정보는 법령에 특별한 규정이 있는 경우를 제외하고 제3자에게 제공하지 않습니다.",
    ],
  },
  {
    title: "6. 이용자의 권리",
    body: [
      "이용자는 언제든지 자신의 개인정보 수집·이용 동의를 철회할 수 있으며, 동의를 철회하면 훈련 서비스 이용이 제한될 수 있습니다.",
      "이용자는 관련 법령에 따라 자신의 휴대전화번호에 대한 열람, 정정, 삭제를 요청할 권리가 있습니다.",
    ],
  },
  {
    title: "7. 방침의 변경",
    body: [
      "이 방침이 변경되는 경우 변경 사항을 이 페이지에 반영하고, 시행일 전에 서비스 화면을 통해 안내합니다.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        개인정보처리방침
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
            {typeof section.body[0] === "string" ? (
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {(section.body as string[]).map((item) => (
                  <li
                    key={item}
                    className="text-base leading-relaxed text-text-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <dl className="mt-3 grid grid-cols-[6rem_1fr] gap-x-4 gap-y-2 border-y border-border py-4 text-base">
                {(section.body as { term: string; desc: string }[]).map(
                  (item) => (
                    <div key={item.term} className="contents">
                      <dt className="text-text-secondary">{item.term}</dt>
                      <dd className="text-text-primary">{item.desc}</dd>
                    </div>
                  ),
                )}
              </dl>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
