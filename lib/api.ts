import {
  authResponseSchema,
  getReportResponseSchema,
  getSessionResponseSchema,
  listSessionsResponseSchema,
  requestSignupOtpResponseSchema,
  startCallResponseSchema,
  submitConsentResponseSchema,
  verifySignupOtpResponseSchema,
} from "@/lib/api-schemas";
import {
  expireAuthIfNeeded,
  handleUnauthorized,
  isPublicAuthPath,
} from "@/lib/auth-session";
import { ApiError } from "@/lib/errors";
import { getAuthToken } from "@/lib/stores/auth-store";
import type {
  AuthResponse,
  GetReportResponse,
  GetSessionResponse,
  ListSessionsResponse,
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
import type { ZodTypeAny } from "zod";

/**
 * POST /v1/auth/signup/otp
 * POST /v1/auth/signup/verify
 * POST /v1/auth/signup
 * POST /v1/auth/login
 * POST /v1/consents  — Bearer 필수. 회원 동의를 확인한 뒤 세션 생성 + 훈련 발신
 * POST /v1/sessions/:sessionId/calls
 * GET  /v1/sessions  — Bearer 필수. 로그인한 계정 소유 세션 전체 목록
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
  listSessions(): Promise<ListSessionsResponse>;
  getSession(sessionId: string): Promise<GetSessionResponse>;
  getReport(sessionId: string): Promise<GetReportResponse>;
}

/** 브라우저는 same-origin `/v1`을 호출하고, Next rewrites가 백엔드로 넘긴다. */
const BASE_URL = "";

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function parseBody<T>(schema: ZodTypeAny, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new ApiError("서버 응답 형식이 올바르지 않습니다.", 502);
  }
  return parsed.data as T;
}

async function request<T>(
  path: string,
  schema: ZodTypeAny,
  init?: RequestInit,
): Promise<T> {
  if (expireAuthIfNeeded() && !isPublicAuthPath(path)) {
    handleUnauthorized();
    throw new ApiError("로그인이 만료되었습니다. 다시 로그인해 주세요.", 401);
  }

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

    if (res.status === 401 && !isPublicAuthPath(path)) {
      handleUnauthorized();
    }

    throw new ApiError(message, res.status, code);
  }

  return parseBody(schema, await res.json());
}

export const api: ApiClient = {
  requestSignupOtp(body) {
    return request<RequestSignupOtpResponse>(
      "/v1/auth/signup/otp",
      requestSignupOtpResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },
  verifySignupOtp(body) {
    return request<VerifySignupOtpResponse>(
      "/v1/auth/signup/verify",
      verifySignupOtpResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },
  signup(body) {
    return request<AuthResponse>("/v1/auth/signup", authResponseSchema, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  login(body) {
    return request<AuthResponse>("/v1/auth/login", authResponseSchema, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  submitConsent(body) {
    return request<SubmitConsentResponse>(
      "/v1/consents",
      submitConsentResponseSchema,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },
  listSessions() {
    return request<ListSessionsResponse>(
      "/v1/sessions",
      listSessionsResponseSchema,
    );
  },
  getSession(sessionId) {
    return request<GetSessionResponse>(
      `/v1/sessions/${sessionId}`,
      getSessionResponseSchema,
    );
  },
  startCall(sessionId) {
    return request<StartCallResponse>(
      `/v1/sessions/${sessionId}/calls`,
      startCallResponseSchema,
      {
        method: "POST",
        body: "{}",
      },
    );
  },
  getReport(sessionId) {
    return request<GetReportResponse>(
      `/v1/sessions/${sessionId}/report`,
      getReportResponseSchema,
    );
  },
};
