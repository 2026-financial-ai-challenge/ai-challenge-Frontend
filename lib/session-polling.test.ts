import { describe, expect, it } from "vitest";
import {
  nextReportPoll,
  nextSessionPoll,
  REPORT_WAIT_LIMIT_MS,
  REPORT_WAIT_SLOW_AFTER_MS,
  REPORT_WAIT_SLOW_POLL_MS,
  SESSION_POLL_CAP_MS,
  SESSION_POLL_MS,
} from "@/lib/session-polling";
import { sampleSession } from "@/test/helpers";

const now = Date.parse("2026-10-06T12:00:00.000Z");

describe("nextSessionPoll", () => {
  it("발신 중에는 3초마다 폴링한다", () => {
    const next = nextSessionPoll({
      now,
      startedAt: now,
      lastStatus: "calling",
      session: sampleSession({ callStatus: "calling", updatedAt: new Date(now).toISOString() }),
    });
    expect(next.interval).toBe(SESSION_POLL_MS);
  });

  it("부재·무응답·실패에서는 멈춘다", () => {
    for (const callStatus of ["missed", "silent", "failed"] as const) {
      expect(
        nextSessionPoll({
          now,
          startedAt: now,
          lastStatus: callStatus,
          session: sampleSession({ callStatus }),
        }).interval,
      ).toBe(false);
    }
  });

  it("리포트가 나오면 세션 폴링을 멈춘다", () => {
    expect(
      nextSessionPoll({
        now,
        startedAt: now,
        lastStatus: "completed",
        session: sampleSession({
          callStatus: "completed",
          reportStatus: "draft",
        }),
      }).interval,
    ).toBe(false);
  });

  it("180초가 지나면 멈춘다", () => {
    expect(
      nextSessionPoll({
        now: now + SESSION_POLL_CAP_MS + 1,
        startedAt: now,
        lastStatus: "calling",
        session: sampleSession({ callStatus: "calling" }),
      }).interval,
    ).toBe(false);
  });

  it("통화가 끝나면 발신 제한시간을 넘겨도 리포트를 계속 기다린다", () => {
    expect(
      nextSessionPoll({
        now: now + SESSION_POLL_CAP_MS + 1,
        startedAt: now,
        lastStatus: "completed",
        session: sampleSession({
          callStatus: "completed",
          reportStatus: "pending",
          updatedAt: new Date(now).toISOString(),
        }),
      }).interval,
    ).toBe(REPORT_WAIT_SLOW_POLL_MS);
  });

  it("리포트를 1분 넘게 기다리면 확인 간격을 늘린다", () => {
    const completed = sampleSession({
      callStatus: "completed",
      reportStatus: "pending",
      updatedAt: new Date(now).toISOString(),
    });
    expect(
      nextSessionPoll({ now, startedAt: now, lastStatus: "completed", session: completed })
        .interval,
    ).toBe(SESSION_POLL_MS);
    expect(
      nextSessionPoll({
        now: now + REPORT_WAIT_SLOW_AFTER_MS + 1,
        startedAt: now,
        lastStatus: "completed",
        session: completed,
      }).interval,
    ).toBe(REPORT_WAIT_SLOW_POLL_MS);
  });

  it("리포트 대기 10분이 지나면 멈춘다", () => {
    expect(
      nextSessionPoll({
        now: now + REPORT_WAIT_LIMIT_MS + 1,
        startedAt: now,
        lastStatus: "completed",
        session: sampleSession({
          callStatus: "completed",
          reportStatus: "pending",
          updatedAt: new Date(now).toISOString(),
        }),
      }).interval,
    ).toBe(false);
  });
});

describe("nextReportPoll", () => {
  it("draft면 15초마다 보고 final이면 멈춘다", () => {
    expect(nextReportPoll("draft", true)).toBe(15_000);
    expect(nextReportPoll("final", true)).toBe(false);
    expect(nextReportPoll("draft", false)).toBe(false);
  });
});
