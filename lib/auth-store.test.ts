import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  isTokenExpired,
  postLoginPath,
  safeNextPath,
  selectIsAuthenticated,
  useAuthStore,
} from "@/lib/stores/auth-store";
import { resetAuthStore, sampleParticipant } from "@/test/helpers";

describe("safeNextPath", () => {
  it("상대 경로만 허용한다", () => {
    expect(safeNextPath("/status/abc")).toBe("/status/abc");
    expect(safeNextPath("/report/abc")).toBe("/report/abc");
  });

  it("외부·프로토콜 상대 경로는 대시보드로 보낸다", () => {
    expect(safeNextPath("https://evil.example")).toBe("/dashboard");
    expect(safeNextPath("//evil.example")).toBe("/dashboard");
    expect(safeNextPath("")).toBe("/dashboard");
    expect(safeNextPath(null)).toBe("/dashboard");
  });
});

describe("postLoginPath", () => {
  it("미동의면 동의 화면으로 보낸다", () => {
    expect(postLoginPath(false, "/dashboard")).toBe("/consent");
  });

  it("이미 동의했는데 next가 동의하면 대시보드로 보낸다", () => {
    expect(postLoginPath(true, "/consent")).toBe("/dashboard");
  });

  it("동의한 사용자는 원래 next로 돌아간다", () => {
    expect(postLoginPath(true, "/status/s1")).toBe("/status/s1");
  });
});

describe("token expiry", () => {
  beforeEach(() => {
    resetAuthStore();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-06T12:00:00.000Z"));
  });

  it("만료 시각이 없으면 레거시 토큰으로 본다", () => {
    expect(isTokenExpired(null)).toBe(false);
    expect(selectIsAuthenticated({ token: "legacy", expiresAt: null })).toBe(
      true,
    );
  });

  it("만료되면 인증되지 않은 것으로 본다", () => {
    expect(isTokenExpired(Date.now() - 1)).toBe(true);
    expect(
      selectIsAuthenticated({ token: "x", expiresAt: Date.now() - 1 }),
    ).toBe(false);
  });

  it("setAuth가 expiresAt을 저장한다", () => {
    useAuthStore
      .getState()
      .setAuth("token-1", sampleParticipant, 120);
    expect(useAuthStore.getState().expiresAt).toBe(Date.now() + 120_000);
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true);
  });

  it("clearAuth는 토큰과 만료 시각을 함께 지운다", () => {
    useAuthStore.getState().setAuth("token-1", sampleParticipant, 120);
    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState()).toMatchObject({
      token: null,
      participant: null,
      expiresAt: null,
    });
  });
});
