export type CallStatus =
  | "waiting"
  | "calling"
  | "completed"
  | "missed"
  | "silent"
  | "failed";

export type ReportStatus = "none" | "pending" | "draft" | "final" | "failed";

export interface ConsentRecord {
  privacy: boolean;
  unannouncedTraining: boolean;
  consentedAt: string;
}

export type TrainingType = "announced" | "unannounced";

export interface Session {
  id: string;
  phoneNumberMasked: string | null;
  callStatus: CallStatus | null;
  callId: string | null;
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

export type WebTrainingEventType =
  | "link_opened"
  | "identity_submitted"
  | "case_lookup_submitted"
  | "financial_info_submitted"
  | "app_install_clicked"
  | "report_clicked"
  | "left_without_input";

export interface WebTrainingReport {
  score: number;
  events: WebTrainingEventType[];
  riskBehaviors: ReportBehavior[];
  defenseBehaviors: ReportBehavior[];
}

export interface CreateWebTrainingLinkResponse {
  token: string;
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
  webTraining?: WebTrainingReport | null;
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
