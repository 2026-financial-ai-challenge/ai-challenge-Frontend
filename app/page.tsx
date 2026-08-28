import { RedirectIfAuthenticated } from "@/components/landing/RedirectIfAuthenticated";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps: {
  n: string;
  title: string;
  body: string;
}[] = [
  {
    n: "1",
    title: "훈련 전화",
    body: "‘훈련 시작’을 누르면 안내된 보이스피싱 전화가 휴대전화로 걸려옵니다. 받아서 평소처럼 대응하면 됩니다.",
  },
  {
    n: "2",
    title: "1차 리포트",
    body: "통화가 끝나면 대응 점수와 행동 분석이 담긴 1차 리포트가 나옵니다.",
  },
  {
    n: "3",
    title: "불시 전화",
    body: "얼마 뒤, 시점을 알리지 않고 실전 훈련 전화가 한 차례 더 걸려옵니다.",
  },
  {
    n: "4",
    title: "최종 리포트",
    body: "두 통화를 비교해, 미리 아는 상황과 갑작스러운 상황의 대응력 차이를 확인합니다.",
  },
];

export default function HomePage() {
  return (
    <>
      <RedirectIfAuthenticated />

      <section className="border-b border-primary-light bg-primary-light">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="min-w-0">
            <Badge className="bg-white text-text-primary">
              AI 보이스피싱 실전 대응훈련
            </Badge>
            <h1 className="mt-4 max-w-md text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
              전화가 오면, 이미
              <br />
              연습해 본 상황이 됩니다
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-primary">
              실제 번호로 훈련 전화가 걸려옵니다. 받아서 대응하고, 통화가 끝나면
              어떻게 반응했는지 코칭 리포트를 받습니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">회원가입하고 시작하기</Link>
              </Button>
              <Button asChild variant="link" className="h-auto px-0 text-sm">
                <Link href="/login">이미 계정이 있어요 →</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xs">
            <div className="rounded-lg bg-white p-6 shadow-card">
              <Badge className="bg-primary-light text-primary">훈련 전화</Badge>
              <p className="mt-4 text-xl font-semibold tracking-tight text-text-primary">
                010 ●●●● ●●●●
              </p>
              <p className="mt-1 text-sm text-text-secondary">수신 중…</p>
              <div
                className="mt-6 flex items-center justify-between"
                aria-hidden
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border text-sm text-text-secondary">
                  거절
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm text-white">
                  받기
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-text-secondary">
              실제로는 휴대전화로 전화가 걸려옵니다.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-xl font-bold text-text-primary">진행 순서</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-primary">
          안내된 훈련 전화 한 번, 예고 없는 실전 전화 한 번. 두 통화의 결과를
          비교해 실제 대응력을 확인합니다.
        </p>

        <ol className="relative mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute inset-x-0 top-5 mx-auto hidden h-px w-3/4 bg-border lg:block"
          />
          {steps.map((step) => (
            <li key={step.n} className="relative lg:text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary lg:mx-auto">
                {step.n}
              </div>
              <h3 className="mt-4 text-base font-bold text-text-primary">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-primary lg:mx-auto lg:max-w-xs">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
