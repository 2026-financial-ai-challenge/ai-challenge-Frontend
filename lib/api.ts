import { ApiError } from "@/lib/errors";
import { mockApi } from "@/lib/mock";
import type {
  GetComparisonResponse,
  GetReportResponse,
  GetSessionResponse,
  RegisterPhoneRequest,
  RegisterPhoneResponse,
  SubmitConsentRequest,
  SubmitConsentResponse,
} from "@/lib/types";

/**
 * 백엔드 연동 시 예상 엔드포인트 (확정 전, 교체 지점)
 *
 * POST /v1/consents
 * POST /v1/sessions/:sessionId/phone
 * GET  /v1/sessions/:sessionId
 * GET  /v1/sessions/:sessionId/report   — 보이스피싱 시뮬레이션 1차 리포트
 * GET  /v1/sessions/:sessionId/result   — 시뮬레이션 vs 불시 보이스피싱 훈련 비교
 */
export interface ApiClient {
  submitConsent(body: SubmitConsentRequest): Promise<SubmitConsentResponse>;
  registerPhone(body: RegisterPhoneRequest): Promise<RegisterPhoneResponse>;
  getSession(sessionId: string): Promise<GetSessionResponse>;
  getAnnouncedReport(sessionId: string): Promise<GetReportResponse>;
  getComparisonResult(sessionId: string): Promise<GetComparisonResponse>;
}

export { ApiError } from "@/lib/errors";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
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
  submitConsent(body) {
    return request<SubmitConsentResponse>("/v1/consents", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  registerPhone({ sessionId, phoneNumber }) {
    return request<RegisterPhoneResponse>(`/v1/sessions/${sessionId}/phone`, {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  },
  getSession(sessionId) {
    return request<GetSessionResponse>(`/v1/sessions/${sessionId}`);
  },
  getAnnouncedReport(sessionId) {
    return request<GetReportResponse>(`/v1/sessions/${sessionId}/report`);
  },
  getComparisonResult(sessionId) {
    return request<GetComparisonResponse>(`/v1/sessions/${sessionId}/result`);
  },
};

export const api: ApiClient = USE_MOCK ? mockApi : liveApi;
