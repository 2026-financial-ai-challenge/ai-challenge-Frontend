/** 서버가 알려주는 통화 상태. 웹에는 통화 UI를 두지 않는다. */
export type CallStatus =
  | "waiting"
  | "calling"
  | "completed"
  | "missed"
  | "silent"
  | "failed";

/** 통화 종료 후 리포트 생성 단계. 통화 전이면 null 또는 none. */
export type ReportStatus = "none" | "pending" | "draft" | "final" | "failed";

export interface ConsentRecord {
  privacy: boolean;
  unannouncedTraining: boolean;
  consentedAt: string;
}

/** 보이스피싱 시뮬레이션(사전 안내 후 발신) / 불시 보이스피싱 훈련(시점 비공개 발신) */
export type TrainingType = "announced" | "unannounced";

export interface Session {
  id: string;
  /** 등록 전이면 null. 저장·표시 시 항상 마스킹된 값만 사용 */
  phoneNumberMasked: string | null;
  /** 전화번호 등록 전이면 null */
  callStatus: CallStatus | null;
  /** 발신 전이면 null */
  callId: string | null;
  /** 통화 전이면 null. draft면 1차, final이면 최종 리포트 */
  reportStatus: ReportStatus | null;
  currentTrainingType: TrainingType;
  consents: ConsentRecord;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitConsentRequest {
  privacy?: boolean;
  unannouncedTraining?: boolean;
}

export interface SubmitConsentResponse {
  sessionId: string;
}

export interface GetSessionResponse {
  session: Session;
}

export interface ListSessionsResponse {
  sessions: Session[];
}

export interface ReportTurn {
  role: "user" | "assistant";
  text: string;
}

export interface ReportBehavior {
  label: string;
  evidence: string;
}

export interface CallReport {
  score: number;
  suspected: boolean;
  gaveName: boolean;
  triedHangup: boolean;
  summary: string;
  coaching: string;
  riskBehaviors: ReportBehavior[];
  defenseBehaviors: ReportBehavior[];
  source: string;
}

export interface GetReportResponse {
  sessionId: string;
  callId: string | null;
  status: ReportStatus;
  turns: ReportTurn[];
  draftTurns?: ReportTurn[];
  unannouncedTurns?: ReportTurn[];
  draft: CallReport | null;
  unannounced?: CallReport | null;
  final: CallReport | null;
  clawopsSummary?: unknown;
}

export function isReportReady(
  status: ReportStatus | null | undefined,
): status is "draft" | "final" {
  return status === "draft" || status === "final";
}

export interface StartCallResponse {
  callId?: string | null;
  status: "waiting" | "calling";
}

export interface AuthParticipant {
  id: number;
  phoneNumberMasked: string;
  hasConsented: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInSec: number;
  participant: AuthParticipant;
}

export interface RequestSignupOtpRequest {
  phoneNumber: string;
}

export interface RequestSignupOtpResponse {
  phoneNumberMasked: string;
  expiresInSec: number;
  resendAvailableInSec: number;
  devCode?: string | null;
}

export interface VerifySignupOtpRequest {
  phoneNumber: string;
  code: string;
}

export interface VerifySignupOtpResponse {
  verificationToken: string;
  expiresInSec: number;
}

export interface SignupRequest {
  verificationToken: string;
  password: string;
  privacy: boolean;
  unannouncedTraining: boolean;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}
