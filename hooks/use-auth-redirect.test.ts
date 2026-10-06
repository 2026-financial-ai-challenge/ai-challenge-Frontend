import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  useRedirectWhenAuthenticated,
  useRequireAuth,
} from "@/hooks/use-auth-redirect";
import { useAuthStore } from "@/lib/stores/auth-store";
import { mockLocation, resetAuthStore, sampleParticipant } from "@/test/helpers";

describe("auth redirects", () => {
  beforeEach(() => {
    resetAuthStore();
  });

  it("비로그인으로 보호 화면에 오면 로그인으로 보낸다", async () => {
    const { replace } = mockLocation("/status/session-1");
    const { result } = renderHook(() => useRequireAuth("/status/session-1"));

    expect(result.current).toBe(false);
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/login?next=/status/session-1");
    });
  });

  it("로그인한 사용자는 로그인 화면에서 나간다", async () => {
    const { replace } = mockLocation("/login");
    useAuthStore.getState().setAuth("token-1", sampleParticipant, 3600);
    const { result } = renderHook(() =>
      useRedirectWhenAuthenticated("/dashboard"),
    );

    expect(result.current).toBe(true);
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("만료된 토큰은 보호 화면에서 로그인으로 보낸다", async () => {
    const { replace } = mockLocation("/report/session-1");
    useAuthStore.setState({
      token: "expired",
      participant: sampleParticipant,
      expiresAt: Date.now() - 1,
      hasHydrated: true,
    });

    const { result } = renderHook(() => useRequireAuth("/report/session-1"));
    expect(result.current).toBe(false);
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/login?next=/report/session-1");
    });
    expect(useAuthStore.getState().token).toBeNull();
  });
});
