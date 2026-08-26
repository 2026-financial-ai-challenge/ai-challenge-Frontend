import { ScoreGauge } from "@/components/report/ScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CallReport, ReportBehavior, ReportTurn } from "@/lib/types";

type TrainingReportProps = {
  status: "draft" | "final";
  body: CallReport;
  turns: ReportTurn[];
};

const flags: { key: keyof Pick<CallReport, "suspected" | "gaveName" | "triedHangup">; label: string }[] = [
  { key: "suspected", label: "의심했는지" },
  { key: "gaveName", label: "성함을 댔는지" },
  { key: "triedHangup", label: "끊으려 했는지" },
];

function BehaviorSection({
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
    <Card className="overflow-hidden">
      <div
        className={`flex items-center gap-2 border-b px-4 py-3 ${
          isDanger
            ? "border-danger/40 bg-danger-light"
            : "border-success/40 bg-success-light"
        }`}
      >
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        <Badge variant={isDanger ? "danger" : "success"}>
          {isDanger ? "위험" : "방어"}
        </Badge>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-3 text-sm text-text-secondary">감지된 항목이 없습니다.</p>
      ) : (
        <ul
          className={`divide-y ${isDanger ? "divide-danger/20" : "divide-success/20"}`}
        >
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className={`border-l-4 px-4 py-3 ${
                isDanger ? "border-danger bg-danger-light/40" : "border-success bg-success-light/40"
              }`}
            >
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              {item.evidence ? (
                <p className="mt-1 text-sm leading-5 text-text-primary">
                  “{item.evidence}”
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function TrainingReport({ status, body, turns }: TrainingReportProps) {
  const isDraft = status === "draft";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={isDraft ? "default" : "secondary"}>
          {isDraft ? "1차 (실시간 받아쓰기)" : "최종"}
        </Badge>
      </div>
      {isDraft ? (
        <p className="text-sm leading-6 text-text-secondary">
          실시간 받아쓰기 기반이라 일부가 실제 대화와 다를 수 있습니다.
        </p>
      ) : null}

      <Card className="p-5">
        <ScoreGauge score={body.score} />
        <p className="mx-auto mt-4 max-w-md text-center text-xs leading-5 text-text-secondary">
          기본 60점에서 감지된 방어 행동은 더하고, 위험 행동은 차감해 계산한 점수입니다.
        </p>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary">이번 통화 요약</h3>
        <p className="mt-2 text-sm leading-6 text-text-primary">{body.summary}</p>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary">다음에 이렇게 하세요</h3>
        <p className="mt-2 text-sm leading-6 text-text-primary">{body.coaching}</p>
      </Card>

      <Card className="p-5">
        <ul className="grid gap-3 sm:grid-cols-3">
          {flags.map((flag) => (
            <li key={flag.key}>
              <p className="text-xs text-text-secondary">{flag.label}</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                {body[flag.key] ? "예" : "아니오"}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <BehaviorSection
        title="위험 행동"
        tone="danger"
        items={body.riskBehaviors}
      />
      <BehaviorSection
        title="방어 행동"
        tone="success"
        items={body.defenseBehaviors}
      />

      {turns.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-primary-light px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">대화 기록</h3>
              <p className="mt-0.5 text-xs text-text-secondary">
                훈련 통화에서 오간 대화입니다.
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden />
              통화 종료
            </span>
          </div>
          <ul className="h-[26rem] space-y-4 overflow-y-auto overscroll-contain bg-primary-light/60 px-4 py-5 sm:h-[30rem] sm:px-5">
            {turns.map((turn, index) => {
              const isUser = turn.role === "user";

              return (
                <li
                  key={`${turn.role}-${index}`}
                  className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[82%] flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <p
                      className={`mb-1 px-1 text-[11px] font-medium text-text-secondary ${isUser ? "text-right" : "text-left"}`}
                    >
                      {isUser ? "나" : "훈련 상대"}
                    </p>
                    <p
                      className={
                        isUser
                          ? "rounded-[1.2rem] rounded-br-md bg-primary px-4 py-2.5 text-sm leading-6 text-white shadow-sm"
                          : "rounded-[1.2rem] rounded-bl-md border border-primary-light bg-white px-4 py-2.5 text-sm leading-6 text-text-primary shadow-sm"
                      }
                    >
                      {turn.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
