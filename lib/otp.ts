export const OTP_CODE_LENGTH = 6;

export const OTP_ERROR = {
  INVALID_PHONE: "INVALID_PHONE",
  OTP_NOT_REQUESTED: "OTP_NOT_REQUESTED",
  OTP_PHONE_MISMATCH: "OTP_PHONE_MISMATCH",
  OTP_EXPIRED: "OTP_EXPIRED",
  OTP_INVALID: "OTP_INVALID",
  OTP_NOT_RECEIVED: "OTP_NOT_RECEIVED",
  OTP_COOLDOWN: "OTP_COOLDOWN",
  OTP_RATE_LIMITED: "OTP_RATE_LIMITED",
  OTP_LOCKED: "OTP_LOCKED",
  OTP_SEND_FAILED: "OTP_SEND_FAILED",
  OCTOMO_NOT_CONFIGURED: "OCTOMO_NOT_CONFIGURED",
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
} as const;

export type OtpErrorCode = (typeof OTP_ERROR)[keyof typeof OTP_ERROR];

export function isOtpConfirmBlocked(input: {
  expired: boolean;
  codeLength: number;
  errorCode?: string | null;
}): boolean {
  return (
    input.expired ||
    input.codeLength !== OTP_CODE_LENGTH ||
    input.errorCode === OTP_ERROR.OTP_LOCKED ||
    input.errorCode === OTP_ERROR.OTP_NOT_REQUESTED
  );
}
