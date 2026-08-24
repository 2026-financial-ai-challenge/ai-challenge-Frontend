"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { TrainingReport } from "@/components/report/TrainingReport";
import { BrandImage } from "@/components/brand/BrandImage";
import { Card } from "@/components/ui/card";
import { ApiError } from "@/lib/errors";
import { OTP_ERROR } from "@/lib/otp";
import { useSessionStore } from "@/lib/stores/session-store";
import {
  useReportQuery,
  useSessionQuery,
} from "@/hooks/use-training-queries";
import { isReportReady } from "@/lib/types";
import type { CallStatus, ReportStatus } from "@/lib/types";

type StatusIcon = "mascot" | "phone" | "shield" | "alert";

const callCopy: Record<
  CallStatus,
  { title: string; body: string; icon: StatusIcon }
> = {
  waiting: {
    title: "발신 대기",
    body: "보이스피싱 시뮬레이션 전화를 준비 중입니다. 잠시 후 휴대전화로 전화가 갑니다. 이 화면에서 통화하지 않습니다.",
    icon: "mascot",
  },
  calling: {
    title: "발신됨",
    body: "훈련 전화를 걸었습니다. 휴대전화를 확인해 주세요. 웹에서는 통화가 진행되지 않습니다.",
    icon: "phone",
  },
  completed: {
    title: "리포트 준비 중",
    body: "통화가 끝났습니다. 1차 리포트를 만들고 있습니다. 잠시만 기다려 주세요.",
    icon: "shield",
  },
};

function statusCardCopy(
  callStatus: CallStatus,
  reportStatus: ReportStatus | null,
): { title: string; body: string; icon: StatusIcon } {
  if (callStatus !== "completed") {
    return callCopy[callStatus];
  }
  if (reportStatus === "failed") {
    return {
      title: "리포트를 만들지 못했습니다",
      body: "통화는 끝났지만 리포트를 준비하는 중 문제가 생겼습니다.",
      icon: "alert",
    };
  }
  return callCopy.completed;
}

export function SessionFlowView() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const pathname = usePathname();
  const router = useRouter();
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const { data, error, isLoading } = useSessionQuery(sessionId);
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
      router.replace("/register");
      return;
    }
    if (isReportReady(session.reportStatus) && !pathname.startsWith("/report/")) {
      router.replace(`/report/${sessionId}`);
    }
  }, [data, pathname, router, sessionId]);

  const heading = isReportReady(reportStatus) ? (
    <>
      <p className="text-xs font-semibold tracking-[0.14em] text-brand-500 uppercase">
        Training report
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">
        훈련 리포트
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-600">
        통화가 끝나면 1차 리포트가 먼저 열리고, 최종 분석이 끝나면 같은 화면에서 바뀝니다.
      </p>
    </>
  ) : (
    <>
      <p className="text-xs font-semibold tracking-[0.14em] text-brand-500 uppercase">
        Training status
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-900">
        훈련 전화 상태
      </h1>
      <p className="mt-3 text-sm leading-6 text-navy-600">
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
        <p className="mt-8 text-sm text-muted-foreground">
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
        <p className="mt-8 text-sm text-muted-foreground">
          번호 인증 화면으로 이동하고 있습니다...
        </p>
      </div>
    );
  }

  if (isReportReady(reportStatus)) {
    const body = report?.final ?? report?.draft;
    const badgeStatus = report?.final ? "final" : "draft";

    return (
      <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
        {heading}
        <div className="mt-8">
          {reportLoading || !body ? (
            <p className="text-sm text-muted-foreground">
              리포트를 불러오고 있습니다...
            </p>
          ) : (
            <TrainingReport
              status={badgeStatus}
              body={body}
              turns={report?.turns ?? []}
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

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16">
      {heading}
      <div className="mt-8">
        <Card className="p-6 text-center">
          <BrandImage
            name={copy.icon}
            alt=""
            className="mx-auto h-24 w-24"
            priority
          />
          <p className="mt-4 text-xs font-semibold tracking-wider text-brand-500">
            {session.phoneNumberMasked}
          </p>
          <h2 className="mt-2 text-xl font-bold text-navy-900">{copy.title}</h2>
          <p className="mt-2 text-sm leading-6 text-navy-600">{copy.body}</p>
          {errorMessage ? (
            <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
