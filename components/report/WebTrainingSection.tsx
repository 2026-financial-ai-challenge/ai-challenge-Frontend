import { BehaviorPanel } from "@/components/report/BehaviorPanel";
import { ScoreGauge } from "@/components/report/ScoreGauge";
import type { WebTrainingReport } from "@/lib/types";
import { WEB_TRAINING_EVENT_LABELS } from "@/lib/web-training";

export function WebTrainingSection({
  phoneScore,
  report,
}: {
  phoneScore: number;
  report: WebTrainingReport;
}) {
  const events = report.events.filter(
    (event) => event in WEB_TRAINING_EVENT_LABELS,
  );

  return (
    <section className="border-t border-border px-5 py-9 sm:px-9 sm:py-11 lg:px-11">
      <h2 className="text-xl font-bold tracking-tight text-text-primary">
        전화와 문자 링크, 두 경로의 대응을 비교했어요
      </h2>
      <p className="mt-2 max-w-[58ch] text-base leading-7 text-text-secondary">
        같은 수법이 전화로 올 때와 문자 링크로 올 때 대응이 어떻게 달랐는지 나란히 둡니다.
      </p>

      <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2">
        <div className="bg-background-muted px-5 py-6 sm:px-6">
          <ScoreGauge score={phoneScore} label="전화 훈련 점수" />
        </div>
        <div className="bg-background-muted px-5 py-6 sm:px-6">
          <ScoreGauge score={report.score} label="링크 훈련 점수" />
        </div>
      </div>

      {events.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-base font-bold text-text-primary">링크에서 한 순서</h3>
          <ol className="mt-4 space-y-2.5">
            {events.map((event, index) => (
              <li key={event} className="flex gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold tabular-nums text-primary"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <span className="text-base leading-7 text-text-primary">
                  {WEB_TRAINING_EVENT_LABELS[event]}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="mt-8 grid items-start gap-5 lg:grid-cols-2">
        <BehaviorPanel
          title="링크에서 조심해야 할 행동"
          items={report.riskBehaviors}
          tone="danger"
          emptyText="위험한 행동이 없었어요."
        />
        <BehaviorPanel
          title="링크에서 잘 막아낸 행동"
          items={report.defenseBehaviors}
          tone="success"
          emptyText="막아낸 행동이 없었어요."
        />
      </div>
    </section>
  );
}
