import { StartTrainingAction } from "@/components/landing/StartTrainingButton";
import { ScoreGauge } from "@/components/report/ScoreGauge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CallReport, ReportBehavior, ReportTurn } from "@/lib/types";

type DraftTrainingReportProps = {
  status: "draft" | "unannounced" | "final";
  body: CallReport;
  turns: ReportTurn[];
};

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-3 text-xl font-bold tracking-tight text-text-primary">{title}</h2>
    </div>
  );
}

function ResponseIndicator({
  label,
  passed,
  positiveText,
  negativeText,
}: {
  label: string;
  passed: boolean;
  positiveText: string;
  negativeText: string;
}) {
  return (
    <div className="flex aspect-square w-full max-w-44 flex-col items-center justify-center justify-self-center rounded-full border-[10px] border-primary-light bg-card p-5 text-center shadow-card">
      <p className="text-xs leading-5 text-text-secondary">{label}</p>
      <p className="mt-2 text-base font-bold text-text-primary">
        {passed ? positiveText : negativeText}
      </p>
      <Badge className="mt-2" variant={passed ? "success" : "danger"}>
        {passed ? "잘했어요" : "보완 필요"}
      </Badge>
    </div>
  );
}

function BehaviorColumn({
  title,
  description,
  items,
  tone,
}: {
  title: string;
  description: string;
  items: ReportBehavior[];
  tone: "danger" | "success";
}) {
  const isDanger = tone === "danger";

  return (
    <div>
      <div className="flex items-center gap-2">
        <Badge variant={tone}>{isDanger ? "위험 신호" : "방어 행동"}</Badge>
        <h3 className="text-base font-bold text-text-primary">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Card
              key={`${item.label}-${index}`}
              className={`p-4 ${isDanger ? "border-danger/40 bg-danger-light/40" : "border-success/40 bg-success-light/40"}`}
            >
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              {item.evidence ? (
                <p className="mt-2 text-sm leading-6 text-text-primary">“{item.evidence}”</p>
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

const principles = [
  {
    title: "신원 확인",
    description: "상대의 소속과 용건을 먼저 확인해요.",
  },
  {
    title: "정보 보호",
    description: "이름과 개인정보는 확인 전까지 말하지 않아요.",
  },
  {
    title: "통화 종료",
    description: "조금이라도 의심되면 통화를 끝내고 공식 번호로 확인해요.",
  },
];

export function DraftTrainingReport({ status, body, turns }: DraftTrainingReportProps) {
  const isUnannounced = status === "unannounced";
  const isFinal = status === "final";
  const userTurns = turns.filter((turn) => turn.role === "user").slice(0, 4);
  const riskItems = body.riskBehaviors.slice(0, 3);

  return (
    <div className="space-y-14 sm:space-y-16">
      <section>
        <Badge variant={status === "draft" ? "default" : "secondary"}>
          {isFinal
            ? "최종 종합 리포트"
            : isUnannounced
              ? "불시 전화 리포트"
              : "1차 리포트"}
        </Badge>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {isFinal
            ? "두 번의 통화에서 보인 대응을 종합했어요"
            : isUnannounced
            ? "불시 전화에서 보인 대응을 분석했어요"
            : "첫 번째 통화에서 보인 대응을 분석했어요"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          실시간 받아쓰기를 기준으로 만든 결과라 실제 대화와 일부 다를 수 있습니다.
        </p>
      </section>

      <section>
        <SectionHeading eyebrow="통화 분석" title="통화 속 반응과 핵심 진단" />
        <div className="mt-6 grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1.15fr)]">
          <div className="grid gap-3 sm:grid-cols-2">
            {userTurns.length > 0 ? (
              userTurns.map((turn, index) => (
                <Card
                  key={`${turn.text}-${index}`}
                  className={`p-4 ${index % 2 === 1 ? "sm:translate-y-4" : ""}`}
                >
                  <p className="text-sm leading-6 text-text-primary">“{turn.text}”</p>
                </Card>
              ))
            ) : (
              <Card className="p-4 sm:col-span-2">
                <p className="text-sm text-text-secondary">확인할 수 있는 사용자 발화가 없습니다.</p>
              </Card>
            )}
          </div>

          <div className="hidden items-center lg:flex" aria-hidden="true">
            <span className="h-px flex-1 border-t border-dashed border-primary" />
            <span className="ml-1 text-primary">→</span>
          </div>

          <Card className="p-6 sm:p-8">
            <p className="text-xs font-semibold text-primary">핵심 진단</p>
            <p className="mt-3 text-lg font-bold leading-8 text-text-primary">{body.summary}</p>
            <div className="mt-5 border-l-2 border-primary/30 pl-4">
              <p className="text-xs text-text-secondary">다음 통화에서는</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-text-primary">
                {body.coaching}
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="대응 지표" title="세 가지 기준으로 대응을 살펴봤어요" />
        <div className="mt-6 grid items-center gap-6 md:grid-cols-[1.15fr_2fr]">
          <Card className="p-5 sm:p-6">
            <ScoreGauge score={body.score} />
          </Card>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResponseIndicator
              label="상황을 의심했나요?"
              passed={body.suspected}
              positiveText="의심했어요"
              negativeText="의심하지 못했어요"
            />
            <ResponseIndicator
              label="개인정보를 지켰나요?"
              passed={!body.gaveName}
              positiveText="이름을 지켰어요"
              negativeText="이름을 말했어요"
            />
            <ResponseIndicator
              label="통화를 끝내려 했나요?"
              passed={body.triedHangup}
              positiveText="종료를 시도했어요"
              negativeText="종료하지 못했어요"
            />
          </div>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="행동 분석" title="위험했던 순간과 잘 막아낸 순간" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <BehaviorColumn
            title="조심해야 할 반응"
            description="상대가 통화를 이어가거나 정보를 얻는 데 도움이 될 수 있는 행동이에요."
            items={body.riskBehaviors}
            tone="danger"
          />
          <BehaviorColumn
            title="계속 유지할 반응"
            description="피싱 상황에서 나를 보호하는 데 도움이 된 행동이에요."
            items={body.defenseBehaviors}
            tone="success"
          />
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="위험 신호 → 다음 대응" title="같은 상황이 오면 이렇게 바꿔보세요" />
        <div className="mt-6 space-y-4">
          {riskItems.length > 0 ? (
            riskItems.map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className="grid items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)]"
              >
                <Card className="p-5">
                  <p className="text-xs font-semibold text-danger">위험 신호</p>
                  <p className="mt-2 text-sm font-semibold text-text-primary">{item.label}</p>
                  {item.evidence ? (
                    <p className="mt-2 text-sm leading-6 text-text-secondary">“{item.evidence}”</p>
                  ) : null}
                </Card>
                <div className="hidden items-center justify-center text-primary sm:flex" aria-hidden="true">
                  →
                </div>
                <Card className="border-primary/30 bg-primary-light/40 p-5">
                  <p className="text-xs font-semibold text-primary">다음 대응</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-text-primary">
                    {body.coaching}
                  </p>
                </Card>
              </div>
            ))
          ) : (
            <Card className="border-success/40 bg-success-light/40 p-5">
              <p className="text-sm font-semibold text-text-primary">
                뚜렷한 위험 행동이 감지되지 않았어요. 지금의 방어 습관을 유지해 주세요.
              </p>
            </Card>
          )}
        </div>
      </section>

      <section>
        <Card className="overflow-hidden bg-primary-light/50">
          <div className="p-6 sm:p-8">
            <Badge>다음 통화 대응 원칙</Badge>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {principles.map((principle) => (
                <div key={principle.title}>
                  <h3 className="font-bold text-text-primary">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {turns.length > 0 ? (
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-bubble border border-primary-light bg-card px-5 py-4 text-sm font-semibold text-text-primary shadow-card [&::-webkit-details-marker]:hidden">
            전체 대화 기록 보기
            <span className="text-primary transition-transform group-open:rotate-180" aria-hidden="true">
              ↓
            </span>
          </summary>
          <Card className="mt-3 overflow-hidden">
            <ul className="h-[28rem] space-y-4 overflow-y-auto overscroll-contain bg-primary-light/60 px-4 py-5 sm:px-5">
              {turns.map((turn, index) => {
                const isUser = turn.role === "user";
                return (
                  <li
                    key={`${turn.role}-${index}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[82%] ${isUser ? "text-right" : "text-left"}`}>
                      <p className="mb-1 px-1 text-[11px] font-medium text-text-secondary">
                        {isUser ? "나" : "훈련 상대"}
                      </p>
                      <p
                        className={
                          isUser
                            ? "rounded-bubble rounded-br-md bg-primary px-4 py-2.5 text-left text-sm leading-6 text-white shadow-sm"
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
        </details>
      ) : null}

      <div className="sticky bottom-4 z-10 bg-background-muted/90 pt-2 backdrop-blur-sm">
        <StartTrainingAction size="lg" label="다시 훈련받기" className="w-full" />
      </div>
    </div>
  );
}
