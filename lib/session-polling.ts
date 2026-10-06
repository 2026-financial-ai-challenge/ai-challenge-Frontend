import type { CallStatus, ReportStatus } from "@/lib/types";

export const SESSION_POLL_MS = 3000;
export const SESSION_POLL_CAP_MS = 180_000;
export const REPORT_POLL_MS = 15_000;

/** 녹음 전사 기반 최종 리포트는 통화 종료 후 몇 분 뒤에 올 수 있다. */
export const REPORT_WAIT_LIMIT_MS = 10 * 60_000;
/** 1분이 지나면 리포트를 덜 자주 확인한다. */
export const REPORT_WAIT_SLOW_AFTER_MS = 60_000;
export const REPORT_WAIT_SLOW_POLL_MS = 10_000;

type PollSession = {
  callStatus: CallStatus | null;
  reportStatus: ReportStatus | null;
  updatedAt: string;
};

/** 통화가 끝난 뒤 리포트를 기다린 시간. updatedAt을 못 읽으면 폴링 시작 시점으로 센다. */
export function reportWaitElapsed(
  session: Pick<PollSession, "updatedAt">,
  now: number,
  fallbackStart: number,
): number {
  const updated = Date.parse(session.updatedAt);
  return now - (Number.isFinite(updated) ? updated : fallbackStart);
}

export function nextSessionPoll(input: {
  now: number;
  startedAt: number | null;
  lastStatus: string | null;
  session: PollSession | undefined;
}): { interval: number | false; startedAt: number; lastStatus: string | null } {
  let startedAt = input.startedAt ?? input.now;
  let lastStatus = input.lastStatus;
  const session = input.session;

  if (!session?.callStatus) {
    return { interval: false, startedAt, lastStatus };
  }

  if (
    session.callStatus !== lastStatus &&
    (session.callStatus === "waiting" || session.callStatus === "calling")
  ) {
    startedAt = input.now;
  }
  lastStatus = session.callStatus;

  if (
    session.callStatus === "missed" ||
    session.callStatus === "silent" ||
    session.callStatus === "failed"
  ) {
    return { interval: false, startedAt, lastStatus };
  }

  if (
    session.reportStatus === "draft" ||
    session.reportStatus === "final" ||
    session.reportStatus === "failed"
  ) {
    return { interval: false, startedAt, lastStatus };
  }

  // 통화가 끝났으면 발신 제한시간이 아니라 리포트 대기시간으로 센다.
  if (session.callStatus === "completed") {
    const waited = reportWaitElapsed(session, input.now, startedAt);
    if (waited > REPORT_WAIT_LIMIT_MS) {
      return { interval: false, startedAt, lastStatus };
    }
    return {
      interval:
        waited > REPORT_WAIT_SLOW_AFTER_MS
          ? REPORT_WAIT_SLOW_POLL_MS
          : SESSION_POLL_MS,
      startedAt,
      lastStatus,
    };
  }

  if (input.now - startedAt > SESSION_POLL_CAP_MS) {
    return { interval: false, startedAt, lastStatus };
  }

  return { interval: SESSION_POLL_MS, startedAt, lastStatus };
}

export function nextReportPoll(
  status: ReportStatus | undefined,
  ready: boolean,
): number | false {
  if (!ready) return false;
  if (status === "final") return false;
  return REPORT_POLL_MS;
}
