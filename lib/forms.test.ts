import { describe, expect, it } from "vitest";
import { formatPhoneInput, loginPasswordSchema, newPasswordSchema, phoneNumberSchema } from "@/lib/forms";
import { consentFieldSchema } from "@/components/forms/ConsentFields";

describe("forms", () => {
  it("전화번호를 010-0000-0000 꼴로 보여 준다", () => {
    expect(formatPhoneInput("01012345678")).toBe("010-1234-5678");
    expect(formatPhoneInput("010-1234-5678")).toBe("010-1234-5678");
  });

  it("010으로 시작하는 11자리만 통과한다", () => {
    expect(phoneNumberSchema.safeParse("01012345678").success).toBe(true);
    expect(phoneNumberSchema.safeParse("010-1234-5678").success).toBe(true);
    expect(phoneNumberSchema.safeParse("01112345678").success).toBe(false);
    expect(phoneNumberSchema.safeParse("0101234").success).toBe(false);
  });

  it("새 비밀번호는 영문+숫자 8자 이상이다", () => {
    expect(newPasswordSchema.safeParse("Password1").success).toBe(true);
    expect(newPasswordSchema.safeParse("password").success).toBe(false);
    expect(newPasswordSchema.safeParse("12345678").success).toBe(false);
  });

  it("로그인 비밀번호는 길이만 본다", () => {
    expect(loginPasswordSchema.safeParse("12345678").success).toBe(true);
    expect(loginPasswordSchema.safeParse("short").success).toBe(false);
  });

  it("동의 항목은 둘 다 켜져야 한다", () => {
    expect(
      consentFieldSchema.safeParse({
        privacy: true,
        unannouncedTraining: true,
      }).success,
    ).toBe(true);
    expect(
      consentFieldSchema.safeParse({
        privacy: true,
        unannouncedTraining: false,
      }).success,
    ).toBe(false);
  });
});
