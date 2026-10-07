import type { WebTrainingEventType } from "@/lib/types";

export const LEAVE_WITHOUT_INPUT_MS = 60_000;

const DEFAULT_PORTAL_ORIGIN = "https://gaoncs.vercel.app";

export function webTrainingUrl(token: string): string {
  const origin = (
    process.env.NEXT_PUBLIC_PORTAL_ORIGIN ?? DEFAULT_PORTAL_ORIGIN
  ).replace(/\/$/, "");
  return `${origin}/t/${encodeURIComponent(token)}`;
}

export type WebTrainingAction = Exclude<
  WebTrainingEventType,
  "link_opened" | "left_without_input"
>;

export const WEB_TRAINING_EVENT_LABELS: Record<WebTrainingEventType, string> = {
  link_opened: "문자 속 링크로 접속",
  identity_submitted: "본인인증 정보 제출",
  case_lookup_submitted: "성명으로 사건 조회",
  financial_info_submitted: "계좌 정보 입력·제출",
  app_install_clicked: "안내 앱 설치 클릭",
  report_clicked: "의심 문자 신고 클릭",
  left_without_input: "입력 없이 이탈",
};

/** 위험 행동 경고 화면 제목. AI 대본(ai/scenarios/portal_link.py)의 WARNING_TITLE과 같다. */
export const WEB_TRAINING_WARNING_TITLE = "보이스피싱에 당했습니다";

export type WebTrainingDebriefCopy = {
  tone: "danger" | "success";
  title: string;
  why: string;
  next: string;
};

export const WEB_TRAINING_DEBRIEF: Record<WebTrainingAction, WebTrainingDebriefCopy> = {
  case_lookup_submitted: {
    tone: "danger",
    title: "문자 링크에서 성명을 입력하고 사건을 조회했어요",
    why: "수사기관은 전화나 문자로 링크를 보내 사건을 조회하게 하지 않습니다. 이런 링크에 이름 같은 개인정보를 입력하면 신원 확인용 정보가 사기범에게 넘어갑니다. 실제로 입력한 정보는 어디로도 전송되지 않았습니다.",
    next: "문자 속 링크는 누르지 말고, 기관 대표번호를 직접 검색해 전화로 사실 여부를 확인하세요.",
  },
  identity_submitted: {
    tone: "danger",
    title: "가짜 사이트에 본인인증 정보를 입력했어요",
    why: "수사기관이 실명 인증을 하라며 링크를 보내는 일은 없습니다. 성명, 생년월일, 휴대전화번호가 한꺼번에 넘어가면 명의 도용과 추가 사기에 쓰입니다. 실제로 입력한 정보는 어디로도 전송되지 않았습니다.",
    next: "링크로 열린 화면에서는 어떤 인증도 진행하지 말고, 이미 입력했다면 명의도용 방지 서비스로 신규 개통·대출을 막아 두세요.",
  },
  financial_info_submitted: {
    tone: "danger",
    title: "가짜 사이트에 계좌 정보를 입력했어요",
    why: "\"자산 보전\", \"안전계좌\"를 이유로 계좌를 입력하게 하거나 돈을 옮기라고 하는 기관은 없습니다. 실제 상황이었다면 계좌가 범행에 바로 쓰였을 수 있습니다. 실제로 입력한 정보는 어디로도 전송되지 않았습니다.",
    next: "실제로 계좌를 알려 줬다면 즉시 거래 은행 고객센터나 112에 지급정지를 요청하세요.",
  },
  app_install_clicked: {
    tone: "danger",
    title: "안내받은 앱·프로그램 설치를 눌렀어요",
    why: "\"보안 프로그램\", \"열람 모듈\"로 위장한 앱은 원격 조종이나 문자·통화 가로채기에 쓰입니다. 설치 순간 휴대전화 전체가 넘어갈 수 있습니다. 실제로 설치된 것은 없습니다.",
    next: "링크로 받은 앱은 설치하지 마세요. 이미 설치했다면 비행기 모드로 전환한 뒤 앱을 지우고 금융기관에 알리세요.",
  },
  report_clicked: {
    tone: "success",
    title: "의심하고 신고를 선택했어요",
    why: "아무것도 입력하지 않고 신고를 먼저 떠올린 것이 가장 안전한 대응입니다. 사기 사이트는 신고되는 순간 피해가 멈춥니다.",
    next: "실제로 이런 문자를 받으면 링크를 누르지 말고 118(불법 스팸·스미싱) 또는 112로 신고하세요.",
  },
};
