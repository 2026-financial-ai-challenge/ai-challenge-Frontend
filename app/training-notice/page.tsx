import { Card } from "@/components/ui/card";
import { PORTAL_NAME } from "@/lib/portal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "훈련용 페이지 안내",
  description: "안심피싱 스미싱 훈련에 쓰이는 가상 페이지 안내입니다.",
  robots: { index: false, follow: false },
};

const facts = [
  `${PORTAL_NAME}은 훈련을 위해 만든 가상 기관이며, 실제로 존재하지 않습니다.`,
  "훈련 페이지는 사전에 동의한 훈련자에게 문자로 보낸 1회용 링크로만 열립니다.",
  "훈련 페이지에 입력한 값은 저장하지 않고, 어떤 행동을 했는지만 결과에 기록합니다.",
];

export default function TrainingNoticePage() {
  return (
    <main
      id="main"
      className="flex min-h-screen items-center justify-center bg-background-muted px-5 py-16"
    >
      <div className="mx-auto w-full max-w-xl">
        <p className="text-xs font-semibold text-primary">안심피싱 훈련용 페이지</p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          훈련 링크로만 열리는 페이지입니다
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          이 주소는 안심피싱이 보이스피싱·스미싱 대응 훈련에 쓰는 가상
          사이트입니다. 유효한 훈련 링크 없이는 훈련 화면이 열리지 않습니다.
        </p>

        <Card className="mt-8 p-6 sm:p-8">
          <h2 className="text-base font-bold text-text-primary">확인해 주세요</h2>
          <ul className="mt-4 space-y-3">
            {facts.map((fact) => (
              <li
                key={fact}
                className="flex gap-3 text-base leading-7 text-text-primary"
              >
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                {fact}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-4 border-primary/30 bg-primary-light/40 p-6 sm:p-8">
          <p className="text-xs font-semibold text-primary">
            실제 피싱이 의심된다면
          </p>
          <p className="mt-2 text-base font-semibold leading-7 text-text-primary">
            문자 속 링크는 누르지 말고, 기관 대표번호를 직접 검색해 확인하세요.
            이미 피해가 생겼다면 112, 스미싱 문자는 118로 신고하세요.
          </p>
        </Card>
      </div>
    </main>
  );
}
