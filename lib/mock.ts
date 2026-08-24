import { ApiError } from "@/lib/errors";
import type {
  BehaviorItem,
  CallReport,
  ComparisonResult,
  GetComparisonResponse,
  GetReportResponse,
  GetSessionResponse,
  ReportTurn,
  RequestOtpRequest,
  RequestOtpResponse,
  Session,
  SubmitConsentRequest,
  SubmitConsentResponse,
  TrainingResult,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
} from "@/lib/types";

const DELAY_MS = 450;
const MOCK_OTP_CODE = "123456";
const OCTOMO_SEND_TO = "16663538";
const OTP_EXPIRES_IN_SEC = 300;
const OTP_RESEND_COOLDOWN_SEC = 60;
const OTP_MAX_ATTEMPTS = 5;
const OTP_MAX_SENDS = 5;

type PendingOtp = {
  phoneDigits: string;
  code: string;
  expiresAtMs: number;
  resendAvailableAtMs: number;
  attempts: number;
  sendCount: number;
};

type MockStore = {
  sessions: Record<string, Session>;
  announced: Record<string, TrainingResult>;
  unannounced: Record<string, TrainingResult>;
  reports: Record<string, GetReportResponse>;
  otps: Record<string, PendingOtp>;
};

function nowIso() {
  return new Date().toISOString();
}

function wait(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36)}`;
}

export function maskPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-***-${digits.slice(6)}`;
  }
  return "****";
}

function announcedBehaviors(): BehaviorItem[] {
  return [
    {
      id: "ann-skepticism",
      category: "skepticism",
      label: "상대 신원에 대한 의심 표현",
      description: "소속·발신 목적을 되묻거나 공식 여부를 확인하려 했습니다.",
      detected: true,
      isPositive: true,
    },
    {
      id: "ann-verification",
      category: "verification",
      label: "공식 채널로 재확인 의사",
      description: "검찰·금융기관에 직접 연락해 확인하겠다고 했습니다.",
      detected: true,
      isPositive: true,
    },
    {
      id: "ann-termination",
      category: "termination",
      label: "위험 인지 후 통화 종료",
      description: "이체·앱 설치 요구 시점에서 통화를 끊었습니다.",
      detected: true,
      isPositive: true,
    },
    {
      id: "ann-account",
      category: "disclosure",
      label: "계좌번호 제공",
      description: "안전조치·환급을 이유로 계좌번호를 말한 경우입니다.",
      detected: false,
      isPositive: false,
    },
    {
      id: "ann-otp",
      category: "disclosure",
      label: "인증번호 제공",
      description: "문자 인증번호를 상대에게 알려 준 경우입니다.",
      detected: false,
      isPositive: false,
    },
    {
      id: "ann-app",
      category: "compliance",
      label: "원격·악성 앱 설치 동의",
      description: "화면 공유 또는 앱 설치 안내에 따른 경우입니다.",
      detected: false,
      isPositive: false,
    },
  ];
}

function unannouncedBehaviors(): BehaviorItem[] {
  return [
    {
      id: "una-skepticism",
      category: "skepticism",
      label: "상대 신원에 대한 의심 표현",
      description: "갑작스러운 급전 요청에 대해 의심을 드러냈습니다.",
      detected: false,
      isPositive: true,
    },
    {
      id: "una-verification",
      category: "verification",
      label: "본인 확인을 다른 경로로 시도",
      description: "가족·지인에게 다른 수단으로 확인하겠다고 했습니다.",
      detected: true,
      isPositive: true,
    },
    {
      id: "una-termination",
      category: "termination",
      label: "위험 인지 후 통화 종료",
      description: "이체 요구 전에 통화를 종료했습니다.",
      detected: false,
      isPositive: true,
    },
    {
      id: "una-account",
      category: "disclosure",
      label: "계좌번호 제공",
      description: "송금할 계좌를 물어보거나 받아 적었습니다.",
      detected: true,
      isPositive: false,
    },
    {
      id: "una-transfer",
      category: "compliance",
      label: "이체·송금 의사 표명",
      description: "급전 요청에 응하겠다는 의사를 밝혔습니다.",
      detected: true,
      isPositive: false,
    },
    {
      id: "una-otp",
      category: "disclosure",
      label: "인증번호 제공",
      description: "문자 인증번호를 상대에게 알려 준 경우입니다.",
      detected: false,
      isPositive: false,
    },
  ];
}

