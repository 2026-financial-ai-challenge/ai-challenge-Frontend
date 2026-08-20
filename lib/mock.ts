import { ApiError } from "@/lib/errors";
import type {
  BehaviorItem,
  ComparisonResult,
  GetComparisonResponse,
  GetReportResponse,
  GetSessionResponse,
  RegisterPhoneRequest,
  RegisterPhoneResponse,
  Session,
  SubmitConsentRequest,
  SubmitConsentResponse,
  TrainingResult,
} from "@/lib/types";

const DELAY_MS = 450;

type MockStore = {
  sessions: Record<string, Session>;
  announced: Record<string, TrainingResult>;
  unannounced: Record<string, TrainingResult>;
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
    currentTrainingType: "unannounced",
    consents: {
      privacy: true,
      unannouncedTraining: true,
      consentedAt: "2026-08-17T10:00:00.000Z",
    },
    createdAt,
    updatedAt: "2026-08-19T14:40:00.000Z",
  };

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

  async registerPhone({
    sessionId,
    phoneNumber,
  }: RegisterPhoneRequest): Promise<RegisterPhoneResponse> {
    await wait();

    const session = requireSession(sessionId);
    const digits = phoneNumber.replace(/\D/g, "");

    if (!/^01[016789]\d{7,8}$/.test(digits)) {
      throw new ApiError(
        "올바른 휴대전화번호 형식이 아닙니다.",
        400,
        "INVALID_PHONE",
      );
    }

    const timestamp = nowIso();
    const updated: Session = {
      ...session,
      phoneNumberMasked: maskPhoneNumber(digits),
      callStatus: "waiting",
      currentTrainingType: "announced",
      updatedAt: timestamp,
    };

    getStore().sessions[sessionId] = updated;
    persistStore(getStore());
    return { session: updated };
  },

  async getSession(sessionId: string): Promise<GetSessionResponse> {
    await wait(200);
    return { session: requireSession(sessionId) };
  },

  async getAnnouncedReport(sessionId: string): Promise<GetReportResponse> {
    await wait();
    requireSession(sessionId);

    const result = getStore().announced[sessionId];
    if (!result) {
      throw new ApiError(
        "보이스피싱 시뮬레이션 리포트가 아직 준비되지 않았습니다.",
        409,
        "REPORT_NOT_READY",
      );
    }

    return { result };
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
