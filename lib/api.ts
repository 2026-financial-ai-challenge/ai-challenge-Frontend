import { ApiError } from "@/lib/errors";
import { mockApi } from "@/lib/mock";
import type {
  GetComparisonResponse,
  GetReportResponse,
  GetSessionResponse,
  RequestOtpRequest,
  RequestOtpResponse,
  SubmitConsentRequest,
  SubmitConsentResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
  SignupOtpResponse,
  VerificationTokenResponse,
  AuthResponse,
} from "@/lib/types";

/**
 * POST /v1/consents
 * POST /v1/auth/signup/otp                   — 회원가입 SMS 인증번호 발송
 * POST /v1/auth/signup/verify                — 인증 후 일회성 verification_token 발급
 * POST /v1/auth/signup, /v1/auth/login       — 가입 및 JWT 로그인
 * GET  /v1/sessions/:sessionId
 * GET  /v1/sessions/:sessionId/report
 * GET  /v1/sessions/:sessionId/result
 */
export interface ApiClient {
  requestSignupOtp(phoneNumber: string): Promise<SignupOtpResponse>;
  verifySignupOtp(phoneNumber: string, code: string): Promise<VerificationTokenResponse>;
  signup(verificationToken: string, password: string): Promise<AuthResponse>;
  login(phoneNumber: string, password: string): Promise<AuthResponse>;
  submitConsent(body: SubmitConsentRequest): Promise<SubmitConsentResponse>;
  requestPhoneOtp(body: RequestOtpRequest): Promise<RequestOtpResponse>;
  verifyPhone(body: VerifyPhoneRequest): Promise<VerifyPhoneResponse>;
  getSession(sessionId: string): Promise<GetSessionResponse>;
  getReport(sessionId: string): Promise<GetReportResponse>;
  getComparisonResult(sessionId: string): Promise<GetComparisonResponse>;
}

export { ApiError } from "@/lib/errors";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
/** 브라우저는 same-origin `/v1`을 호출하고, Next rewrites가 백엔드로 넘긴다. */
const BASE_URL = "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window === "undefined"
    ? null
    : JSON.parse(localStorage.getItem("spc-auth") ?? "null")?.state?.accessToken;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let code: string | undefined;
    let message = `요청에 실패했습니다. (${res.status})`;

    try {
      const body = (await res.json()) as { message?: string; code?: string };
      if (body.message) message = body.message;
      code = body.code;
    } catch {
      // ignore non-JSON error bodies
    }

    throw new ApiError(message, res.status, code);
  }

  return res.json() as Promise<T>;
}

const liveApi: ApiClient = {
  requestSignupOtp(phoneNumber) {
    return request<SignupOtpResponse>("/v1/auth/signup/otp", { method: "POST", body: JSON.stringify({ phoneNumber }) });
  },
  verifySignupOtp(phoneNumber, code) {
    return request<VerificationTokenResponse>("/v1/auth/signup/verify", { method: "POST", body: JSON.stringify({ phoneNumber, code }) });
  },
  signup(verificationToken, password) {
    return request<AuthResponse>("/v1/auth/signup", { method: "POST", body: JSON.stringify({ verificationToken, password }) });
  },
  login(phoneNumber, password) {
    return request<AuthResponse>("/v1/auth/login", { method: "POST", body: JSON.stringify({ phoneNumber, password }) });
  },
  submitConsent(body) {
    return request<SubmitConsentResponse>("/v1/consents", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  requestPhoneOtp({ sessionId, phoneNumber }) {
    return request<RequestOtpResponse>(
      `/v1/sessions/${sessionId}/phone/otp`,
      {
        method: "POST",
        body: JSON.stringify({ phoneNumber }),
      },
    );
  },
  verifyPhone({ sessionId, phoneNumber, code }) {
    return request<VerifyPhoneResponse>(
      `/v1/sessions/${sessionId}/phone/verify`,
      {
        method: "POST",
        body: JSON.stringify({ phoneNumber, code }),
      },
    );
  },
  getSession(sessionId) {
    return request<GetSessionResponse>(`/v1/sessions/${sessionId}`);
  },
  getReport(sessionId) {
    return request<GetReportResponse>(`/v1/sessions/${sessionId}/report`);
  },
  getComparisonResult(sessionId) {
    return request<GetComparisonResponse>(`/v1/sessions/${sessionId}/result`);
  },
};

export const api: ApiClient = USE_MOCK ? (mockApi as ApiClient) : liveApi;
