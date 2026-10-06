import type { CallStatus, ReportStatus } from "@/lib/types";

export const SESSION_POLL_MS = 3000;
export const SESSION_POLL_CAP_MS = 180_000;
export const COMPLETED_STALE_MS = 20_000;
export const REPORT_POLL_MS = 15_000;

type PollSession = {
  callStatus: CallStatus | null;
  reportStatus: ReportStatus | null;
  updatedAt: string;
};

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

  if (input.now - startedAt > SESSION_POLL_CAP_MS) {
    return { interval: false, startedAt, lastStatus };
  }

  if (session.callStatus === "completed") {
    const updated = Date.parse(session.updatedAt);
    if (Number.isFinite(updated) && input.now - updated > COMPLETED_STALE_MS) {
      return { interval: false, startedAt, lastStatus };
    }
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
