import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { postLoginPath } from "@/lib/stores/auth-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useSessionStore } from "@/lib/stores/session-store";
import { isReportReady } from "@/lib/types";
import { nextReportPoll, nextSessionPoll } from "@/lib/session-polling";
import {
  jsonResponse,
  resetAuthStore,
  resetSessionStore,
  sampleAuth,
  sampleReport,
  sampleSession,
} from "@/test/helpers";

describe("login → consent → polling → report", () => {
  beforeEach(() => {
    resetAuthStore();
    resetSessionStore();
    vi.unstubAllGlobals();
  });

  it("로그인부터 최종 리포트까지 한 줄로 이어진다", async () => {
    const calling = sampleSession({ callStatus: "calling", reportStatus: "none" });
    const drafted = sampleSession({
      callStatus: "completed",
      reportStatus: "draft",
    });
    const report = sampleReport({
      status: "final",
      final: sampleReport().draft,
    });

    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse(sampleAuth))
        .mockResolvedValueOnce(jsonResponse({ sessionId: calling.id }))
        .mockResolvedValueOnce(jsonResponse({ session: calling }))
        .mockResolvedValueOnce(jsonResponse({ session: drafted }))
        .mockResolvedValueOnce(jsonResponse(report)),
    );

    const auth = await api.login({
      phoneNumber: "01012345678",
      password: "Password1",
    });
    useAuthStore
      .getState()
      .setAuth(auth.accessToken, auth.participant, auth.expiresInSec);
    expect(postLoginPath(auth.participant.hasConsented, "/dashboard")).toBe(
      "/dashboard",
    );

    const { sessionId } = await api.submitConsent({
      privacy: true,
      unannouncedTraining: true,
    });
    useSessionStore.getState().setSessionId(sessionId);
    expect(useSessionStore.getState().sessionId).toBe("session-1");

    const live = await api.getSession(sessionId);
    expect(
      nextSessionPoll({
        now: Date.now(),
        startedAt: Date.now(),
        lastStatus: null,
        session: live.session,
      }).interval,
    ).toBe(3000);

    const done = await api.getSession(sessionId);
    expect(isReportReady(done.session.reportStatus)).toBe(true);
    expect(
      nextSessionPoll({
        now: Date.now(),
        startedAt: Date.now(),
        lastStatus: "completed",
        session: done.session,
      }).interval,
    ).toBe(false);

    const finalReport = await api.getReport(sessionId);
    expect(nextReportPoll(finalReport.status, true)).toBe(false);
    expect(finalReport.final?.score).toBe(72);
  });
});
