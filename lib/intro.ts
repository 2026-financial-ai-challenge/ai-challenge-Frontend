/**
 * 랜딩 체험은 실제 훈련 시뮬레이션과 이어지지 않는 독립 데모다. 그래서 훈련
 * 시나리오가 쓰는 가상 포털(lib/portal.ts)과도 이름을 공유하지 않고, 이 화면
 * 전용 가상 기관을 쓴다. 실존 기관명·대표번호는 사칭 대사에 넣지 않는다 —
 * 체험의 실감은 기관명이 아니라 긴급성·비밀 유지·권위 압박에서 나온다.
 */
export const INTRO_FAKE_AGENCY = "한울중앙수사청";
export const INTRO_FAKE_UNIT = "금융범죄수사1부";
export const INTRO_FAKE_SITE = `${INTRO_FAKE_AGENCY} 전자민원`;
export const INTRO_CALLER_NUMBER = "070-5275-3828";

export type StageNumber = 1 | 2 | 3;
export type ChoiceKey = "A" | "B";
export type UserChoices = Record<StageNumber, ChoiceKey | undefined>;

export interface StageData {
  stageNumber: StageNumber;
  script: string;
  choices: {
    key: ChoiceKey;
    text: string;
  }[];
}

export const STAGES_CONFIG: Record<
  StageNumber,
  (prevChoice?: ChoiceKey) => StageData
> = {
  1: () => ({
    stageNumber: 1,
    script: `${INTRO_FAKE_AGENCY} ${INTRO_FAKE_UNIT} 이진우 수사관입니다. 김영수 씨 되십니까? 본인 명의로 개설된 계좌가 자금세탁 사기 사건에 쓰여서 연락드렸습니다. 직접 개설하신 계좌 맞습니까?`,
    choices: [
      {
        key: "A",
        text: "제가 만든 통장이 아닌데요? 무슨 일이죠?",
      },
      {
        key: "B",
        text: "의심스러운데요. 소속 남겨주시면 제가 대표번호를 직접 찾아서 다시 걸겠습니다.",
      },
    ],
  }),
  2: (prevChoice) => ({
    stageNumber: 2,
    script:
      prevChoice === "B"
        ? `선생님, 지금 장난 전화 아닙니다. 공무집행 중 끊으시면 출석 기피로 간주되어 바로 체포영장 청구됩니다. ${INTRO_FAKE_SITE}에서 사건번호 2026-형제-4892호 직접 조회해보십시오.`
        : `명의도용 피해를 입증하셔야 혐의를 벗습니다. 지금 ${INTRO_FAKE_SITE} 들어가셔서 사건번호 2026-형제-4892호 조회해보십시오. 본인 이름으로 출석요구서 올라와 있습니다.`,
    choices: [
      {
        key: "A",
        text: "진짜 제 이름으로 사건이 떠 있네요... 제가 어떻게 해야 합니까?",
      },
      {
        key: "B",
        text: "공문이 있어도 전화를 끊고 가족이나 변호사와 먼저 상의하겠습니다.",
      },
    ],
  }),
  3: (prevChoice) => ({
    stageNumber: 3,
    script:
      prevChoice === "B"
        ? "수사 기밀이라 외부로 발설하시면 공범으로 즉시 긴급체포 대상입니다. 결백을 입증하시려면 지금 보내드리는 보안 인증 앱 설치하고 휴대전화 검사부터 받으십시오."
        : "금융보안 원격 검사로 자산 동결을 막아야 합니다. 지금 문자로 보내드리는 보안 앱 설치하시고 화면 유지하십시오.",
    choices: [
      {
        key: "A",
        text: "공범으로 몰리는 건 무서우니까... 일단 앱 설치하겠습니다.",
      },
      {
        key: "B",
        text: "전화로 앱 설치를 요구하는 건 사기입니다. 끊겠습니다.",
      },
    ],
  }),
};

/** 세 단계 모두 B가 전화를 끊어내는 선택이다. */
export const SAFE_CHOICE: ChoiceKey = "B";

export const STAGE_REVIEW: Record<
  StageNumber,
  { label: string; safe: string; unsafe: string }
