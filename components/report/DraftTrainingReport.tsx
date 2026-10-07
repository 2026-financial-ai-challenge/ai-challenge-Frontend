import { StartTrainingAction } from "@/components/landing/StartTrainingAction";
import { BehaviorPanel } from "@/components/report/BehaviorPanel";
import { ScoreGauge, scoreZone } from "@/components/report/ScoreGauge";
import { WebTrainingSection } from "@/components/report/WebTrainingSection";
import {
  BEHAVIOR_ORIGIN_LABELS,
  annotateBehaviorOrigins,
  type AnnotatedBehavior,
} from "@/lib/report-behaviors";
import type { CallReport, ReportTurn, WebTrainingReport } from "@/lib/types";

type DraftTrainingReportProps = {
  status: "draft" | "unannounced" | "final";
  body: CallReport;
  turns: ReportTurn[];
  calls?: { announced: CallReport | null; unannounced: CallReport | null };
  webTraining?: WebTrainingReport | null;
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border px-5 py-9 sm:px-9 sm:py-11 lg:px-11">
      <h2 className="text-xl font-bold tracking-tight text-text-primary">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-[58ch] text-base leading-7 text-text-secondary">
          {description}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ResultMark({ passed }: { passed: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-5 w-5 shrink-0 ${passed ? "text-success" : "text-danger"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {passed ? (
        <path d="M2.5 8.5 6.3 12.3 13.5 3.8" />
      ) : (
        <>
          <path d="M8 2.6v7" />
          <path d="M8 12.8v.3" />
        </>
      )}
    </svg>
  );
}

function CriterionTile({
  question,
  passed,
  positiveText,
  negativeText,
}: {
  question: string;
  passed: boolean;
  positiveText: string;
  negativeText: string;
}) {
  return (
    <li
      className={`rounded-xl border p-5 ${
        passed ? "border-success/20 bg-success-light/60" : "border-danger/20 bg-danger-light/60"
      }`}
    >
      <div className="flex items-center gap-2">
        <ResultMark passed={passed} />
        <p
          className={`text-base font-bold leading-6 ${
            passed ? "text-success" : "text-danger"
          }`}
        >
          {passed ? positiveText : negativeText}
        </p>
      </div>
      <p className="mt-2.5 text-sm leading-6 text-text-secondary">{question}</p>
    </li>
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

const KIND_LABELS = {
  draft: "1차 전화 결과",
  unannounced: "불시 전화 결과",
  final: "최종 결과",
} as const;

export function DraftTrainingReport({
  status,
  body,
  turns,
  calls,
  webTraining,
}: DraftTrainingReportProps) {
  const isFinal = status === "final";
  const userTurns = turns.filter((turn) => turn.role === "user").slice(0, 4);
  const compared = isFinal ? calls : undefined;
  const riskBehaviors = annotateBehaviorOrigins(
    body.riskBehaviors,
    compared?.announced?.riskBehaviors,
    compared?.unannounced?.riskBehaviors,
  );
  const defenseBehaviors = annotateBehaviorOrigins(
    body.defenseBehaviors,
    compared?.announced?.defenseBehaviors,
    compared?.unannounced?.defenseBehaviors,
  );
  const zone = scoreZone(body.score);

  const quotable = (items: AnnotatedBehavior[]) =>
    items.find((item) => item.evidence && item.evidence.trim().length > 0);
  const keyMoment =
    zone.label === "양호"
      ? (quotable(defenseBehaviors) ?? quotable(riskBehaviors))
      : (quotable(riskBehaviors) ?? quotable(defenseBehaviors));
  const keyMomentIsDefense = keyMoment
    ? defenseBehaviors.includes(keyMoment)
    : false;

  const toPanelItems = (items: AnnotatedBehavior[]) =>
    items.map((item) => ({
      label: item.label,
      evidence: item.evidence,
      note: item.origin ? BEHAVIOR_ORIGIN_LABELS[item.origin] : null,
    }));

  return (
    <div>
      <article className="overflow-hidden break-keep rounded-2xl border border-border bg-card shadow-sheet">
        <div className={`h-1.5 ${zone.band}`} aria-hidden />

        <header className="bg-primary-deep px-5 py-8 sm:px-9 sm:py-10 lg:px-11 lg:py-12">
          <p className="text-base font-bold text-white">{KIND_LABELS[status]}</p>

          <div className="mt-8 grid gap-9 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-14">
            <ScoreGauge
              variant="hero"
              score={body.score}
              label={isFinal ? "종합 점수" : "대응 점수"}
            />

            <div className="lg:border-l lg:border-white/10 lg:pl-14">
              <p className="max-w-[46ch] text-[1.0625rem] leading-[1.85] text-white/85 sm:text-lg">
                {body.summary}
              </p>

              {keyMoment ? (
                <figure className="mt-7 border-l-2 border-white/20 pl-5">
                  <figcaption
                    className={`text-sm font-semibold ${
                      keyMomentIsDefense ? "text-success-bright" : "text-danger-bright"
                    }`}
                  >
                    {keyMomentIsDefense
                      ? "이 말이 통화를 지켰어요"
                      : "이 말이 가장 위험했어요"}
                  </figcaption>
                  <blockquote className="mt-1.5 max-w-[42ch] text-base leading-7 text-white">
                    “{keyMoment.evidence}”
                  </blockquote>
                </figure>
              ) : null}
            </div>
          </div>
        </header>

        <Section title="세 가지 기준으로 대응을 살펴봤어요">
          <ul className="grid gap-4 sm:grid-cols-3">
            <CriterionTile
              question="상황을 의심했나요?"
              passed={body.suspected}
              positiveText="의심했어요"
              negativeText="의심하지 못했어요"
            />
            <CriterionTile
              question="개인정보를 지켰나요?"
              passed={!body.gaveName}
              positiveText="이름을 지켰어요"
              negativeText="이름을 말했어요"
            />
            <CriterionTile
              question="통화를 끝내려 했나요?"
              passed={body.triedHangup}
              positiveText="종료를 시도했어요"
              negativeText="종료하지 못했어요"
            />
          </ul>
        </Section>

        {userTurns.length > 0 ? (
          <Section
            title="통화에서 실제로 한 말"
            description="받아쓰기에 남은 앞부분입니다. 분석을 빼고 말 그대로 옮겼습니다."
          >
            <ul className="grid gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2">
              {userTurns.map((turn, index) => (
                <li
                  key={`${turn.text}-${index}`}
                  className="bg-background-muted px-5 py-4 text-base leading-7 text-text-primary"
                >
                  “{turn.text}”
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {webTraining ? (
          <WebTrainingSection phoneScore={body.score} report={webTraining} />
        ) : null}

        <Section title="위험했던 순간과 잘 막아낸 순간">
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <BehaviorPanel
              title="조심해야 할 반응"
              description="상대가 통화를 이어가거나 정보를 얻는 데 도움이 될 수 있는 행동이에요."
              items={toPanelItems(riskBehaviors)}
              tone="danger"
              emptyText="위험한 반응이 없었어요. 지금처럼 하면 돼요."
            />
            <BehaviorPanel
              title="계속 유지할 반응"
              description="피싱 상황에서 나를 보호하는 데 도움이 된 행동이에요."
              items={toPanelItems(defenseBehaviors)}
              tone="success"
              emptyText="막아낸 반응이 없었어요. 아래 세 가지부터 연습해 보세요."
            />
          </div>
        </Section>

        <Section title="같은 상황이 오면 이렇게 바꿔보세요">
          <div className="rounded-xl bg-primary px-6 py-7 sm:px-8 sm:py-8">
            <p className="text-sm font-semibold text-white/55">다음 통화에서는</p>
            <p className="mt-2 max-w-[36ch] text-xl font-bold leading-8 text-white sm:text-2xl sm:leading-9">
              {body.coaching}
            </p>
          </div>

          <h3 className="mt-9 text-base font-bold text-text-primary">기억해 둘 세 가지</h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="border-t-2 border-primary/30 pt-3.5"
              >
                <dt className="text-base font-bold text-text-primary">
                  {principle.title}
                </dt>
                <dd className="mt-1 text-base leading-7 text-text-secondary">
                  {principle.description}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* 최종 리포트는 두 통화를 종합한 결과라, 한쪽 통화의 대화 기록만 붙이면 오해를 준다. */}
        {!isFinal && turns.length > 0 ? (
          <details className="group border-t border-border">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-5 text-sm font-semibold text-text-primary hover:bg-background-muted sm:px-9 lg:px-11 [&::-webkit-details-marker]:hidden">
              전체 대화 기록 보기
              <span
                className="text-text-secondary transition-transform group-open:rotate-180"
                aria-hidden
              >
                ↓
              </span>
            </summary>
            <ul className="max-h-[26rem] space-y-4 overflow-y-auto overscroll-contain border-t border-border bg-background-muted px-5 py-6 sm:px-9 lg:px-11">
              {turns.map((turn, index) => {
                const isUser = turn.role === "user";
                return (
                  <li
                    key={`${turn.role}-${index}`}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[82%] ${isUser ? "text-right" : "text-left"}`}>
                      <p className="mb-1 px-1 text-xs font-medium text-text-secondary">
                        {isUser ? "나" : "훈련 상대"}
                      </p>
                      <p
                        className={
                          isUser
                            ? "rounded-chat rounded-br-md bg-primary px-4 py-2.5 text-left text-sm leading-6 text-white"
                            : "rounded-chat rounded-bl-md border border-border bg-white px-4 py-2.5 text-sm leading-6 text-text-primary"
                        }
                      >
                        {turn.text}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </details>
        ) : null}
      </article>

      <div className="mt-8">
        <StartTrainingAction size="lg" label="다시 훈련받기" className="w-full" />
      </div>
    </div>
  );
}
