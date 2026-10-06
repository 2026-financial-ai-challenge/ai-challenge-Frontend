import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  jsonResponse,
  mockLocation,
  resetAuthStore,
  sampleAuth,
  sampleParticipant,
  sampleReport,
  sampleSession,
} from "@/test/helpers";

describe("api client", () => {
  beforeEach(() => {
    resetAuthStore();
    vi.unstubAllGlobals();
    mockLocation("/dashboard");
  });

  it("로그인 401은 로그아웃하지 않는다", async () => {
    useAuthStore.getState().setAuth("keep", sampleParticipant, 3600);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ message: "비밀번호가 올바르지 않습니다." }, 401),
      ),
    );

    await expect(
      api.login({ phoneNumber: "01012345678", password: "wrongpass" }),
    ).rejects.toMatchObject({ status: 401 });
    expect(useAuthStore.getState().token).toBe("keep");
  });

  it("보호된 API 401은 세션을 지우고 로그인으로 보낸다", async () => {
    const { replace } = mockLocation("/dashboard");
    useAuthStore.getState().setAuth("old", sampleParticipant, 3600);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ message: "인증이 필요합니다.", code: "UNAUTHORIZED" }, 401),
      ),
    );

    await expect(api.listSessions()).rejects.toBeInstanceOf(ApiError);
    expect(useAuthStore.getState().token).toBeNull();
    expect(replace).toHaveBeenCalledWith("/login?next=/dashboard");
  });

  it("만료된 토큰이면 요청 전에 로그인으로 보낸다", async () => {
    const { replace } = mockLocation("/status/session-1");
    useAuthStore.setState({
      token: "expired",
      participant: sampleParticipant,
      expiresAt: Date.now() - 10,
    });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(api.getSession("session-1")).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/login?next=/status/session-1");
  });

  it("스키마에 맞지 않는 성공 응답은 502로 막는다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ accessToken: "only-token" })),
    );

    await expect(
      api.login({ phoneNumber: "01012345678", password: "Password1" }),
    ).rejects.toMatchObject({
      status: 502,
      message: "서버 응답 형식이 올바르지 않습니다.",
    });
  });

  it("정상 로그인 응답을 검증해 돌려준다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(sampleAuth)),
    );

    await expect(
      api.login({ phoneNumber: "01012345678", password: "Password1" }),
    ).resolves.toEqual(sampleAuth);
  });

  it("세션·리포트 응답도 검증한다", async () => {
    const session = sampleSession();
    const report = sampleReport({ status: "final", final: sampleReport().draft });
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse({ session }))
        .mockResolvedValueOnce(jsonResponse(report)),
    );

    await expect(api.getSession("session-1")).resolves.toEqual({ session });
    await expect(api.getReport("session-1")).resolves.toMatchObject({
      sessionId: "session-1",
      status: "final",
    });
  });
});
