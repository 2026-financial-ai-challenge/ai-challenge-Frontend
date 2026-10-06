import { describe, expect, it } from "vitest";
import { TRAINING_NOTICE_PATH, resolveAppRequest } from "@/lib/portal-routing";

describe("resolveAppRequest", () => {
  it("포털의 웹 훈련 링크는 /cs 아래로 rewrite한다", () => {
    expect(resolveAppRequest(true, "/t/abc123")).toEqual({
      action: "rewrite",
      pathname: "/cs/t/abc123",
      robots: true,
    });
  });

  it("토큰 없이 들어온 포털 주소는 모두 훈련 안내로 보낸다", () => {
    for (const pathname of ["/", "/inquiry", "/verify", "/hold", "/notice", "/t"]) {
      expect(resolveAppRequest(true, pathname)).toEqual({
        action: "rewrite",
        pathname: TRAINING_NOTICE_PATH,
        robots: true,
      });
    }
  });

  it("포털에서 /cs 직접 접근은 접두를 떼고 리다이렉트한다", () => {
    expect(resolveAppRequest(true, "/cs")).toEqual({
      action: "redirect",
      pathname: "/",
    });
    expect(resolveAppRequest(true, "/cs/hold")).toEqual({
      action: "redirect",
      pathname: "/hold",
    });
  });

  it("포털에서 API 경로는 그대로 통과시킨다", () => {
    expect(resolveAppRequest(true, "/v1/web-training/abc123")).toEqual({
      action: "next",
      pathname: "/v1/web-training/abc123",
    });
  });

  it("포털에 없는 경로도 훈련 안내로 보낸다", () => {
    expect(resolveAppRequest(true, "/dashboard")).toEqual({
      action: "rewrite",
      pathname: TRAINING_NOTICE_PATH,
      robots: true,
    });
  });

  it("포털 아이콘은 포털 전용 파일로 바꿔 준다", () => {
    expect(resolveAppRequest(true, "/favicon.ico")).toEqual({
      action: "rewrite",
      pathname: "/portal/favicon.ico",
      robots: true,
    });
  });

  it("메인 앱에서 /cs는 포털 없음을 보여 준다", () => {
    expect(resolveAppRequest(false, "/cs")).toEqual({
      action: "rewrite",
      pathname: "/__no-portal",
    });
    expect(resolveAppRequest(false, "/cs/inquiry")).toEqual({
      action: "rewrite",
      pathname: "/__no-portal",
    });
  });

  it("메인 앱의 일반 경로는 그대로 둔다", () => {
    expect(resolveAppRequest(false, "/dashboard")).toEqual({
      action: "next",
      pathname: "/dashboard",
    });
    expect(resolveAppRequest(false, "/status/abc")).toEqual({
      action: "next",
      pathname: "/status/abc",
    });
  });

  it("메인 앱에서도 훈련 안내 페이지는 그대로 열린다", () => {
    expect(resolveAppRequest(false, TRAINING_NOTICE_PATH)).toEqual({
      action: "next",
      pathname: TRAINING_NOTICE_PATH,
    });
  });
});
