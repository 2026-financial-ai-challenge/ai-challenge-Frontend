import { StartTrainingAction } from "@/components/landing/StartTrainingButton";
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

  // 코칭 문장의 근거가 되는 "그 순간". 데이터에 코칭↔행동 연결 필드가 없어
  // 가장 비중 있는(첫 번째) 위험 행동을 우선하고, 위험 행동이 없으면 방어 행동으로 대신한다.
  const anchorRisk = body.riskBehaviors[0] ?? null;
  const anchor = anchorRisk ?? body.defenseBehaviors[0] ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={isDraft ? "default" : "secondary"}>
          {isDraft ? "1차 (실시간 받아쓰기)" : "최종"}
        </Badge>
      </div>
      {isDraft ? (
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          실시간 받아쓰기 기반이라 일부가 실제 대화와 다를 수 있습니다.
        </p>
      ) : null}

      {/* 1. 3초 안에 얻어야 할 것: 다음 통화에서 쓸 조언 한 문장 */}
      <div className="mt-4 rounded-bubble bg-primary-light/70 px-5 py-7 sm:px-7 sm:py-8">
        <p className="text-xs font-semibold tracking-wide text-primary">다음 통화에서는</p>
        <p className="mt-2 text-2xl font-bold leading-snug tracking-tight text-balance text-text-primary sm:text-[1.75rem]">
          {body.coaching}
        </p>

        {/* 2. 그 조언의 근거가 되는 통화 속 순간 */}
        {anchor ? (
          <div className="mt-5 border-l-2 border-primary/30 pl-4">
            <p className="text-xs font-medium text-text-secondary">
              {anchorRisk ? "이 순간 때문이에요" : "이 순간 덕분이에요"}
            </p>
            <p className="mt-1.5 inline-block rounded-bubble rounded-tl-md bg-white px-4 py-2.5 text-sm leading-6 text-text-primary shadow-sm">
              “{anchor.evidence}”
            </p>
          </div>
        ) : null}
      </div>

      {/* 3. 잘 대응한 부분 · 점수 · 체크리스트 — 보조 지표로 조용하게 */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ScoreGauge score={body.score} variant="compact" />
        {body.defenseBehaviors.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-text-secondary">잘한 점</span>
            {body.defenseBehaviors.map((item, index) => (
              <Badge key={`${item.label}-${index}`} variant="success">
                {item.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <details className="group mt-4">
        <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-text-secondary [&::-webkit-details-marker]:hidden">
          체크리스트·전체 대화 보기
          <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true">
            <path
              d="M5 7.5 10 12.5 15 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>

        <div className="mt-4 space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-text-primary">이번 통화 요약</h3>
            <p className="mt-2 text-sm leading-6 text-text-primary">{body.summary}</p>
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

          <BehaviorSection title="위험 행동" tone="danger" items={body.riskBehaviors} />
          <BehaviorSection title="방어 행동" tone="success" items={body.defenseBehaviors} />

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
                              ? "rounded-bubble rounded-br-md bg-primary px-4 py-2.5 text-sm leading-6 text-white shadow-sm"
                              : "rounded-bubble rounded-bl-md border border-primary-light bg-white px-4 py-2.5 text-sm leading-6 text-text-primary shadow-sm"
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
      </details>

      {/* 액션: 다시 훈련받기 하나만 — 스크롤 중에도 항상 손닿는 곳에 */}
      <div className="sticky bottom-4 z-10 mt-8 bg-background-muted/90 pt-5 backdrop-blur-sm">
        <StartTrainingAction size="lg" label="다시 훈련받기" className="w-full" />
      </div>
    </div>
  );
}
