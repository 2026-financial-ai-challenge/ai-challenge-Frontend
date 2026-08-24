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
} from "@/lib/types";

/**
 * POST /v1/consents
 * POST /v1/sessions/:sessionId/phone/otp     — 인증코드·수신번호 발급. 번호를 확정하지 않음
 * POST /v1/sessions/:sessionId/phone/verify  — 옥토모 수신 확인 후에만 번호 등록 + 발신 대기
 * GET  /v1/sessions/:sessionId
 * GET  /v1/sessions/:sessionId/report
 * GET  /v1/sessions/:sessionId/result
 */
export interface ApiClient {
  submitConsent(body: SubmitConsentRequest): Promise<SubmitConsentResponse>;
  requestPhoneOtp(body: RequestOtpRequest): Promise<RequestOtpResponse>;
  verifyPhone(body: VerifyPhoneRequest): Promise<VerifyPhoneResponse>;
  getSession(sessionId: string): Promise<GetSessionResponse>;
  getAnnouncedReport(sessionId: string): Promise<GetReportResponse>;
  getComparisonResult(sessionId: string): Promise<GetComparisonResponse>;
}

export { ApiError } from "@/lib/errors";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
/** 브라우저는 same-origin `/v1`을 호출하고, Next rewrites가 백엔드로 넘긴다. */
const BASE_URL = "";

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
  getAnnouncedReport(sessionId) {
    return request<GetReportResponse>(`/v1/sessions/${sessionId}/report`);
  },
  getComparisonResult(sessionId) {
    return request<GetComparisonResponse>(`/v1/sessions/${sessionId}/result`);
  },
};

export const api: ApiClient = USE_MOCK ? mockApi : liveApi;
