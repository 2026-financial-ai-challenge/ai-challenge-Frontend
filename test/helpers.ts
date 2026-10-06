import { useAuthStore } from "@/lib/stores/auth-store";
import { useSessionStore } from "@/lib/stores/session-store";
import type { GetReportResponse, Session } from "@/lib/types";
import { vi } from "vitest";

export function mockLocation(pathname = "/") {
  const replace = vi.fn();
  vi.stubGlobal("location", {
    pathname,
    replace,
    href: `http://localhost${pathname}`,
    origin: "http://localhost",
  });
  return { replace };
}

export function resetAuthStore() {
  useAuthStore.setState({
    token: null,
    participant: null,
    expiresAt: null,
    hasHydrated: true,
  });
}

export function resetSessionStore() {
  useSessionStore.setState({
    sessionId: null,
    hasHydrated: true,
  });
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const sampleParticipant = {
  id: 1,
  phoneNumberMasked: "010-****-5678",
  hasConsented: true,
};

export const sampleAuth = {
  accessToken: "token-1",
  tokenType: "bearer",
  expiresInSec: 3600,
  participant: sampleParticipant,
};

export function sampleSession(overrides: Partial<Session> = {}): Session {
  return {
    id: "session-1",
    phoneNumberMasked: "010-****-5678",
    callStatus: "calling",
    callId: "call-1",
    reportStatus: "none",
    currentTrainingType: "announced",
    consents: {
      privacy: true,
      unannouncedTraining: true,
      consentedAt: "2026-10-06T00:00:00.000Z",
    },
    createdAt: "2026-10-06T00:00:00.000Z",
    updatedAt: "2026-10-06T00:00:00.000Z",
    ...overrides,
  } as Session;
}

export function sampleReport(
  overrides: Partial<GetReportResponse> = {},
): GetReportResponse {
  return {
    sessionId: "session-1",
    callId: "call-1",
    status: "draft",
    turns: [{ role: "assistant", text: "hello" }],
    draft: {
      score: 72,
      suspected: true,
      gaveName: false,
      triedHangup: true,
      summary: "의심했습니다.",
      coaching: "끊고 다시 확인하세요.",
      riskBehaviors: [],
      defenseBehaviors: [],
      source: "live",
    },
    unannounced: null,
    final: null,
    ...overrides,
  };
}
