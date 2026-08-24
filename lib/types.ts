/** 서버가 알려주는 통화 상태. 웹에는 통화 UI를 두지 않는다. */
export type CallStatus = "waiting" | "calling" | "completed";

/** 보이스피싱 시뮬레이션(사전 안내 후 발신) / 불시 보이스피싱 훈련(시점 비공개 발신) */
export type TrainingType = "announced" | "unannounced";

export type BehaviorCategory =
  | "disclosure"
  | "compliance"
  | "skepticism"
  | "termination"
  | "verification";

export interface ConsentRecord {
  privacy: boolean;
  unannouncedTraining: boolean;
  consentedAt: string;
}

export interface Session {
  id: string;
  /** 등록 전이면 null. 저장·표시 시 항상 마스킹된 값만 사용 */
  phoneNumberMasked: string | null;
  /** 전화번호 등록 전이면 null */
  callStatus: CallStatus | null;
  currentTrainingType: TrainingType;
  consents: ConsentRecord;
  createdAt: string;
  updatedAt: string;
}

export interface BehaviorItem {
  id: string;
  category: BehaviorCategory;
  label: string;
  description: string;
  /** 통화 중 해당 행동이 감지되었는지 */
  detected: boolean;
  /** 대응 관점에서 바람직한 행동인지 (의심 표현, 공식 채널 확인 등) */
  isPositive: boolean;
}

export interface TrainingResult {
  sessionId: string;
  trainingType: TrainingType;
  /** 0–100, 높을수록 대응이 우수 */
  score: number;
  durationSec: number;
  scenarioName: string;
  scenarioSummary: string;
  behaviors: BehaviorItem[];
  feedback: string;
  completedAt: string;
}

export interface ComparisonResult {
  sessionId: string;
  announced: TrainingResult;
  unannounced: TrainingResult;
  /** 불시 보이스피싱 훈련 점수 − 보이스피싱 시뮬레이션 점수 */
  scoreDelta: number;
  overallFeedback: string;
}

export interface SubmitConsentRequest {
  privacy: boolean;
  unannouncedTraining: boolean;
}

export interface SubmitConsentResponse {
  sessionId: string;
}

export interface RequestOtpRequest {
  sessionId: string;
  phoneNumber: string;
}

export interface RequestOtpResponse {
  phoneNumberMasked: string;
  code: string;
  sendToNumber: string;
  expiresInSec: number;
  resendAvailableInSec: number;
}

export interface VerifyPhoneRequest {
  sessionId: string;
  phoneNumber: string;
  code: string;
}

export interface VerifyPhoneResponse {
  session: Session;
}

export interface GetSessionResponse {
  session: Session;
}

export interface GetReportResponse {
  result: TrainingResult;
}

export interface GetComparisonResponse {
  result: ComparisonResult;
}
