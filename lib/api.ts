import { ApiError } from "@/lib/errors";
import { getAuthToken } from "@/lib/stores/auth-store";
import type {
  AuthResponse,
  GetReportResponse,
  GetSessionResponse,
  LoginRequest,
  RequestSignupOtpRequest,
  RequestSignupOtpResponse,
  SignupRequest,
  StartCallResponse,
  SubmitConsentRequest,
  SubmitConsentResponse,
  VerifySignupOtpRequest,
  VerifySignupOtpResponse,
} from "@/lib/types";

/**
 * POST /v1/auth/signup/otp
 * POST /v1/auth/signup/verify
 * POST /v1/auth/signup
 * POST /v1/auth/login
 * POST /v1/consents  — Bearer 필수. 세션 생성 + 훈련 발신
 * POST /v1/sessions/:sessionId/calls
 * GET  /v1/sessions/:sessionId
 * GET  /v1/sessions/:sessionId/report
 */
export interface ApiClient {
  requestSignupOtp(body: RequestSignupOtpRequest): Promise<RequestSignupOtpResponse>;
  verifySignupOtp(body: VerifySignupOtpRequest): Promise<VerifySignupOtpResponse>;
  signup(body: SignupRequest): Promise<AuthResponse>;
  login(body: LoginRequest): Promise<AuthResponse>;
  submitConsent(body: SubmitConsentRequest): Promise<SubmitConsentResponse>;
  startCall(sessionId: string): Promise<StartCallResponse>;
  getSession(sessionId: string): Promise<GetSessionResponse>;
  getReport(sessionId: string): Promise<GetReportResponse>;
}

export { ApiError } from "@/lib/errors";

/** 브라우저는 same-origin `/v1`을 호출하고, Next rewrites가 백엔드로 넘긴다. */
const BASE_URL = "";

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
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
  requestSignupOtp(body) {
    return request<RequestSignupOtpResponse>("/v1/auth/signup/otp", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  verifySignupOtp(body) {
    return request<VerifySignupOtpResponse>("/v1/auth/signup/verify", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  signup(body) {
    return request<AuthResponse>("/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  login(body) {
    return request<AuthResponse>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  submitConsent(body) {
    return request<SubmitConsentResponse>("/v1/consents", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  getSession(sessionId) {
    return request<GetSessionResponse>(`/v1/sessions/${sessionId}`);
  },
  startCall(sessionId) {
    return request<StartCallResponse>(`/v1/sessions/${sessionId}/calls`, {
      method: "POST",
      body: "{}",
    });
  },
  getReport(sessionId) {
    return request<GetReportResponse>(`/v1/sessions/${sessionId}/report`);
  },
};

export const api: ApiClient = liveApi;
