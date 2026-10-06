import type { ReportBehavior } from "@/lib/types";

/**
 * 최종 리포트의 위험·방어 행동은 백엔드가 1차 전화와 불시 전화의 목록을
 * (label, evidence) 쌍 기준으로 합쳐서 내려준다. 합친 목록만 보면 어느 통화에서
 * 나온 행동인지 알 수 없으므로, 같은 응답에 함께 오는 통화별 리포트와 같은
 * 기준으로 맞춰 출처를 되돌린다.
 */
export type BehaviorOrigin = "announced" | "unannounced" | "both";

export const BEHAVIOR_ORIGIN_LABELS: Record<BehaviorOrigin, string> = {
  announced: "1차 전화",
  unannounced: "불시 전화",
  both: "두 통화 모두",
};

export interface AnnotatedBehavior extends ReportBehavior {
  /** 출처를 알 수 없거나 통화별 리포트가 없으면 null */
  origin: BehaviorOrigin | null;
}

function behaviorKey(item: ReportBehavior): string {
  // 백엔드 중복 제거 키와 같은 조합. 구분자는 라벨·근거에 안 쓰이는 문자로 둔다.
  return `${item.label}\u0000${item.evidence ?? ""}`;
}

function keySet(items: ReportBehavior[] | null | undefined): Set<string> {
  return new Set((items ?? []).map(behaviorKey));
}

export function annotateBehaviorOrigins(
  merged: ReportBehavior[],
  announced: ReportBehavior[] | null | undefined,
  unannounced: ReportBehavior[] | null | undefined,
): AnnotatedBehavior[] {
  // 통화별 리포트가 아예 없으면 표시할 근거가 없으니 배지를 달지 않는다.
  if (announced == null && unannounced == null) {
    return merged.map((item) => ({ ...item, origin: null }));
  }

  const announcedKeys = keySet(announced);
  const unannouncedKeys = keySet(unannounced);

  return merged.map((item) => {
    const key = behaviorKey(item);
    const inAnnounced = announcedKeys.has(key);
    const inUnannounced = unannouncedKeys.has(key);
    const origin: BehaviorOrigin | null =
      inAnnounced && inUnannounced
        ? "both"
        : inAnnounced
          ? "announced"
          : inUnannounced
            ? "unannounced"
            : null;
    return { ...item, origin };
  });
}
