import { ScoreGauge } from "@/components/report/ScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ReportBehavior, WebTrainingReport } from "@/lib/types";
import { WEB_TRAINING_EVENT_LABELS } from "@/lib/web-training";

function BehaviorList({
  title,
  items,
  tone,
}: {
  title: string;
  items: ReportBehavior[];
  tone: "danger" | "success";
}) {
  const isDanger = tone === "danger";

  return (
    <div>
      <div className="flex items-center gap-2">
        <Badge variant={tone}>{isDanger ? "위험 신호" : "방어 행동"}</Badge>
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
      </div>
      <div className="mt-3 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Card
              key={`${item.label}-${index}`}
              className={`p-4 sm:p-5 ${isDanger ? "border-danger/40 bg-danger-light/40" : "border-success/40 bg-success-light/40"}`}
            >
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              {item.evidence ? (
                <p className="mt-2 text-base leading-6 text-text-secondary">{item.evidence}</p>
              ) : null}
            </Card>
          ))
        ) : (
          <Card className="p-4">
            <p className="text-sm text-text-secondary">감지된 항목이 없습니다.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

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
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
        <h2 className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
          전화와 문자 링크, 두 경로의 대응을 비교했어요
        </h2>
        <span className="text-xs text-text-secondary">웹 링크 훈련</span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:gap-7">
        <Card className="p-5 sm:p-7 lg:p-8">
          <ScoreGauge score={phoneScore} label="전화 훈련 점수" />
        </Card>
        <Card className="p-5 sm:p-7 lg:p-8">
          <ScoreGauge score={report.score} label="링크 훈련 점수" />
        </Card>
      </div>

      {events.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-bold text-text-primary">링크에서 한 행동</h3>
          <ol className="mt-3 flex flex-wrap gap-2">
            {events.map((event, index) => (
              <li
                key={event}
                className="rounded border border-border bg-card px-3 py-1.5 text-sm text-text-primary"
              >
                <span className="mr-1.5 text-xs tabular-nums text-text-secondary">
                  {index + 1}
                </span>
                {WEB_TRAINING_EVENT_LABELS[event]}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <BehaviorList
          title="링크에서 조심해야 할 행동"
          items={report.riskBehaviors}
          tone="danger"
        />
        <BehaviorList
          title="링크에서 잘 막아낸 행동"
          items={report.defenseBehaviors}
          tone="success"
        />
      </div>
    </section>
  );
}
