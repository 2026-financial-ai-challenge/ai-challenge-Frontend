/** 화면에 보여주는 인증코드 길이. 만료·재발송 초는 서버 응답 값을 쓴다. */
export const OTP_CODE_LENGTH = 6;
export const OTP_EXPIRES_IN_SEC = 300;
export const OTP_RESEND_COOLDOWN_SEC = 60;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_MAX_SENDS = 5;

export const OCTOMO_SEND_TO = "16663538";
export const MOCK_OTP_CODE = "123456";

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

export function formatMoNumber(digits: string) {
  const value = digits.replace(/\D/g, "");
  if (value.length === 8) return `${value.slice(0, 4)}-${value.slice(4)}`;
  return value;
}

export function smsDeepLink(to: string, body: string, isIos = false) {
  const encoded = encodeURIComponent(body);
  if (isIos) {
    return `sms:${to}&body=${encoded}`;
  }
  return `sms:${to}?body=${encoded}`;
}
