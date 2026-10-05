import { BrandImage } from "@/components/brand/BrandImage";
import { IntroReplayButton } from "@/components/landing/IntroReplayButton";
import { IntroSequence } from "@/components/landing/IntroSequence";
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

      <IntroSequence />

      <section className="border-b border-primary-light bg-primary-light">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="min-w-0">
            <Badge className="bg-white text-text-primary">
              AI 보이스피싱 실전 대응훈련
            </Badge>
            <h1 className="mt-4 max-w-md text-4xl font-bold leading-[1.3] tracking-tight text-text-primary sm:text-5xl sm:leading-[1.25]">
              전화가 오면, 이미
              <br />
              연습해 본 상황이 됩니다
            </h1>
            <p className="mt-4 max-w-md break-keep text-base leading-relaxed text-text-primary">
              실제 번호로 훈련 전화가 걸려옵니다. 받아서 대응하고, 통화가 끝나면
              어떻게 반응했는지 코칭 리포트를 받습니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">회원가입하고 시작하기</Link>
              </Button>
              <Button asChild variant="link" className="h-auto px-0 text-sm">
                <Link href="/login">이미 계정이 있어요</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <BrandImage
              name="hero"
              alt="보이스피싱 훈련 전화가 걸려온 휴대전화 화면"
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-xl font-bold tracking-tight text-text-primary">
          진행 순서
        </h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-text-primary">
          안내된 훈련 전화 한 번, 예고 없는 실전 전화 한 번. 두 통화의 결과를
          비교해 실제 대응력을 확인합니다.
        </p>

        <ol className="mt-10">
          {steps.map((step, index) => (
            <li key={step.n} className="relative flex gap-5 pb-10 last:pb-0">
              {index < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-[1.1rem] top-9 h-[calc(100%-2.25rem)] w-px bg-border"
                />
              ) : null}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary text-sm font-bold tabular-nums text-primary">
                {step.n}
              </div>
              <div className="pt-1">
                <h3 className="text-base font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-lg text-base leading-relaxed text-text-primary">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <IntroReplayButton />
      </section>
    </>
  );
}
