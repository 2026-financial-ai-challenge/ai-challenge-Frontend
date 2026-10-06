import { beforeEach, describe, expect, it } from "vitest";
import {
  expireAuthIfNeeded,
  handleUnauthorized,
  isPublicAuthPath,
} from "@/lib/auth-session";
import { useAuthStore } from "@/lib/stores/auth-store";
import { mockLocation, resetAuthStore, sampleParticipant } from "@/test/helpers";

describe("auth-session", () => {
  beforeEach(() => {
    resetAuthStore();
  });

  it("로그인·가입 API는 공개 경로다", () => {
    expect(isPublicAuthPath("/v1/auth/login")).toBe(true);
    expect(isPublicAuthPath("/v1/auth/signup")).toBe(true);
    expect(isPublicAuthPath("/v1/sessions")).toBe(false);
  });

  it("만료된 토큰을 지운다", () => {
    useAuthStore.setState({
      token: "old",
      participant: sampleParticipant,
      expiresAt: Date.now() - 1000,
    });
    expect(expireAuthIfNeeded()).toBe(true);
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("401이면 로그인으로 보내고 next를 붙인다", () => {
    const { replace } = mockLocation("/status/session-1");
    useAuthStore.setState({
      token: "old",
      participant: sampleParticipant,
      expiresAt: Date.now() + 60_000,
    });

    handleUnauthorized();

    expect(useAuthStore.getState().token).toBeNull();
    expect(replace).toHaveBeenCalledWith("/login?next=/status/session-1");
  });

  it("이미 로그인 화면이면 리다이렉트하지 않는다", () => {
    const { replace } = mockLocation("/login");
    handleUnauthorized();
    expect(replace).not.toHaveBeenCalled();
  });
});
