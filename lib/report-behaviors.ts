import type { ReportBehavior } from "@/lib/types";

// 백엔드가 합쳐 내려준 행동 목록에 통화별 리포트를 대조해 출처를 되돌린다.
export type BehaviorOrigin = "announced" | "unannounced" | "both";

export const BEHAVIOR_ORIGIN_LABELS: Record<BehaviorOrigin, string> = {
  announced: "1차 전화",
  unannounced: "불시 전화",
  both: "두 통화 모두",
};

export interface AnnotatedBehavior extends ReportBehavior {
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