> = {
  1: {
    label: "1단계 · 사건 연루 통보",
    safe: "소속을 받아 직접 걸겠다고 하셨습니다. 진짜 기관이라면 이 요구를 거절할 이유가 없습니다.",
    unsafe: "계좌 이야기에 바로 대답하셨습니다. 조직은 이 반응 하나로 본인 확인을 끝냅니다.",
  },
  2: {
    label: "2단계 · 위조 영장 확인",
    safe: "전화를 끊고 주변과 상의하겠다고 하셨습니다. 혼자 두지 않는 것이 핵심입니다.",
    unsafe: "사이트에 뜬 사건번호를 사실로 받아들이셨습니다. 그 화면은 조직이 만든 것입니다.",
  },
  3: {
    label: "3단계 · 보안 앱 설치",
    safe: "설치를 거부하고 끊으셨습니다. 피해는 여기서 멈춥니다.",
    unsafe: "설치에 동의하셨습니다. 실제였다면 이 순간 전화와 자산이 함께 넘어갑니다.",
  },
};

export const TYPING_INTERVAL_MS = 28;
export const SLIDER_KNOB_PX = 64;
export const SLIDER_GRAB_OFFSET_PX = 28;
export const SLIDE_ACCEPT_RATIO = 0.85;
export const FRAME_WIDTH_PX = 345;
export const FRAME_HEIGHT_PX = 690;
export const FRAME_MARGIN_PX = 32;
export const MIN_FRAME_SCALE = 0.55;

export function emptyChoices(): UserChoices {
  return { 1: undefined, 2: undefined, 3: undefined };
}

export function stageData(stage: StageNumber, prevChoice?: ChoiceKey) {
  return STAGES_CONFIG[stage](prevChoice);
}

export function buildVerdict(userChoices: UserChoices) {
  const stages: StageNumber[] = [1, 2, 3];
  const safeCount = stages.filter((n) => userChoices[n] === SAFE_CHOICE).length;
  const installedApp = userChoices[3] === "A";

  if (installedApp) {
    return {
      safeCount,
      tone: "danger" as const,
      title: "마지막에 앱 설치에 동의하셨습니다",
      summary: "실제 상황이었다면 이 통화에서 피해가 시작됩니다.",
    };
  }
  if (safeCount === stages.length) {
    return {
      safeCount,
      tone: "safe" as const,
      title: "세 번 다 끊어내셨습니다",
      summary: "다만 글로 읽을 때와, 일상 중에 갑자기 울리는 전화는 다릅니다.",
    };
  }
  return {
    safeCount,
    tone: "warn" as const,
    title: "중간에 설득당한 지점이 있습니다",
    summary: "조직은 세 번 중 한 번만 통하면 다음 단계로 넘어갑니다.",
  };
}

export function shouldShowHijackCard(userChoices: UserChoices) {
  return userChoices[1] === SAFE_CHOICE || userChoices[3] === "A";
}

export function nextAfterChoice(currentStage: StageNumber): {
  stage: StageNumber;
  mode: "call" | "verdict";
} {
  if (currentStage < 3) {
    return { stage: (currentStage + 1) as StageNumber, mode: "call" };
  }
  return { stage: currentStage, mode: "verdict" };
}

export function computeFrameScale(innerWidth: number, innerHeight: number) {
  const byHeight = (innerHeight - FRAME_MARGIN_PX) / FRAME_HEIGHT_PX;
  const byWidth = (innerWidth - FRAME_MARGIN_PX) / FRAME_WIDTH_PX;
  return Math.max(MIN_FRAME_SCALE, Math.min(1, byHeight, byWidth));
}

export function computeSlideX(input: {
  clientX: number;
  trackLeft: number;
  frameScale: number;
  maxSlide: number;
}) {
  const pointerX = (input.clientX - input.trackLeft) / (input.frameScale || 1);
  return Math.max(
    0,
    Math.min(pointerX - SLIDER_GRAB_OFFSET_PX, input.maxSlide),
  );
}

export function shouldAcceptSlide(slide: number, maxSlide: number) {
  return slide >= maxSlide * SLIDE_ACCEPT_RATIO;
}

export function formatCallDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
