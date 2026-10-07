import type { CallStatus, ReportStatus } from "@/lib/types";

export const SESSION_POLL_MS = 3000;
export const SESSION_POLL_CAP_MS = 180_000;
export const REPORT_POLL_MS = 15_000;

export const REPORT_WAIT_LIMIT_MS = 10 * 60_000;
export const REPORT_WAIT_SLOW_AFTER_MS = 60_000;
export const REPORT_WAIT_SLOW_POLL_MS = 10_000;

type PollSession = {
  callStatus: CallStatus | null;
  reportStatus: ReportStatus | null;
  updatedAt: string;
};

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
