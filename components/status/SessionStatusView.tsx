"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BrandImage } from "@/components/brand/BrandImage";
import { Card } from "@/components/ui/card";
import { ApiError } from "@/lib/errors";
import { OTP_ERROR } from "@/lib/otp";
import { useSessionStore } from "@/lib/stores/session-store";
import { useSessionQuery } from "@/hooks/use-training-queries";
import type { CallStatus } from "@/lib/types";

const statusCopy: Record<
  CallStatus,
  { title: string; body: string; icon: "mascot" | "phone" | "shield" }
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
    title: "통화 종료",
    body: "보이스피싱 시뮬레이션 통화가 끝났습니다. 결과는 리포트 화면에서 확인할 수 있습니다.",
    icon: "shield",
  },
};

export function SessionStatusView() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const router = useRouter();
  const setSessionId = useSessionStore((state) => state.setSessionId);
  const { data, error, isLoading } = useSessionQuery(sessionId);

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "상태를 불러오지 못했습니다."
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
    }
  }, [data, router]);

  if (errorMessage && !data) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {errorMessage}
      </p>
    );
  }

  if (isLoading || !data) {
    return (
      <p className="text-sm text-muted-foreground">상태를 확인하고 있습니다...</p>
    );
  }

  const session = data.session;
  const status = session.callStatus;
  if (!session.phoneNumberMasked || !status) {
    return (
      <p className="text-sm text-muted-foreground">
        번호 인증 화면으로 이동하고 있습니다...
      </p>
    );
  }

  const copy = statusCopy[status];

  return (
    <Card className="p-6 text-center">
      <BrandImage name={copy.icon} alt="" className="mx-auto h-24 w-24" />
      <p className="mt-4 text-xs font-semibold tracking-wider text-brand-500">
        {session.phoneNumberMasked}
      </p>
      <h2 className="mt-2 text-xl font-bold text-navy-900">{copy.title}</h2>
      <p className="mt-2 text-sm leading-6 text-navy-600">{copy.body}</p>
      {errorMessage ? (
        <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </Card>
  );
}