const DEMO_SESSION_ID = "ses_demo_completed";

function seedStore(): MockStore {
  const createdAt = "2026-08-18T09:12:00.000Z";

  const demoSession: Session = {
    id: DEMO_SESSION_ID,
    phoneNumberMasked: "010-****-4567",
    callStatus: "completed",
    callId: "CA_demo",
    reportStatus: "draft",
    currentTrainingType: "unannounced",
    consents: {
      privacy: true,
      unannouncedTraining: true,
      consentedAt: "2026-08-17T10:00:00.000Z",
    },
    createdAt,
    updatedAt: "2026-08-19T14:40:00.000Z",
  };

  const demoDraft: CallReport = {
    suspected: true,
    gaveName: true,
    triedHangup: false,
    summary:
      "상대가 검찰을 사칭해 계좌 연루를 주장했습니다. 훈련자는 신원을 물었으나 성함을 말했고, 통화를 끊지는 않았습니다.",
    coaching:
      "기관은 전화로 개인정보를 받지 않습니다. 이름을 말하기 전에 공식 번호로 다시 걸고, 의심되면 바로 끊으세요.",
    riskBehaviors: [
      { label: "개인정보 제공", evidence: "김민수입니다" },
    ],
    defenseBehaviors: [
      { label: "상대방 신원 확인", evidence: "어디시라고요? 검찰이요?" },
    ],
    source: "live",
  };

  const demoTurns: ReportTurn[] = [
    { role: "assistant", text: "검찰입니다. 명의가 도용되었습니다." },
    { role: "user", text: "어디시라고요? 검찰이요?" },
    { role: "assistant", text: "본인 성함 확인하겠습니다." },
    { role: "user", text: "김민수입니다" },
  ];

  const announced: TrainingResult = {
    sessionId: DEMO_SESSION_ID,
    trainingType: "announced",
    score: 82,
    durationSec: 146,
    scenarioName: "검찰·금융감독 사칭",
    scenarioSummary:
      "계좌가 범죄에 연루되었다며 안전계좌로 이체를 요구하는 전형적인 기관 사칭 시나리오입니다.",
    behaviors: announcedBehaviors(),
    feedback:
      "보이스피싱 시뮬레이션에서는 상대 신원을 의심하고 공식 채널 확인을 언급한 뒤 통화를 종료했습니다. 금전·인증정보 제공은 없었습니다.",
    completedAt: "2026-08-18T09:16:00.000Z",
  };

  const unannounced: TrainingResult = {
    sessionId: DEMO_SESSION_ID,
    trainingType: "unannounced",
    score: 48,
    durationSec: 203,
    scenarioName: "지인 사칭 급전 요청",
    scenarioSummary:
      "가족·지인을 사칭해 급히 돈을 보내 달라는 시나리오입니다. 발신 시점은 사전 안내되지 않았습니다.",
    behaviors: unannouncedBehaviors(),
    feedback:
      "불시 보이스피싱 훈련에서는 다른 경로로 확인하겠다는 말은 있었으나, 계좌를 받아 적고 송금 의사를 밝혔습니다. 시뮬레이션보다 방어가 약해진 구간입니다.",
    completedAt: "2026-08-19T14:38:00.000Z",
  };

  return {
    sessions: { [DEMO_SESSION_ID]: demoSession },
    announced: { [DEMO_SESSION_ID]: announced },
    unannounced: { [DEMO_SESSION_ID]: unannounced },
    reports: {
      [DEMO_SESSION_ID]: {
        sessionId: DEMO_SESSION_ID,
        callId: "CA_demo",
        status: "draft",
        turns: demoTurns,
        draft: demoDraft,
        final: null,
        clawopsSummary: null,
      },
    },
    otps: {},
  };
}

