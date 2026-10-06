import { describe, expect, it } from "vitest";
import { resolveAppRequest } from "@/lib/portal-routing";

describe("resolveAppRequest", () => {
  it("포털 호스트는 루트를 /cs로 숨긴다", () => {
    expect(resolveAppRequest(true, "/")).toEqual({
      action: "rewrite",
      pathname: "/cs",
      robots: true,
    });
  });

  it("포털 페이지는 /cs 아래로 rewrite한다", () => {
    expect(resolveAppRequest(true, "/inquiry")).toEqual({
      action: "rewrite",
      pathname: "/cs/inquiry",
      robots: true,
    });
    expect(resolveAppRequest(true, "/verify")).toEqual({
      action: "rewrite",
      pathname: "/cs/verify",
      robots: true,
    });
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

  it("포털에 없는 경로는 안내 페이지로 보낸다", () => {
    expect(resolveAppRequest(true, "/dashboard")).toEqual({
      action: "rewrite",
      pathname: "/cs/notice",
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
});
