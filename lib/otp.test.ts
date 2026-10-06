import { describe, expect, it } from "vitest";
import { isOtpConfirmBlocked, OTP_ERROR } from "@/lib/otp";

describe("isOtpConfirmBlocked", () => {
  it("6자리이고 만료·잠금이 아니면 통과한다", () => {
    expect(
      isOtpConfirmBlocked({ expired: false, codeLength: 6 }),
    ).toBe(false);
  });

  it("만료되면 막는다", () => {
    expect(
      isOtpConfirmBlocked({ expired: true, codeLength: 6 }),
    ).toBe(true);
  });

  it("잠기거나 요청이 없으면 막는다", () => {
    expect(
      isOtpConfirmBlocked({
        expired: false,
        codeLength: 6,
        errorCode: OTP_ERROR.OTP_LOCKED,
      }),
    ).toBe(true);
    expect(
      isOtpConfirmBlocked({
        expired: false,
        codeLength: 6,
        errorCode: OTP_ERROR.OTP_NOT_REQUESTED,
      }),
    ).toBe(true);
  });

  it("자릿수가 모자라면 막는다", () => {
    expect(
      isOtpConfirmBlocked({ expired: false, codeLength: 5 }),
    ).toBe(true);
  });
});
