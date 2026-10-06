import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  WEB_TRAINING_DEBRIEF,
  WEB_TRAINING_WARNING_TITLE,
  type WebTrainingAction,
} from "@/lib/web-training";
import { cn } from "@/lib/utils";

const checks = [
  "기관은 문자 링크로 사건 조회·본인인증·계좌 입력을 요구하지 않아요.",
  "링크로 받은 앱이나 프로그램은 설치하지 않아요.",
  "의심되면 직접 검색한 대표번호로 확인하고, 118이나 112에 신고해요.",
];

export function WebTrainingDebrief({ action }: { action: WebTrainingAction }) {
  const copy = WEB_TRAINING_DEBRIEF[action];
  const isDanger = copy.tone === "danger";

  return (
    <main className="min-h-screen bg-background-muted px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Badge variant={isDanger ? "danger" : "success"}>
          {isDanger ? "위험 행동" : "방어 행동"}
        </Badge>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {isDanger ? WEB_TRAINING_WARNING_TITLE : "이것은 훈련이었습니다"}
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          방금 본 화면은 안심피싱이 만든 스미싱 훈련용 가상 사이트입니다.
          가온형사사법지원포털은 실제로 존재하지 않는 기관이며, 어떤 행동을
          했는지만 훈련 결과에 기록됩니다.
        </p>

        <Card
          className={cn(
            "mt-8 p-6 sm:p-8",
            isDanger
              ? "border-danger/40 bg-danger-light/40"
              : "border-success/40 bg-success-light/40",
          )}
        >
          <p
            className={cn(
              "text-xs font-semibold",
              isDanger ? "text-danger" : "text-success",
            )}
          >
            방금 한 행동
          </p>
          <h2 className="mt-2 text-lg font-bold leading-7 text-text-primary">
            {copy.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-text-primary">{copy.why}</p>
        </Card>

        <Card className="mt-4 border-primary/30 bg-primary-light/40 p-6 sm:p-8">
          <p className="text-xs font-semibold text-primary">실제 상황이라면</p>
          <p className="mt-2 text-base font-semibold leading-7 text-text-primary">
            {copy.next}
          </p>
        </Card>

        <section className="mt-10">
          <h2 className="text-base font-bold text-text-primary">기억할 세 가지</h2>
          <ul className="mt-4 space-y-3">
            {checks.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-base leading-7 text-text-primary"
              >
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-sm leading-6 text-text-secondary">
          훈련 결과는 안심피싱 리포트에서 전화 훈련 점수와 함께 확인할 수
          있습니다. 이 창은 닫아도 됩니다.
        </p>
      </div>
    </main>
  );
}