const MOCK_STORAGE_KEY = "spc.mockStore";

const globalForMock = globalThis as typeof globalThis & {
  __spcMockStore?: MockStore;
};

function loadStoredStore(): MockStore | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(MOCK_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockStore;
  } catch {
    return null;
  }
}

function persistStore(store: MockStore) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
}

function getStore(): MockStore {
  if (!globalForMock.__spcMockStore) {
    const seeded = seedStore();
    const stored = loadStoredStore();
    globalForMock.__spcMockStore = stored
      ? {
          sessions: { ...seeded.sessions, ...stored.sessions },
          announced: { ...seeded.announced, ...stored.announced },
          unannounced: { ...seeded.unannounced, ...stored.unannounced },
          reports: { ...seeded.reports, ...(stored.reports ?? {}) },
          otps: { ...seeded.otps, ...(stored.otps ?? {}) },
        }
      : seeded;
  }
  return globalForMock.__spcMockStore;
}

function requireSession(sessionId: string): Session {
  const session = getStore().sessions[sessionId];
  if (!session) {
    throw new ApiError("세션을 찾을 수 없습니다.", 404, "SESSION_NOT_FOUND");
  }
  return session;
}

export const mockApi = {
  async submitConsent(body: SubmitConsentRequest): Promise<SubmitConsentResponse> {
    await wait();

    if (!body.privacy || !body.unannouncedTraining) {
      throw new ApiError(
        "필수 동의 항목에 모두 동의해야 합니다.",
        400,
        "CONSENT_REQUIRED",
      );
    }

    const timestamp = nowIso();
    const session: Session = {
      id: createId("ses"),
      phoneNumberMasked: null,
      callStatus: null,
      callId: null,
      reportStatus: null,
      currentTrainingType: "announced",
      consents: {
        privacy: true,
        unannouncedTraining: true,
        consentedAt: timestamp,
      },
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    getStore().sessions[session.id] = session;
    persistStore(getStore());
    return { sessionId: session.id };
  },

  async requestPhoneOtp({
    sessionId,
    phoneNumber,
  }: RequestOtpRequest): Promise<RequestOtpResponse> {
    await wait();

    requireSession(sessionId);
    const digits = phoneNumber.replace(/\D/g, "");

    if (!/^010\d{8}$/.test(digits)) {
      throw new ApiError(
        "010으로 시작하는 휴대전화번호 11자리를 입력해 주세요.",
        400,
        "INVALID_PHONE",
      );
    }

    const store = getStore();
    const existing = store.otps[sessionId];
    const now = Date.now();

    if (
      existing &&
      existing.phoneDigits === digits &&
      now < existing.resendAvailableAtMs
    ) {
      const waitSec = Math.ceil((existing.resendAvailableAtMs - now) / 1000);
      throw new ApiError(
        `인증번호는 ${waitSec}초 후 다시 요청할 수 있습니다.`,
        429,
        "OTP_COOLDOWN",
      );
    }

    const sendCount =
      existing && existing.phoneDigits === digits ? existing.sendCount + 1 : 1;

    if (sendCount > OTP_MAX_SENDS) {
      throw new ApiError(
        "인증번호 요청 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.",
        429,
        "OTP_RATE_LIMITED",
      );
    }

    store.otps[sessionId] = {
      phoneDigits: digits,
      code: MOCK_OTP_CODE,
      expiresAtMs: now + OTP_EXPIRES_IN_SEC * 1000,
      resendAvailableAtMs: now + OTP_RESEND_COOLDOWN_SEC * 1000,
      attempts: 0,
      sendCount,
    };
    persistStore(store);

    return {
      phoneNumberMasked: maskPhoneNumber(digits),
      code: MOCK_OTP_CODE,
      sendToNumber: OCTOMO_SEND_TO,
      expiresInSec: OTP_EXPIRES_IN_SEC,
      resendAvailableInSec: OTP_RESEND_COOLDOWN_SEC,
    };
  },

  async verifyPhone({
    sessionId,
    phoneNumber,
    code,
  }: VerifyPhoneRequest): Promise<VerifyPhoneResponse> {
    await wait();

    const session = requireSession(sessionId);
    const digits = phoneNumber.replace(/\D/g, "");
    const normalizedCode = code.replace(/\D/g, "");
    const store = getStore();
    const pending = store.otps[sessionId];

    if (!pending) {
      throw new ApiError(
        "인증번호를 먼저 요청해 주세요.",
        400,
        "OTP_NOT_REQUESTED",
      );
    }

    if (pending.phoneDigits !== digits) {
      throw new ApiError(
        "인증번호를 받은 번호와 일치하지 않습니다. 번호를 다시 확인해 주세요.",
        400,
        "OTP_PHONE_MISMATCH",
      );
    }

    if (Date.now() > pending.expiresAtMs) {
      throw new ApiError(
        "인증번호가 만료되었습니다. 다시 받아 주세요.",
        400,
        "OTP_EXPIRED",
      );
    }

    if (pending.attempts >= OTP_MAX_ATTEMPTS) {
      throw new ApiError(
        "인증 시도 횟수를 초과했습니다. 인증번호를 다시 받아 주세요.",
        429,
        "OTP_LOCKED",
      );
    }

    if (pending.code !== normalizedCode) {
      pending.attempts += 1;
      persistStore(store);
      const remaining = OTP_MAX_ATTEMPTS - pending.attempts;
      throw new ApiError(
        remaining > 0
          ? `인증번호가 올바르지 않습니다. (${remaining}회 남음)`
          : "인증 시도 횟수를 초과했습니다. 인증번호를 다시 받아 주세요.",
        400,
        remaining > 0 ? "OTP_INVALID" : "OTP_LOCKED",
      );
    }

    const timestamp = nowIso();
    const updated: Session = {
      ...session,
      phoneNumberMasked: maskPhoneNumber(digits),
      callStatus: "waiting",
      callId: null,
      reportStatus: null,
      currentTrainingType: "announced",
      updatedAt: timestamp,
    };

    store.sessions[sessionId] = updated;
    delete store.otps[sessionId];
    persistStore(store);
    return { session: updated };
  },

  async getSession(sessionId: string): Promise<GetSessionResponse> {
    await wait(200);
    return { session: requireSession(sessionId) };
  },

  async getReport(sessionId: string): Promise<GetReportResponse> {
    await wait();
    requireSession(sessionId);

    const report = getStore().reports[sessionId];
    if (!report || (report.status !== "draft" && report.status !== "final")) {
      throw new ApiError(
        "리포트가 아직 준비되지 않았습니다.",
        409,
        "REPORT_NOT_READY",
      );
    }

    return report;
  },

  async getComparisonResult(sessionId: string): Promise<GetComparisonResponse> {
    await wait();
    requireSession(sessionId);

    const announced = getStore().announced[sessionId];
    const unannounced = getStore().unannounced[sessionId];

    if (!announced || !unannounced) {
      throw new ApiError(
        "최종 비교 리포트가 아직 준비되지 않았습니다.",
        409,
        "RESULT_NOT_READY",
      );
    }

    const result: ComparisonResult = {
      sessionId,
      announced,
      unannounced,
      scoreDelta: unannounced.score - announced.score,
      overallFeedback:
        "보이스피싱 시뮬레이션에서는 잘 차단했지만, 갑작스러운 지인 사칭에는 송금 의사가 나왔습니다. 실제 피해는 불시 보이스피싱 훈련에서 더 자주 드러납니다.",
    };

    return { result };
  },
};
