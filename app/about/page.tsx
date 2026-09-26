import { StartTrainingAction } from "@/components/landing/StartTrainingButton";
import { ScoreGauge } from "@/components/report/ScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스소개",
  description:
    "안심피싱이 실제 전화로 보이스피싱 대응훈련을 진행하는 이유와 방식을 소개합니다.",
};

const moments = [
  {
    quote: "사례 영상은 몇 번이나 봤어요.",
    detail:
      "그런데 막상 검찰을 사칭한 전화를 받으니 머릿속이 하얘지더라고요.",
  },
  {
    quote: "이상하다는 생각은 들었어요.",
    detail: "그런데 상대가 자꾸 다급하게 재촉하니까, 일단 시키는 대로 하게 됐습니다.",
  },
  {
    quote: "나는 절대 안 속을 거라 생각했는데",
    detail: "정신을 차려보니 통화가 이미 5분 넘게 이어지고 있었습니다.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-5 py-20 sm:py-28">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl">
          교육은 다 받았는데, 왜 막상 전화가 오면 안 될까요?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-text-primary">
          보이스피싱 수법을 아는 것과, 벨이 울리는 순간 침착하게 반응하는 것은
          다른 능력입니다. 안심피싱은 그 차이를 실제 전화로 확인합니다.
        </p>
      </section>

      <section className="border-y border-border bg-background-muted">
        <div className="mx-auto max-w-3xl space-y-6 px-5 py-16 sm:py-20">
          {moments.map((moment) => (
            <Card key={moment.quote} className="p-6 sm:p-8">
              <p className="text-lg font-semibold leading-snug text-text-primary">
                &ldquo;{moment.quote}&rdquo;
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                {moment.detail}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
        <h2 className="text-2xl font-bold leading-snug tracking-tight text-text-primary sm:text-3xl">
          그래서 안심피싱은 말이 아니라, 진짜 전화로 훈련합니다.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          설명을 듣는 것과 실제로 반응하는 것은 다릅니다. 안심피싱은 그 순간을
          안전하게 재현하고, 어떻게 반응했는지 구체적으로 알려드립니다.
        </p>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            같은 번호로, 두 번 걸려옵니다
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            마음의 준비가 된 상태와, 갑작스러운 상태의 대응은 다릅니다. 두
            통화를 비교해야 진짜 실력을 알 수 있습니다.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <Badge>1차 훈련</Badge>
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                미리 알고 받는 전화
              </h3>
              <p className="mt-2 text-base leading-relaxed text-text-primary">
                훈련 시작을 누른 직후 걸려오는 전화입니다. 마음의 준비가 된
                상태에서 어떻게 대응하는지 먼저 확인합니다.
              </p>
            </Card>
            <Card className="p-6 sm:p-8">
              <Badge variant="danger">2차 훈련</Badge>
              <h3 className="mt-4 text-lg font-bold text-text-primary">
                예고 없이 받는 전화
              </h3>
              <p className="mt-2 text-base leading-relaxed text-text-primary">
                며칠 뒤, 아무 알림 없이 걸려오는 전화입니다. 실제 위기 상황과
                가장 비슷한 순간을 만듭니다.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background-muted">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            통화가 끝나면, 바로 리포트로 확인합니다
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-text-secondary">
            점수 하나로 끝나지 않습니다. 무엇을 잘했고, 무엇이 위험했는지, 다음
            통화에서는 어떻게 답하면 좋을지까지 알려드립니다.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <Card className="p-6 sm:p-8">
              <p className="text-xs font-semibold text-text-secondary">
                예시 화면
              </p>
              <div className="mt-4">
                <ScoreGauge score={72} />
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-danger/40 bg-danger-light/40 p-5">
                <Badge variant="danger">위험 신호</Badge>
                <p className="mt-3 text-sm font-semibold text-text-primary">
                  이름을 먼저 말함
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-primary">
                  &ldquo;네, 제가 OOO 맞는데요.&rdquo;
                </p>
              </Card>
              <Card className="border-success/40 bg-success-light/40 p-5">
                <Badge variant="success">방어 행동</Badge>
                <p className="mt-3 text-sm font-semibold text-text-primary">
                  공식 채널 재확인 시도
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-primary">
                  &ldquo;제가 대표번호로 다시 걸어보겠습니다.&rdquo;
                </p>
              </Card>
              <Card className="p-5 sm:col-span-2">
                <p className="text-xs font-semibold text-primary">
                  다음 통화를 위한 코칭 (예시)
                </p>
                <p className="mt-2 text-base font-semibold leading-relaxed text-text-primary">
                  소속과 이름을 먼저 물어보고, 공식 대표번호로 직접 다시 거는
                  습관을 들여보세요.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            안전하게 설계했습니다
          </h2>
          <ul className="mt-6 space-y-3">
            <li className="text-base leading-relaxed text-text-primary">
              수집하는 개인정보는 휴대전화번호 하나뿐입니다.
            </li>
            <li className="text-base leading-relaxed text-text-primary">
              훈련 전화와 문자는 실제 수사기관·금융기관의 업무와 무관하며,
              금전 이체나 개인정보 입력을 실제로 요구하지 않습니다.
            </li>
            <li className="text-base leading-relaxed text-text-primary">
              수집한 번호는 훈련 종료 후 30일이 지나면 파기합니다. 자세한
              내용은{" "}
              <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
                개인정보처리방침
              </Link>
              에서 확인할 수 있습니다.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-primary-light/50">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 py-20 text-center sm:py-24">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            지금, 실전처럼 확인해보세요
          </h2>
          <StartTrainingAction size="lg" label="훈련 시작하기" />
          <Link
            href="/login"
            className="text-sm font-medium text-primary hover:underline"
          >
            이미 계정이 있어요 →
          </Link>
        </div>
      </section>
    </div>
  );
}
