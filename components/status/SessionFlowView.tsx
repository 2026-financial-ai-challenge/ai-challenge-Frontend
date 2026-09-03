"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReportCollection } from "@/components/report/ReportCollection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApiError, apiErrorMessage } from "@/lib/errors";
import { OTP_ERROR } from "@/lib/otp";
import { useSessionStore } from "@/lib/stores/session-store";
import {
  queryKeys,
  useReportQuery,
  useSessionQuery,
  useStartCallMutation,
} from "@/hooks/use-training-queries";
import { isReportReady } from "@/lib/types";
import type { CallStatus, ReportStatus } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

const callCopy: Record<
  CallStatus,
  { title: string; body: string }
> = {
  waiting: {
    title: "발신 대기",
    body: "보이스피싱 시뮬레이션 전화를 준비 중입니다. 잠시 후 휴대전화로 전화가 갑니다. 방해금지 모드는 꺼 두고, 이 화면에서 통화하지 않습니다.",
  },
  calling: {
    title: "발신됨",
    body: "훈련 전화를 걸었습니다. 휴대전화를 받아 주세요. 거절하거나 받지 않으면 훈련이 시작되지 않습니다.",
  },
  completed: {
    title: "리포트 준비 중",
    body: "통화가 끝났습니다. 1차 리포트를 만들고 있습니다. 잠시만 기다려 주세요.",
  },
  missed: {
    title: "전화를 받지 못했습니다",
    body: "방해금지 모드이거나 전화를 거절·무응답하면 훈련이 진행되지 않습니다. 다시 시도해 주세요.",
  },
  silent: {
    title: "통화 내용을 확인할 수 없습니다",
    body: "전화는 연결됐지만 응답한 내용이 없어 리포트를 만들 수 없습니다. 다시 전화 걸기를 눌러 훈련을 진행해 주세요.",
  },
  failed: {
    title: "전화를 걸지 못했습니다",
    body: "지금은 통화 연결이 혼잡하거나 이전 연결이 정리되는 중입니다. 잠시 기다렸다가 다시 시도해 주세요.",
  },
};

function statusCardCopy(
  callStatus: CallStatus,
  reportStatus: ReportStatus | null,
): { title: string; body: string } {
  if (callStatus !== "completed") {
    return callCopy[callStatus];
  }
  if (reportStatus === "failed") {
    return {
      title: "리포트를 만들지 못했습니다",
      body: "통화는 끝났지만 리포트를 준비하는 중 문제가 생겼습니다.",
    };
  }
  return callCopy.completed;
}

export function SessionFlowView() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const recordCompletedSession = useSessionStore(
    (state) => state.recordCompletedSession,
  );
  const { data, error, isLoading } = useSessionQuery(sessionId);
  const retryMutation = useStartCallMutation();
  const reportStatus = data?.session.reportStatus ?? null;
  const {
    data: report,
    error: reportError,
    isLoading: reportLoading,
  } = useReportQuery(sessionId, reportStatus);

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "상태를 불러오지 못했습니다."
        : reportError instanceof ApiError
          ? reportError.message
          : reportError
            ? "리포트를 불러오지 못했습니다."
            : null;

  useEffect(() => {
    if (error instanceof ApiError && error.code === OTP_ERROR.SESSION_NOT_FOUND) {
      setSessionId(null);
      router.replace("/consent");
    }
  }, [error, router, setSessionId]);

  useEffect(() => {
    const session = data?.session;
    if (!session) return;
    if (!session.phoneNumberMasked || !session.callStatus) {
      router.replace("/consent");
      return;
    }
    if (isReportReady(session.reportStatus) && !pathname.startsWith("/report/")) {
      router.replace(`/report/${sessionId}`);
    }
  }, [data, pathname, router, sessionId]);

  useEffect(() => {
    if (reportStatus !== "final" || !report) return;
    recordCompletedSession({
      id: sessionId,
      announcedScore: report.draft?.score ?? null,
      unannouncedScore: report.unannounced?.score ?? report.final?.score ?? null,
      completedAt: new Date().toISOString(),
    });
  }, [reportStatus, report, sessionId, recordCompletedSession]);

  const heading = isReportReady(reportStatus) ? (
    <>
      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
        Training report
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
        훈련 리포트
      </h1>
      <p className="mt-3 text-sm leading-6 text-text-primary">
        통화가 끝나면 1차 리포트가 먼저 열리고, 최종 분석이 끝나면 같은 화면에서 바뀝니다.
      </p>
    </>
  ) : (
    <>
      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
        Training status
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
        훈련 전화 상태
      </h1>
      <p className="mt-3 text-sm leading-6 text-text-primary">
        서버가 알려 주는 상태만 표시합니다. 통화는 휴대전화에서 이루어집니다.
      </p>
    </>
  );

  if (errorMessage && !data && !report) {
    return (
      <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
        {heading}
        <p className="mt-8 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
        {heading}
        <p className="mt-8 text-sm text-text-secondary">
          상태를 확인하고 있습니다...
        </p>
      </div>
    );
  }

  const session = data.session;
  const callStatus = session.callStatus;
  if (!session.phoneNumberMasked || !callStatus) {
    return (
      <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
        {heading}
        <p className="mt-8 text-sm text-text-secondary">
          번호 인증 화면으로 이동하고 있습니다...
        </p>
      </div>
    );
  }

  if (isReportReady(reportStatus)) {
    const body = report?.final ?? report?.unannounced ?? report?.draft;

    return (
      <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
        {heading}
        <div className="mt-8">
          {reportLoading || !body ? (
            <p className="text-sm text-text-secondary">
              리포트를 불러오고 있습니다...
            </p>
          ) : (
            <ReportCollection
              key={report?.status}
              draft={report?.draft ?? null}
              unannounced={report?.unannounced ?? null}
              final={report?.final ?? null}
              draftTurns={report?.draftTurns ?? report?.turns ?? []}
              unannouncedTurns={report?.unannouncedTurns ?? report?.turns ?? []}
            />
          )}
          {errorMessage ? (
            <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
          ) : null}
        </div>
      </div>
    );
  }

  const copy = statusCardCopy(callStatus, reportStatus);
  const canRetry =
    callStatus === "waiting" ||
    callStatus === "missed" ||
    callStatus === "silent" ||
    callStatus === "failed";
  const retryError = apiErrorMessage(retryMutation.error);

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      {heading}
      <div className="mt-8">
        <Card className="p-6 text-center">
          <p className="text-xs font-semibold tracking-wider text-primary">
            {session.phoneNumberMasked}
          </p>
          <h2 className="mt-2 text-xl font-bold text-text-primary">{copy.title}</h2>
          <p className="mt-2 text-sm leading-6 text-text-primary">{copy.body}</p>
          {errorMessage ? (
            <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
          ) : null}
          {retryError ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {retryError}
            </p>
          ) : null}
          {canRetry ? (
            <Button
              type="button"
              className="mt-5"
              disabled={retryMutation.isPending}
              onClick={() => {
                retryMutation.reset();
                void retryMutation
                  .mutateAsync(sessionId)
                  .then(() =>
                    queryClient.invalidateQueries({
                      queryKey: queryKeys.session(sessionId),
                    }),
                  )
                  .catch(() => {
                    // 오류는 mutation error 상태로 보여 준다.
                  });
              }}
            >
              {retryMutation.isPending ? "다시 거는 중..." : "다시 전화 걸기"}
            </Button>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
