import { afterEach, describe, expect, it } from "vitest";
import { isPortalHost } from "@/lib/portal-host";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env.NEXT_PUBLIC_PORTAL_ONLY = originalEnv.NEXT_PUBLIC_PORTAL_ONLY;
  process.env.NEXT_PUBLIC_PORTAL_HOSTS = originalEnv.NEXT_PUBLIC_PORTAL_HOSTS;
});

describe("isPortalHost", () => {
  it("허용된 포털 호스트를 인식한다", () => {
    process.env.NEXT_PUBLIC_PORTAL_ONLY = "";
    process.env.NEXT_PUBLIC_PORTAL_HOSTS = "gaoncs.localhost,gaoncs.vercel.app";
    expect(isPortalHost("gaoncs.localhost:3000")).toBe(true);
    expect(isPortalHost("gaoncs.vercel.app")).toBe(true);
    expect(isPortalHost("localhost:3000")).toBe(false);
  });

  it("개발 포트 3001은 포털로 본다", () => {
    process.env.NEXT_PUBLIC_PORTAL_ONLY = "";
    expect(isPortalHost("127.0.0.1:3001")).toBe(true);
  });

  it("PORTAL_ONLY면 호스트와 상관없이 포털이다", () => {
    process.env.NEXT_PUBLIC_PORTAL_ONLY = "true";
    expect(isPortalHost("example.com")).toBe(true);
  });
});
