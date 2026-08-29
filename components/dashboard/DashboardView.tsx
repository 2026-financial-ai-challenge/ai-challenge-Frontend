"use client";

import { StartTrainingAction } from "@/components/landing/StartTrainingButton";
import { TrainingProgress } from "@/components/dashboard/TrainingProgress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useReportQuery, useSessionQuery } from "@/hooks/use-training-queries";
import { replaceTo, useAuthStore } from "@/lib/stores/auth-store";
import { useSessionStore, type CompletedRun } from "@/lib/stores/session-store";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";

function completedSteps(session: Session): number {
  if (session.reportStatus === "final") return 4;
  if (session.reportStatus === "draft") return 2;
  if (session.currentTrainingType === "unannounced") return 2;
  if (session.callStatus === "completed") return 1;
  return 0;
}

function statusLabel(session: Session): string {
  const { callStatus, reportStatus, currentTrainingType } = session;
  const round =
    currentTrainingType === "unannounced" ? "불시 훈련" : "보이스피싱 시뮬레이션";

  if (reportStatus === "draft") return "1차 리포트 준비됨 · 불시 전화 대기 중";
  if (reportStatus === "pending") return `${round} 리포트 생성 중`;
  if (reportStatus === "failed") return "리포트 생성 실패";

  switch (callStatus) {
    case "waiting":
      return `${round} 전화 대기 중`;
    case "calling":
      return `${round} 전화 발신됨`;
    case "completed":
      return "통화 완료 · 리포트 준비 중";
    case "missed":
      return "전화를 받지 못함";
    case "failed":
      return "발신 실패";
    default:
      return "전화번호 등록 필요";
  }
}

function resumePath(session: Session): string {
  return session.phoneNumberMasked ? `/status/${session.id}` : "/consent";
}

function runDate(iso: string): string {
  return iso.slice(0, 10).replaceAll("-", ".");
}

function runScoreText(run: CompletedRun): string {
  if (run.announcedScore != null && run.unannouncedScore != null) {
    return `시뮬 ${run.announcedScore} → 실전 ${run.unannouncedScore}`;
  }
  if (run.unannouncedScore != null) return `실전 ${run.unannouncedScore}점`;
  if (run.announcedScore != null) return `시뮬 ${run.announcedScore}점`;
  return "완료";
}

function Judgement({
  tone,
  children,
}: {
  tone: "success" | "caution" | "danger";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-text-primary",
        tone === "success" && "bg-success-light",
        tone === "caution" && "bg-caution-light",
        tone === "danger" && "bg-danger-light",
      )}
    >
      {children}
    </span>
  );
}

export function DashboardView() {
  const authHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const participant = useAuthStore((state) => state.participant);

  const sessionHydrated = useSessionStore((state) => state.hasHydrated);
  const sessionId = useSessionStore((state) => state.sessionId);
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const recordCompletedSession = useSessionStore(
    (state) => state.recordCompletedSession,
  );
  const history = useSessionStore((state) => state.history);

  const ready = authHydrated && sessionHydrated;

  useEffect(() => {
    if (authHydrated && !token) {
      replaceTo("/login?next=/dashboard");
    }
  }, [authHydrated, token]);

  const activeId = ready && token && sessionId ? sessionId : undefined;
  const { data, error, isLoading } = useSessionQuery(activeId);
  const session = data?.session ?? null;
  const reportStatus = session?.reportStatus ?? null;
  const { data: reportData } = useReportQuery(
    activeId && reportStatus === "draft" ? activeId : undefined,
    reportStatus,
  );
  const draft = reportData?.draft ?? null;

  useEffect(() => {
    if (error) setSessionId(null);
  }, [error, setSessionId]);

  useEffect(() => {
    if (session && session.reportStatus === "final") {
      recordCompletedSession({
        id: session.id,
        announcedScore: null,
        unannouncedScore: null,
        completedAt: new Date().toISOString(),
      });
    }
  }, [session, recordCompletedSession]);

  if (!ready || !token) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <p className="text-sm text-text-secondary">
          로그인 상태를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  const hasActive = Boolean(sessionId) && !error;
  const inProgress = hasActive && (!session || session.reportStatus !== "final");

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        내 훈련
      </h1>
      {participant ? (
        <p className="mt-2 text-sm text-text-secondary">
          {participant.phoneNumberMasked}
        </p>
      ) : null}

      {inProgress ? (
        <Card className="mt-8 p-6">
          {session ? (
            <>
              <TrainingProgress completed={completedSteps(session)} />

              <div className="mt-6 border-t border-border pt-6">
                {session.reportStatus === "draft" ? (
                  <>
                    <p className="text-xs font-medium text-text-secondary">
                      이번 대응 점수
                    </p>
                    <p className="mt-1 text-5xl font-bold leading-none text-text-primary">
                      {draft ? draft.score : "–"}
                    </p>
                    {draft ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Judgement tone={draft.suspected ? "success" : "danger"}>
                          {draft.suspected ? "의심함" : "의심 없음"}
                        </Judgement>
                        <Judgement tone={draft.gaveName ? "danger" : "success"}>
                          {draft.gaveName ? "이름 알려줌" : "개인정보 지킴"}
                        </Judgement>
                        <Judgement
                          tone={draft.triedHangup ? "success" : "caution"}
                        >
                          {draft.triedHangup ? "통화 종료 시도" : "종료 안 함"}
                        </Judgement>
                      </div>
                    ) : null}
                    <p className="mt-5 text-sm font-semibold text-text-primary">
                      다음: 불시 전화
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-primary">
                      준비되면 예고 없이 실전 훈련 전화가 한 차례 더 걸려옵니다.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-text-primary">
                      {statusLabel(session)}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      통화는 휴대전화에서 이뤄집니다. 이 화면에서 통화하지
                      않습니다.
                    </p>
                  </>
                )}

                <div className="mt-5">
                  <Button asChild variant="secondary">
                    <Link href={resumePath(session)}>
                      {session.reportStatus === "draft"
                        ? "1차 리포트 보기"
                        : "상태 자세히 보기"}
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          ) : isLoading ? (
            <p className="text-sm text-text-secondary">불러오는 중입니다...</p>
          ) : (
            <p className="text-sm text-text-secondary">
              이전 훈련 정보를 불러오지 못했습니다.
            </p>
          )}
        </Card>
      ) : (
        <Card className="mt-8 p-6">
          <h2 className="text-base font-bold text-text-primary">
            {history.length > 0 ? "새 회차 시작" : "첫 훈련 시작"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-primary">
            {history.length > 0
              ? "이전 회차가 끝났습니다. 다시 연습하려면 새 회차를 시작하세요."
              : "보이스피싱 시뮬레이션과 불시 훈련을 같은 번호로 진행하고, 두 결과를 비교합니다."}
          </p>
          <div className="mt-4">
            <StartTrainingAction size="lg" label="훈련 시작하기" />
          </div>
        </Card>
      )}

      {history.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-base font-bold text-text-primary">
            이전 훈련 · {history.length}회
          </h2>
          <Card className="mt-3 divide-y divide-border p-0">
            {history.map((run, index) => (
              <div
                key={run.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">
                    {history.length - index}회차
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {runDate(run.completedAt)} · {runScoreText(run)}
                  </p>
                </div>
                <Button asChild variant="link" className="h-auto shrink-0 px-0">
                  <Link href={`/status/${run.id}`}>리포트 보기</Link>
                </Button>
              </div>
            ))}
          </Card>
        </section>
      ) : null}
    </div>
  );
}
